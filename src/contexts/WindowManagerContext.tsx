import { createContext, useContext, ReactNode } from 'react';
import { useWindowManager, WindowState } from '../hooks/useWindowManager';

interface WindowManagerContextType {
  windows: WindowState[];
  openWindow: (windowId: string) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  getWindow: (windowId: string) => WindowState | undefined;
  getOpenWindows: () => WindowState[];
}

const WindowManagerContext = createContext<WindowManagerContextType | undefined>(undefined);

export const WindowManagerProvider = ({ children }: { children: ReactNode }) => {
  const windowManager = useWindowManager();
  
  return (
    <WindowManagerContext.Provider value={windowManager}>
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManagerContext = () => {
  const context = useContext(WindowManagerContext);
  if (context === undefined) {
    throw new Error('useWindowManagerContext must be used within a WindowManagerProvider');
  }
  return context;
};