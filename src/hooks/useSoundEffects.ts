
import { useEffect, useState } from 'react';
import { 
  playSound, 
  toggleSound, 
  setSoundVolume, 
  getSoundSettings, 
  initSoundEffects,
  SoundEffect
} from '@/utils/soundEffects';

export function useSoundEffects() {
  const [isEnabled, setIsEnabled] = useState(getSoundSettings().enabled);
  const [volume, setVolume] = useState(getSoundSettings().volume);
  
  // Initialize sound effects on first mount
  useEffect(() => {
    initSoundEffects();
  }, []);
  
  const play = (sound: SoundEffect) => {
    playSound(sound);
  };
  
  const toggle = () => {
    const newState = toggleSound();
    setIsEnabled(newState);
    return newState;
  };
  
  const updateVolume = (newVolume: number) => {
    setSoundVolume(newVolume);
    setVolume(newVolume);
  };
  
  return {
    play,
    toggle,
    isEnabled,
    volume,
    updateVolume
  };
}
