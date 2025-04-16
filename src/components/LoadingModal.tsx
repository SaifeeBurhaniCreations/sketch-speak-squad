
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface LoadingModalProps {
  open: boolean;
  onFinishLoading: () => void;
}

export function LoadingModal({ open, onFinishLoading }: LoadingModalProps) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!open) return;
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => onFinishLoading(), 500);
          return 100;
        }
        return newProgress;
      });
    }, 400);
    
    return () => clearInterval(interval);
  }, [open, onFinishLoading]);
  
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="bg-game-blue border-4 border-white rounded-xl max-w-sm overflow-hidden p-0">
        <div className="flex flex-col items-center justify-center text-white p-8 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-game-yellow mb-4" />
          <h2 className="text-2xl font-bold mb-6">Loading... get ready!</h2>
          
          <div className="w-full bg-white/20 rounded-full h-4 mb-2">
            <div 
              className="bg-game-yellow h-4 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/80 text-sm">Connecting to other players...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
