
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut, PenTool, HelpCircle, UserMinus, UserPlus } from "lucide-react";

interface ExitGameModalProps {
  open: boolean;
  onClose: () => void;
  onQuit: () => void;
  onSwitchRole: () => void;
  currentRole: "drawer" | "guesser";
}

export function ExitGameModal({ open, onClose, onQuit, onSwitchRole, currentRole }: ExitGameModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-xl max-w-md">
        <DialogTitle className="text-2xl font-bold text-game-darkBlue">Game Options</DialogTitle>
        <DialogDescription className="text-gray-600">
          What would you like to do?
        </DialogDescription>
        
        <div className="grid gap-3 mt-4">
          <Button 
            variant="outline" 
            className="flex justify-between items-center py-6 bg-game-softBlue hover:bg-game-softBlue/80 text-game-darkBlue border-game-blue"
            onClick={() => setSelectedOption("switchRole")}
          >
            <div className="flex items-center">
              {currentRole === "drawer" ? <UserMinus className="mr-2 h-5 w-5" /> : <UserPlus className="mr-2 h-5 w-5" />}
              <span>Switch to {currentRole === "drawer" ? "Guesser" : "Drawer"}</span>
            </div>
            {selectedOption === "switchRole" && (
              <div className="text-sm bg-game-green text-white px-2 py-1 rounded-full">
                Selected
              </div>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className="flex justify-between items-center py-6 bg-game-softBlue hover:bg-game-softBlue/80 text-game-darkBlue border-game-blue"
            onClick={() => setSelectedOption("practice")}
          >
            <div className="flex items-center">
              <PenTool className="mr-2 h-5 w-5" />
              <span>Practice Drawing</span>
            </div>
            {selectedOption === "practice" && (
              <div className="text-sm bg-game-green text-white px-2 py-1 rounded-full">
                Selected
              </div>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className="flex justify-between items-center py-6 bg-game-softBlue hover:bg-game-softBlue/80 text-game-darkBlue border-game-blue"
            onClick={() => setSelectedOption("hint")}
          >
            <div className="flex items-center">
              <HelpCircle className="mr-2 h-5 w-5" />
              <span>Quick AI Hint</span>
            </div>
            {selectedOption === "hint" && (
              <div className="text-sm bg-game-green text-white px-2 py-1 rounded-full">
                Selected
              </div>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className="flex justify-between items-center py-6 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
            onClick={() => setSelectedOption("quit")}
          >
            <div className="flex items-center">
              <LogOut className="mr-2 h-5 w-5" />
              <span>Quit Game</span>
            </div>
            {selectedOption === "quit" && (
              <div className="text-sm bg-red-500 text-white px-2 py-1 rounded-full">
                Selected
              </div>
            )}
          </Button>
        </div>
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (selectedOption === "quit") {
                onQuit();
              } else if (selectedOption === "switchRole") {
                onSwitchRole();
              }
              onClose();
            }}
            disabled={!selectedOption}
            className={selectedOption === "quit" ? "bg-red-500 hover:bg-red-600" : ""}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
