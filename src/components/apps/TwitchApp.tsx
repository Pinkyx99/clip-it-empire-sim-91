import { useState, useEffect } from 'react';
import { useGameData } from '../../hooks/useGameData';
import { STREAMERS } from '../../data/streamers';
import { Users, Play, Clock, ArrowLeft } from 'lucide-react';

export const TwitchApp = () => {
  const { gameState, setCurrentStreamer, setCurrentApp, setClipCooldown } = useGameData();
  const { currentStreamer, clipCooldown } = gameState;
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (clipCooldown > 0) {
      setTimeLeft(Math.ceil((clipCooldown - Date.now()) / 1000));
      const interval = setInterval(() => {
        const remaining = Math.ceil((clipCooldown - Date.now()) / 1000);
        setTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          setClipCooldown(0);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [clipCooldown, setClipCooldown]);

  const handleStreamerSelect = (streamer: typeof STREAMERS[0]) => {
    if (clipCooldown > 0) return;
    setCurrentStreamer(streamer);
    setCurrentApp('capcut'); // Go to clip mini-game in CapCut
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    return `${(count / 1000).toFixed(0)}K`;
  };

  const isOnCooldown = clipCooldown > 0 && Date.now() < clipCooldown;

  return (
    <div className="p-4 pb-24">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button 
          onClick={() => setCurrentApp('home')}
          className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">Twitch</h1>
          <p className="text-sm text-muted-foreground">Choose a streamer to clip</p>
        </div>
      </div>

      {/* Cooldown Notice */}
      {isOnCooldown && (
        <div className="card-gaming bg-muted/30 border-muted mb-6">
          <div className="flex items-center space-x-3">
            <div className="app-icon bg-muted">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="font-medium">Clipping Cooldown</p>
              <p className="text-sm text-muted-foreground">
                Wait {timeLeft}s before clipping again
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Streamers List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Popular Streamers</h2>
        <div className="space-y-3">
          {STREAMERS.map((streamer) => (
            <button
              key={streamer.id}
              onClick={() => handleStreamerSelect(streamer)}
              disabled={isOnCooldown}
              className={`
                w-full card-gaming text-left transition-all duration-300
                ${isOnCooldown ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}
              `}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img 
                    src={streamer.avatar} 
                    alt={streamer.displayName}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{streamer.displayName}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{streamer.category}</p>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatFollowers(streamer.followers)} followers
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-current" />
                  </div>
                  <span className="text-xs text-success font-medium">LIVE</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 card-gaming bg-primary/10 border-primary/30">
        <div className="space-y-2">
          <h3 className="font-semibold text-primary">💡 Clipping Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Popular streamers generate more views</li>
            <li>• Time your clips perfectly for better quality</li>
            <li>• Wait for exciting moments to clip</li>
            <li>• Failed clips have a 30-second cooldown</li>
          </ul>
        </div>
      </div>
    </div>
  );
};