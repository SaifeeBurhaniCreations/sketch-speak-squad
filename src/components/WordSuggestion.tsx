
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface WordSuggestionProps {
  words: string[];
  onSelectWord: (word: string) => void;
  visible: boolean;
}

export function WordSuggestion({ words, onSelectWord, visible }: WordSuggestionProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const handleSelectWord = (word: string) => {
    setSelectedWord(word);
    onSelectWord(word);
  };

  if (!visible) return null;

  return (
    <div className="bg-game-darkBlue rounded-xl p-4 shadow-lg animate-bounce-in">
      <h3 className="font-bold text-white text-xl mb-3">Choose a word to draw:</h3>
      <div className="flex flex-col gap-2">
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
    </div>
  );
}
