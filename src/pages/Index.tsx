
import { useState, useEffect } from "react";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { WordSuggestion } from "@/components/WordSuggestion";
import { ChatBox } from "@/components/ChatBox";
import { Leaderboard } from "@/components/Leaderboard";
import { GameHeader } from "@/components/GameHeader";
import { CorrectGuessModal } from "@/components/CorrectGuessModal";
import { EmojiReactions } from "@/components/EmojiReactions";
import { GameLobby } from "@/components/GameLobby";
import { FloatingTips } from "@/components/FloatingTips";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, Users, Volume2, VolumeX } from "lucide-react";

// Sample data
const SAMPLE_PLAYERS = [
  { id: 1, username: "YourUsername", score: 340, isCurrentPlayer: true },
  { id: 2, username: "ArtistPro", score: 520, isDrawer: true },
  { id: 3, username: "WordMaster", score: 480 },
  { id: 4, username: "QuickGuesser", score: 300 },
  { id: 5, username: "DrawingWizard", score: 290 },
  { id: 6, username: "PuzzleSolver", score: 240 },
];

const SAMPLE_WORDS = [
  "airplane", "elephant", "birthday", "smartphone", "rainbow", "treasure",
  "pizza", "soccer", "beach", "mountain", "robot", "dragon",
  "unicorn", "castle", "astronaut", "spaceship", "princess", "dinosaur",
  "submarine", "tornado", "vampire", "werewolf", "wizard", "zombie",
  "ninja", "pirate", "cowboy", "superhero", "mermaid", "fairy"
];

const Index = () => {
  const { toast } = useToast();
  const [username, setUsername] = useState("YourUsername");
  const [isDrawer, setIsDrawer] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [suggestedWords, setSuggestedWords] = useState<string[]>([]);
  const [showWordSelection, setShowWordSelection] = useState(false);
  const [players, setPlayers] = useState(SAMPLE_PLAYERS);
  const [roundNumber, setRoundNumber] = useState(1);
  const [totalRounds, setTotalRounds] = useState(7);
  const [showCorrectGuessModal, setShowCorrectGuessModal] = useState(false);
  const [correctGuesser, setCorrectGuesser] = useState("");
  const [pointsAwarded, setPointsAwarded] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Simulate getting three random words when it's your turn to draw
  useEffect(() => {
    if (isDrawer) {
      // Shuffle and get 3 random words
      const shuffled = [...SAMPLE_WORDS].sort(() => 0.5 - Math.random());
      setSuggestedWords(shuffled.slice(0, 3));
      setShowWordSelection(true);
    }
  }, [isDrawer]);

  const handleWordSelection = (word: string) => {
    setCurrentWord(word);
    setShowWordSelection(false);
    
    toast({
      title: "Word Selected",
      description: `You selected "${word}". Start drawing now!`,
      variant: "default",
    });
  };

  const handleGuess = (guess: string) => {
    // Simulate guess checking
    if (guess.toLowerCase().trim() === currentWord.toLowerCase()) {
      // Correct guess!
      setCorrectGuesser(username);
      setPointsAwarded(100);
      setShowCorrectGuessModal(true);
      
      // Update scores
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.isCurrentPlayer
            ? { ...player, score: player.score + 100 }
            : player.isDrawer
            ? { ...player, score: player.score + 50 }
            : player
        )
      );
    }
  };

  const handleTimeUp = () => {
    toast({
      title: "Time's Up!",
      description: `The word was "${currentWord}". Next round starting soon!`,
      variant: "destructive",
    });
    
    // Simulate starting next round
    setTimeout(() => {
      setRoundNumber((prev) => Math.min(prev + 1, totalRounds));
      
      // Rotate drawer role for demonstration
      if (!isDrawer) {
        setIsDrawer(true);
      } else {
        setIsDrawer(false);
      }
    }, 3000);
  };

  const handleStartGame = (name: string) => {
    setUsername(name);
    setGameStarted(true);
    
    toast({
      title: "Welcome to the game!",
      description: "Get ready to draw and guess with friends!",
    });
    
    // Update current player name in players list
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.isCurrentPlayer ? { ...player, username: name } : player
      )
    );
  };

  if (!gameStarted) {
    return <GameLobby onStartGame={handleStartGame} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-game-softBlue to-game-lightBlue relative overflow-hidden">
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
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="mb-4 sm:mb-0 flex items-center">
            <img src="/logo.svg" alt="Logo" className="w-16 h-16 mr-3" />
            <div>
              <h1 className="text-5xl font-bold text-white drop-shadow-md flex items-center">
                Sketch
                <span className="text-game-yellow mx-1">Speak</span>
                <span className="text-game-orange">Squad</span>
              </h1>
              <p className="text-white/80 text-lg">Draw, guess, and have fun with friends!</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white text-game-blue"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    <Users className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Players</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white text-game-blue"
                  >
                    <HelpCircle className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Game Rules</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white text-game-blue"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    {soundEnabled ? (
                      <Volume2 className="h-6 w-6" />
                    ) : (
                      <VolumeX className="h-6 w-6" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{soundEnabled ? "Mute Sounds" : "Enable Sounds"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>
        
        <GameHeader
          currentWord={currentWord}
          isDrawer={isDrawer}
          roundNumber={roundNumber}
          totalRounds={totalRounds}
          currentDrawer={players.find((p) => p.isDrawer)?.username || ""}
          timeLimit={90}
          onTimeUp={handleTimeUp}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <div className="relative">
              <DrawingCanvas isDrawer={isDrawer} />
              
              {/* Word suggestion popup */}
              {showWordSelection && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <WordSuggestion
                    words={suggestedWords}
                    onSelectWord={handleWordSelection}
                    visible={showWordSelection}
                  />
                </div>
              )}
              
              {/* Emoji reactions */}
              <div className="absolute bottom-4 right-4">
                <EmojiReactions />
              </div>
            </div>
          </div>
          
          <div className={`lg:col-span-1 space-y-4 ${isMobileMenuOpen ? '' : 'hidden lg:block'}`}>
            <Leaderboard players={players} />
            <div className="h-[calc(100%-280px)] min-h-[300px]">
              <ChatBox
                username={username}
                isDrawer={isDrawer}
                onGuess={handleGuess}
                correctWord={currentWord}
              />
            </div>
          </div>
        </div>
      </div>
      
      <CorrectGuessModal
        open={showCorrectGuessModal}
        onClose={() => setShowCorrectGuessModal(false)}
        guesser={correctGuesser}
        word={currentWord}
        points={pointsAwarded}
      />
      
      {/* Floating tips */}
      <FloatingTips />
    </div>
  );
};

export default Index;
