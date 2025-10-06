'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { BarChart3, ClipboardCheck, MessageCircle, Trophy, ChevronDown, LogOut, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { PracticeTimer } from '@/components/PracticeTimer';

export default function UsernameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const username = params.username as string;

  // Verify username matches logged-in user
  useEffect(() => {
    if (user && username !== user.username) {
      router.push(`/${user.username}/dashboard`);
    }
  }, [user, username, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Redirect to login if not authenticated after loading
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  // Show loading state only while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Don't render anything if redirecting
  if (!user) {
    return null;
  }

  const menuItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard',
      path: `/${username}/dashboard`,
      icon: <BarChart3 className="w-4 h-4" />
    },
    { 
      id: 'practice', 
      name: 'Practice',
      path: `/${username}/practice`,
      icon: <ClipboardCheck className="w-4 h-4" />
    },
    { 
      id: 'discuss', 
      name: 'Discuss',
      path: `/${username}/discuss`,
      icon: <MessageCircle className="w-4 h-4" />
    },
    { 
      id: 'leaderboard', 
      name: 'Leaderboard',
      path: `/${username}/leaderboard`,
      icon: <Trophy className="w-4 h-4" />
    },
  ];

  // Find current page
  const currentPage = menuItems.find(item => 
    pathname === item.path || pathname.startsWith(item.path + '/')
  );

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar>
            <SidebarHeader>
              <div className="p-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  VerbalForge
                </h1>
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Platform</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.path || pathname.startsWith(item.path + '/')}
                        >
                          <Link href={item.path}>
                            {item.icon}
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter>
              <div className="p-2 space-y-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 px-2 w-full rounded-md hover:bg-accent transition-colors cursor-pointer">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href={`/${username}/settings`} className="flex items-center cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SidebarFooter>
          </Sidebar>
          
          <main className="flex-1">
            <div className="sticky top-0 z-10 bg-background border-b">
              <div className="flex items-center h-16 px-6 gap-4">
                <SidebarTrigger />
                <div className="flex-1">
                  <h1 className="text-xl font-semibold">
                    {currentPage?.name || 'VerbalForge'}
                  </h1>
                </div>
                <PracticeTimer />
                <ThemeToggle />
              </div>
            </div>
            
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
