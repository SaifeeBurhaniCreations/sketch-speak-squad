
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
import { HelpCircle, Users } from "lucide-react";
import { LoadingModal } from "@/components/LoadingModal";
import { WordSelectionModal } from "@/components/WordSelectionModal";
import { WaitingForArtistModal } from "@/components/WaitingForArtistModal";
import { ExitGameModal } from "@/components/ExitGameModal";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { SoundSettings } from "@/components/SoundSettings";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { SoundVisualizer } from "@/components/SoundVisualizer";

// Define player interface to fix TypeScript errors
interface Player {
  id: number;
  username: string;
  score: number;
  isCurrentPlayer?: boolean;
  isDrawer?: boolean;
}

// Sample data
const SAMPLE_PLAYERS: Player[] = [
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

type GameState = 
  | "lobby" 
  | "loading" 
  | "waiting-for-artist" 
  | "selecting-word" 
  | "playing" 
  | "round-end";

const Index = () => {
  const { toast } = useToast();
  const { play } = useSoundEffects();
  const [username, setUsername] = useState("YourUsername");
  const [isDrawer, setIsDrawer] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [suggestedWords, setSuggestedWords] = useState<string[]>([]);
  const [showWordSelection, setShowWordSelection] = useState(false);
  const [players, setPlayers] = useState<Player[]>(SAMPLE_PLAYERS);
  const [roundNumber, setRoundNumber] = useState(1);
  const [totalRounds, setTotalRounds] = useState(7);
  const [showCorrectGuessModal, setShowCorrectGuessModal] = useState(false);
  const [correctGuesser, setCorrectGuesser] = useState("");
  const [pointsAwarded, setPointsAwarded] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [gameState, setGameState] = useState<GameState>("lobby");
  const [showExitModal, setShowExitModal] = useState(false);
  const [lastTimeoutToast, setLastTimeoutToast] = useState<Date | null>(null);
  const [showSoundVisualizer, setShowSoundVisualizer] = useState(false);
  const [showWaitingForArtistModal, setShowWaitingForArtistModal] = useState(false);

  // Temporary state for sound visualization
  useEffect(() => {
    if (showSoundVisualizer) {
      const timeout = setTimeout(() => {
        setShowSoundVisualizer(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [showSoundVisualizer]);

  // Get the current drawer's name
  const currentDrawer = players.find((p) => p.isDrawer)?.username || "";

  // Simulate getting three random words when it's your turn to draw
  useEffect(() => {
    if (gameState === "selecting-word" && isDrawer) {
      // Shuffle and get 3 random words
      const shuffled = [...SAMPLE_WORDS].sort(() => 0.5 - Math.random());
      setSuggestedWords(shuffled.slice(0, 3));
    }
  }, [gameState, isDrawer]);

  useEffect(() => {
    if (gameState === "waiting-for-artist") {
      // Show the modal when the game state is "waiting-for-artist"
      setShowWaitingForArtistModal(true);
      play('modalOpen');
  
      const timer = setTimeout(() => {
        setShowWaitingForArtistModal(false);
        play('modalClose');
      }, 2000);
  
      return () => clearTimeout(timer);
    }
  }, [gameState, play]);

  const handleWordSelection = (word: string) => {
    setCurrentWord(word);
    setGameState("playing");
    play('buttonClick');
    
    toast({
      title: "Word Selected",
      description: `You selected "${word}". Start drawing now!`,
      variant: "default",
    });
  };

  const handleGuess = (guess: string) => {
    // Play typing sound
    play('typing');
    
    // Simulate guess checking
    if (guess.toLowerCase().trim() === currentWord.toLowerCase() && !isDrawer) {
      // Correct guess!
      setCorrectGuesser(username);
      setPointsAwarded(100);
      setShowCorrectGuessModal(true);
      play('correctGuess');
      setShowSoundVisualizer(true);
      
      // Update scores - fixed to avoid TypeScript errors
      setPlayers((prevPlayers) => {
        return prevPlayers.map((player) => {
          if (player.isCurrentPlayer) {
            return { ...player, score: player.score + 100 };
          } else if (player.isDrawer) {
            return { ...player, score: player.score + 50 };
          }
          return player;
        });
      });
    } else {
      // Wrong guess
      play('wrongGuess');
      // Display the guess in the chat
    }
  };

  const handleTimeUp = () => {
    // Only show toast if it's been more than 5 seconds since the last one
    const now = new Date();
    if (!lastTimeoutToast || (now.getTime() - lastTimeoutToast.getTime()) > 5000) {
      toast({
        title: "Time's Up!",
        description: `The word was "${currentWord}". Next round starting soon!`,
        variant: "destructive",
      });
      play('timeUp');
      setLastTimeoutToast(now);
    }
    
    // Simulate starting next round
    setTimeout(() => {
      setRoundNumber((prev) => Math.min(prev + 1, totalRounds));
      
      // Rotate drawer role - fixed to avoid TypeScript errors
      const nextDrawerIndex = Math.floor(Math.random() * players.length);
      const nextDrawer = players[nextDrawerIndex].username;
      
      setPlayers((prevPlayers) => {
        return prevPlayers.map((player, index) => {
          if (index === nextDrawerIndex) {
            return { ...player, isDrawer: true };
          } else {
            const { isDrawer, ...rest } = player;
            return rest;
          }
        });
      });
      
      setIsDrawer(nextDrawer === username);
      
      if (nextDrawer === username) {
        setGameState("selecting-word");
      } else {
        setGameState("waiting-for-artist");
      }
    }, 3000);
  };

  const handleStartGame = (name: string) => {
    setUsername(name);
    setGameState("loading");
    play('buttonClick');
    
    // Update current player name in players list - fixed to avoid TypeScript errors
    setPlayers((prevPlayers) => {
      return prevPlayers.map((player) => {
        if (player.isCurrentPlayer) {
          return { ...player, username: name };
        }
        return player;
      });
    });
    
    // Simulate loading and then transition to game
    setTimeout(() => {
      const randomDrawerIndex = Math.floor(Math.random() * players.length);
      const randomDrawer = players[randomDrawerIndex].username;
      
      // Fixed to avoid TypeScript errors
      setPlayers((prevPlayers) => {
        return prevPlayers.map((player, index) => {
          if (index === randomDrawerIndex) {
            return { ...player, isDrawer: true };
          } else {
            const { isDrawer, ...rest } = player;
            return rest;
          }
        });
      });
      
      setIsDrawer(randomDrawer === name);
      
      if (randomDrawer === name) {
        setGameState("selecting-word");
      } else {
        setGameState("waiting-for-artist");
      }
    }, 3000);
  };
  
  const handleExitGame = () => {
    setShowExitModal(true);
    play('modalOpen');
  };
  
  const handleSwitchRole = () => {
    setIsDrawer(!isDrawer);
    play('roleSwitch');
    
    // Update players array to reflect role change - fixed to avoid TypeScript errors
    setPlayers((prevPlayers) => {
      return prevPlayers.map((player) => {
        if (player.isCurrentPlayer) {
          return { ...player, isDrawer: !isDrawer };
        } else if (player.isDrawer) {
          const { isDrawer, ...rest } = player;
          return rest;
        }
        return player;
      });
    });
    
    if (!isDrawer) {
      setGameState("selecting-word");
    } else {
      setGameState("waiting-for-artist");
    }
    
    toast({
      title: "Role Switched",
      description: `You are now a ${!isDrawer ? "drawer" : "guesser"}.`,
    });
  };
  
  const handleQuitGame = () => {
    setGameState("lobby");
    setRoundNumber(1);
    setCurrentWord("");
    play('buttonClick');
    
    toast({
      title: "Game Ended",
      description: "You've left the game. Join a new one when ready!",
    });
  };

  // Handle countdown tick sound effect
  const handleCountdownTick = (seconds: number) => {
    if (seconds <= 5 && seconds > 0) {
      play('timerTick');
    }
  };

  // Render different components based on game state
  if (gameState === "lobby") {
    return <GameLobby onStartGame={handleStartGame} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-game-softBlue to-game-lightBlue relative overflow-hidden pb-12">
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
      
      {/* Sound visualizer overlay */}
      {showSoundVisualizer && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="bg-game-yellow/20 backdrop-blur-sm p-8 rounded-full animate-pulse">
            <SoundVisualizer isPlaying={true} size="lg" color="#FFD700" />
          </div>
        </div>
      )}
      
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
                    onClick={() => {
                      play('buttonClick');
                      setIsMobileMenuOpen(!isMobileMenuOpen);
                    }}
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
                    onClick={() => play('buttonClick')}
                  >
                    <HelpCircle className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Game Rules</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <SoundSettings />
          </div>
        </header>
        
        <GameHeader
          currentWord={currentWord}
          isDrawer={isDrawer}
          roundNumber={roundNumber}
          totalRounds={totalRounds}
          currentDrawer={currentDrawer}
          timeLimit={90}
          onTimeUp={handleTimeUp}
          onCountdownTick={handleCountdownTick}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <div className="relative">
              <DrawingCanvas 
                isDrawer={isDrawer} 
                onExit={handleExitGame}
              />
              
              {/* Emoji reactions */}
              <div className="absolute bottom-4 right-4">
                <EmojiReactions />
              </div>
            </div>
            
            {!isDrawer && (
              <VirtualKeyboard 
                onSubmit={handleGuess} 
                disabled={gameState !== "playing"}
              />
            )}
          </div>
          
          <div className={`lg:col-span-1 space-y-4 ${isMobileMenuOpen ? '' : 'hidden lg:block'}`}>
            <div className="h-[calc(100%-280px)] min-h-[300px]">
              <ChatBox
                username={username}
                isDrawer={isDrawer}
                onGuess={handleGuess}
                correctWord={currentWord}
              />
            </div>
            {isDrawer && <Leaderboard players={players} />}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <LoadingModal 
        open={gameState === "loading"} 
        onFinishLoading={() => {
          if (isDrawer) {
            setGameState("selecting-word");
          } else {
            setGameState("waiting-for-artist");
          }
        }} 
      />
      
      <WordSelectionModal 
        open={gameState === "selecting-word" && isDrawer} 
        words={suggestedWords} 
        onSelectWord={handleWordSelection}
        artistName={username}
      />
      
      {showWaitingForArtistModal && <WaitingForArtistModal open={true} artistName={currentDrawer} />}
      
      <ExitGameModal 
        open={showExitModal}
        onClose={() => {
          setShowExitModal(false);
          play('modalClose');
        }}
        onQuit={handleQuitGame}
        onSwitchRole={handleSwitchRole}
        currentRole={isDrawer ? "drawer" : "guesser"}
      />
      
      <CorrectGuessModal
        open={showCorrectGuessModal}
        onClose={() => {
          setShowCorrectGuessModal(false);
          play('modalClose');
        }}
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
