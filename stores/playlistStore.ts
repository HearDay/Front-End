import { create } from 'zustand';

interface PlaylistStore {
  playlist: number[];
  currentIndex: number;
  isPlaylistMode: boolean;

  setPlaylist: (ids: number[]) => void;
  setCurrentIndex: (index: number) => void;
  goToNext: () => number | null;
  goToPrev: () => number | null;
  getCurrentArticleId: () => number | null;
  reset: () => void;
}

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
  playlist: [],
  currentIndex: 0,
  isPlaylistMode: false,

  setPlaylist: (ids) => set({
    playlist: ids,
    currentIndex: 0,
    isPlaylistMode: true
  }),

  setCurrentIndex: (index) => set({ currentIndex: index }),

  goToNext: () => {
    const { playlist, currentIndex } = get();
    if (currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1;
      set({ currentIndex: nextIndex });
      return playlist[nextIndex];
    }
    return null;
  },

  goToPrev: () => {
    const { currentIndex, playlist } = get();
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      set({ currentIndex: prevIndex });
      return playlist[prevIndex];
    }
    return null;
  },

  getCurrentArticleId: () => {
    const { playlist, currentIndex } = get();
    return playlist[currentIndex] || null;
  },

  reset: () => set({
    playlist: [],
    currentIndex: 0,
    isPlaylistMode: false
  }),
}));
