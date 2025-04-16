
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

interface Message {
  id: number;
  sender: string;
  content: string;
  isSystemMessage?: boolean;
  isCorrectGuess?: boolean;
}

interface ChatBoxProps {
  username: string;
  isDrawer: boolean;
  onGuess?: (guess: string) => void;
  correctWord?: string;
}

export function ChatBox({ username, isDrawer, onGuess, correctWord }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "System", content: "Game starting! Get ready to guess or draw!", isSystemMessage: true },
  ]);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Prevent drawer from guessing
    if (isDrawer) {
      addMessage({
        id: Date.now(),
        sender: username,
        content: input,
      });
    } else {
      // Check if guess is correct
      const isCorrect = correctWord && input.toLowerCase().trim() === correctWord.toLowerCase();
      
      addMessage({
        id: Date.now(),
        sender: username,
        content: input,
        isCorrectGuess: isCorrect,
      });
      
      if (onGuess) {
        onGuess(input);
      }
    }
    
    setInput("");
  };

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-game-darkBlue rounded-xl flex flex-col overflow-hidden shadow-lg h-full">
      <div className="bg-game-blue p-3 border-b border-blue-400">
        <h3 className="font-bold text-white text-xl">Game Chat</h3>
      </div>
      
      <ScrollArea className="flex-grow p-3" ref={scrollAreaRef}>
        <div className="space-y-2">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`px-3 py-2 rounded-lg ${
                msg.isSystemMessage 
                  ? "bg-game-orange/70 text-white font-medium" 
                  : msg.isCorrectGuess
                  ? "bg-game-green text-white font-bold animate-bounce-in"
                  : "bg-white"
              }`}
            >
              {!msg.isSystemMessage && (
                <span className="font-bold text-game-blue">{msg.sender}: </span>
              )}
              <span>{msg.content}</span>
              {msg.isCorrectGuess && <span className="ml-2">🎉</span>}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-3 bg-white border-t border-blue-200">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDrawer ? "Chat with players..." : "Type your guess..."}
            className="border-game-blue"
          />
          <Button 
            onClick={handleSendMessage}
            className="bg-game-blue hover:bg-game-darkBlue"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
