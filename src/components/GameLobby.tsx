
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Users, Play } from "lucide-react";

interface GameLobbyProps {
  onStartGame: (username: string) => void;
}

export function GameLobby({ onStartGame }: GameLobbyProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleStart = () => {
    if (!username.trim()) {
      setError("Please enter a username to continue");
      return;
    }
    
    onStartGame(username);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-game-softBlue to-game-lightBlue relative overflow-hidden p-4">
      {/* Background X-patterns */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute text-blue-300/30 text-8xl font-bold"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: 'rotate(45deg)',
            }}
          >
            ✕
          </div>
        ))}
      </div>
      
      <div className="text-center mb-8 absolute top-10 left-0 right-0">
        <h1 className="text-6xl font-bold text-white drop-shadow-lg flex items-center justify-center">
          Sketch
          <span className="text-game-yellow mx-2">Speak</span>
          <span className="text-game-orange">Squad</span>
        </h1>
        <p className="text-white/90 text-xl mt-2">Draw, guess, and have fun with friends!</p>
      </div>
      
      <Card className="max-w-md w-full bg-white/95 backdrop-blur shadow-xl border-0 rounded-xl animate-fade-in z-10">
        <CardHeader>
          <CardTitle className="text-2xl text-game-blue">Join the Game</CardTitle>
          <CardDescription>Enter your username to start playing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="Enter your username" 
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                className="border-game-blue"
              />
              {error && (
                <div className="flex items-center text-red-500 text-sm mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </div>
              )}
            </div>
            
            <div className="bg-game-softBlue rounded-lg p-4">
              <h3 className="font-semibold flex items-center text-game-darkBlue mb-2">
                <Users className="h-5 w-5 mr-2" /> 
                Game Rules
              </h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>One player draws while others guess</li>
                <li>Correct guesses earn points for both guesser and drawer</li>
                <li>Each round has a time limit to guess the word</li>
                <li>The player with the most points at the end wins!</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-game-blue hover:bg-game-darkBlue text-lg py-6"
            onClick={handleStart}
          >
            <Play className="mr-2 h-5 w-5" /> 
            Start Playing
          </Button>
        </CardFooter>
      </Card>
      
      <div className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-sm">
        © 2025 Sketch Speak Squad • A fun multiplayer drawing and guessing game
      </div>
    </div>
  );
}
