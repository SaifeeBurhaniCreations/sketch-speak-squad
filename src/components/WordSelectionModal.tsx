
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface WordSelectionModalProps {
  open: boolean;
  words: string[];
  onSelectWord: (word: string) => void;
  artistName: string;
}

export function WordSelectionModal({ open, words, onSelectWord, artistName }: WordSelectionModalProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  
  useEffect(() => {
    if (!open) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!selectedWord && words.length > 0) {
            // Auto-select first word if time runs out
            onSelectWord(words[0]);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [open, selectedWord, words, onSelectWord]);
  
  const handleSelectWord = (word: string) => {
    setSelectedWord(word);
    onSelectWord(word);
  };
  
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="bg-game-blue border-4 border-white rounded-xl max-w-md p-0 overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 overflow-hidden">
            <img 
              src="/placeholder.svg" 
              alt="Artist avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <h2 className="text-xl font-bold text-white mb-1">
            {artistName === "YourUsername" ? "YOU" : artistName} IS THE ARTIST...
          </h2>
          
          <div className="text-2xl font-bold text-white mb-6">
            WAITING FOR THE ARTIST TO CHOOSE A WORD
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-6 mb-6">
            <div 
              className="bg-game-green h-6 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(timeLeft / 15) * 100}%` }}
            />
          </div>
          
          <div className="grid gap-3">
            {words.map((word) => (
              <Button
                key={word}
                variant="outline"
                className={cn(
                  "text-lg py-6 font-semibold transition-all",
                  selectedWord === word
                    ? "bg-game-green text-white hover:bg-game-green/90"
                    : "bg-white hover:bg-gray-100"
                )}
                onClick={() => handleSelectWord(word)}
              >
                {word}
                {selectedWord === word && <Check className="ml-2 h-5 w-5" />}
              </Button>
            ))}
          </div>
          
          <div className="mt-6 flex items-center justify-center text-white">
            <Clock className="mr-2 h-5 w-5" />
            <span className="font-bold">{timeLeft}s</span> to choose a word
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
