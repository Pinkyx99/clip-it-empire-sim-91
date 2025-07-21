import { useState, useEffect } from 'react';
import { useGameData } from '../../hooks/useGameData';
import { getRandomHashtags } from '../../data/streamers';
import { Camera, Plus, Heart, MessageCircle, Share, Bookmark, Home, Search, User, Bell, Play } from 'lucide-react';

export const TikTokApp = () => {
  const { gameState, addPost, updatePlayer, clearCurrentClip } = useGameData();
  const { currentClip, player, posts } = gameState;
  
  const [activeTab, setActiveTab] = useState<'home' | 'discover' | 'create' | 'inbox' | 'profile'>('create');
  const [postTitle, setPostTitle] = useState('');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [showAccountCreation, setShowAccountCreation] = useState(!player.tikTokUsername);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [showPostSuccess, setShowPostSuccess] = useState(false);

  const availableHashtags = getRandomHashtags(10);

  // Auto-save account info
  useEffect(() => {
    if (player.tikTokUsername) {
      setShowAccountCreation(false);
    }
  }, [player.tikTokUsername]);

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
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate random views with viral chance
    const baseViews = Math.floor(Math.random() * 4900) + 100;
    const isViral = Math.random() < 0.15;
    const finalViews = isViral ? baseViews * (Math.random() * 10 + 5) : baseViews;
    
    // Calculate earnings
    const earningsPerView = player.hasPartnership ? 0.002 : 0.0005;
    const earnings = (finalViews / 1000) * (earningsPerView * 1000);
    
    // Generate metrics
    const likes = Math.floor(finalViews * (Math.random() * 0.1 + 0.05));
    const comments = Math.floor(finalViews * (Math.random() * 0.02 + 0.01));
    const shares = Math.floor(finalViews * (Math.random() * 0.005 + 0.002));
    
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
    setShowPostSuccess(true);
    setActiveTab('home');
    
    setTimeout(() => {
      setShowPostSuccess(false);
    }, 3000);
  };

  if (showAccountCreation) {
    return (
      <div className="h-full bg-black text-white flex flex-col">
        {/* TikTok Header */}
        <div className="p-4 text-center border-b border-gray-800">
          <h1 className="text-2xl font-bold">TikTok</h1>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Camera className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Join TikTok</h2>
              <p className="text-gray-400">Create your account to start posting</p>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                />
              </div>

              <button 
                onClick={handleCreateAccount}
                disabled={!username || !password}
                className="w-full p-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg disabled:opacity-50"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isPosting) {
    return (
      <div className="h-full bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-2">Posting...</h2>
          <p className="text-gray-400">Your video is going viral! 🚀</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-black text-white flex flex-col">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex space-x-6">
          <button 
            onClick={() => setActiveTab('home')}
            className={`text-lg font-semibold ${activeTab === 'home' ? 'text-white' : 'text-gray-400'}`}
          >
            Following
          </button>
          <button 
            onClick={() => setActiveTab('discover')}
            className={`text-lg font-semibold ${activeTab === 'discover' ? 'text-white' : 'text-gray-400'}`}
          >
            For You
          </button>
        </div>
        <div className="text-lg font-bold">TikTok</div>
        <div className="w-16"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'home' && (
          <div className="h-full">
            {showPostSuccess && (
              <div className="p-4 bg-green-600 text-center">
                <p className="font-semibold">🎉 Video posted successfully!</p>
              </div>
            )}
            
            {posts.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
                  <p className="text-gray-400">Start creating to see your posts here</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-4">
                {posts.slice().reverse().map((post, index) => (
                  <div key={post.id} className="border-b border-gray-800 pb-4">
                    {/* User info */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold">@{player.tikTokUsername}</p>
                        <p className="text-gray-400 text-sm">{new Date(post.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Video content */}
                    <div className="aspect-video bg-gray-900 rounded-lg mb-3 flex items-center justify-center">
                      <div className="text-center">
                        <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">{post.title}</p>
                      </div>
                    </div>

                    {/* Hashtags */}
                    <div className="mb-3">
                      <p className="text-sm">
                        {post.hashtags.map(tag => `#${tag}`).join(' ')}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-5 h-5" />
                          <span className="text-sm">{post.likes.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm">{post.comments.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share className="w-5 h-5" />
                          <span className="text-sm">{post.shares.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {post.views.toLocaleString()} views
                        {post.isViral && <span className="ml-2 text-red-400">🔥 VIRAL</span>}
                      </div>
                    </div>

                    {/* Earnings */}
                    <div className="mt-2 text-sm text-green-400">
                      Earned: ${post.earnings.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="h-full p-4">
            {!currentClip ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No clip ready</h3>
                  <p className="text-gray-400">Create and edit a clip first</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Video Preview */}
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">{currentClip.title}</p>
                    <p className="text-gray-500 text-sm">Duration: {currentClip.duration}s</p>
                  </div>
                </div>

                {/* Caption */}
                <div>
                  <textarea
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Describe your video..."
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 resize-none"
                    rows={3}
                    maxLength={150}
                  />
                  <p className="text-gray-400 text-sm mt-1">{postTitle.length}/150</p>
                </div>

                {/* Hashtags */}
                <div>
                  <h3 className="font-semibold mb-3">Hashtags (max 5)</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {availableHashtags.map((hashtag) => (
                      <button
                        key={hashtag}
                        onClick={() => toggleHashtag(hashtag)}
                        className={`p-2 rounded-lg text-sm transition-all ${
                          selectedHashtags.includes(hashtag)
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        } ${selectedHashtags.length >= 5 && !selectedHashtags.includes(hashtag) 
                          ? 'opacity-50 cursor-not-allowed' 
                          : ''
                        }`}
                        disabled={selectedHashtags.length >= 5 && !selectedHashtags.includes(hashtag)}
                      >
                        #{hashtag}
                      </button>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    Selected: {selectedHashtags.length}/5
                  </p>
                </div>

                {/* Post Button */}
                <button 
                  onClick={handlePost}
                  disabled={!postTitle || selectedHashtags.length === 0}
                  className="w-full p-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="h-full p-4">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold">@{player.tikTokUsername}</h2>
              <div className="flex justify-center space-x-6 mt-4">
                <div className="text-center">
                  <p className="text-xl font-bold">{player.followers.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{posts.length}</p>
                  <p className="text-gray-400 text-sm">Videos</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{player.totalViews.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">Views</p>
                </div>
              </div>
              
              {player.hasPartnership && (
                <div className="mt-4 p-2 bg-yellow-600/20 border border-yellow-600 rounded-lg">
                  <p className="text-yellow-400 font-semibold">✅ Creator Fund Partner</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-around p-4 border-t border-gray-800 bg-black">
        <button 
          onClick={() => setActiveTab('home')}
          className={`p-2 ${activeTab === 'home' ? 'text-white' : 'text-gray-400'}`}
        >
          <Home className="w-6 h-6" />
        </button>
          <button 
            onClick={() => setActiveTab('discover')}
            className={`p-2 ${activeTab === 'discover' ? 'text-white' : 'text-gray-400'}`}
          >
            <Search className="w-6 h-6" />
          </button>
        <button 
          onClick={() => setActiveTab('create')}
          className="p-2 bg-white rounded-lg"
        >
          <Plus className="w-6 h-6 text-black" />
        </button>
        <button 
          onClick={() => setActiveTab('inbox')}
          className={`p-2 ${activeTab === 'inbox' ? 'text-white' : 'text-gray-400'}`}
        >
          <Bell className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`p-2 ${activeTab === 'profile' ? 'text-white' : 'text-gray-400'}`}
        >
          <User className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};