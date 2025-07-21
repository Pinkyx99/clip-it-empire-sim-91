import { useGameData } from '../hooks/useGameData';
import { DollarSign, Users, Star, Target } from 'lucide-react';

export const PlayerStats = () => {
  const { gameState } = useGameData();
  const { player } = gameState;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const progressToGoal = player.hasPartnership 
    ? Math.min((player.followers / 100000) * 100, 100) // Progress to 100K after partnership
    : Math.min((player.followers / 10000) * 100, 100); // Progress to 10K

  return (
    <div className="card-gaming mb-6">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="app-icon bg-gradient-to-r from-success to-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Money</p>
            <p className="text-xl font-bold text-success">${formatNumber(player.money)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="app-icon bg-gradient-to-r from-primary to-primary-glow">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Followers</p>
            <p className="text-xl font-bold">{formatNumber(player.followers)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="app-icon bg-gradient-to-r from-viral to-red-400">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Level</p>
            <p className="text-xl font-bold">{player.level}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="app-icon bg-gradient-to-r from-secondary to-blue-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Posts</p>
            <p className="text-xl font-bold">{player.postsCreated}</p>
          </div>
        </div>
      </div>

      {player.hasPartnership && (
        <div className="bg-gradient-to-r from-primary/20 to-primary-glow/20 border border-primary/30 rounded-xl p-3 mb-4">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">TikTok Partner</span>
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
              $2 per 1K views
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Current Goal</span>
          <span className="text-sm font-medium">{progressToGoal.toFixed(1)}%</span>
        </div>
        <div className="progress-bar h-3">
          <div 
            className="progress-fill" 
            style={{ width: `${progressToGoal}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">{player.currentGoal}</p>
      </div>
    </div>
  );
};