import { useState, useEffect } from 'react';

export interface StreamerData {
  id: string;
  name: string;
  displayName: string;
  avatar: string;
  followers: number;
  category: string;
}

export interface ClipData {
  id: string;
  streamerId: string;
  streamerName: string;
  title: string;
  duration: number;
  quality: 'low' | 'medium' | 'high';
  timestamp: number;
}

export interface TikTokPost {
  id: string;
  clipId: string;
  title: string;
  hashtags: string[];
  views: number;
  likes: number;
  comments: number;
  shares: number;
  earnings: number;
  timestamp: number;
  isViral: boolean;
}

export interface PlayerData {
  money: number;
  followers: number;
  level: number;
  currentGoal: string;
  tikTokUsername: string;
  tikTokPassword: string;
  hasPartnership: boolean;
  whopUnlocked: boolean;
  totalEarnings: number;
  totalViews: number;
  clipsCreated: number;
  postsCreated: number;
  lastLogin: number;
  dailyBonusClaimed: boolean;
}

export interface GameState {
  player: PlayerData;
  clips: ClipData[];
  posts: TikTokPost[];
  currentApp: 'home' | 'twitch' | 'capcut' | 'tiktok' | 'whop';
  currentClip: ClipData | null;
  clipCooldown: number;
  currentStreamer: StreamerData | null;
}

const STORAGE_KEY = 'clipItTycoon_gameState';

const initialPlayerData: PlayerData = {
  money: 10,
  followers: 0,
  level: 1,
  currentGoal: 'Reach 10,000 TikTok followers',
  tikTokUsername: '',
  tikTokPassword: '',
  hasPartnership: false,
  whopUnlocked: false,
  totalEarnings: 0,
  totalViews: 0,
  clipsCreated: 0,
  postsCreated: 0,
  lastLogin: Date.now(),
  dailyBonusClaimed: false,
};

const initialGameState: GameState = {
  player: initialPlayerData,
  clips: [],
  posts: [],
  currentApp: 'home',
  currentClip: null,
  clipCooldown: 0,
  currentStreamer: null,
};

export const useGameData = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  // Load game state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setGameState(parsed);
        
        // Check for daily bonus
        const now = Date.now();
        const lastLogin = parsed.player.lastLogin || 0;
        const daysSinceLogin = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLogin >= 1) {
          setGameState(prev => ({
            ...prev,
            player: {
              ...prev.player,
              lastLogin: now,
              dailyBonusClaimed: false,
            }
          }));
        }
      } catch (error) {
        console.error('Error loading saved game:', error);
      }
    }
  }, []);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const updateGameState = (updater: (prev: GameState) => GameState) => {
    setGameState(updater);
  };

  const updatePlayer = (updater: (prev: PlayerData) => PlayerData) => {
    setGameState(prev => ({
      ...prev,
      player: updater(prev.player)
    }));
  };

  const addMoney = (amount: number) => {
    updatePlayer(prev => ({
      ...prev,
      money: prev.money + amount,
      totalEarnings: prev.totalEarnings + amount
    }));
  };

  const addFollowers = (amount: number) => {
    updatePlayer(prev => {
      const newFollowers = prev.followers + amount;
      const hasPartnership = newFollowers >= 10000;
      const whopUnlocked = hasPartnership;
      
      return {
        ...prev,
        followers: newFollowers,
        hasPartnership: hasPartnership,
        whopUnlocked: whopUnlocked,
        currentGoal: hasPartnership ? 'Become a viral sensation!' : 'Reach 10,000 TikTok followers'
      };
    });
  };

  const addClip = (clip: ClipData) => {
    setGameState(prev => ({
      ...prev,
      clips: [...prev.clips, clip],
      currentClip: clip,
      player: {
        ...prev.player,
        clipsCreated: prev.player.clipsCreated + 1
      }
    }));
  };

  const addPost = (post: TikTokPost) => {
    setGameState(prev => ({
      ...prev,
      posts: [...prev.posts, post],
      player: {
        ...prev.player,
        postsCreated: prev.player.postsCreated + 1,
        totalViews: prev.player.totalViews + post.views
      }
    }));
    
    // Add earnings and followers from the post
    addMoney(post.earnings);
    
    // Calculate followers gained based on views and viral status
    const followersGained = post.isViral 
      ? Math.floor(post.views * 0.1) // 10% conversion for viral posts
      : Math.floor(post.views * 0.02); // 2% conversion for normal posts
    
    addFollowers(followersGained);
  };

  const claimDailyBonus = () => {
    if (!gameState.player.dailyBonusClaimed) {
      const bonusAmount = 50 + (gameState.player.level * 10);
      addMoney(bonusAmount);
      updatePlayer(prev => ({
        ...prev,
        dailyBonusClaimed: true
      }));
      return bonusAmount;
    }
    return 0;
  };

  const setCurrentApp = (app: GameState['currentApp']) => {
    setGameState(prev => ({ ...prev, currentApp: app }));
  };

  const setCurrentStreamer = (streamer: StreamerData | null) => {
    setGameState(prev => ({ ...prev, currentStreamer: streamer }));
  };

  const setClipCooldown = (cooldown: number) => {
    setGameState(prev => ({ ...prev, clipCooldown: cooldown }));
  };

  const clearCurrentClip = () => {
    setGameState(prev => ({ ...prev, currentClip: null }));
  };

  return {
    gameState,
    updateGameState,
    updatePlayer,
    addMoney,
    addFollowers,
    addClip,
    addPost,
    claimDailyBonus,
    setCurrentApp,
    setCurrentStreamer,
    setClipCooldown,
    clearCurrentClip,
  };
};