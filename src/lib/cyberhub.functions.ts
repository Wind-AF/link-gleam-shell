import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";

// Valor fixo da taxa em centavos (R$ 23,39). Travado no servidor para
// impedir que o cliente envie valores arbitrários.
const FIXED_AMOUNT_CENTS = 2339;

const inputSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Nome muito curto")
    .max(80, "Nome muito longo")
    .regex(/^[\p{L}\s.'-]+$/u, "Nome contém caracteres inválidos"),
  customerPhone: z
    .string()
    .trim()
    .regex(/^\d{10,11}$/, "Telefone inválido"),
  customerDocument: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().regex(/^\d{11}$/, "CPF inválido")),
  customerEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("E-mail inválido")
    .max(120),
  description: z.string().trim().max(200).optional(),
});

type CreatePixInput = z.input<typeof inputSchema>;

// Rate limit simples em memória — protege o gateway contra abuso anônimo.
// Worker reinicia esvazia a janela, o que é aceitável para esse cenário.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT_MAX) return false;
  bucket.count += 1;
  return true;
}

export const createPixTransaction = createServerFn({ method: "POST" })
  .inputValidator((data: CreatePixInput) => {
    const result = inputSchema.safeParse(data);
    if (!result.success) {
      throw new Error(
        result.error.issues.map((i) => i.message).join("; ") ||
          "Dados inválidos",
      );
    }
    return result.data;
  })
  .handler(async ({ data }) => {
    const key = process.env.CYBERHUB_SECRET_KEY;
    if (!key) {
      return { ok: false as const, error: "Gateway não configurado" };
    }

    // Rate limit por IP do solicitante.
    let ip = "unknown";
    try {
      ip = getRequestIP({ xForwardedFor: true }) || "unknown";
    } catch {
      // ignore — fallback to shared bucket
    }
    if (!checkRateLimit(ip)) {
      return {
        ok: false as const,
        error: "Muitas tentativas. Aguarde um instante e tente novamente.",
      };
    }

    try {
      const res = await fetch(
        "https://api.escalecyber.com/v1/payments/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-API-Key": key,
          },
          body: JSON.stringify({
            // Valor sempre fixo no servidor — cliente não controla o amount.
            amount: FIXED_AMOUNT_CENTS,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerDocument: data.customerDocument,
            customerEmail: data.customerEmail,
            description: data.description ?? "Taxa de liberação de saque",
          }),
        },
      );

      const raw = await res.text();
      let json: any = null;
      try {
        json = raw ? JSON.parse(raw) : null;
      } catch {
        json = null;
      }

      if (!res.ok) {
        // Não vazar corpo bruto do gateway nos logs do cliente.
        console.error("CyberHub error", res.status, raw);
        return {
          ok: false as const,
          error: `Falha ao gerar PIX (${res.status})`,
        };
      }

      const d = json?.data ?? json ?? {};
      const pix =
        d.pixCode ||
        d.pix_code ||
        d.qrCode ||
        d.qr_code ||
        d.brCode ||
        d.br_code ||
        d.copyPaste ||
        d.copy_paste ||
        d.payload ||
        d?.pix?.code ||
        d?.pix?.qrcode ||
        "";

      const qrImage =
        d.qrCodeImage ||
        d.qr_code_image ||
        d.qrCodeBase64 ||
        d.qr_code_base64 ||
        d?.pix?.qrCodeImage ||
        d?.pix?.image ||
        "";

      const id = d.id || d.transactionId || d.transaction_id || null;

      return {
        ok: true as const,
        pixCode: String(pix || ""),
        qrImage: String(qrImage || ""),
        id,
      };
    } catch (err) {
      console.error("CyberHub request failed", err);
      return { ok: false as const, error: "Erro ao conectar com o gateway" };
    }
  });
