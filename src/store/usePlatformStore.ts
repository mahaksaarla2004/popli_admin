import { create } from 'zustand';

// Types
export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  city: string;
  state: string;
  followers: number;
  following: number;
  totalLikes: number;
  coinsEarned: number;
  videoCount: number;
  status: 'active' | 'suspended' | 'shadow_banned';
  isVerified: boolean;
  earningsFrozen: boolean;
  registrationDate: string;
  lastActive: string;
}

export interface Reel {
  id: string;
  title: string;
  duration: number; // in seconds
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  views: number;
  likes: number;
  shares: number;
  commentsCount: number;
  city: string;
  category: 'comedy' | 'tech' | 'dance' | 'food' | 'music' | 'drama' | 'fashion' | 'vlog';
  isTrending: boolean;
  isHidden: boolean;
  copyrightFlag: boolean;
  reported: boolean;
  commentsDisabled: boolean;
  ageRestricted: boolean;
  uploadDate: string;
  videoUrl: string; // fallback preview link
  musicName?: string;
  location?: string;
  taggedUsers?: Array<{ id: string; username: string }>;
}

export interface Transaction {
  id: string;
  creatorName: string;
  creatorUsername: string;
  amount: number; // in coins
  rupees: number; // equivalent rupees
  type: 'purchase' | 'withdrawal';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  date: string;
  method: string;
}

export interface Campaign {
  id: string;
  title: string;
  type: 'push' | 'banner' | 'challenge' | 'event';
  status: 'active' | 'scheduled' | 'completed' | 'draft';
  targetAudience: string;
  dateCreated: string;
  scheduledTime?: string;
  hashtag?: string;
}

export interface ModerationReport {
  id: string;
  type: 'reel' | 'comment' | 'user' | 'chat';
  targetId: string;
  targetTitle: string;
  targetCreatorName: string;
  reportReason: string;
  reporterName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'actioned';
  date: string;
  aiClassification?: {
    nudity: number; // percentage
    violence: number;
    hateSpeech: number;
    spam: number;
  };
}

export interface SupportTicket {
  id: string;
  subject: string;
  userName: string;
  userUsername: string;
  category: 'withdrawal' | 'login' | 'account_recovery' | 'abuse_complaint' | 'coin_issue';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  dateCreated: string;
  chatHistory: Array<{
    sender: 'user' | 'support';
    message: string;
    timestamp: string;
  }>;
}

export interface Gift {
  id: string;
  name: string;
  icon: string;
  coinPrice: number;
  popularity: number;
  animationType: 'fade' | 'bounce' | 'zoom' | '3d';
}

interface PlatformState {
  creators: Creator[];
  reels: Reel[];
  transactions: Transaction[];
  campaigns: Campaign[];
  reports: ModerationReport[];
  tickets: SupportTicket[];
  gifts: Gift[];
  
  // Platform Controls
  recommendationWeights: {
    watchTimeWeight: number;
    shareWeight: number;
    nearbyWeight: number;
    commentWeight: number;
    moodWeight: number;
  };
  coinRateSettings: {
    purchasePricePerCoin: number; // INR
    withdrawalRedeemRate: number; // INR per coin
    minimumWithdrawalCoins: number;
    dailyLimitCoins: number;
  };
  botAttackActive: boolean;
  botSimulationInterval: number; // speed multiplier
  
  // Actions - User Management
  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
  verifyUser: (userId: string) => void;
  removeVerification: (userId: string) => void;
  shadowBanUser: (userId: string) => void;
  freezeEarnings: (userId: string) => void;
  
  // Actions - Content Management
  removeReel: (reelId: string) => void;
  hideReel: (reelId: string) => void;
  forceTrendReel: (reelId: string) => void;
  restrictAgeReel: (reelId: string) => void;
  disableCommentsReel: (reelId: string) => void;
  
  // Actions - Payouts & Coins
  approveWithdrawal: (txId: string) => void;
  rejectWithdrawal: (txId: string) => void;
  updateCoinRates: (rates: Partial<PlatformState['coinRateSettings']>) => void;
  addGiftItem: (gift: Gift) => void;
  deleteGiftItem: (giftId: string) => void;
  
  // Actions - Campaigns & Moderation
  addCampaign: (campaign: Omit<Campaign, 'id' | 'dateCreated' | 'sentCount' | 'openRate' | 'clickRate'>) => void;
  resolveReport: (reportId: string, action: 'warning' | 'removed' | 'dismissed') => void;
  sendSupportReply: (ticketId: string, message: string) => void;
  
  // Actions - Control Panel Sliders & Simulation
  setWeights: (weights: Partial<PlatformState['recommendationWeights']>) => void;
  toggleBotAttack: () => void;
  simulateLiveTicks: () => void;
  resetPlatformStore: () => void;
}

import { adminService } from '../services/adminService';

const initialGifts: Gift[] = [
  { id: 'g_1', name: 'Rose', icon: '🌹', coinPrice: 5, popularity: 82, animationType: 'fade' },
  { id: 'g_2', name: 'Heart', icon: '❤️', coinPrice: 10, popularity: 94, animationType: 'bounce' },
  { id: 'g_3', name: 'Fire', icon: '🔥', coinPrice: 50, popularity: 76, animationType: 'zoom' },
];

const DEFAULT_STATE = () => ({
  creators: [],
  reels: [],
  transactions: [],
  campaigns: [],
  reports: [],
  tickets: [],
  gifts: initialGifts,
  recommendationWeights: {
    watchTimeWeight: 45,
    shareWeight: 25,
    nearbyWeight: 20,
    commentWeight: 10,
    moodWeight: 5
  },
  coinRateSettings: {
    purchasePricePerCoin: 1.25,
    withdrawalRedeemRate: 0.85,
    minimumWithdrawalCoins: 1000,
    dailyLimitCoins: 50000
  },
  botAttackActive: false,
  botSimulationInterval: 1000
});

export const usePlatformStore = create<PlatformState & { fetchAllData: () => Promise<void> }>((set) => ({
  ...DEFAULT_STATE(),

  fetchAllData: async () => {
    try {
      const [users, reels, txs, reports, tickets, fetchedGifts] = await Promise.all([
        adminService.getUsers().catch(() => []),
        adminService.getReels().catch(() => []),
        adminService.getTransactions().catch(() => []),
        adminService.getReports().catch(() => []),
        adminService.getTickets().catch(() => []),
        adminService.getGifts().catch(() => []),
      ]);

      const mappedCreators = users.map((u: any) => ({
        id: u.id,
        name: u.name || 'Unknown',
        username: u.username || 'unknown',
        avatar: u.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${u.username}`,
        city: u.city || 'Unknown',
        state: 'Unknown',
        followers: u.followersCount || 0,
        following: u.followingCount || 0,
        totalLikes: u.totalLikesReceived || 0,
        coinsEarned: 0,
        videoCount: 0,
        status: u.isBlocked ? 'suspended' : 'active',
        isVerified: u.isVerified || false,
        earningsFrozen: false,
        registrationDate: u.createdAt,
        lastActive: u.updatedAt
      }));

      const mappedReels = reels.map((r: any) => ({
        id: r.id,
        title: r.description || 'No Title',
        duration: 15,
        creatorId: r.creatorId,
        creatorName: r.creator?.name || 'Unknown',
        creatorUsername: r.creator?.username || 'unknown',
        views: r.viewsCount || 0,
        likes: r.likesCount || 0,
        shares: r.sharesCount || 0,
        commentsCount: r.commentsCount || 0,
        city: r.city || 'Unknown',
        category: r.category || 'vlog',
        isTrending: false,
        isHidden: false,
        copyrightFlag: false,
        reported: false,
        commentsDisabled: false,
        ageRestricted: false,
        uploadDate: r.createdAt,
        videoUrl: r.mediaUrl || "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-holding-a-camera-40742-large.mp4"
      }));

      const mappedTxs = txs.map((t: any) => ({
        id: t.id,
        creatorName: t.wallet?.user?.name || 'Unknown',
        creatorUsername: t.wallet?.user?.username || 'unknown',
        amount: t.currency === 'INR' ? Math.round(t.amount / 0.85) : t.amount,
        rupees: t.currency === 'INR' ? t.amount : t.amount * 0.85,
        type: t.type === 'WITHDRAWAL' ? 'withdrawal' : 'purchase',
        status: t.status.toLowerCase(),
        date: t.createdAt,
        method: t.description || 'UPI'
      }));

      const mappedReports = reports.map((r: any) => ({
        id: r.id,
        type: 'reel',
        targetId: r.reelId,
        targetTitle: r.reel?.description || 'Unknown Reel',
        targetCreatorName: r.reel?.creator?.username || 'Unknown Creator',
        reportReason: r.reason,
        reporterName: r.reporter?.name || 'Unknown',
        severity: 'medium',
        status: r.status === 'PENDING' ? 'pending' : 'actioned',
        date: r.createdAt
      }));

      const mappedTickets = tickets.map((t: any) => ({
        id: t.id,
        subject: t.subject,
        userName: t.creator?.name || 'Unknown',
        userUsername: t.creator?.username || 'unknown',
        category: 'general',
        priority: 'medium',
        status: t.status.toLowerCase(),
        dateCreated: t.createdAt,
        chatHistory: []
      }));

      const mappedGifts = fetchedGifts.map((g: any) => ({
        id: g.id,
        name: g.name,
        icon: g.iconUrl,
        coinPrice: g.costInCoins,
        popularity: 0,
        animationType: g.animationType || 'fly'
      }));

      set((state) => ({
        creators: mappedCreators,
        reels: mappedReels,
        transactions: mappedTxs,
        reports: mappedReports,
        tickets: mappedTickets,
        gifts: mappedGifts.length > 0 ? mappedGifts : state.gifts
      }));
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    }
  },

  // Actions: User management
  banUser: async (userId) => {
    await adminService.suspendUser(userId).catch(console.error);
    set((state) => ({
      creators: state.creators.map((c) => c.id === userId ? { ...c, status: 'suspended' } : c)
    }));
  },
  
  unbanUser: (userId) => set((state) => ({
    creators: state.creators.map((c) => c.id === userId ? { ...c, status: 'active' } : c)
  })),
  
  verifyUser: (userId) => set((state) => ({
    creators: state.creators.map((c) => c.id === userId ? { ...c, isVerified: true } : c)
  })),
  
  removeVerification: (userId) => set((state) => ({
    creators: state.creators.map((c) => c.id === userId ? { ...c, isVerified: false } : c)
  })),
  
  shadowBanUser: (userId) => set((state) => ({
    creators: state.creators.map((c) => c.id === userId ? { ...c, status: 'shadow_banned' } : c)
  })),
  
  freezeEarnings: (userId) => set((state) => ({
    creators: state.creators.map((c) => c.id === userId ? { ...c, earningsFrozen: !c.earningsFrozen } : c)
  })),

  // Actions: Content Management
  removeReel: async (reelId) => {
    await adminService.deleteReel(reelId).catch(console.error);
    set((state) => ({
      reels: state.reels.filter((r) => r.id !== reelId),
      reports: state.reports.map((rep) => rep.targetId === reelId ? { ...rep, status: 'actioned' } : rep)
    }));
  },
  
  hideReel: (reelId) => set((state) => ({
    reels: state.reels.map((r) => r.id === reelId ? { ...r, isHidden: !r.isHidden } : r)
  })),
  
  forceTrendReel: (reelId) => set((state) => ({
    reels: state.reels.map((r) => r.id === reelId ? { ...r, isTrending: !r.isTrending } : r)
  })),
  
  restrictAgeReel: (reelId) => set((state) => ({
    reels: state.reels.map((r) => r.id === reelId ? { ...r, ageRestricted: !r.ageRestricted } : r)
  })),
  
  disableCommentsReel: (reelId) => set((state) => ({
    reels: state.reels.map((r) => r.id === reelId ? { ...r, commentsDisabled: !r.commentsDisabled } : r)
  })),

  // Payouts & Coins
  approveWithdrawal: async (txId) => {
    await adminService.approveWithdrawal(txId).catch(console.error);
    set((state) => ({
      transactions: state.transactions.map((t) => t.id === txId ? { ...t, status: 'completed' } : t)
    }));
  },
  
  rejectWithdrawal: async (txId) => {
    await adminService.rejectWithdrawal(txId).catch(console.error);
    set((state) => ({
      transactions: state.transactions.map((t) => t.id === txId ? { ...t, status: 'rejected' } : t)
    }));
  },
  
  updateCoinRates: (rates) => set((state) => ({
    coinRateSettings: { ...state.coinRateSettings, ...rates }
  })),
  
  addGiftItem: async (gift) => {
    try {
      const savedGift = await adminService.addGift(gift);
      set((state) => ({
        gifts: [...state.gifts, { ...gift, id: savedGift.id }]
      }));
    } catch (error) {
      console.error(error);
      set((state) => ({ gifts: [...state.gifts, gift] }));
    }
  },
  
  deleteGiftItem: async (giftId) => {
    await adminService.deleteGift(giftId).catch(console.error);
    set((state) => ({
      gifts: state.gifts.filter((g) => g.id !== giftId)
    }));
  },

  // Campaigns & Moderation
  addCampaign: (campaign) => set((state) => {
    const newCamp: Campaign = {
      ...campaign,
      id: `camp_${Math.floor(Math.random() * 10000)}`,
      dateCreated: new Date().toISOString().split('T')[0]
    };
    return { campaigns: [newCamp, ...state.campaigns] };
  }),
  
  resolveReport: (reportId, action) => set((state) => {
    const report = state.reports.find((r) => r.id === reportId);
    if (!report) return {};
    
    let updatedReels = [...state.reels];
    if (action === 'removed') {
      updatedReels = updatedReels.filter((r) => r.id !== report.targetId);
      if (report.targetId) {
        adminService.deleteReel(report.targetId).catch(console.error);
      }
    }
    
    return {
      reports: state.reports.map((rep) => rep.id === reportId ? { ...rep, status: 'actioned' } : rep),
      reels: updatedReels
    };
  }),
  
  sendSupportReply: (ticketId, message) => set((state) => ({
    tickets: state.tickets.map((t) => t.id === ticketId ? {
      ...t,
      status: 'in_progress',
      chatHistory: [...t.chatHistory, { sender: 'support', message, timestamp: new Date().toISOString() }]
    } : t)
  })),

  // Config Sliders & Simulation
  setWeights: (weights) => set((state) => ({
    recommendationWeights: { ...state.recommendationWeights, ...weights }
  })),
  
  toggleBotAttack: () => set((state) => {
    const current = state.botAttackActive;
    return { botAttackActive: !current };
  }),
  
  simulateLiveTicks: () => set((state) => {
    return state; // Disable simulation on live data
  }),
  
  resetPlatformStore: () => set(DEFAULT_STATE())
}));

