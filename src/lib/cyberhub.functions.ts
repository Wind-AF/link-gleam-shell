import { createServerFn } from "@tanstack/react-start";

type CreatePixInput = {
  amount: number; // in cents
  customerName: string;
  customerPhone: string;
  customerDocument: string;
  customerEmail: string;
  description?: string;
};

export const createPixTransaction = createServerFn({ method: "POST" })
  .inputValidator((data: CreatePixInput) => data)
  .handler(async ({ data }) => {
    const key = process.env.CYBERHUB_SECRET_KEY;
    if (!key) {
      return { ok: false as const, error: "CYBERHUB_SECRET_KEY não configurada" };
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
            amount: data.amount,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerDocument: data.customerDocument,
            customerEmail: data.customerEmail,
            description: data.description ?? "Pagamento",
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
        console.error("CyberHub error", res.status, raw);
        return {
          ok: false as const,
          error: json?.message || `Falha ao gerar PIX (${res.status})`,
        };
      }

      // Try to extract PIX code + QR from common response shapes
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
