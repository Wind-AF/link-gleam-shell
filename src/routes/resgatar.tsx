import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, CreditCard, X, HelpCircle } from "lucide-react";
import coinP from "@/assets/coin-p.png";
import pixLogo from "@/assets/pix-logo.webp";
import pagbankLogo from "@/assets/pagbank-logo.webp";
import paypalLogo from "@/assets/paypal-logo.webp";
import claroLogo from "@/assets/claro-logo.webp";

export const Route = createFileRoute("/resgatar")({
  component: Resgatar,
});

const TARGET = 2800;
const DURATION = 1800;

type Sheet = null | "method" | "pix" | "confirm";
type PixKeyType = "CPF" | "E-mail" | "Telefone" | "Chave aleatória";

const PIX_PLACEHOLDER: Record<PixKeyType, string> = {
  CPF: "000.000.000-00",
  "E-mail": "seuemail@exemplo.com",
  Telefone: "(00) 00000-0000",
  "Chave aleatória": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
};

function Resgatar() {
  const [amount, setAmount] = useState(0);
  const [selected, setSelected] = useState<number>(2800);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [keyType, setKeyType] = useState<PixKeyType | null>(null);
  const [pixKey, setPixKey] = useState("");

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setAmount(TARGET * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const formatted = amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const points = Math.floor(amount * 10).toLocaleString("pt-BR");

  const options = [
    { value: 10, label: "R$10" },
    { value: 15, label: "R$15" },
    { value: 25, label: "R$25" },
    { value: 2800, label: "R$2.800,00" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] max-w-[430px] mx-auto">
      {/* Header */}
      <div className="flex items-center px-3 py-4 bg-background relative">
        <Link to="/" className="w-9 h-9 flex items-center justify-center">
          <ChevronLeft size={26} className="text-foreground" strokeWidth={2.5} />
        </Link>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-[16px] font-bold text-foreground">
          Resgatar recompensas
        </h1>
        <button className="ml-auto w-9 h-9 flex items-center justify-center text-foreground/70">
          <HelpCircle size={22} />
        </button>
      </div>

      <div className="px-4 pb-6">
        {/* Balance card */}
        <div className="bg-[#0d0d0d] rounded-[18px] p-5 pt-4 pb-0 relative overflow-hidden">
          <p className="text-white/80 text-[13px] font-medium">Seu saldo</p>
          <p className="text-white text-[34px] font-[900] leading-tight mt-0.5 tabular-nums">
            R$ {formatted}
          </p>
          <p className="text-white/60 text-[12px] mt-1">= {points} ponto(s)</p>
          <img
            src={coinP}
            alt=""
            className="absolute right-4 top-1/2 -translate-y-1/2 w-[78px] h-[78px] object-contain"
          />
          <div className="border-t border-dashed border-white/30 mt-4" />
          <div className="flex items-center justify-between py-3">
            <p className="text-white/80 text-[12px]">Suas transações: R$ 0,03</p>
            <ChevronRight size={16} className="text-white/60" />
          </div>
        </div>

        {/* Sacar dinheiro */}
        <div className="bg-white rounded-[18px] p-5 mt-4 shadow-sm">
          <h2 className="text-[17px] font-bold text-foreground">Sacar dinheiro</h2>
          <div className="flex items-center gap-1.5 mt-3 text-[12px] text-foreground/80">
            <CreditCard size={16} />
            <span>Transferência bancária</span>
            <span className="text-foreground/30">/</span>
            <img src={pixLogo} alt="Pix" className="h-3 object-contain" />
            <span className="text-foreground/30">/</span>
            <img src={pagbankLogo} alt="PagBank" className="h-3 object-contain" />
            <span className="text-foreground/30">/</span>
            <img src={paypalLogo} alt="PayPal" className="h-3 object-contain" />
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4">
            {options.map((o) => {
              const isSel = selected === o.value;
              return (
                <button
                  key={o.value}
                  onClick={() => setSelected(o.value)}
                  className={`h-[60px] rounded-[10px] border text-[13px] font-bold flex items-center justify-center transition-colors ${
                    isSel
                      ? "border-pink bg-pink/5 text-pink"
                      : "border-[#e5e5e5] bg-white text-foreground"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setSheet("method")}
            className="w-full h-[44px] bg-pink text-white font-bold text-[15px] rounded-[10px] mt-4 active:scale-[0.98] transition-transform"
          >
            Resgatar saldo
          </button>

          <p className="text-center text-foreground/50 text-[11px] leading-snug mt-3 px-4">
            Para sacar dinheiro, você precisa de um saldo mínimo de R$10. Os limites de saque para transações individuais e mensais podem variar conforme o país ou a região.
          </p>
        </div>

        {/* Obtenha Moedas */}
        <div className="bg-white rounded-[18px] p-5 mt-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-2">
              <h2 className="text-[17px] font-bold text-foreground">Obtenha Moedas para a LIVE</h2>
              <p className="text-foreground/60 text-[12px] mt-2 leading-snug">
                Use Moedas para enviar presentes virtuais para seus hosts de LIVE favoritos.
              </p>
            </div>
            <div className="text-4xl">🌹</div>
          </div>
          <button
            disabled
            className="w-full h-[44px] bg-[#e5e5e5] text-foreground/50 font-bold text-[15px] rounded-[10px] mt-4 cursor-not-allowed"
          >
            Indisponível
          </button>
        </div>

        {/* Recarga móvel */}
        <div className="bg-white rounded-[18px] p-5 mt-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-bold text-foreground">Recarga móvel</h2>
            <div className="flex items-center gap-1.5 text-[11px] text-foreground/60">
              <img src={claroLogo} alt="Claro" className="h-4 object-contain" />
              <span className="text-foreground/30">/</span>
              <span className="font-bold">TIM</span>
              <span className="text-foreground/30">/</span>
              <span className="font-bold text-[#662d91]">Vivo</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 pb-3 border-b border-[#eee]">
            <span className="text-foreground text-[14px] font-medium">+55</span>
            <span className="text-foreground/30">|</span>
            <span className="text-foreground/40 text-[14px]">12345678901</span>
          </div>
          <button
            disabled
            className="w-full h-[44px] bg-[#e5e5e5] text-foreground/50 font-bold text-[15px] rounded-[10px] mt-4 cursor-not-allowed"
          >
            Indisponível
          </button>
          <p className="text-center text-foreground/50 text-[11px] leading-snug mt-3">
            Você precisa de um saldo mínimo de R$10 para recarga de celular.
          </p>
        </div>
      </div>

      {/* Bottom sheets */}
      {sheet && (
        <div
          className="fixed inset-0 z-[90] bg-black/50"
          onClick={() => setSheet(null)}
        />
      )}

      {/* Sheet: choose method */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 bottom-0 w-full max-w-[430px] bg-white rounded-t-[20px] z-[95] transition-transform duration-300 ${
          sheet === "method" ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="relative px-5 pt-5 pb-2">
          <h3 className="text-center text-[17px] font-extrabold text-foreground">
            Escolher um método de saque
          </h3>
          <button
            onClick={() => setSheet(null)}
            className="absolute right-3 top-4 w-9 h-9 flex items-center justify-center text-foreground/70"
          >
            <X size={22} />
          </button>
        </div>
        <button
          onClick={() => setSheet("pix")}
          className="w-full flex items-center px-5 py-5 border-t border-[#eee] text-left"
        >
          <img src={pixLogo} alt="" className="w-10 h-10 object-contain" />
          <div className="flex-1 ml-3">
            <p className="font-extrabold text-foreground text-[15px]">PIX</p>
            <p className="text-foreground/60 text-[12px] mt-0.5">
              O dinheiro deve chegar em até 1 minuto
            </p>
          </div>
          <span className="text-foreground/60 text-[13px] mr-1">BRL</span>
          <ChevronRight size={18} className="text-foreground/40" />
        </button>
        <div className="w-full flex items-center px-5 py-5 border-t border-[#eee]">
          <img src={paypalLogo} alt="" className="w-10 h-10 object-contain" />
          <div className="flex-1 ml-3">
            <p className="font-extrabold text-foreground text-[15px]">PayPal</p>
            <p className="text-foreground/60 text-[12px] mt-0.5">
              O dinheiro deve chegar de 1 a 3 dias úteis
            </p>
          </div>
          <span className="text-pink text-[13px] font-medium mr-1">Inválido</span>
          <span className="text-foreground/60 text-[13px] mr-1">USD</span>
          <ChevronRight size={18} className="text-foreground/40" />
        </div>
        <p className="text-foreground/50 text-[11px] leading-snug px-5 pb-6 pt-2">
          Saque processado pelo TikTok no Brasil (ByteDance Brasil Tecnologia Ltda.) CNPJ: 27.415.911/0001
        </p>
      </div>

      {/* Sheet: PIX key */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 bottom-0 w-full max-w-[430px] bg-white rounded-t-[20px] z-[95] transition-transform duration-300 ${
          sheet === "pix" ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="relative px-5 pt-5 pb-2 flex items-center">
          <button
            onClick={() => setSheet("method")}
            className="w-9 h-9 flex items-center justify-center text-foreground/70"
          >
            <ChevronLeft size={24} />
          </button>
          <h3 className="absolute left-1/2 -translate-x-1/2 text-[17px] font-extrabold text-foreground">
            Informar chave PIX
          </h3>
          <button
            onClick={() => setSheet(null)}
            className="ml-auto w-9 h-9 flex items-center justify-center text-foreground/70"
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-5 pt-2 pb-6">
          <p className="text-foreground/60 text-[13px] mt-1">Tipo de chave</p>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {(["CPF", "E-mail", "Telefone", "Chave aleatória"] as PixKeyType[]).map((t) => {
              const isSel = keyType === t;
              return (
                <button
                  key={t}
                  onClick={() => setKeyType(t)}
                  className={`h-[50px] rounded-[10px] border text-[14px] font-bold transition-colors ${
                    isSel
                      ? "border-pink bg-pink/5 text-pink"
                      : "border-[#e5e5e5] bg-white text-foreground"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <p className="text-foreground/60 text-[13px] mt-5">Sua chave PIX</p>
          <input
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            placeholder={keyType ? PIX_PLACEHOLDER[keyType] : "Digite sua chave PIX"}
            maxLength={120}
            className="w-full h-[52px] mt-3 px-4 rounded-[10px] border border-[#e5e5e5] text-[14px] text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-pink"
          />

          <button
            onClick={() => setSheet("confirm")}
            disabled={!keyType || !pixKey.trim()}
            className="w-full h-[50px] bg-pink text-white font-bold text-[15px] rounded-[10px] mt-6 disabled:opacity-50 active:scale-[0.98] transition-transform"
          >
            Continuar
          </button>
        </div>
      </div>

      {/* Sheet: confirm withdrawal */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 bottom-0 w-full max-w-[430px] bg-white rounded-t-[20px] z-[95] transition-transform duration-300 ${
          sheet === "confirm" ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="relative px-5 pt-5 pb-2 flex items-center">
          <button
            onClick={() => setSheet("pix")}
            className="w-9 h-9 flex items-center justify-center text-foreground/70"
          >
            <ChevronLeft size={24} />
          </button>
          <h3 className="absolute left-1/2 -translate-x-1/2 text-[17px] font-extrabold text-foreground">
            Confirmar saque
          </h3>
          <button
            onClick={() => setSheet(null)}
            className="ml-auto w-9 h-9 flex items-center justify-center text-foreground/70"
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-5 pt-3 pb-6">
          {[
            { label: "Tempo de processamento", value: "Até 1 minuto" },
            { label: "Conta para saque", value: `PIX (${keyType ?? "CPF"})` },
            { label: "Chave PIX", value: pixKey || "—" },
            {
              label: "Valor do saque",
              value: `R$${selected.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
            },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-4 border-b border-[#eee] last:border-b-0"
            >
              <span className="text-foreground/60 text-[14px]">{row.label}</span>
              <span className="text-foreground text-[14px] font-bold">{row.value}</span>
            </div>
          ))}

          <button className="w-full h-[50px] bg-pink text-white font-bold text-[15px] rounded-[10px] mt-6 active:scale-[0.98] transition-transform">
            Confirmar para sacar
          </button>
        </div>
      </div>
    </div>
  );
}
    </div>
  );
}
