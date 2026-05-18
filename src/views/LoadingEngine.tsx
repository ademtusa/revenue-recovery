import { useEffect, useState } from 'react';
import { Activity, Search, ShieldAlert, Cpu } from 'lucide-react';

interface LoadingEngineProps {
  onComplete: () => void;
}

export function LoadingEngine({ onComplete }: LoadingEngineProps) {
  const [step, setStep] = useState(0);
  const [dynamicText, setDynamicText] = useState('');

  const steps = [
    { icon: <Search size={24} className="text-blue-500" />, text: "Geçmiş iletişim logları taranıyor..." },
    { icon: <Activity size={24} className="text-orange-500" />, text: "Sessiz müşteri kopuşları tespit ediliyor..." },
    { icon: <ShieldAlert size={24} className="text-red-500" />, text: "Takip boşlukları analiz ediliyor..." },
    { icon: <Cpu size={24} className="text-green-500" />, text: "Kurtarılabilir gelir hesaplanıyor..." }
  ];

  const analysisTargets = [
    "Ahmet Yılmaz (Q1 Teklif) inceleniyor...",
    "Lumina Mimarlık e-posta zinciri taranıyor...",
    "Nexus Lojistik son temas tarihi: 7 ay önce...",
    "Anahtar kelime analizi: 'Bütçe', 'Düşüneceğiz'...",
    "Duygu analizi (Sentiment) hesaplanıyor...",
    "Gözden kaçan fırsatlar haritalandırılıyor..."
  ];

  // Main Steps Interval
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 1200);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [onComplete, steps.length]);

  // Dynamic Text Interval (Matrix effect)
  useEffect(() => {
    let index = 0;
    const fastInterval = setInterval(() => {
      setDynamicText(analysisTargets[index % analysisTargets.length]);
      index++;
    }, 800);

    return () => clearInterval(fastInterval);
  }, []);

  return (
    <div className="container min-h-screen flex items-center justify-center animate-in">
      <div className="flex-col items-center justify-center text-center max-w-md w-full relative z-10">
        
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-[var(--surface)] rounded-full shadow-[0_0_30px_rgba(59,130,246,0.1)]"></div>
          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin-slow"></div>
          <div className="absolute inset-0 flex items-center justify-center animate-pulse-slow">
            <Cpu size={40} className="text-primary" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2 tracking-tight">Yapay Zeka Teşhis Motoru Aktif</h2>
        <p className="text-xs text-primary font-mono mb-8 h-4">{dynamicText}</p>

        <div className="glass-panel p-6 text-left relative overflow-hidden">
          {/* Subtle scanning line effect */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary opacity-50 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-scan"></div>

          {steps.map((s, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-4 py-3 transition-all duration-500 ${index <= step ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 hidden'}`}
            >
              {index === step ? (
                <div className="animate-pulse">{s.icon}</div>
              ) : (
                <div className="text-muted">{s.icon}</div>
              )}
              <span className={`font-medium text-sm ${index === step ? 'text-main' : 'text-muted'}`}>
                {s.text}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
