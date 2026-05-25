import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Check, Copy, ChevronRight } from "lucide-react";
import phoneHand from "@/assets/phone-hand.png";
import coinP from "@/assets/coin-p.png";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="min-h-screen bg-background max-w-[430px] mx-auto">
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md transition-opacity duration-300">
          <div
            className="flex flex-col items-center justify-center max-w-[320px] w-[85%] rounded-[32px] p-8"
            style={{ backgroundColor: "rgba(37, 37, 37, 0.75)" }}
          >
            <img src={coinP} alt="Moeda P" width={80} height={80} className="w-[80px] h-[80px] object-contain" />
            <p className="text-white text-2xl font-extrabold mt-6">Parabéns!</p>
            <p className="text-white/90 text-center text-sm mt-2 leading-relaxed">
              Você mandou muito bem como usuário ativo na plataforma. Seu engajamento foi reconhecido e sua recompensa já está disponível.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-8 w-full py-3 bg-pink text-white font-bold text-[15px] rounded-[12px] active:scale-[0.97] transition-all"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      <div className="px-4 mt-2">
        <div className="rounded-[24px] overflow-hidden bg-pink">
          {/* Top hero */}
          <div className="bg-pink p-5 pb-6 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-white/90 text-[11px] font-medium tracking-wide mb-1.5">24 de fev - 10 de mar</p>
              <h1 className="text-[26px] font-[900] leading-[1.1] text-white max-w-[180px]">
                Parabéns! Você garantiu <span className="text-yellow">R$ 2.800,00</span>
              </h1>
              <p className="text-white text-[13px] leading-snug mt-3 font-medium max-w-[210px]">
                Sua Mega Recompensa foi conquistada com sucesso.
              </p>
            </div>
            <img
              src={phoneHand}
              alt="Mão segurando celular com moedas"
              width={150}
              height={150}
              className="absolute -top-2 right-0 w-[150px] h-auto z-[5] object-contain pointer-events-none"
            />

            <div className="h-[110px] mt-8 flex items-end justify-between relative z-10">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[72px] h-[105px] flex flex-col items-center justify-center rounded-[36px] shadow-[0px_4px_10px_rgba(0,0,0,0.1)] bg-yellow"
                >
                  <div className="w-[50px] h-[50px] rounded-full border-[3px] border-pink bg-pink flex items-center justify-center">
                    <User className="text-yellow" size={30} />
                  </div>
                  <span className="text-[#1a1a1a] font-extrabold text-[14px] mt-1.5">R$280</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA + invite */}
          <div className="bg-pink px-5 pb-5">
            <button className="w-full h-[52px] bg-yellow text-foreground font-[800] text-[17px] rounded-full mt-4 flex items-center justify-center active:scale-[0.98] transition-transform shadow-[0px_2px_8px_rgba(0,0,0,0.08)]">
              Resgatar recompensa
            </button>
            <p className="mt-5 text-center text-white text-[13px]">
              Código de convite:{" "}
              <span className="font-bold text-yellow underline decoration-solid underline-offset-4 cursor-pointer">
                JN869241770351
                <Copy className="inline ml-1" size={14} />
              </span>
            </p>
          </div>

          {/* Activity summary */}
          <div className="bg-pink px-5 py-6">
            <h2 className="text-white text-[18px] font-black mb-3">Resumo da sua atividade na plataforma</h2>
            <p className="text-white/90 text-[13px] leading-relaxed mb-5 font-medium">
              Parabéns! Por ser um usuário ativo na plataforma, você está sendo recompensado com base no seu engajamento contínuo.
            </p>
            <div className="flex flex-col gap-3">
              {[
                "Mais de 100 vídeos compartilhados com amigos",
                "Mais de 250 horas assistidas na plataforma",
                "Mais de 420 anúncios assistidos",
                "Mais de 1.000 vídeos curtidos",
                "7 dias consecutivos acessando diariamente",
                "Atividade consistente validada durante todo o período da campanha",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5">
                  <div className="w-[20px] h-[20px] rounded-full bg-yellow flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="text-pink" size={11} strokeWidth={3} />
                  </div>
                  <span className="text-white text-[13px] leading-snug font-medium">{text}</span>
                </div>
              ))}
            </div>
            <p className="text-white/80 text-[12px] leading-relaxed mt-5 font-medium">
              Essas ações confirmam que todos os critérios exigidos pela campanha foram integralmente cumpridos.
            </p>
          </div>

          {/* How you got it */}
          <div className="bg-pink px-5 py-6 border-t border-dashed border-white/30">
            <h2 className="text-white text-[18px] font-black mb-5">Como você obteve R$ 5.361,52</h2>
            <p className="text-white text-[13px] font-medium leading-[1.4]">
              1. Você compartilhou seu link e seus amigos baixaram o app, se cadastraram e inseriram seu código de convite.
            </p>
            <p className="mt-1">
              <span className="text-yellow font-bold text-[13px]">R$ 1.000 recebidos</span>
            </p>

            <div className="w-full border-t border-dotted border-white/20 my-5" />

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-white text-[13px] font-medium leading-[1.4]">
                  2. Seus amigos assistiram 30 minutos de vídeos por dia durante o período completo.
                </p>
                <p className="mt-1">
                  <span className="text-yellow font-bold text-[13px]">R$ 2.700 recebidos</span>
                </p>
              </div>
              <span className="bg-dark-red text-white text-[11px] font-bold px-4 py-2 rounded-full ml-3 shrink-0">
                Concluído
              </span>
            </div>

            {/* Timeline */}
            <div className="mt-10 px-2 relative">
              <div className="absolute top-[38px] left-6 right-6 h-[3px] bg-yellow rounded-full" />
              <div className="flex items-center justify-between relative">
                {[
                  { days: "3 dias", amount: "+R$ 20" },
                  { days: "7 dias", amount: "+R$ 50" },
                  { days: "14 dias", amount: "+R$ 200" },
                ].map((m) => (
                  <div key={m.days} className="flex flex-col items-center">
                    <span className="bg-white/20 text-[9px] px-2 py-0.5 rounded-full text-white mb-2 font-medium">
                      {m.days}
                    </span>
                    <div className="bg-yellow border-2 border-yellow w-5 h-5 rounded-full flex items-center justify-center z-10">
                      <Check className="text-pink" size={10} strokeWidth={3} />
                    </div>
                    <span className="text-yellow font-black text-[11px] mt-2">{m.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full border-t border-dashed border-white/30 mt-8" />
            <p className="text-center text-white/80 text-[12px] font-medium py-8 cursor-pointer hover:underline flex items-center justify-center gap-1">
              Ver detalhes <ChevronRight size={14} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
