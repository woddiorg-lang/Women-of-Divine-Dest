import { create } from 'zustand';

interface RadioState {
  isPlaying: boolean;
  isOpen: boolean; // Is the full screen radio open
  currentProgramId: string | null;
  currentEpisodeId: string | null;
  volume: number;
  togglePlay: () => void;
  playEpisode: (programId: string, episodeId: string) => void;
  setVolume: (v: number) => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useRadioStore = create<RadioState>((set) => ({
  isPlaying: false,
  isOpen: false,
  currentProgramId: null,
  currentEpisodeId: null,
  volume: 80,
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  playEpisode: (programId, episodeId) => set({ currentProgramId: programId, currentEpisodeId: episodeId, isPlaying: true }),
  setVolume: (volume) => set({ volume }),
  setIsOpen: (isOpen) => set({ isOpen }),
}));
