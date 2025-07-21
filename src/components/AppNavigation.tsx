import { useGameData } from '../hooks/useGameData';
import { Home, Tv, Edit, Camera, ShoppingBag } from 'lucide-react';

export const AppNavigation = () => {
  const { gameState, setCurrentApp } = useGameData();
  const { currentApp, player } = gameState;

  const apps = [
    { id: 'home' as const, name: 'Home', icon: Home, color: 'from-muted to-muted' },
    { id: 'twitch' as const, name: 'Twitch', icon: Tv, color: 'from-purple-500 to-purple-600' },
    { id: 'capcut' as const, name: 'CapCut', icon: Edit, color: 'from-pink-500 to-pink-600' },
    { id: 'tiktok' as const, name: 'TikTok', icon: Camera, color: 'from-red-500 to-pink-500' },
    { 
      id: 'whop' as const, 
      name: 'Whop', 
      icon: ShoppingBag, 
      color: 'from-green-500 to-green-600',
      locked: !player.whopUnlocked
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => !app.locked && setCurrentApp(app.id)}
            disabled={app.locked}
            className={`
              relative flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-300
              ${currentApp === app.id ? 'scale-110' : 'scale-100'}
              ${app.locked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
            `}
          >
            <div className={`
              app-icon bg-gradient-to-r ${app.color} 
              ${currentApp === app.id ? 'shadow-lg' : ''}
              ${app.locked ? 'grayscale' : ''}
            `}>
              <app.icon className="w-6 h-6" />
            </div>
            <span className={`
              text-xs font-medium
              ${currentApp === app.id ? 'text-foreground' : 'text-muted-foreground'}
              ${app.locked ? 'text-muted-foreground/50' : ''}
            `}>
              {app.name}
            </span>
            {app.locked && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-muted rounded-full flex items-center justify-center">
                <span className="text-xs">🔒</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};