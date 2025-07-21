import { WindowManagerProvider, useWindowManagerContext } from '../contexts/WindowManagerContext';
import { useGameData } from '../hooks/useGameData';
import { Desktop } from '../components/Desktop';
import { Taskbar } from '../components/Taskbar';
import { Window } from '../components/Window';
import { TwitchApp } from '../components/apps/TwitchApp';
import { CapCutApp } from '../components/apps/CapCutApp';
import { TikTokApp } from '../components/apps/TikTokApp';
import { WhopApp } from '../components/apps/WhopApp';
import { FileExplorerApp } from '../components/apps/FileExplorerApp';
import { Tv, Edit, Camera, ShoppingBag, FolderOpen } from 'lucide-react';

const IndexContent = () => {
  const { gameState } = useGameData();
  const { windows, openWindow, closeWindow, minimizeWindow, focusWindow, getWindow } = useWindowManagerContext();

  // Auto-open windows based on game flow
  const handleStreamerSelected = () => {
    if (gameState.currentStreamer) {
      openWindow('capcut');
    }
  };

  const handleClipCreated = () => {
    if (gameState.currentClip) {
      openWindow('tiktok');
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <Desktop />
      <Taskbar />
      
      {/* Windows */}
      <Window
        id="twitch"
        title="Twitch"
        icon={<Tv className="w-4 h-4" />}
        isOpen={getWindow('twitch')?.isOpen || false}
        isMinimized={getWindow('twitch')?.isMinimized || false}
        zIndex={getWindow('twitch')?.zIndex || 1}
        onClose={() => closeWindow('twitch')}
        onMinimize={() => minimizeWindow('twitch')}
        onFocus={() => focusWindow('twitch')}
      >
        <TwitchApp />
      </Window>

      <Window
        id="capcut"
        title="CapCut"
        icon={<Edit className="w-4 h-4" />}
        isOpen={getWindow('capcut')?.isOpen || false}
        isMinimized={getWindow('capcut')?.isMinimized || false}
        zIndex={getWindow('capcut')?.zIndex || 1}
        onClose={() => closeWindow('capcut')}
        onMinimize={() => minimizeWindow('capcut')}
        onFocus={() => focusWindow('capcut')}
      >
        <CapCutApp />
      </Window>

      <Window
        id="tiktok"
        title="TikTok"
        icon={<Camera className="w-4 h-4" />}
        isOpen={getWindow('tiktok')?.isOpen || false}
        isMinimized={getWindow('tiktok')?.isMinimized || false}
        zIndex={getWindow('tiktok')?.zIndex || 1}
        onClose={() => closeWindow('tiktok')}
        onMinimize={() => minimizeWindow('tiktok')}
        onFocus={() => focusWindow('tiktok')}
      >
        <TikTokApp />
      </Window>

      <Window
        id="whop"
        title="Whop"
        icon={<ShoppingBag className="w-4 h-4" />}
        isOpen={getWindow('whop')?.isOpen || false}
        isMinimized={getWindow('whop')?.isMinimized || false}
        zIndex={getWindow('whop')?.zIndex || 1}
        onClose={() => closeWindow('whop')}
        onMinimize={() => minimizeWindow('whop')}
        onFocus={() => focusWindow('whop')}
      >
        <WhopApp />
      </Window>

      <Window
        id="fileexplorer"
        title="File Explorer"
        icon={<FolderOpen className="w-4 h-4" />}
        isOpen={getWindow('fileexplorer')?.isOpen || false}
        isMinimized={getWindow('fileexplorer')?.isMinimized || false}
        zIndex={getWindow('fileexplorer')?.zIndex || 1}
        onClose={() => closeWindow('fileexplorer')}
        onMinimize={() => minimizeWindow('fileexplorer')}
        onFocus={() => focusWindow('fileexplorer')}
      >
        <FileExplorerApp />
      </Window>
    </div>
  );
};

const Index = () => {
  return (
    <WindowManagerProvider>
      <IndexContent />
    </WindowManagerProvider>
  );
};

export default Index;
