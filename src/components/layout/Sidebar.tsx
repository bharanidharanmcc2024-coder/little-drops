import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  UserPlus,
  FileText,
  Heart,
  Search,
  Users,
  LogOut,
  Settings,
  Crown,
  Shield,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['staff', 'trustee', 'founder'] },
  { name: 'New Admission', href: '/admission', icon: UserPlus, roles: ['staff', 'trustee', 'founder'] },
  { name: 'Death Registration', href: '/death', icon: FileText, roles: ['staff', 'trustee', 'founder'] },
  { name: 'Health Records', href: '/health', icon: Heart, roles: ['staff', 'trustee', 'founder'] },
  { name: 'Search Patients', href: '/search', icon: Search, roles: ['staff', 'trustee', 'founder'] },
  { name: 'User Management', href: '/users', icon: Users, roles: ['founder'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['founder'] },
];

const roleIcons = {
  staff: User,
  trustee: Shield,
  founder: Crown,
};

const roleLabels = {
  staff: 'Staff Member',
  trustee: 'Trustee',
  founder: 'Founder',
};

export default function Sidebar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const RoleIcon = roleIcons[user.role];
  const filteredNav = navigation.filter((item) => item.roles.includes(user.role));

  return (
    <div className="flex flex-col h-full w-64 bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sidebar-foreground">LITTLE DROPS</h1>
            <p className="text-xs text-sidebar-foreground/60">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'sidebar-item',
                  isActive && 'sidebar-item-active'
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-sidebar-accent/50">
          <div className="w-10 h-10 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
            <RoleIcon className="w-5 h-5 text-sidebar-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/60">{roleLabels[user.role]}</p>
            {user.isHigherAuthority && (
              <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium bg-sidebar-primary/20 text-sidebar-primary rounded mt-1">
                Higher Authority
              </span>
            )}
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
