
import { useState, useEffect } from "react";
import { ToolTip } from "./ToolTip";

interface Tip {
  id: number;
  text: string;
  type: "tip" | "hint" | "help";
  delay: number;
  duration: number;
}

export function FloatingTips() {
  const [visibleTips, setVisibleTips] = useState<Tip[]>([]);

  const tips: Tip[] = [
    { 
      id: 1, 
      text: "Draw clearly to help others guess correctly!", 
      type: "tip",
      delay: 3000,
      duration: 5000
    },
    {
      id: 2,
      text: "Use the emoji reactions to show appreciation for good drawings",
      type: "hint",
      delay: 10000,
      duration: 5000
    },
    {
      id: 3,
      text: "Both drawer and guessers earn points for correct guesses",
      type: "help",
      delay: 18000,
      duration: 5000
    }
  ];

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    tips.forEach(tip => {
      const timer = setTimeout(() => {
        setVisibleTips(prev => [...prev, tip]);
        
        // Auto-remove after duration
        const removalTimer = setTimeout(() => {
          setVisibleTips(prev => prev.filter(t => t.id !== tip.id));
        }, tip.duration);
        
        timers.push(removalTimer);
      }, tip.delay);
      
      timers.push(timer);
    });
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  return (
    <div className="fixed bottom-5 left-5 space-y-3 z-50">
      {visibleTips.map(tip => (
        <ToolTip
          key={tip.id}
          text={tip.text}
          type={tip.type}
          duration={0}
          className="shadow-lg"
        />
      ))}
    </div>
  );
}
