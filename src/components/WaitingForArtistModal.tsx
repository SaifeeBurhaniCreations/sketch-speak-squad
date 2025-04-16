
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface WaitingForArtistModalProps {
  open: boolean;
  artistName: string;
}

export function WaitingForArtistModal({ open, artistName }: WaitingForArtistModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="bg-game-blue border-4 border-white rounded-xl max-w-md p-0 overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 overflow-hidden">
            <img 
              src="/placeholder.svg" 
              alt="Artist avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <h2 className="text-xl font-bold text-white mb-1">
            {artistName} IS THE ARTIST...
          </h2>
          
          <div className="text-2xl font-bold text-white mb-6">
            WAITING FOR THE ARTIST TO CHOOSE A WORD
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-6 mb-6">
            <div className="bg-game-green h-6 rounded-full animate-pulse" style={{ width: '70%' }} />
          </div>
          
          <div className="flex justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-game-yellow" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
