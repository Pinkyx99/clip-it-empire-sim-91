import { useWindowManagerContext } from '../contexts/WindowManagerContext';
import { useGameData } from '../hooks/useGameData';
import { Tv, Edit, Camera, ShoppingBag, Home, Trophy, Gift } from 'lucide-react';

export const Desktop = () => {
  const { openWindow } = useWindowManagerContext();
  const { gameState, claimDailyBonus } = useGameData();
  const { player } = gameState;

  const apps = [
    { 
      id: 'twitch', 
      name: 'Twitch', 
      icon: Tv, 
      color: 'from-purple-500 to-purple-600',
      position: { x: 50, y: 50 }
    },
    { 
      id: 'capcut', 
      name: 'CapCut', 
      icon: Edit, 
      color: 'from-pink-500 to-pink-600',
      position: { x: 50, y: 150 }
    },
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      icon: Camera, 
      color: 'from-red-500 to-pink-500',
      position: { x: 50, y: 250 }
    },
    { 
      id: 'whop', 
      name: 'Whop', 
      icon: ShoppingBag, 
      color: 'from-green-500 to-green-600',
      position: { x: 50, y: 350 },
      locked: !player.whopUnlocked
    },
  ];

  const handleAppClick = (appId: string) => {
    openWindow(appId);
  };

  const handleDailyBonus = () => {
    const bonus = claimDailyBonus();
    if (bonus > 0) {
      // Show notification
      console.log(`Claimed daily bonus: $${bonus}`);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden"
      style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      }}
    >
      {/* Desktop Icons */}
      <div className="absolute inset-0 p-4">
        {/* App Icons */}
        {apps.map((app) => (
          <div
            key={app.id}
            className="absolute"
            style={{ left: app.position.x, top: app.position.y }}
          >
            <button
              onClick={() => !app.locked && handleAppClick(app.id)}
              disabled={app.locked}
              className={`
                flex flex-col items-center space-y-2 p-3 rounded-lg transition-all duration-300
                ${app.locked 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-white/10 hover:scale-105 active:scale-95'
                }
              `}
            >
              <div className={`
                w-16 h-16 rounded-xl flex items-center justify-center text-white shadow-lg
                bg-gradient-to-br ${app.color}
                ${app.locked ? 'grayscale' : ''}
              `}>
                <app.icon className="w-8 h-8" />
                {app.locked && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">🔒</span>
                  </div>
                )}
              </div>
              <span className="text-white text-sm font-medium text-center">
                {app.name}
              </span>
            </button>
          </div>
        ))}

        {/* Player Stats Widget */}
        <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm rounded-xl p-4 text-white">
          <div className="flex items-center space-x-2 mb-3">
            <Home className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Clip It Tycoon</h3>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Money:</span>
              <span className="text-success font-bold">${player.money.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Followers:</span>
              <span className="font-bold">{player.followers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Level:</span>
              <span className="font-bold">{player.level}</span>
            </div>
            <div className="flex justify-between">
              <span>Posts:</span>
              <span className="font-bold">{player.postsCreated}</span>
            </div>
          </div>

          {player.hasPartnership && (
            <div className="mt-3 bg-primary/20 border border-primary/30 rounded-lg p-2">
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-primary text-xs font-semibold">TikTok Partner</span>
              </div>
            </div>
          )}
        </div>

        {/* Daily Bonus Notification */}
        {!player.dailyBonusClaimed && (
          <div className="absolute bottom-20 right-4 bg-success/90 backdrop-blur-sm rounded-xl p-4 text-white animate-pulse">
            <button 
              onClick={handleDailyBonus}
              className="flex items-center space-x-3 hover:scale-105 transition-transform"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-sm">Daily Bonus Ready!</p>
                <p className="text-xs opacity-90">
                  Click to claim ${50 + (player.level * 10)}
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Current Goal */}
        <div className="absolute bottom-20 left-4 bg-black/30 backdrop-blur-sm rounded-xl p-4 text-white max-w-sm">
          <div className="flex items-center space-x-2 mb-2">
            <Trophy className="w-5 h-5 text-viral" />
            <h3 className="font-semibold text-sm">Current Goal</h3>
          </div>
          
          <p className="text-sm mb-3">{player.currentGoal}</p>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>
                {player.hasPartnership 
                  ? `${Math.min((player.followers / 100000) * 100, 100).toFixed(1)}%`
                  : `${Math.min((player.followers / 10000) * 100, 100).toFixed(1)}%`
                }
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${player.hasPartnership 
                    ? Math.min((player.followers / 100000) * 100, 100)
                    : Math.min((player.followers / 10000) * 100, 100)
                  }%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};