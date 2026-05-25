export type RoleType = 'farmer' | 'business' | 'salesman' | 'admin';

export interface DashboardBranding {
  title: string;
  subtitle: string;
  badgeText: string;
  themeColor: 'primary' | 'blue' | 'accent' | 'gray';
}

export const roleConfig: Record<RoleType, DashboardBranding> = {
  farmer: {
    title: 'Customer Farmer Dashboard',
    subtitle: 'Register/login, live mandi prices, weather forecast, soil-based crop recommendation, image quality check, price suggestion, sell listings, and government schemes.',
    badgeText: 'FARMER',
    themeColor: 'primary'
  },
  business: {
    title: 'Enterprise Procurement Portal',
    subtitle: 'Operations view for procurement teams to manage listings, bids, deals, transport and payments.',
    badgeText: 'BUSINESS',
    themeColor: 'blue'
  },
  salesman: {
    title: 'Salesman Trader Dashboard',
    subtitle: 'View farmer listings, filter by crop/quality/price, place offers, accept deals, track transport, and manage payments.',
    badgeText: 'SALESMAN',
    themeColor: 'blue'
  },
  admin: {
    title: 'Admin Control Center',
    subtitle: 'Verify users, manage listings, monitor transactions, publish schemes, analytics dashboard, and fraud detection.',
    badgeText: 'ADMIN',
    themeColor: 'gray'
  }
};

export const defaultBranding: DashboardBranding = {
  title: 'One-to-One Agricultural Portal',
  subtitle: 'Connecting farmers with markets through intelligent technology.',
  badgeText: '🌐 Live Portal',
  themeColor: 'primary'
};
