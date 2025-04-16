
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Palette, MessageSquare } from "lucide-react";

interface EmptyStateProps {
  onCreateGame: () => void;
}

export function EmptyState({ onCreateGame }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 bg-game-blue/10 rounded-full flex items-center justify-center mb-6">
        <Palette className="w-12 h-12 text-game-blue" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Ready to Play?</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        Join the fun in this multiplayer drawing and guessing game! Express your creativity and test your guessing skills.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          className="bg-game-blue hover:bg-game-darkBlue text-white px-6 py-5"
          onClick={onCreateGame}
        >
          <Users className="mr-2 h-5 w-5" />
          Create a Game
        </Button>
        
        <Button
          variant="outline"
          className="border-game-blue text-game-blue hover:bg-game-blue/10 px-6 py-5"
        >
          <MessageSquare className="mr-2 h-5 w-5" />
          Join with Code
        </Button>
      </div>
      
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="w-12 h-12 bg-game-yellow/20 rounded-full flex items-center justify-center mb-3 mx-auto">
            <Users className="w-6 h-6 text-game-yellow" />
          </div>
          <h3 className="font-bold text-lg mb-2">Play Together</h3>
          <p className="text-gray-600 text-sm">Play with friends or join public games with players from around the world.</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="w-12 h-12 bg-game-orange/20 rounded-full flex items-center justify-center mb-3 mx-auto">
            <Palette className="w-6 h-6 text-game-orange" />
          </div>
          <h3 className="font-bold text-lg mb-2">Draw & Guess</h3>
          <p className="text-gray-600 text-sm">Take turns drawing while others guess, or put your guessing skills to the test.</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="w-12 h-12 bg-game-green/20 rounded-full flex items-center justify-center mb-3 mx-auto">
            <MessageSquare className="w-6 h-6 text-game-green" />
          </div>
          <h3 className="font-bold text-lg mb-2">Chat & React</h3>
          <p className="text-gray-600 text-sm">Chat with other players, react to drawings, and celebrate correct guesses.</p>
        </div>
      </div>
    </div>
  );
}
