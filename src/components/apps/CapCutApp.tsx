import { useState, useEffect, useRef } from 'react';
import { useGameData } from '../../hooks/useGameData';
import { generateClipTitle } from '../../data/streamers';
import { Play, Target, CheckCircle, XCircle, Edit } from 'lucide-react';

export const CapCutApp = () => {
  const { gameState, addClip, setClipCooldown } = useGameData();
  const { currentStreamer, currentClip } = gameState;
  
  const [isClipping, setIsClipping] = useState(false);
  const [targetZone, setTargetZone] = useState({ start: 40, end: 60 });
  const [linePosition, setLinePosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [gameResult, setGameResult] = useState<'success' | 'failed' | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isClipping) {
      const animate = () => {
        setLinePosition(prev => {
          let newPos = prev + (direction * 1.5);
          
          if (newPos >= 100) {
            newPos = 100;
            setDirection(-1);
          } else if (newPos <= 0) {
            newPos = 0;
            setDirection(1);
          }
          
          return newPos;
        });
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isClipping, direction]);

  useEffect(() => {
    // Generate random target zone
    const start = Math.random() * 40 + 20; // 20-60
    const end = start + 20; // 20px wide zone
    setTargetZone({ start, end });
  }, []);

  const handleStartClipping = () => {
    if (!currentStreamer) return;
    setIsClipping(true);
    setGameResult(null);
  };

  const handleClickTarget = () => {
    if (!isClipping || !currentStreamer) return;
    
    const isInTargetZone = linePosition >= targetZone.start && linePosition <= targetZone.end;
    setIsClipping(false);
    
    if (isInTargetZone) {
      setGameResult('success');
      // Create clip after short delay
      setTimeout(() => {
        const newClip = {
          id: `clip_${Date.now()}`,
          streamerId: currentStreamer.id,
          streamerName: currentStreamer.displayName,
          title: generateClipTitle(currentStreamer.displayName),
          duration: Math.floor(Math.random() * 30) + 15, // 15-45 seconds
          quality: 'high' as const,
          timestamp: Date.now()
        };
        addClip(newClip);
        setIsEditing(true);
      }, 1000);
    } else {
      setGameResult('failed');
      // Set 30 second cooldown
      setClipCooldown(Date.now() + 30000);
      setTimeout(() => {
        setGameResult(null);
        setLinePosition(0);
        setDirection(1);
      }, 2000);
    }
  };

  const handleFinishEditing = () => {
    // Will trigger TikTok window opening from parent component
    setIsEditing(false);
  };

  if (!currentStreamer && !currentClip) {
    return (
      <div className="h-full bg-background">
        <div className="p-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-pink-400">CapCut</h1>
              <p className="text-sm text-muted-foreground">Video editing made easy</p>
            </div>
          </div>

          <div className="card-gaming text-center">
            <div className="app-icon bg-gradient-to-r from-pink-500 to-pink-600 mx-auto mb-4">
              <Play className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No clip to edit</h2>
            <p className="text-muted-foreground mb-4">
              Go to Twitch and create a clip first
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Edit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-pink-400">CapCut</h1>
            <p className="text-sm text-muted-foreground">
              {isEditing ? 'Edit your clip' : 'Create the perfect clip'}
            </p>
          </div>
        </div>

        {/* Clip Creation Mini-Game */}
        {currentStreamer && !currentClip && !isEditing && (
          <div className="space-y-6">
            <div className="card-gaming text-center">
              <img 
                src={currentStreamer.avatar} 
                alt={currentStreamer.displayName}
                className="w-24 h-24 rounded-xl mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">
                Clipping {currentStreamer.displayName}
              </h2>
              <p className="text-muted-foreground">
                Click when the line is in the target zone!
              </p>
            </div>

            {/* Timing Game */}
            <div className="card-gaming">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Target className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold">Perfect Timing</h3>
                </div>

                {/* Slider Game */}
                <div className="relative">
                  <div className="w-full h-16 bg-muted rounded-xl relative overflow-hidden">
                    {/* Target Zone */}
                    <div 
                      className="absolute top-0 h-full bg-gradient-to-r from-success/30 to-success/50 border-2 border-success rounded"
                      style={{
                        left: `${targetZone.start}%`,
                        width: `${targetZone.end - targetZone.start}%`
                      }}
                    />
                    
                    {/* Moving Line */}
                    <div 
                      className="absolute top-0 w-1 h-full bg-primary transition-colors duration-100"
                      style={{
                        left: `${linePosition}%`,
                        backgroundColor: isClipping ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                      }}
                    />
                  </div>

                  {/* Result Indicator */}
                  {gameResult && (
                    <div className={`
                      absolute inset-0 flex items-center justify-center rounded-xl
                      ${gameResult === 'success' ? 'bg-success/20' : 'bg-destructive/20'}
                    `}>
                      {gameResult === 'success' ? (
                        <CheckCircle className="w-12 h-12 text-success" />
                      ) : (
                        <XCircle className="w-12 h-12 text-destructive" />
                      )}
                    </div>
                  )}
                </div>

                {/* Game Button */}
                <div className="text-center">
                  {!isClipping && !gameResult && (
                    <button 
                      onClick={handleStartClipping}
                      className="btn-gaming"
                    >
                      Start Clipping
                    </button>
                  )}
                  
                  {isClipping && (
                    <button 
                      onClick={handleClickTarget}
                      className="btn-gaming animate-clip-pulse"
                    >
                      CLIP NOW!
                    </button>
                  )}

                  {gameResult === 'success' && (
                    <div className="text-center space-y-2">
                      <p className="text-success font-semibold">Perfect Clip! 🎉</p>
                      <p className="text-sm text-muted-foreground">Moving to editor...</p>
                    </div>
                  )}

                  {gameResult === 'failed' && (
                    <div className="text-center space-y-2">
                      <p className="text-destructive font-semibold">Missed! 😢</p>
                      <p className="text-sm text-muted-foreground">30 second cooldown...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="card-gaming bg-primary/10 border-primary/30">
              <h3 className="font-semibold text-primary mb-2">🎯 Clipping Tips</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Wait for the line to enter the green zone</li>
                <li>• Perfect timing gives better clip quality</li>
                <li>• Failed attempts have a 30-second cooldown</li>
              </ul>
            </div>
          </div>
        )}

        {/* Clip Editor */}
        {(currentClip || isEditing) && (
          <div className="space-y-6">
            <div className="card-gaming">
              <h2 className="text-xl font-semibold mb-4">Edit Your Clip</h2>
              
              {/* Clip Preview */}
              <div className="bg-black rounded-xl aspect-video mb-4 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-white/50 mx-auto mb-2" />
                  <p className="text-white/70">
                    {currentClip?.title || generateClipTitle(currentStreamer?.displayName || '')}
                  </p>
                  <p className="text-white/50 text-sm">
                    Duration: {currentClip?.duration || Math.floor(Math.random() * 30) + 15}s
                  </p>
                </div>
              </div>

              {/* Simple Editing Options */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button className="p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">✂️</span>
                    <p className="font-medium">Trim</p>
                  </div>
                </button>
                
                <button className="p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">✨</span>
                    <p className="font-medium">Effects</p>
                  </div>
                </button>
                
                <button className="p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">🎵</span>
                    <p className="font-medium">Audio</p>
                  </div>
                </button>
                
                <button className="p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">💬</span>
                    <p className="font-medium">Text</p>
                  </div>
                </button>
              </div>

              <button 
                onClick={handleFinishEditing}
                className="w-full btn-gaming"
              >
                Finish Editing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};