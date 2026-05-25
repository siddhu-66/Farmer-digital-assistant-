import { Sprout, CloudSun, ShoppingBag, User, LayoutDashboard, Recycle, BrainCircuit, ShieldCheck, FileCheck, PlusCircle, BarChart3, Truck, Settings, Users, ClipboardList, Package
} from 'lucide-react';
export const getMenuItems = (role: string | null) => {
  if (role === 'admin') {
    return [
      { icon: ShieldCheck, labelKey: 'adminDashboard.sidebar.dashboard', href: '/admin' },
      { icon: Users, labelKey: 'adminDashboard.sidebar.users', href: '/admin/users' },
      { icon: Truck, labelKey: 'adminDashboard.sidebar.procurements', href: '/business/procurement' },
      { icon: FileCheck, labelKey: 'adminDashboard.sidebar.verifications', href: '/admin/verifications' },
      { icon: Package, labelKey: 'adminDashboard.sidebar.sellRequests', href: '/admin/sell-requests' },
      { icon: ClipboardList, labelKey: 'adminDashboard.sidebar.orders', href: '/admin/orders' },
      { icon: Settings, labelKey: 'adminDashboard.sidebar.logs', href: '/admin/logs' },
      { icon: User, labelKey: 'sidebar.profile', href: '/profile' },
    ];
  }
  if (role === 'business' || role === 'salesman') {
    return [
      { icon: Package, labelKey: 'businessDashboard.sidebar.orders', href: '/business/orders' },
      { icon: PlusCircle, labelKey: 'businessDashboard.sidebar.post', href: '/business/post-contract' },
      { icon: BarChart3, labelKey: 'businessDashboard.sidebar.projections', href: '/business/projections' },
      { icon: Truck, labelKey: 'businessDashboard.sidebar.dispatch', href: '/business/sales/dispatch' },
      { icon: User, labelKey: 'sidebar.profile', href: '/profile' },
    ];
  }
  // Default to Customer items
  return [
    { icon: LayoutDashboard, labelKey: 'sidebar.dashboard', href: '/dashboard' },
    { icon: BrainCircuit, labelKey: 'sidebar.analytics', href: '/analytics' },
    { icon: Sprout, labelKey: 'sidebar.crops', href: '/crops' },
    { icon: Recycle, labelKey: 'sidebar.residue', href: '/residue' },
    { icon: CloudSun, labelKey: 'sidebar.weather', href: '/weather' },
    { icon: ShoppingBag, labelKey: 'sidebar.market', href: '/market' },
    { icon: User, labelKey: 'sidebar.profile', href: '/profile' },
  ];
};
