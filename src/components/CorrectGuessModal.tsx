
import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// @ts-ignore
import confetti from "canvas-confetti";

interface CorrectGuessModalProps {
  open: boolean;
  onClose: () => void;
  guesser: string;
  word: string;
  points: number;
}

export function CorrectGuessModal({
  open,
  onClose,
  guesser,
  word,
  points,
}: CorrectGuessModalProps) {
  useEffect(() => {
    if (open) {
      // Show confetti when the modal opens
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white border-4 border-game-yellow rounded-xl p-6 shadow-2xl max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-game-blue mb-2">
            Correct Guess!
          </h2>
          <div className="text-xl mb-4">
            <span className="font-bold text-game-orange">{guesser}</span> correctly guessed the word:
          </div>
          <div className="bg-game-green/10 border-2 border-game-green rounded-lg p-4 mb-6">
            <span className="text-2xl font-bold text-game-green">{word}</span>
          </div>
          <div className="text-xl mb-6">
            <span className="font-bold">+{points} points</span> awarded!
          </div>
          <Button
            onClick={onClose}
            className="bg-game-blue hover:bg-game-darkBlue text-white px-8 py-6 text-lg"
          >
            Continue Playing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
