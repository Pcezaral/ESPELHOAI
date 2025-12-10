import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Sparkles, Zap, Gift } from "lucide-react";
import { useLocation } from "wouter";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  credits?: number;
}

export default function OnboardingModal({
  isOpen,
  onClose,
  userName = "Usuário",
  credits = 5,
}: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [, setLocation] = useLocation();

  if (!isOpen) return null;

  const steps = [
    {
      icon: <Gift className="w-16 h-16 text-orange-400" />,
      title: "Bem-vindo ao ESPELHO AI!",
      description: `Oi ${userName}! 👋 Você recebeu 5 créditos grátis para começar a transformar suas fotos em estilos incríveis.`,
      action: "Próximo",
    },
    {
      icon: <Sparkles className="w-16 h-16 text-purple-400" />,
      title: "9 Estilos Incríveis",
      description: "Escolha entre Épico, Gangster, Pintura, Circo, Bichinho, Monstro, Natal, Réveillon e mais! Cada um transforma sua foto de forma única.",
      action: "Próximo",
    },
    {
      icon: <Zap className="w-16 h-16 text-yellow-400" />,
      title: "Como Funciona",
      description: "1. Envie sua foto | 2. Escolha um estilo | 3. Veja a magia acontecer | 4. Baixe em HD e compartilhe!",
      action: "Começar Agora",
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setLocation("/generator");
      onClose();
    }
  };

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-slate-900 border-slate-700 max-w-md w-full p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            {currentStep.icon}
          </div>

          <h2 className="text-2xl font-bold mb-4">{currentStep.title}</h2>
          <p className="text-slate-300 mb-8">{currentStep.description}</p>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === step
                    ? "w-8 bg-orange-500"
                    : index < step
                    ? "w-2 bg-orange-400"
                    : "w-2 bg-slate-600"
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            {step > 0 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outline"
                className="flex-1"
              >
                Voltar
              </Button>
            )}
            <Button
              onClick={handleNext}
              className={`flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 ${
                step === 0 ? "w-full" : ""
              }`}
            >
              {currentStep.action}
            </Button>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 text-sm text-slate-400 hover:text-slate-300 transition"
          >
            Pular Introdução
          </button>
        </div>
      </Card>
    </div>
  );
}
