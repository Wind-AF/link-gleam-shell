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

type Sheet = null | "method" | "pix";
type PixKeyType = "CPF" | "E-mail" | "Telefone" | "Chave aleatória";

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

          <button className="w-full h-[44px] bg-pink text-white font-bold text-[15px] rounded-[10px] mt-4 active:scale-[0.98] transition-transform">
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
    </div>
  );
}
