import React, { createContext, useContext, useRef } from 'react'

interface SavedNewsScrollContextType {
  scrollPosition: React.MutableRefObject<number>
  setScrollPosition: (position: number) => void
}

const SavedNewsScrollContext = createContext<SavedNewsScrollContextType | undefined>(undefined)

export function SavedNewsScrollProvider({ children }: { children: React.ReactNode }) {
  const scrollPosition = useRef<number>(0)

  const setScrollPosition = (position: number) => {
    scrollPosition.current = position
  }

  return (
    <SavedNewsScrollContext.Provider value={{ scrollPosition, setScrollPosition }}>
      {children}
    </SavedNewsScrollContext.Provider>
  )
}

export function useSavedNewsScroll() {
  const context = useContext(SavedNewsScrollContext)
  if (context === undefined) {
    throw new Error('useSavedNewsScroll must be used within a SavedNewsScrollProvider')
  }
  return context
}
