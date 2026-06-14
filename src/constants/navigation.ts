import { 
  LayoutDashboard, 
  Users, 
  Video, 
  Sliders, 
  Coins, 
  ShieldAlert, 
  Megaphone, 
  AlertTriangle, 
  MessageSquare, 
  BarChart3, 
  Map, 
  ShieldCheck, 
  HelpCircle, 
  Settings,
  Trophy
} from 'lucide-react';
import { UserRole } from '../types';

export interface NavItem {
  title: string;
  path: string;
  icon: any;
  roles?: UserRole[];
}

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'User Management',
    path: '/users',
    icon: Users,
    roles: ['super_admin', 'moderator', 'support_admin'],
  },
  {
    title: 'Reel Management',
    path: '/reels',
    icon: Video,
    roles: ['super_admin', 'moderator', 'marketing_admin'],
  },
  {
    title: 'Feed Control Center',
    path: '/feed-control',
    icon: Sliders,
    roles: ['super_admin', 'marketing_admin'],
  },
  {
    title: 'Coin & Monetization',
    path: '/monetization',
    icon: Coins,
    roles: ['super_admin', 'finance_admin'],
  },
  {
    title: 'Challenges',
    path: '/challenges',
    icon: Trophy,
    roles: ['super_admin', 'marketing_admin'],
  },
  /* 
  --- HIDING DUMMY TABS FOR V1 LAUNCH ---
  {
    title: 'Security & Anti-Fraud',
    path: '/fraud',
    icon: ShieldAlert,
    roles: ['super_admin', 'moderator'],
  },
  {
    title: 'Campaigns & Notifications',
    path: '/campaigns',
    icon: Megaphone,
    roles: ['super_admin', 'marketing_admin'],
  },
  {
    title: 'Moderation Queue',
    path: '/moderation',
    icon: AlertTriangle,
    roles: ['super_admin', 'moderator'],
  },
  {
    title: 'Messaging Moderation',
    path: '/messaging',
    icon: MessageSquare,
    roles: ['super_admin', 'moderator'],
  },
  {
    title: 'Analytics & Intelligence',
    path: '/analytics',
    icon: BarChart3,
    roles: ['super_admin', 'finance_admin', 'marketing_admin'],
  },
  {
    title: 'Nearby Location Intel',
    path: '/nearby',
    icon: Map,
  },
  {
    title: 'Staff Management',
    path: '/staff',
    icon: ShieldCheck,
    roles: ['super_admin'],
  },
  {
    title: 'Customer Support',
    path: '/support',
    icon: HelpCircle,
    roles: ['super_admin', 'support_admin'],
  },
  {
    title: 'System Settings',
    path: '/settings',
    icon: Settings,
    roles: ['super_admin'],
  }
  */
];
