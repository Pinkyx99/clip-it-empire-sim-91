import { useGameData } from '../hooks/useGameData';
import { AppNavigation } from '../components/AppNavigation';
import { HomeApp } from '../components/apps/HomeApp';
import { TwitchApp } from '../components/apps/TwitchApp';
import { CapCutApp } from '../components/apps/CapCutApp';
import { TikTokApp } from '../components/apps/TikTokApp';
import { WhopApp } from '../components/apps/WhopApp';

const Index = () => {
  const { gameState } = useGameData();

  const renderCurrentApp = () => {
    switch (gameState.currentApp) {
      case 'twitch':
        return <TwitchApp />;
      case 'capcut':
        return <CapCutApp />;
      case 'tiktok':
        return <TikTokApp />;
      case 'whop':
        return <WhopApp />;
      default:
        return <HomeApp />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentApp()}
      <AppNavigation />
    </div>
  );
};

export default Index;
