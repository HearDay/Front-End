import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TodayNewsContextType {
  showTodayNewsModal: boolean;
  setShowTodayNewsModal: (visible: boolean) => void;
  completedNewsId: string | null;
  setCompletedNewsId: (id: string | null) => void;
  isTodayNewsFlow: boolean;
  setIsTodayNewsFlow: (isFlowing: boolean) => void;
}

const TodayNewsContext = createContext<TodayNewsContextType | undefined>(undefined);

export const TodayNewsProvider = ({ children }: { children: ReactNode }) => {
  const [showTodayNewsModal, setShowTodayNewsModal] = useState(false);
  const [completedNewsId, setCompletedNewsId] = useState<string | null>(null);
  const [isTodayNewsFlow, setIsTodayNewsFlow] = useState(false);

  const value = {
    showTodayNewsModal,
    setShowTodayNewsModal,
    completedNewsId,
    setCompletedNewsId,
    isTodayNewsFlow,
    setIsTodayNewsFlow,
  };

  return (
    <TodayNewsContext.Provider value={value}>
      {children}
    </TodayNewsContext.Provider>
  );
};

export const useTodayNews = () => {
  const context = useContext(TodayNewsContext);
  if (context === undefined) {
    throw new Error('useTodayNews must be used within a TodayNewsProvider');
  }
  return context;
};
