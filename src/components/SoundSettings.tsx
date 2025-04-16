
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from "@/components/ui/popover";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

export function SoundSettings() {
  const { isEnabled, volume, toggle, updateVolume, play } = useSoundEffects();
  const [open, setOpen] = useState(false);
  
  const handleToggle = () => {
    toggle();
    play('buttonClick');
  };
  
  const handleVolumeChange = (value: number[]) => {
    updateVolume(value[0]);
  };
  
  // Dynamic icon based on volume level and enabled state
  const VolumeIcon = () => {
    if (!isEnabled) return <VolumeX />;
    if (volume < 0.2) return <Volume />;
    if (volume < 0.6) return <Volume1 />;
    return <Volume2 />;
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white text-game-blue"
          onClick={() => {
            play('buttonClick');
            setOpen(!open);
          }}
        >
          <VolumeIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Sound Settings</h3>
          
          <div className="flex items-center justify-between">
            <span>Sound Effects</span>
            <Button 
              variant={isEnabled ? "default" : "outline"} 
              size="sm"
              onClick={handleToggle}
              className={isEnabled ? "bg-game-green" : ""}
            >
              {isEnabled ? "On" : "Off"}
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Volume</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Volume className="h-4 w-4" />
              <Slider
                defaultValue={[volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                disabled={!isEnabled}
              />
              <Volume2 className="h-4 w-4" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
