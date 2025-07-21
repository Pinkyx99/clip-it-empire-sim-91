import { useState } from 'react';
import { useGameData } from '../hooks/useGameData';

export interface WindowState {
  id: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

export const useWindowManager = () => {
  const [windows, setWindows] = useState<WindowState[]>([
    { id: 'twitch', isOpen: false, isMinimized: false, zIndex: 1 },
    { id: 'capcut', isOpen: false, isMinimized: false, zIndex: 1 },
    { id: 'tiktok', isOpen: false, isMinimized: false, zIndex: 1 },
    { id: 'whop', isOpen: false, isMinimized: false, zIndex: 1 },
  ]);

  const [highestZIndex, setHighestZIndex] = useState(1);

  const openWindow = (windowId: string) => {
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    
    setWindows(prev => prev.map(window => 
      window.id === windowId 
        ? { ...window, isOpen: true, isMinimized: false, zIndex: newZIndex }
        : window
    ));
  };

  const closeWindow = (windowId: string) => {
    setWindows(prev => prev.map(window => 
      window.id === windowId 
        ? { ...window, isOpen: false, isMinimized: false }
        : window
    ));
  };

  const minimizeWindow = (windowId: string) => {
    setWindows(prev => prev.map(window => 
      window.id === windowId 
        ? { ...window, isMinimized: true }
        : window
    ));
  };

  const restoreWindow = (windowId: string) => {
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    
    setWindows(prev => prev.map(window => 
      window.id === windowId 
        ? { ...window, isMinimized: false, zIndex: newZIndex }
        : window
    ));
  };

  const focusWindow = (windowId: string) => {
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    
    setWindows(prev => prev.map(window => 
      window.id === windowId 
        ? { ...window, zIndex: newZIndex }
        : window
    ));
  };

  const getWindow = (windowId: string) => {
    return windows.find(w => w.id === windowId);
  };

  const getOpenWindows = () => {
    return windows.filter(w => w.isOpen);
  };

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    focusWindow,
    getWindow,
    getOpenWindows,
  };
};