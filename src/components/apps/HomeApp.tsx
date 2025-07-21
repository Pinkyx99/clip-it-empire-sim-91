import { useGameData } from '../../hooks/useGameData';
import { Trophy, Gift, TrendingUp, Clock } from 'lucide-react';
import { PlayerStats } from '../PlayerStats';

export const HomeApp = () => {
  const { gameState, claimDailyBonus } = useGameData();
  const { player, posts } = gameState;

  const handleClaimBonus = () => {
    const bonus = claimDailyBonus();
    if (bonus > 0) {
      // TODO: Show toast notification
      console.log(`Claimed daily bonus: $${bonus}`);
    }
  };

  const recentPosts = posts.slice(-3).reverse();
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
  const totalEarnings = posts.reduce((sum, post) => sum + post.earnings, 0);

  return (
    <div className="p-4 pb-24 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Clip It Tycoon
        </h1>
        <p className="text-muted-foreground">
          Build your social media empire, one clip at a time
        </p>
      </div>

      {/* Player Stats */}
      <PlayerStats />

      {/* Daily Bonus */}
      {!player.dailyBonusClaimed && (
        <div className="card-gaming bg-gradient-to-r from-success/10 to-emerald-400/10 border-success/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="app-icon bg-gradient-to-r from-success to-emerald-400">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-success">Daily Bonus Available!</h3>
                <p className="text-sm text-muted-foreground">
                  Claim ${50 + (player.level * 10)} daily bonus
                </p>
              </div>
            </div>
            <button 
              onClick={handleClaimBonus}
              className="btn-success"
            >
              Claim
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card-gaming text-center">
          <div className="app-icon bg-gradient-to-r from-viral to-red-400 mx-auto mb-2">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-sm text-muted-foreground">Total Views</p>
          <p className="text-lg font-bold">{totalViews.toLocaleString()}</p>
        </div>

        <div className="card-gaming text-center">
          <div className="app-icon bg-gradient-to-r from-success to-emerald-400 mx-auto mb-2">
            <Trophy className="w-6 h-6" />
          </div>
          <p className="text-sm text-muted-foreground">Total Earned</p>
          <p className="text-lg font-bold text-success">${totalEarnings.toFixed(2)}</p>
        </div>
      </div>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Posts</h2>
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div key={post.id} className="card-gaming">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium truncate">{post.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {post.views.toLocaleString()} views
                      </span>
                      <span className="text-sm text-success">
                        +${post.earnings.toFixed(2)}
                      </span>
                      {post.isViral && (
                        <span className="text-xs bg-viral/20 text-viral px-2 py-1 rounded-full">
                          🔥 VIRAL
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">
                      {new Date(post.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Getting Started Guide */}
      {posts.length === 0 && (
        <div className="card-gaming space-y-4">
          <h2 className="text-xl font-semibold">Getting Started</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-xl">
              <span className="text-2xl">1️⃣</span>
              <div>
                <p className="font-medium">Open Twitch</p>
                <p className="text-sm text-muted-foreground">Choose a streamer to clip</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-xl">
              <span className="text-2xl">2️⃣</span>
              <div>
                <p className="font-medium">Create a Clip</p>
                <p className="text-sm text-muted-foreground">Play the timing mini-game</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-xl">
              <span className="text-2xl">3️⃣</span>
              <div>
                <p className="font-medium">Edit in CapCut</p>
                <p className="text-sm text-muted-foreground">Enhance your clip</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-xl">
              <span className="text-2xl">4️⃣</span>
              <div>
                <p className="font-medium">Post on TikTok</p>
                <p className="text-sm text-muted-foreground">Earn views and followers</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};