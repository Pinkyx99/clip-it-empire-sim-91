import { useWindowManager } from '../hooks/useWindowManager';
import { useGameData } from '../hooks/useGameData';
import { Desktop } from '../components/Desktop';
import { Taskbar } from '../components/Taskbar';
import { Window } from '../components/Window';
import { TwitchApp } from '../components/apps/TwitchApp';
import { CapCutApp } from '../components/apps/CapCutApp';
import { TikTokApp } from '../components/apps/TikTokApp';
import { WhopApp } from '../components/apps/WhopApp';
import { Tv, Edit, Camera, ShoppingBag } from 'lucide-react';

const Index = () => {
  const { gameState } = useGameData();
  const { windows, openWindow, closeWindow, minimizeWindow, focusWindow, getWindow } = useWindowManager();

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
    </div>
  );
};

export default Index;
