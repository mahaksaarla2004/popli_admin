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
  ipAddress: string;
  deviceFingerprint: string;
  phone: string;
  email: string;
  bio: string;
  riskScore: number; // 0 to 100
  lastActive: string;
  watchTime: number; // in hours
  avgRetention: number; // percentage
  dopamineHook: number; // dopamine retention level (0-10)
  scrollFatiguePoint: number; // avg scroll count before fatigue (0-100)
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
  completionRate: number; // percentage
  rewatchRatio: number; // percentage
  viralScore: number; // 0 to 100
  city: string;
  category: 'comedy' | 'tech' | 'dance' | 'food' | 'music' | 'drama' | 'fashion' | 'vlog';
  mood: 'joy' | 'excited' | 'emotional' | 'relaxed' | 'cringe' | 'patriotic';
  isTrending: boolean;
  isHidden: boolean;
  copyrightFlag: boolean;
  reported: boolean;
  commentsDisabled: boolean;
  ageRestricted: boolean;
  uploadDate: string;
  videoUrl: string; // fallback preview link
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
  ipAddress: string;
  fraudSuspected: boolean;
}

export interface Campaign {
  id: string;
  title: string;
  type: 'push' | 'banner' | 'challenge' | 'event';
  status: 'active' | 'scheduled' | 'completed' | 'draft';
  targetAudience: string;
  cityTarget: string;
  sentCount: number;
  openRate: number; // percentage
  clickRate: number; // percentage
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

// Helper generators for high-fidelity Mock Datasets (Indian Context)
const indianCities = [
  { name: 'Mumbai', state: 'Maharashtra' },
  { name: 'Delhi', state: 'Delhi' },
  { name: 'Bengaluru', state: 'Karnataka' },
  { name: 'Lucknow', state: 'Uttar Pradesh' },
  { name: 'Jaipur', state: 'Rajasthan' },
  { name: 'Indore', state: 'Madhya Pradesh' },
  { name: 'Madurai', state: 'Tamil Nadu' },
  { name: 'Hyderabad', state: 'Telangana' },
  { name: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Kolkata', state: 'West Bengal' }
];

const categories = ['comedy', 'tech', 'dance', 'food', 'music', 'drama', 'fashion', 'vlog'] as const;
const moods = ['joy', 'excited', 'emotional', 'relaxed', 'cringe', 'patriotic'] as const;

const firstNames = [
  'Aarav', 'Kabir', 'Vihaan', 'Diya', 'Ananya', 'Ishan', 'Rohan', 'Riya', 'Priya', 'Amit',
  'Sai', 'Pooja', 'Rahul', 'Sneha', 'Vikram', 'Aditya', 'Devika', 'Karan', 'Meera', 'Varun',
  'Neha', 'Siddharth', 'Ajay', 'Sachin', 'Divya', 'Kavita', 'Sunita', 'Tushar', 'Deepak', 'Arjun'
];

const lastNames = [
  'Sharma', 'Patel', 'Reddy', 'Nair', 'Iyer', 'Malhotra', 'Gupta', 'Sen', 'Verma', 'Mishra',
  'Kumar', 'Hegde', 'Bose', 'Patil', 'Rathore', 'Rao', 'Joshi', 'Kakkar', 'Ranade', 'Mehta',
  'Nambiar', 'Das', 'Roy', 'Singh', 'Choudhury', 'Jadhav', 'Deshmukh', 'Pillai', 'Dubey', 'Gowda'
];

const generateCreators = (): Creator[] => {
  const list: Creator[] = [];
  for (let i = 1; i <= 112; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${fn} ${ln}`;
    const username = `${fn.toLowerCase()}_${ln.toLowerCase()}_${Math.floor(10 + Math.random() * 90)}`;
    const cityObj = indianCities[Math.floor(Math.random() * indianCities.length)];
    
    const followers = Math.floor(Math.random() * 2500000) + 1500;
    const totalLikes = Math.floor(followers * (2 + Math.random() * 8));
    const coinsEarned = Math.floor(followers * (0.01 + Math.random() * 0.1));
    const isVerified = followers > 200000 && Math.random() > 0.4;
    
    // IP and device fingerprint simulation
    const ipAddress = `103.86.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const deviceFingerprint = `dfp_android_${Math.random().toString(36).substring(2, 10).toUpperCase()}_${Math.floor(1000 + Math.random() * 9000)}`;
    
    const statusVal = Math.random() > 0.95 
      ? (Math.random() > 0.5 ? 'suspended' : 'shadow_banned') 
      : 'active';
      
    list.push({
      id: `c_${i}`,
      name,
      username,
      avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`,
      city: cityObj.name,
      state: cityObj.state,
      followers,
      following: Math.floor(Math.random() * 800) + 50,
      totalLikes,
      coinsEarned,
      videoCount: Math.floor(Math.random() * 250) + 10,
      status: statusVal,
      isVerified,
      earningsFrozen: false,
      registrationDate: new Date(Date.now() - (Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      ipAddress,
      deviceFingerprint,
      phone: `+91 ${90000 + Math.floor(Math.random() * 9999)} ${10000 + Math.floor(Math.random() * 89999)}`,
      email: `${username}@gmail.com`,
      bio: `Hyperlocal creator from ${cityObj.name} sharing ${categories[Math.floor(Math.random() * categories.length)]} and cultural vibes! ✨`,
      riskScore: Math.floor(Math.random() * 35) + (statusVal !== 'active' ? 45 : 0),
      lastActive: new Date(Date.now() - (Math.random() * 72 * 60 * 60 * 1000)).toISOString(),
      watchTime: Math.floor(followers * (0.05 + Math.random() * 0.15)),
      avgRetention: Math.floor(Math.random() * 45) + 30,
      dopamineHook: Math.floor(Math.random() * 5) + 5,
      scrollFatiguePoint: Math.floor(Math.random() * 40) + 40
    });
  }
  return list;
};

const generateReels = (creators: Creator[]): Reel[] => {
  const list: Reel[] = [];
  const reelTitles = [
    "Amazing Mumbai monsoon tapri cutting chai vibes",
    "Bhangra dance challenge in Indore metro!",
    "Lucknow Tunday Kababi street tour - Mouthwatering!",
    "Bengaluru techie's daily struggle at Silk Board junction",
    "Jaipur street food trail - Pyaz Kachori exploration",
    "Madurai Jasmine market fragrance and colors",
    "Typical Delhi mom logic in the morning!",
    "Traditional Indian Bharatanatyam remix workout",
    "10 min Indian home workout hacks without gym",
    "Authentic dhaba style Paneer Butter Masala recipe",
    "Garba fever preparation on Surat streets!",
    "How to bargain in Jaipur local bazaar like a pro",
    "Super viral Indian comedy recreation with family",
    "CRICKET: Team India victory celebration in Madurai",
    "My peaceful village life vlog - Rural Haryana scenery",
    "Traditional mehendi design tutorial step-by-step",
    "Best budget street shopping in Sarojini Nagar Delhi",
    "Delicious South Indian filter coffee & idli breakfast",
    "Desi comedy: when Indian dad checks report card",
    "Sardarji viral energetic dance challenge!"
  ];

  for (let i = 1; i <= 215; i++) {
    const creator = creators[Math.floor(Math.random() * creators.length)];
    const title = `${reelTitles[i % reelTitles.length]} #${categories[i % categories.length]} #popli`;
    const views = Math.floor(Math.random() * 6500000) + 1200;
    const likes = Math.floor(views * (0.08 + Math.random() * 0.12));
    const shares = Math.floor(likes * (0.05 + Math.random() * 0.15));
    const commentsCount = Math.floor(likes * (0.01 + Math.random() * 0.05));
    const completionRate = Math.floor(Math.random() * 60) + 20;
    const rewatchRatio = Math.floor(completionRate * (0.1 + Math.random() * 0.4));
    const viralScore = Math.floor((completionRate * 0.6) + (rewatchRatio * 0.4) + (likes / views * 100));

    list.push({
      id: `r_${i}`,
      title,
      duration: Math.floor(Math.random() * 45) + 15,
      creatorId: creator.id,
      creatorName: creator.name,
      creatorUsername: creator.username,
      views,
      likes,
      shares,
      commentsCount,
      completionRate,
      rewatchRatio,
      viralScore,
      city: creator.city,
      category: categories[Math.floor(Math.random() * categories.length)],
      mood: moods[Math.floor(Math.random() * moods.length)],
      isTrending: viralScore > 75 && Math.random() > 0.3,
      isHidden: false,
      copyrightFlag: Math.random() > 0.96,
      reported: Math.random() > 0.93,
      commentsDisabled: false,
      ageRestricted: false,
      uploadDate: new Date(Date.now() - (Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-holding-a-camera-40742-large.mp4" // premium fallback
    });
  }
  return list;
};

const generateTransactions = (creators: Creator[]): Transaction[] => {
  const list: Transaction[] = [];
  const methods = ['UPI (PhonePe)', 'Google Pay', 'Paytm', 'Razorpay', 'IMPS Transfer', 'NetBanking'];
  for (let i = 1; i <= 58; i++) {
    const creator = creators[Math.floor(Math.random() * creators.length)];
    const type = Math.random() > 0.4 ? 'withdrawal' : 'purchase';
    const amount = Math.floor(Math.random() * 12500) + 500;
    const rupees = amount * (type === 'withdrawal' ? 0.8 : 1.0); // conversion mock

    list.push({
      id: `tx_${1000 + i}`,
      creatorName: creator.name,
      creatorUsername: creator.username,
      amount,
      rupees,
      type,
      status: Math.random() > 0.85 ? 'pending' : (Math.random() > 0.05 ? 'completed' : 'rejected'),
      date: new Date(Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      method: methods[Math.floor(Math.random() * methods.length)],
      ipAddress: creator.ipAddress,
      fraudSuspected: Math.random() > 0.94
    });
  }
  return list;
};

const generateCampaigns = (): Campaign[] => {
  const list: Campaign[] = [];
  const titles = [
    "Diwali Hyperlocal Spark Challenge 🪔",
    "IPL Cricket Mania - Cheering Loud 🏏",
    "Jaipur Food Carnival Hunt 🌶️",
    "Monsoon Rains Dance Challenge ☔",
    "Lucknow Nawabi Shayri Hunt 🎤",
    "Madurai Street Markets Walkthrough 🌸",
    "Indore Clean City Clean Reels Drive ♻️",
    "College Campus Viral Comedian Search 🎭",
    "Street Fashion Creator Fest 🕶️",
    "POPLI Stars Creator Rewards Launch 🚀"
  ];

  for (let i = 0; i < 22; i++) {
    const type = i % 4 === 0 ? 'challenge' : (i % 4 === 1 ? 'push' : (i % 4 === 2 ? 'banner' : 'event'));
    const statusVal = i < 4 ? 'active' : (i < 8 ? 'scheduled' : (i < 16 ? 'completed' : 'draft'));
    const sentCount = statusVal === 'completed' || statusVal === 'active' ? Math.floor(Math.random() * 850000) + 12000 : 0;
    
    list.push({
      id: `camp_${i + 100}`,
      title: titles[i % titles.length],
      type,
      status: statusVal,
      targetAudience: i % 2 === 0 ? 'Active Creators (Age 18-25)' : 'General Viewers (Tier-2 Cities)',
      cityTarget: i % 3 === 0 ? 'Lucknow, Indore' : (i % 3 === 1 ? 'Jaipur, Madurai' : 'National (All Cities)'),
      sentCount,
      openRate: sentCount > 0 ? Math.floor(Math.random() * 35) + 15 : 0,
      clickRate: sentCount > 0 ? Math.floor(Math.random() * 12) + 2 : 0,
      dateCreated: new Date(Date.now() - (Math.random() * 60 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      scheduledTime: statusVal === 'scheduled' ? new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() : undefined,
      hashtag: type === 'challenge' ? `#${titles[i % titles.length].split(' ')[0].toLowerCase()}Star` : undefined
    });
  }
  return list;
};

const generateReports = (reels: Reel[]): ModerationReport[] => {
  const list: ModerationReport[] = [];
  const reasons = [
    "Violent content or self-harm",
    "Nudity or sexually explicit gestures",
    "Hate speech and abusive language",
    "Spam, fake views farm, automated bot profile",
    "Copyright infringement - audio track stolen",
    "Harassment & personal bullying",
    "Fake news or political provocation"
  ];
  
  for (let i = 1; i <= 24; i++) {
    const targetReel = reels[i * 5 % reels.length];
    const severity = i % 3 === 0 ? 'critical' : (i % 3 === 1 ? 'high' : (i % 4 === 2 ? 'medium' : 'low'));
    
    list.push({
      id: `rep_${100 + i}`,
      type: 'reel',
      targetId: targetReel.id,
      targetTitle: targetReel.title,
      targetCreatorName: targetReel.creatorName,
      reportReason: reasons[i % reasons.length],
      reporterName: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
      severity,
      status: i < 18 ? 'pending' : 'actioned',
      date: new Date(Date.now() - (Math.random() * 10 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      aiClassification: {
        nudity: i % reasons.length === 1 ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 5),
        violence: i % reasons.length === 0 ? Math.floor(Math.random() * 45) + 55 : Math.floor(Math.random() * 2),
        hateSpeech: i % reasons.length === 2 ? Math.floor(Math.random() * 50) + 40 : Math.floor(Math.random() * 3),
        spam: i % reasons.length === 3 ? Math.floor(Math.random() * 80) + 19 : Math.floor(Math.random() * 10)
      }
    });
  }
  return list;
};

const generateTickets = (): SupportTicket[] => {
  const list: SupportTicket[] = [];
  const subjects = [
    "Unable to withdraw earnings - Transaction failed but coins deducted",
    "Profile verification request denied, please review my account",
    "Banned by mistake! I have not uploaded copyrighted content",
    "App crashes when attempting to record 60s short audio",
    "Diwali challenge reward coins not credited to wallet",
    "Account got hacked - IP locations showing unrecognized device from Russia",
    "Comment section abuse report on my recent trending comedy video"
  ];
  
  for (let i = 1; i <= 14; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const u = `${fn.toLowerCase()}_${ln.toLowerCase()}`;
    const category = i % 5 === 0 ? 'withdrawal' : (i % 5 === 1 ? 'login' : (i % 5 === 2 ? 'account_recovery' : (i % 5 === 3 ? 'abuse_complaint' : 'coin_issue')));
    
    list.push({
      id: `tix_${1000 + i}`,
      subject: subjects[i % subjects.length],
      userName: `${fn} ${ln}`,
      userUsername: u,
      category,
      priority: i % 3 === 0 ? 'high' : (i % 3 === 1 ? 'medium' : 'low'),
      status: i < 8 ? 'open' : (i < 11 ? 'in_progress' : 'resolved'),
      dateCreated: new Date(Date.now() - (Math.random() * 5 * 24 * 60 * 60 * 1000)).toISOString(),
      chatHistory: [
        { sender: 'user', message: `Hello team, I am facing an issue with my platform account: ${subjects[i % subjects.length]}. Please resolve immediately.`, timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
        { sender: 'support', message: "Hi there, thank you for reaching out to POPLI support team. We have escalated this to our operations department and are investigating.", timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() }
      ]
    });
  }
  return list;
};

const initialGifts: Gift[] = [
  { id: 'g_1', name: 'Rose', icon: '🌹', coinPrice: 5, popularity: 82, animationType: 'fade' },
  { id: 'g_2', name: 'Heart', icon: '❤️', coinPrice: 10, popularity: 94, animationType: 'bounce' },
  { id: 'g_3', name: 'Fire', icon: '🔥', coinPrice: 50, popularity: 76, animationType: 'zoom' },
  { id: 'g_4', name: 'Crown', icon: '👑', coinPrice: 200, popularity: 61, animationType: '3d' },
  { id: 'g_5', name: 'Diamond', icon: '💎', coinPrice: 500, popularity: 45, animationType: 'zoom' },
  { id: 'g_6', name: 'Rocket', icon: '🚀', coinPrice: 1000, popularity: 29, animationType: '3d' },
  { id: 'g_7', name: 'Lion Hunt', icon: '🦁', coinPrice: 5000, popularity: 12, animationType: 'bounce' }
];

const DEFAULT_STATE = () => {
  const creators = generateCreators();
  const reels = generateReels(creators);
  const transactions = generateTransactions(creators);
  const campaigns = generateCampaigns();
  const reports = generateReports(reels);
  const tickets = generateTickets();
  
  return {
    creators,
    reels,
    transactions,
    campaigns,
    reports,
    tickets,
    gifts: initialGifts,
    recommendationWeights: {
      watchTimeWeight: 45,
      shareWeight: 25,
      nearbyWeight: 20,
      commentWeight: 10,
      moodWeight: 5
    },
    coinRateSettings: {
      purchasePricePerCoin: 1.25, // 1.25 INR
      withdrawalRedeemRate: 0.85, // 0.85 INR
      minimumWithdrawalCoins: 1000,
      dailyLimitCoins: 50000
    },
    botAttackActive: false,
    botSimulationInterval: 1000
  };
};

export const usePlatformStore = create<PlatformState>((set) => ({
  ...DEFAULT_STATE(),

  // Actions: User management
  banUser: (userId) => set((state) => ({
    creators: state.creators.map((c) => c.id === userId ? { ...c, status: 'suspended', riskScore: 95 } : c)
  })),
  
  unbanUser: (userId) => set((state) => ({
    creators: state.creators.map((c) => c.id === userId ? { ...c, status: 'active', riskScore: 10 } : c)
  })),
  
  verifyUser: (userId) => set((state) => ({
    creators: state.creators.map((c) => c.id === userId ? { ...c, isVerified: true } : c)
  })),
  
  removeVerification: (userId) => set((state) => ({
    creators: state.creators.map((c) => c.id === userId ? { ...c, isVerified: false } : c)
  })),
  
  shadowBanUser: (userId) => set((state) => ({
    creators: state.creators.map((c) => c.id === userId ? { ...c, status: 'shadow_banned', riskScore: 78 } : c)
  })),
  
  freezeEarnings: (userId) => set((state) => ({
    creators: state.creators.map((c) => c.id === userId ? { ...c, earningsFrozen: !c.earningsFrozen } : c)
  })),

  // Actions: Content Management
  removeReel: (reelId) => set((state) => ({
    reels: state.reels.filter((r) => r.id !== reelId),
    reports: state.reports.map((rep) => rep.targetId === reelId ? { ...rep, status: 'actioned' } : rep)
  })),
  
  hideReel: (reelId) => set((state) => ({
    reels: state.reels.map((r) => r.id === reelId ? { ...r, isHidden: !r.isHidden } : r)
  })),
  
  forceTrendReel: (reelId) => set((state) => ({
    reels: state.reels.map((r) => r.id === reelId ? { ...r, isTrending: !r.isTrending, viralScore: 98 } : r)
  })),
  
  restrictAgeReel: (reelId) => set((state) => ({
    reels: state.reels.map((r) => r.id === reelId ? { ...r, ageRestricted: !r.ageRestricted } : r)
  })),
  
  disableCommentsReel: (reelId) => set((state) => ({
    reels: state.reels.map((r) => r.id === reelId ? { ...r, commentsDisabled: !r.commentsDisabled } : r)
  })),

  // Payouts & Coins
  approveWithdrawal: (txId) => set((state) => ({
    transactions: state.transactions.map((t) => t.id === txId ? { ...t, status: 'completed' } : t)
  })),
  
  rejectWithdrawal: (txId) => set((state) => ({
    transactions: state.transactions.map((t) => t.id === txId ? { ...t, status: 'rejected' } : t)
  })),
  
  updateCoinRates: (rates) => set((state) => ({
    coinRateSettings: { ...state.coinRateSettings, ...rates }
  })),
  
  addGiftItem: (gift) => set((state) => ({
    gifts: [...state.gifts, gift]
  })),
  
  deleteGiftItem: (giftId) => set((state) => ({
    gifts: state.gifts.filter((g) => g.id !== giftId)
  })),

  // Campaigns & Moderation
  addCampaign: (campaign) => set((state) => {
    const newCamp: Campaign = {
      ...campaign,
      id: `camp_${Math.floor(Math.random() * 10000)}`,
      dateCreated: new Date().toISOString().split('T')[0],
      sentCount: campaign.status === 'active' ? Math.floor(Math.random() * 500000) + 100 : 0,
      openRate: campaign.status === 'active' ? Math.floor(Math.random() * 30) + 10 : 0,
      clickRate: campaign.status === 'active' ? Math.floor(Math.random() * 10) + 1 : 0
    };
    return { campaigns: [newCamp, ...state.campaigns] };
  }),
  
  resolveReport: (reportId, action) => set((state) => {
    const report = state.reports.find((r) => r.id === reportId);
    if (!report) return {};
    
    let updatedReels = [...state.reels];
    if (action === 'removed') {
      updatedReels = updatedReels.filter((r) => r.id !== report.targetId);
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
    if (!current) {
      // Simulate extreme fraud flags when bot attack starts
      const targetUser = state.creators[Math.floor(Math.random() * state.creators.length)];
      const botIp = `203.111.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      
      const fraudTx: Transaction = {
        id: `tx_${Math.floor(Math.random() * 1000) + 9000}`,
        creatorName: targetUser.name,
        creatorUsername: targetUser.username,
        amount: 250000,
        rupees: 200000,
        type: 'withdrawal',
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        method: 'UPI (PhonePe)',
        ipAddress: botIp,
        fraudSuspected: true
      };
      
      return {
        botAttackActive: true,
        transactions: [fraudTx, ...state.transactions],
        creators: state.creators.map((c) => c.id === targetUser.id ? { ...c, riskScore: 98 } : c)
      };
    } else {
      return { botAttackActive: false };
    }
  }),
  
  simulateLiveTicks: () => set((state) => {
    // Increase views and likes on trending reels
    const updatedReels = state.reels.map((r) => {
      if (r.isTrending || state.botAttackActive) {
        const addedViews = state.botAttackActive ? Math.floor(Math.random() * 200000) + 5000 : Math.floor(Math.random() * 2000) + 200;
        const addedLikes = Math.floor(addedViews * 0.1);
        const addedShares = Math.floor(addedLikes * 0.08);
        return {
          ...r,
          views: r.views + addedViews,
          likes: r.likes + addedLikes,
          shares: r.shares + addedShares
        };
      }
      return r;
    });
    
    return { reels: updatedReels };
  }),
  
  resetPlatformStore: () => set(DEFAULT_STATE())
}));
