import { useState } from 'react';
import { useGameData } from '../../hooks/useGameData';
import { ArrowLeft, ShoppingBag, DollarSign, TrendingUp, Lock } from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  brand: string;
  payPerView: number;
  upfrontCost: number;
  minFollowers: number;
  description: string;
  color: string;
}

const CAMPAIGNS: Campaign[] = [
  {
    id: 'gaming_mouse',
    title: 'Gaming Mouse Promo',
    brand: 'TechGear Pro',
    payPerView: 3.0,
    upfrontCost: 50,
    minFollowers: 5000,
    description: 'Promote our new gaming mouse in your clips',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'energy_drink',
    title: 'Energy Drink Campaign',
    brand: 'PowerUp Energy',
    payPerView: 2.5,
    upfrontCost: 25,
    minFollowers: 3000,
    description: 'Feature our energy drink in gaming content',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'crypto_app',
    title: 'Crypto Trading App',
    brand: 'CoinTrader',
    payPerView: 5.0,
    upfrontCost: 100,
    minFollowers: 15000,
    description: 'Promote our crypto trading platform',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'headset',
    title: 'Pro Gaming Headset',
    brand: 'AudioMax',
    payPerView: 2.0,
    upfrontCost: 30,
    minFollowers: 1000,
    description: 'Showcase our premium gaming headset',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'clothing',
    title: 'Streetwear Collection',
    brand: 'UrbanFlex',
    payPerView: 1.5,
    upfrontCost: 15,
    minFollowers: 2000,
    description: 'Wear our latest streetwear in your content',
    color: 'from-pink-500 to-red-500'
  }
];

export const WhopApp = () => {
  const { gameState, setCurrentApp, updatePlayer } = useGameData();
  const { player } = gameState;
  const [joinedCampaigns, setJoinedCampaigns] = useState<string[]>([]);

  const handleJoinCampaign = (campaign: Campaign) => {
    if (player.money >= campaign.upfrontCost && player.followers >= campaign.minFollowers) {
      updatePlayer(prev => ({
        ...prev,
        money: prev.money - campaign.upfrontCost
      }));
      setJoinedCampaigns(prev => [...prev, campaign.id]);
    }
  };

  const canJoinCampaign = (campaign: Campaign) => {
    return player.money >= campaign.upfrontCost && 
           player.followers >= campaign.minFollowers &&
           !joinedCampaigns.includes(campaign.id);
  };

  const formatMoney = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (!player.whopUnlocked) {
    return (
      <div className="p-4 pb-24">
        <div className="flex items-center space-x-4 mb-6">
          <button 
            onClick={() => setCurrentApp('home')}
            className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-green-400">Whop</h1>
            <p className="text-sm text-muted-foreground">Brand partnerships</p>
          </div>
        </div>

        <div className="card-gaming text-center">
          <div className="app-icon bg-muted mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Whop Locked</h2>
          <p className="text-muted-foreground mb-4">
            Unlock brand partnerships by reaching 10,000 TikTok followers and getting the TikTok Partnership
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Current Followers:</span>
              <span className="font-bold">{formatFollowers(player.followers)}</span>
            </div>
            <div className="flex justify-between">
              <span>Required:</span>
              <span className="font-bold">10K</span>
            </div>
            <div className="flex justify-between">
              <span>Partnership:</span>
              <span className={`font-bold ${player.hasPartnership ? 'text-success' : 'text-muted-foreground'}`}>
                {player.hasPartnership ? '✅ Active' : '❌ Locked'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-green-400">Whop</h1>
          <p className="text-sm text-muted-foreground">Brand partnerships & campaigns</p>
        </div>
      </div>

      {/* Stats */}
      <div className="card-gaming mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <DollarSign className="w-4 h-4 text-success" />
              <span className="text-lg font-bold">{formatMoney(player.money)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Available Budget</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-lg font-bold">{formatFollowers(player.followers)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
        </div>
      </div>

      {/* Active Campaigns */}
      {joinedCampaigns.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Active Campaigns</h2>
          <div className="space-y-3">
            {joinedCampaigns.map(campaignId => {
              const campaign = CAMPAIGNS.find(c => c.id === campaignId);
              if (!campaign) return null;
              
              return (
                <div key={campaign.id} className="card-gaming bg-success/10 border-success/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-success">{campaign.title}</h3>
                      <p className="text-sm text-muted-foreground">{campaign.brand}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success">{formatMoney(campaign.payPerView)}/1K views</p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Campaigns */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Available Campaigns</h2>
        <div className="space-y-4">
          {CAMPAIGNS.map((campaign) => {
            const isJoined = joinedCampaigns.includes(campaign.id);
            const canJoin = canJoinCampaign(campaign);
            const hasFollowers = player.followers >= campaign.minFollowers;
            const hasBudget = player.money >= campaign.upfrontCost;

            return (
              <div key={campaign.id} className={`
                card-gaming
                ${isJoined ? 'opacity-50' : ''}
              `}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${campaign.color} text-white mb-2`}>
                        {campaign.brand}
                      </div>
                      <h3 className="font-semibold text-lg">{campaign.title}</h3>
                      <p className="text-sm text-muted-foreground">{campaign.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Pay per 1K views</p>
                      <p className="font-bold text-success text-lg">{formatMoney(campaign.payPerView)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Join cost</p>
                      <p className="font-bold text-lg">{formatMoney(campaign.upfrontCost)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Min. followers required:</span>
                      <span className={hasFollowers ? 'text-success' : 'text-destructive'}>
                        {formatFollowers(campaign.minFollowers)}
                        {hasFollowers ? ' ✅' : ' ❌'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Budget required:</span>
                      <span className={hasBudget ? 'text-success' : 'text-destructive'}>
                        {formatMoney(campaign.upfrontCost)}
                        {hasBudget ? ' ✅' : ' ❌'}
                      </span>
                    </div>
                  </div>

                  {isJoined ? (
                    <div className="w-full p-3 bg-success/20 text-success rounded-xl text-center font-medium">
                      ✅ Joined Campaign
                    </div>
                  ) : (
                    <button
                      onClick={() => handleJoinCampaign(campaign)}
                      disabled={!canJoin}
                      className={`
                        w-full p-3 rounded-xl font-medium transition-all duration-300
                        ${canJoin 
                          ? 'bg-gradient-to-r from-success to-emerald-400 text-white hover:scale-105 active:scale-95' 
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }
                      `}
                    >
                      {!hasFollowers ? 'Need More Followers' :
                       !hasBudget ? 'Insufficient Budget' :
                       'Join Campaign'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 card-gaming bg-green-500/10 border-green-500/30">
        <h3 className="font-semibold text-green-400 mb-2">💰 Campaign Tips</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Higher upfront costs usually mean better payouts</li>
          <li>• Campaign earnings are added to your regular TikTok earnings</li>
          <li>• Some campaigns require minimum follower counts</li>
          <li>• Join multiple campaigns to maximize earnings</li>
        </ul>
      </div>
    </div>
  );
};