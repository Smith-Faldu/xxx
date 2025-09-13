import React from 'react';
import { cn } from './ui/utils';
import { 
  LayoutDashboard, 
  Upload, 
  History, 
  MessageSquare, 
  User, 
  LogOut 
} from 'lucide-react';

type Page = 'dashboard' | 'upload' | 'analysis' | 'chat' | 'profile';

interface RouteParams {
  id?: string;
}

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page, params?: RouteParams) => void;
}

const navigation = [
  { name: 'Dashboard', href: 'dashboard', icon: LayoutDashboard },
  { name: 'Upload', href: 'upload', icon: Upload },
  { name: 'History', href: 'dashboard', icon: History },
  { name: 'Chat', href: 'chat', icon: MessageSquare },
  { name: 'Profile', href: 'profile', icon: User },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <div className="fixed left-0 top-16 bottom-0 w-64 bg-background/80 backdrop-blur-md border-r border-border z-40">
      <div className="flex flex-col h-full p-4">
        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const isActive = currentPage === item.href;
            return (
              <button
                key={item.name}
                onClick={() => onNavigate(item.href as Page)}
                className={cn(
                  'w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-600 border border-blue-200/50 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <item.icon className={cn('w-5 h-5', isActive ? 'text-blue-600' : '')} />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground px-3 py-2">
            Legal Lens v1.0
          </div>
        </div>
      </div>
    </div>
  );
}