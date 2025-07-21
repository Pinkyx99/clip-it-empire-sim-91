import { useWindowManagerContext } from '../contexts/WindowManagerContext';
import { useGameData } from '../hooks/useGameData';
import { Tv, Edit, Camera, ShoppingBag, Clock } from 'lucide-react';

export const Taskbar = () => {
  const { getOpenWindows, restoreWindow, focusWindow } = useWindowManagerContext();
  const { gameState } = useGameData();
  const openWindows = getOpenWindows();

  const getWindowIcon = (windowId: string) => {
    switch (windowId) {
      case 'twitch': return <Tv className="w-4 h-4" />;
      case 'capcut': return <Edit className="w-4 h-4" />;
      case 'tiktok': return <Camera className="w-4 h-4" />;
      case 'whop': return <ShoppingBag className="w-4 h-4" />;
      default: return null;
    }
  };

  const getWindowTitle = (windowId: string) => {
    switch (windowId) {
      case 'twitch': return 'Twitch';
      case 'capcut': return 'CapCut';
      case 'tiktok': return 'TikTok';
      case 'whop': return 'Whop';
      default: return '';
    }
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-gradient-to-r from-primary/90 to-primary-glow/90 backdrop-blur-sm border-t border-border flex items-center justify-between px-4">
      {/* Start Button */}
      <div className="flex items-center space-x-2">
        <button className="bg-primary/20 hover:bg-primary/30 px-3 py-1 rounded text-sm font-medium text-primary-foreground transition-colors">
          🎮 Clip Tycoon
        </button>
      </div>

      {/* Open Windows */}
      <div className="flex items-center space-x-1">
        {openWindows.map((window) => (
          <button
            key={window.id}
            onClick={() => {
              if (window.isMinimized) {
                restoreWindow(window.id);
              } else {
                focusWindow(window.id);
              }
            }}
            className={`
              flex items-center space-x-2 px-3 py-1 rounded text-sm transition-colors
              ${window.isMinimized 
                ? 'bg-muted/30 text-muted-foreground' 
                : 'bg-primary-foreground/20 text-primary-foreground'
              }
              hover:bg-primary-foreground/30
            `}
          >
            {getWindowIcon(window.id)}
            <span>{getWindowTitle(window.id)}</span>
          </button>
        ))}
      </div>

      {/* System Info */}
      <div className="flex items-center space-x-4 text-sm text-primary-foreground">
        <div className="flex items-center space-x-1">
          <span>💰 ${gameState.player.money.toFixed(0)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>👥 {gameState.player.followers.toLocaleString()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{formatTime()}</span>
        </div>
      </div>
    </div>
  );
};