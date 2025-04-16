
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

interface GameTimerProps {
  initialSeconds: number;
  onTimeUp?: () => void;
}

export function GameTimer({ initialSeconds, onTimeUp }: GameTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (seconds <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
      setProgress((prev) => (prev - 100 / initialSeconds));
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, initialSeconds, onTimeUp]);

  // Format time as MM:SS
  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-game-darkBlue p-3 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-white">
          <Clock className="mr-2 h-5 w-5" />
          <span className="font-bold">Time Remaining</span>
        </div>
        <div className="text-white font-bold text-xl">{formatTime()}</div>
      </div>
      <Progress 
        value={progress} 
        className={`h-3 bg-gray-300 [&>div]:${
          progress > 60 
            ? "bg-game-green" 
            : progress > 30 
            ? "bg-game-yellow" 
            : "bg-game-orange"
        }`}
      />
    </div>
  );
}
