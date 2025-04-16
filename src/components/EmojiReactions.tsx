
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EMOJIS = [
  { emoji: "👍", label: "Thumbs Up" },
  { emoji: "😂", label: "Laugh" },
  { emoji: "😮", label: "Wow" },
  { emoji: "❤️", label: "Love" },
  { emoji: "👏", label: "Clap" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "🎯", label: "Bullseye" },
  { emoji: "🤔", label: "Thinking" },
];

interface EmojiReaction {
  emoji: string;
  count: number;
  reacted: boolean;
}

export function EmojiReactions() {
  const [reactions, setReactions] = useState<EmojiReaction[]>(
    EMOJIS.map((emoji) => ({
      emoji: emoji.emoji,
      count: 0,
      reacted: false,
    }))
  );

  const handleReaction = (index: number) => {
    setReactions((prev) => {
      const newReactions = [...prev];
      const reaction = newReactions[index];
      
      if (reaction.reacted) {
        // Remove reaction
        newReactions[index] = {
          ...reaction,
          count: Math.max(0, reaction.count - 1),
          reacted: false,
        };
      } else {
        // Add reaction
        newReactions[index] = {
          ...reaction,
          count: reaction.count + 1,
          reacted: true,
        };
      }
      
      return newReactions;
    });
  };

  return (
    <div className="flex space-x-2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
      {reactions.map((reaction, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-full px-3 py-1 transition-all",
            reaction.reacted && "bg-game-blue/10"
          )}
          onClick={() => handleReaction(index)}
        >
          <span className="text-xl mr-1">{reaction.emoji}</span>
          {reaction.count > 0 && (
            <span className="text-sm font-medium">{reaction.count}</span>
          )}
        </Button>
      ))}
    </div>
  );
}
