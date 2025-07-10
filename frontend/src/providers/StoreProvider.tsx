import React, { createContext, useContext } from 'react';
import type { Instance } from "mobx-state-tree";
import { rootStore } from '../stores/RootStore';

type StoreType = Instance<typeof rootStore>;

const StoreContext = createContext<StoreType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};