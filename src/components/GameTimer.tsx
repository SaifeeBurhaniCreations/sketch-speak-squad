
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";
import { SoundVisualizer } from "./SoundVisualizer";

interface GameTimerProps {
  initialSeconds: number;
  onTimeUp?: () => void;
  onCountdownTick?: (seconds: number) => void;
}

export function GameTimer({ initialSeconds, onTimeUp, onCountdownTick }: GameTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [progress, setProgress] = useState(100);
  const [isCountingDown, setIsCountingDown] = useState(false);

  useEffect(() => {
    if (seconds <= 0) {
      if (onTimeUp) onTimeUp();
      setIsCountingDown(false);
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => {
        const newSeconds = prev - 1;
        
        // Call onCountdownTick when we're in the last 5 seconds
        if (newSeconds <= 5 && onCountdownTick) {
          onCountdownTick(newSeconds);
          setIsCountingDown(true);
        } else if (newSeconds > 5) {
          setIsCountingDown(false);
        }
        
        return newSeconds;
      });
      setProgress((prev) => (prev - 100 / initialSeconds));
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, initialSeconds, onTimeUp, onCountdownTick]);

  // Format time as MM:SS
  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Determine progress color class based on time remaining
  const progressColorClass = 
    progress > 60 ? "bg-game-green" : 
    progress > 30 ? "bg-game-yellow" : 
    "bg-game-orange";

  return (
    <div className="bg-game-darkBlue p-3 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-white">
          <Clock className="mr-2 h-5 w-5" />
          <span className="font-bold">Time Remaining</span>
        </div>
        <div className="text-white font-bold text-xl flex items-center">
          {formatTime()}
          {isCountingDown && (
            <div className="ml-2">
              <SoundVisualizer isPlaying={true} size="sm" color="#FFD700" />
            </div>
          )}
        </div>
      </div>
      <Progress 
        value={progress} 
        className={`h-3 bg-gray-300`}
        // Dynamically apply the progress bar color
        style={{
          ['--progress-background' as any]: 
            progress > 60 ? 'var(--game-green)' : 
            progress > 30 ? 'var(--game-yellow)' : 
            'var(--game-orange)'
        }}
      />
    </div>
  );
}
