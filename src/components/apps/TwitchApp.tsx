import { useState, useEffect } from 'react';
import { useGameData } from '../../hooks/useGameData';
import { useWindowManagerContext } from '../../contexts/WindowManagerContext';
import { STREAMERS } from '../../data/streamers';
import { Users, Play, Clock, Tv, MessageCircle, Send } from 'lucide-react';

const CHAT_MESSAGES = [
  'W', 'L', 'CLIP IT!', 'omg', 'prerecorded', 'i love u', '💀', 'LMAOOO', 
  'POGGERS', 'KEKW', 'no way', 'thats crazy', 'hes so good', 'chat is this real?',
  'FIRST', 'EZ Clap', 'MonkaS', '5Head', 'Pepega', 'HYPEROMEGALUL', 'based',
  'ratio', 'fr fr', 'not the...', 'bro really said', 'this guy', 'SHEESH'
];

const CHAT_USERS = [
  'gamer123', 'pogchamp99', 'streamer_fan', 'clipper_pro', 'tiktok_legend',
  'viewer420', 'chat_god', 'omega_lul', 'pro_gamer', 'twitch_addict'
];

export const TwitchApp = () => {
  const { gameState, setCurrentStreamer, setClipCooldown } = useGameData();
  const { openWindow } = useWindowManagerContext();
  const { currentStreamer, clipCooldown } = gameState;
  const [timeLeft, setTimeLeft] = useState(0);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, user: string, message: string, timestamp: number}>>([]);
  const [isClipping, setIsClipping] = useState(false);
  const [linePosition, setLinePosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [targetZone, setTargetZone] = useState({ start: 40, end: 60 });
  const [gameResult, setGameResult] = useState<'success' | 'failed' | null>(null);

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

  // Simulate chat messages when viewing a streamer
  useEffect(() => {
    if (currentStreamer) {
      const interval = setInterval(() => {
        const randomMessage = CHAT_MESSAGES[Math.floor(Math.random() * CHAT_MESSAGES.length)];
        const randomUser = CHAT_USERS[Math.floor(Math.random() * CHAT_USERS.length)];
        
        setChatMessages(prev => {
          const newMessage = {
            id: `msg_${Date.now()}`,
            user: randomUser,
            message: randomMessage,
            timestamp: Date.now()
          };
          const updated = [...prev, newMessage];
          return updated.slice(-50); // Keep only last 50 messages
        });
      }, Math.random() * 3000 + 1000); // Random interval 1-4 seconds

      return () => clearInterval(interval);
    }
  }, [currentStreamer]);

  // Clip timing game animation
  useEffect(() => {
    if (isClipping) {
      const animate = () => {
        setLinePosition(prev => {
          let newPos = prev + (direction * 2); // Faster movement
          
          if (newPos >= 100) {
            newPos = 100;
            setDirection(-1);
          } else if (newPos <= 0) {
            newPos = 0;
            setDirection(1);
          }
          
          return newPos;
        });
      };
      
      const animationFrame = requestAnimationFrame(animate);
      const interval = setInterval(animate, 16); // ~60fps
      
      return () => {
        cancelAnimationFrame(animationFrame);
        clearInterval(interval);
      };
    }
  }, [isClipping, direction]);

  const handleStreamerSelect = (streamer: typeof STREAMERS[0]) => {
    if (clipCooldown > 0) return;
    setCurrentStreamer(streamer);
    setChatMessages([]);
    // Generate new target zone
    const start = Math.random() * 40 + 20;
    setTargetZone({ start, end: start + 15 });
  };

  const handleStartClipping = () => {
    setIsClipping(true);
    setGameResult(null);
    setLinePosition(0);
  };

  const handleClipAttempt = () => {
    if (!isClipping || !currentStreamer) return;
    
    const isInTargetZone = linePosition >= targetZone.start && linePosition <= targetZone.end;
    setIsClipping(false);
    
    if (isInTargetZone) {
      setGameResult('success');
      // Open CapCut after success
      setTimeout(() => {
        openWindow('capcut');
      }, 1500);
    } else {
      setGameResult('failed');
      setClipCooldown(Date.now() + 30000);
      setTimeout(() => {
        setGameResult(null);
        setLinePosition(0);
      }, 2000);
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    return `${(count / 1000).toFixed(0)}K`;
  };

  const isOnCooldown = clipCooldown > 0 && Date.now() < clipCooldown;

  if (!currentStreamer) {
    return (
      <div className="h-full bg-background">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Tv className="w-5 h-5 text-white" />
            </div>
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
        </div>
      </div>
    );
  }

  // Streaming view with chat and clip game
  return (
    <div className="h-full bg-background flex">
      {/* Main Stream View */}
      <div className="flex-1 p-4">
        {/* Stream Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src={currentStreamer.avatar} 
              alt={currentStreamer.displayName}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-xl font-bold">{currentStreamer.displayName}</h2>
              <p className="text-sm text-muted-foreground">{currentStreamer.category}</p>
            </div>
          </div>
          <button 
            onClick={() => setCurrentStreamer(null)}
            className="btn-gaming text-sm"
          >
            ← Back
          </button>
        </div>

        {/* Stream Video */}
        <div className="bg-black rounded-xl aspect-video mb-4 flex items-center justify-center relative overflow-hidden">
          <img 
            src={currentStreamer.avatar} 
            alt={currentStreamer.displayName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Play className="w-8 h-8 fill-current" />
              </div>
              <p className="text-lg font-semibold">{currentStreamer.displayName} LIVE</p>
              <p className="text-sm opacity-80">{formatFollowers(currentStreamer.followers)} viewers</p>
            </div>
          </div>
        </div>

        {/* Clip Game */}
        <div className="card-gaming">
          <h3 className="text-lg font-semibold mb-4 text-center">Clip This Moment!</h3>
          
          {/* Timing Game */}
          <div className="space-y-4">
            <div className="relative">
              <div className="w-full h-12 bg-muted rounded-xl relative overflow-hidden">
                {/* Different colored zones */}
                <div className="absolute top-0 h-full w-full">
                  <div className="absolute top-0 h-full w-1/3 bg-destructive/30"></div>
                  <div className="absolute top-0 h-full left-1/3 w-1/3 bg-warning/30"></div>
                  <div className="absolute top-0 h-full right-0 w-1/3 bg-success/30"></div>
                </div>
                
                {/* Target Zone */}
                <div 
                  className="absolute top-0 h-full bg-primary/50 border-2 border-primary"
                  style={{
                    left: `${targetZone.start}%`,
                    width: `${targetZone.end - targetZone.start}%`
                  }}
                />
                
                {/* Moving Line */}
                <div 
                  className="absolute top-0 w-1 h-full bg-white shadow-lg transition-all duration-75"
                  style={{ left: `${linePosition}%` }}
                />
              </div>

              {/* Result Overlay */}
              {gameResult && (
                <div className={`
                  absolute inset-0 flex items-center justify-center rounded-xl text-lg font-bold
                  ${gameResult === 'success' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}
                `}>
                  {gameResult === 'success' ? '🎉 PERFECT CLIP!' : '💥 MISSED!'}
                </div>
              )}
            </div>

            {/* Game Controls */}
            <div className="text-center space-y-2">
              {!isClipping && !gameResult && !isOnCooldown && (
                <button 
                  onClick={handleStartClipping}
                  className="btn-viral"
                >
                  🎬 Start Clipping
                </button>
              )}
              
              {isClipping && (
                <button 
                  onClick={handleClipAttempt}
                  className="btn-viral animate-pulse"
                >
                  🎯 CLIP NOW!
                </button>
              )}

              {gameResult === 'success' && (
                <p className="text-success text-sm">Opening CapCut for editing...</p>
              )}

              {gameResult === 'failed' && (
                <p className="text-destructive text-sm">30 second cooldown...</p>
              )}

              {isOnCooldown && !gameResult && (
                <p className="text-muted-foreground text-sm">Cooldown: {timeLeft}s</p>
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Hit the white line when it's in the glowing zone for a perfect clip!
            </p>
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-80 border-l border-border bg-muted/20">
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Stream Chat</h3>
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
              {Math.floor(Math.random() * 5000 + 1000)} viewers
            </span>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-80 overflow-y-auto p-2 space-y-1">
          {chatMessages.map((msg) => (
            <div key={msg.id} className="text-xs">
              <span className="font-medium text-primary">{msg.user}:</span>
              <span className="ml-1 text-muted-foreground">{msg.message}</span>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-3 border-t border-border">
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="Say something..."
              className="flex-1 p-2 text-xs bg-background border border-border rounded-lg"
              disabled
            />
            <button className="p-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50" disabled>
              <Send className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Chat disabled in demo</p>
        </div>
      </div>
    </div>
  );
};