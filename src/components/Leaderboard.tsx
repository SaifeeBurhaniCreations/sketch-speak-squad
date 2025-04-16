
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Star } from "lucide-react";

interface Player {
  id: number;
  username: string;
  score: number;
  isCurrentPlayer?: boolean;
  isDrawer?: boolean;
}

interface LeaderboardProps {
  players: Player[];
}

export function Leaderboard({ players }: LeaderboardProps) {
  // Sort players by score (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-game-darkBlue rounded-xl overflow-hidden shadow-lg">
      <div className="bg-game-blue p-3 border-b border-blue-400 flex items-center">
        <Trophy className="text-game-yellow mr-2 h-6 w-6" />
        <h3 className="font-bold text-white text-xl">Leaderboard</h3>
      </div>
      
      <ScrollArea className="h-[250px]">
        <div className="p-2 space-y-1">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`flex justify-between items-center p-2 rounded-lg ${
                player.isCurrentPlayer 
                  ? "bg-game-yellow/20 text-white border border-game-yellow" 
                  : "bg-white"
              }`}
            >
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-game-blue flex items-center justify-center text-white font-bold mr-2">
                  {index + 1}
                </div>
                <span className="font-semibold">
                  {player.username}
                  {player.isDrawer && (
                    <span className="ml-2 text-sm bg-game-orange text-white px-2 py-0.5 rounded-full">
                      Drawing
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center">
                <Star className="text-game-yellow fill-game-yellow h-4 w-4 mr-1" />
                <span className="font-bold">{player.score}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
