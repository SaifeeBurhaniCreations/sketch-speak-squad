
import { useState, useEffect } from "react";
import { GameTimer } from "@/components/GameTimer";

interface GameHeaderProps {
  currentWord?: string;
  isDrawer: boolean;
  roundNumber: number;
  totalRounds: number;
  currentDrawer: string;
  timeLimit: number;
  onTimeUp?: () => void;
}

export function GameHeader({
  currentWord,
  isDrawer,
  roundNumber,
  totalRounds,
  currentDrawer,
  timeLimit,
  onTimeUp,
}: GameHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-stretch justify-between mb-4">
      <div className="bg-game-darkBlue p-4 rounded-xl text-white shadow-lg flex-1 flex flex-col justify-center">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-game-lightBlue font-medium">Round</h3>
            <p className="text-xl font-bold">{roundNumber} / {totalRounds}</p>
          </div>
          <div>
            <h3 className="text-game-lightBlue font-medium">Artist</h3>
            <p className="text-xl font-bold">{currentDrawer}</p>
          </div>
          <div>
            <h3 className="text-game-lightBlue font-medium">Word</h3>
            <p className="text-xl font-bold">
              {isDrawer 
                ? currentWord 
                : currentWord 
                  ? currentWord.replace(/[a-zA-Z]/g, "_ ") 
                  : "Waiting..."}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex-1">
        <GameTimer initialSeconds={timeLimit} onTimeUp={onTimeUp} />
      </div>
    </div>
  );
}
