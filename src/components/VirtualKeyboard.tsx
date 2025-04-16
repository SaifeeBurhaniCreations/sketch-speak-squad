
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Backspace, Send } from "lucide-react";

interface VirtualKeyboardProps {
  onSubmit: (guess: string) => void;
  disabled?: boolean;
}

export function VirtualKeyboard({ onSubmit, disabled = false }: VirtualKeyboardProps) {
  const [input, setInput] = useState("");
  
  const keyboardRows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"]
  ];
  
  const handleKeyPress = (key: string) => {
    if (disabled) return;
    setInput((prev) => prev + key);
  };
  
  const handleBackspace = () => {
    if (disabled) return;
    setInput((prev) => prev.slice(0, -1));
  };
  
  const handleSubmit = () => {
    if (disabled || !input.trim()) return;
    onSubmit(input.trim());
    setInput("");
  };
  
  return (
    <div className="bg-game-darkBlue rounded-xl p-3 shadow-lg">
      <div className="bg-white rounded-lg mb-3 flex justify-between items-center overflow-hidden">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your guess here..."
          className="w-full px-4 py-3 outline-none text-lg"
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-400 hover:text-gray-600 mr-1"
          onClick={handleBackspace}
          disabled={disabled || !input}
        >
          <Backspace className="h-5 w-5" />
        </Button>
        <Button 
          className="bg-game-green hover:bg-game-green/90 mr-1 rounded-l-none h-full"
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {rowIndex === 2 && (
              <Button
                variant="outline"
                className="text-lg font-medium bg-white hover:bg-gray-100 w-16"
                onClick={handleSubmit}
                disabled={disabled || !input.trim()}
              >
                Enter
              </Button>
            )}
            
            {row.map((key) => (
              <Button
                key={key}
                variant="outline"
                className="text-lg font-medium bg-white hover:bg-gray-100 w-10 h-10 p-0"
                onClick={() => handleKeyPress(key)}
                disabled={disabled}
              >
                {key}
              </Button>
            ))}
            
            {rowIndex === 2 && (
              <Button
                variant="outline"
                className="text-lg font-medium bg-white hover:bg-gray-100 w-16"
                onClick={handleBackspace}
                disabled={disabled || !input}
              >
                <Backspace className="h-5 w-5" />
              </Button>
            )}
          </div>
        ))}
        
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="text-lg font-medium bg-white hover:bg-gray-100 w-2/3"
            onClick={() => handleKeyPress(" ")}
            disabled={disabled}
          >
            Space
          </Button>
        </div>
      </div>
    </div>
  );
}
