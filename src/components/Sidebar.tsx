'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Home, User, MessageCircle, Folder, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  userName: string;
  userEmail: string;
  onLogout: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Sidebar({ 
  userName, 
  userEmail, 
  onLogout, 
  activeTab = 'overview',
  onTabChange 
}: SidebarProps) {
  const menuItems = [
    { 
      id: 'overview', 
      name: 'Overview', 
      icon: <Home className="w-5 h-5" />
    },
    { 
      id: 'profile', 
      name: 'Profile', 
      icon: <User className="w-5 h-5" />
    },
    { 
      id: 'messages', 
      name: 'Messages', 
      icon: <MessageCircle className="w-5 h-5" />,
      badge: 3
    },
    { 
      id: 'projects', 
      name: 'Projects', 
      icon: <Folder className="w-5 h-5" />
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: <Settings className="w-5 h-5" />
    },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border fixed h-full flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          VerbalForge
        </h1>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? 'default' : 'ghost'}
            className={cn(
              'w-full justify-start',
              activeTab === item.id && 'bg-primary text-primary-foreground'
            )}
            onClick={() => onTabChange?.(item.id)}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </Button>
        ))}
      </nav>

      <Separator />

      {/* User Section */}
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
