
import { useState, useEffect } from "react";
import { MessageCircle, Lightbulb, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolTipProps {
  text: string;
  type?: "tip" | "hint" | "help";
  duration?: number;
  className?: string;
}

export function ToolTip({ 
  text, 
  type = "tip", 
  duration = 0,
  className 
}: ToolTipProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration]);

  if (!visible) return null;

  const icons = {
    tip: <MessageCircle className="h-5 w-5" />,
    hint: <Lightbulb className="h-5 w-5" />,
    help: <HelpCircle className="h-5 w-5" />,
  };

  const bgColors = {
    tip: "bg-game-blue text-white",
    hint: "bg-game-yellow text-black",
    help: "bg-game-orange text-white",
  };

  return (
    <div 
      className={cn(
        "rounded-lg p-3 shadow-lg flex items-center max-w-sm animate-float",
        bgColors[type],
        className
      )}
    >
      <div className="mr-2 flex-shrink-0">
        {icons[type]}
      </div>
      <div className="text-sm">{text}</div>
      {duration > 0 && (
        <button 
          className="ml-2 opacity-70 hover:opacity-100"
          onClick={() => setVisible(false)}
        >
          ×
        </button>
      )}
    </div>
  );
}
