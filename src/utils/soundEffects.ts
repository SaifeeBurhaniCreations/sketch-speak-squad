
export type SoundEffect = 
  | 'buttonClick'
  | 'modalOpen'
  | 'modalClose'
  | 'correctGuess'
  | 'wrongGuess'
  | 'roleSwitch'
  | 'timerTick'
  | 'timeUp'
  | 'scoreUpdate'
  | 'typing';

// Mapping sound effects to their file paths
const soundMap: Record<SoundEffect, string> = {
  buttonClick: '/sounds/button-click.mp3',
  modalOpen: '/sounds/modal-open.mp3',
  modalClose: '/sounds/modal-close.mp3',
  correctGuess: '/sounds/correct-guess.mp3',
  wrongGuess: '/sounds/wrong-guess.mp3',
  roleSwitch: '/sounds/role-switch.mp3',
  timerTick: '/sounds/timer-tick.mp3',
  timeUp: '/sounds/time-up.mp3',
  scoreUpdate: '/sounds/score-update.mp3',
  typing: '/sounds/typing.mp3'
};

// Create audio elements for each sound effect
const audioElements: Partial<Record<SoundEffect, HTMLAudioElement>> = {};

// Initialize audio elements (called once on app startup)
export const initSoundEffects = () => {
  Object.entries(soundMap).forEach(([key, path]) => {
    try {
      const audio = new Audio();
      audio.src = path;
      audio.preload = 'auto';
      audioElements[key as SoundEffect] = audio;
    } catch (error) {
      console.error(`Failed to load sound effect: ${key}`, error);
    }
  });
};

// Sound settings state
let soundEnabled = true;
let soundVolume = 0.5;

// Play a sound effect
export const playSound = (soundEffect: SoundEffect) => {
  if (!soundEnabled) return;
  
  const audio = audioElements[soundEffect];
  if (audio) {
    // Create a clone to allow overlapping sounds
    const audioClone = audio.cloneNode() as HTMLAudioElement;
    audioClone.volume = soundVolume;
    audioClone.play().catch(err => {
      // Browsers often block autoplay without user interaction
      console.warn(`Sound playback blocked: ${soundEffect}`, err);
    });
  } else {
    console.warn(`Sound effect not loaded: ${soundEffect}`);
  }
};

// Toggle sound on/off
export const toggleSound = (): boolean => {
  soundEnabled = !soundEnabled;
  return soundEnabled;
};

// Set sound volume (0.0 to 1.0)
export const setSoundVolume = (volume: number) => {
  soundVolume = Math.max(0, Math.min(1, volume));
};

// Get current sound settings
export const getSoundSettings = () => ({
  enabled: soundEnabled,
  volume: soundVolume
});
