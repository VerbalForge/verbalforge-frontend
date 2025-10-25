'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
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
import { Logo } from '@/components/Logo';
import { LayoutDashboard, MessageCircle, HelpCircle, MessageSquare, ChevronDown, LogOut, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Redirect to login if not authenticated after loading
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin');
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
      id: 'overview', 
      name: 'Overview',
      path: '/admin',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    { 
      id: 'faqs', 
      name: 'FAQs',
      path: '/admin/faqs',
      icon: <HelpCircle className="w-4 h-4" />
    },
    { 
      id: 'support', 
      name: 'Support Tickets',
      path: '/admin/support',
      icon: <MessageCircle className="w-4 h-4" />
    },
    { 
      id: 'feedback', 
      name: 'Feedback',
      path: '/admin/feedback',
      icon: <MessageSquare className="w-4 h-4" />
    },
  ];

  // Determine page title
  const getPageTitle = () => {
    const currentItem = menuItems.find(item => pathname === item.path);
    if (currentItem) return currentItem.name;
    return 'Admin Portal';
  };

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar>
            <SidebarHeader>
              <div className="p-2 flex items-center gap-2">
                <Logo width={24} height={24} />
                <div>
                  <h1 className="text-xl font-bold">
                    VerbalForge
                  </h1>
                  <p className="text-xs text-muted-foreground">Admin Portal</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Administration</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.path}
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

              <SidebarGroup>
                <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href={`/${user.username}/dashboard`}>
                          <LayoutDashboard className="w-4 h-4" />
                          <span>My Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
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
                        <p className="text-xs text-muted-foreground truncate">Admin</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href={`/${user.username}/settings`} className="flex items-center cursor-pointer">
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
                    {getPageTitle()}
                  </h1>
                </div>
                <ThemeToggle />
              </div>
            </div>
            
            <div className="pt-4 px-6 pb-6">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
