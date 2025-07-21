import { useState } from 'react';
import { useGameData } from '../../hooks/useGameData';
import { getRandomHashtags } from '../../data/streamers';
import { Camera, Hash, TrendingUp, Users, Heart, MessageCircle, Share } from 'lucide-react';

export const TikTokApp = () => {
  const { gameState, addPost, updatePlayer, clearCurrentClip } = useGameData();
  const { currentClip, player } = gameState;
  
  const [postTitle, setPostTitle] = useState('');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [showAccountCreation, setShowAccountCreation] = useState(!player.tikTokUsername);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const availableHashtags = getRandomHashtags(10);

  const handleCreateAccount = () => {
    if (username && password) {
      updatePlayer(prev => ({
        ...prev,
        tikTokUsername: username,
        tikTokPassword: password
      }));
      setShowAccountCreation(false);
    }
  };

  const toggleHashtag = (hashtag: string) => {
    if (selectedHashtags.includes(hashtag)) {
      setSelectedHashtags(prev => prev.filter(h => h !== hashtag));
    } else if (selectedHashtags.length < 5) {
      setSelectedHashtags(prev => [...prev, hashtag]);
    }
  };

  const handlePost = async () => {
    if (!currentClip || !postTitle) return;
    
    setIsPosting(true);
    
    // Simulate posting delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate random views with viral chance
    const baseViews = Math.floor(Math.random() * 4900) + 100; // 100-5000
    const isViral = Math.random() < 0.15; // 15% chance to go viral
    const finalViews = isViral ? baseViews * (Math.random() * 10 + 5) : baseViews; // 5x-15x multiplier for viral
    
    // Calculate earnings based on partnership status
    const earningsPerView = player.hasPartnership ? 0.002 : 0.0005; // $2 vs $0.50 per 1000 views
    const earnings = (finalViews / 1000) * (earningsPerView * 1000);
    
    // Generate social proof metrics
    const likes = Math.floor(finalViews * (Math.random() * 0.1 + 0.05)); // 5-15% like rate
    const comments = Math.floor(finalViews * (Math.random() * 0.02 + 0.01)); // 1-3% comment rate
    const shares = Math.floor(finalViews * (Math.random() * 0.005 + 0.002)); // 0.2-0.7% share rate
    
    const newPost = {
      id: `post_${Date.now()}`,
      clipId: currentClip.id,
      title: postTitle,
      hashtags: selectedHashtags,
      views: Math.floor(finalViews),
      likes,
      comments,
      shares,
      earnings,
      timestamp: Date.now(),
      isViral
    };
    
    addPost(newPost);
    clearCurrentClip();
    setPostTitle('');
    setSelectedHashtags([]);
    setIsPosting(false);
    
    // Show success message
    setTimeout(() => {
      // Post success handled by parent
    }, 1000);
  };

  if (showAccountCreation) {
    return (
      <div className="h-full bg-background">
        <div className="p-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-red-400">TikTok</h1>
              <p className="text-sm text-muted-foreground">Create your account</p>
            </div>
          </div>

          <div className="card-gaming">
            <div className="text-center mb-6">
              <div className="app-icon bg-gradient-to-r from-red-500 to-pink-500 mx-auto mb-4">
                <Camera className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Join TikTok</h2>
              <p className="text-muted-foreground">Create your account to start posting clips</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full p-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full p-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button 
                onClick={handleCreateAccount}
                disabled={!username || !password}
                className="w-full btn-gaming disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentClip) {
    return (
      <div className="h-full bg-background">
        <div className="p-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-red-400">TikTok</h1>
              <p className="text-sm text-muted-foreground">@{player.tikTokUsername}</p>
            </div>
          </div>

          <div className="card-gaming text-center">
            <div className="app-icon bg-gradient-to-r from-red-500 to-pink-500 mx-auto mb-4">
              <Camera className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No clip ready</h2>
            <p className="text-muted-foreground mb-4">
              Create and edit a clip first
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isPosting) {
    return (
      <div className="h-full bg-background flex items-center justify-center">
        <div className="card-gaming text-center">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Posting to TikTok...</h2>
          <p className="text-muted-foreground">Your clip is going viral! 🚀</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-red-400">TikTok</h1>
            <p className="text-sm text-muted-foreground">@{player.tikTokUsername}</p>
          </div>
        </div>

        {/* Account Stats */}
        <div className="card-gaming mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-lg font-bold">{player.followers.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1 mb-1">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-lg font-bold">{player.totalViews.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground">Total Views</p>
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Camera className="w-4 h-4 text-viral" />
                <span className="text-lg font-bold">{player.postsCreated}</span>
              </div>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
          </div>
        </div>

        {/* Post Creation */}
        <div className="space-y-6">
          {/* Video Preview */}
          <div className="card-gaming">
            <h2 className="text-lg font-semibold mb-3">Your Clip</h2>
            <div className="bg-black rounded-xl aspect-video mb-3 flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-12 h-12 text-white/50 mx-auto mb-2" />
                <p className="text-white/70 text-sm">{currentClip.title}</p>
                <p className="text-white/50 text-xs">Duration: {currentClip.duration}s</p>
              </div>
            </div>
          </div>

          {/* Post Details */}
          <div className="card-gaming">
            <h2 className="text-lg font-semibold mb-3">Post Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Add a catchy title..."
                  className="w-full p-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={150}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {postTitle.length}/150 characters
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium mb-3">
                  <Hash className="w-4 h-4" />
                  <span>Hashtags (max 5)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableHashtags.map((hashtag) => (
                    <button
                      key={hashtag}
                      onClick={() => toggleHashtag(hashtag)}
                      className={`
                        p-2 rounded-xl text-sm transition-all duration-200
                        ${selectedHashtags.includes(hashtag)
                          ? 'bg-primary/20 text-primary border border-primary'
                          : 'bg-muted hover:bg-muted/80 border border-transparent'
                        }
                        ${selectedHashtags.length >= 5 && !selectedHashtags.includes(hashtag) 
                          ? 'opacity-50 cursor-not-allowed' 
                          : ''
                        }
                      `}
                      disabled={selectedHashtags.length >= 5 && !selectedHashtags.includes(hashtag)}
                    >
                      {hashtag}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Selected: {selectedHashtags.length}/5
                </p>
              </div>
            </div>
          </div>

          {/* Post Button */}
          <button 
            onClick={handlePost}
            disabled={!postTitle || selectedHashtags.length === 0}
            className="w-full btn-viral disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post to TikTok 🚀
          </button>

          {/* Tips */}
          <div className="card-gaming bg-viral/10 border-viral/30">
            <h3 className="font-semibold text-viral mb-2">🔥 Viral Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use trending hashtags for more reach</li>
              <li>• Catchy titles get more views</li>
              <li>• 15% chance for any post to go viral</li>
              <li>• Partnership unlocks at 10K followers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};