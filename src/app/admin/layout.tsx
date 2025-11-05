'use client';

import { useEffect, useState } from 'react';
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
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { 
  LayoutDashboard, 
  MessageCircle, 
  HelpCircle, 
  MessageSquare, 
  ChevronDown, 
  LogOut, 
  Settings,
  FileQuestion,
  FileText,
  Users,
  BookOpen,
  User,
  Plus,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

// Create a context for the add button action
import { createContext, useContext } from 'react';

const AddButtonContext = createContext<{
  onAddClick: (() => void) | null;
  setOnAddClick: (callback: (() => void) | null) => void;
}>({
  onAddClick: null,
  setOnAddClick: () => {},
});

export const useAddButton = () => useContext(AddButtonContext);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [onAddClick, setOnAddClick] = useState<(() => void) | null>(null);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Redirect to login if not authenticated after loading
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin');
    }
    // Redirect non-admin users to their dashboard
    if (!loading && user && !user.isAdmin) {
      router.push(`/${user.username}/dashboard`);
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

  // Don't render anything if redirecting (not authenticated or not admin)
  if (!user || !user.isAdmin) {
    return null;
  }

  const menuItems = [
    { 
      id: 'overview', 
      name: 'Overview',
      path: '/admin',
      icon: <LayoutDashboard className="w-4 h-4" />,
      group: null // Outside all groups
    },
    // Content Management
    { 
      id: 'questions', 
      name: 'Questions',
      path: '/admin/questions',
      icon: <FileQuestion className="w-4 h-4" />,
      group: 'content'
    },
    { 
      id: 'passages', 
      name: 'Passages',
      path: '/admin/passages',
      icon: <FileText className="w-4 h-4" />,
      group: 'content'
    },
    { 
      id: 'words', 
      name: 'Words',
      path: '/admin/words',
      icon: <BookOpen className="w-4 h-4" />,
      group: 'content'
    },
    // Community & Interaction
    { 
      id: 'discussions', 
      name: 'Discussions',
      path: '/admin/discussions',
      icon: <MessageSquare className="w-4 h-4" />,
      group: 'community'
    },
    { 
      id: 'faqs', 
      name: 'FAQs',
      path: '/admin/faqs',
      icon: <HelpCircle className="w-4 h-4" />,
      group: 'community'
    },
    { 
      id: 'feedback', 
      name: 'Feedback',
      path: '/admin/feedback',
      icon: <MessageSquare className="w-4 h-4" />,
      group: 'community'
    },
    // User & Support
    { 
      id: 'users', 
      name: 'User Analytics',
      path: '/admin/users',
      icon: <Users className="w-4 h-4" />,
      group: 'support'
    },
    { 
      id: 'support', 
      name: 'Support Tickets',
      path: '/admin/support',
      icon: <MessageCircle className="w-4 h-4" />,
      group: 'support'
    },
  ];

  // Determine page title
  const getPageTitle = () => {
    // Check for exact match first
    const currentItem = menuItems.find(item => pathname === item.path);
    if (currentItem) return currentItem.name;
    
    // Check for dynamic routes
    if (pathname.startsWith('/admin/passages/')) return 'Edit Passage';
    if (pathname.startsWith('/admin/questions/')) return 'Edit Question';
    if (pathname.startsWith('/admin/discussions/')) return 'Discussion Details';
    if (pathname.startsWith('/admin/users/')) return 'User Details';
    if (pathname.startsWith('/admin/words/')) return 'Edit Word';
    if (pathname.startsWith('/admin/faqs/')) return 'Edit FAQ';
    if (pathname.startsWith('/admin/support/')) return 'Support Ticket Details';
    if (pathname.startsWith('/admin/feedback/')) return 'Feedback Details';
    
    return 'Admin Portal';
  };

  // Determine if add button should be shown
  const showAddButton = () => {
    return pathname === '/admin/words' || 
           pathname === '/admin/questions' || 
           pathname === '/admin/passages' ||
           pathname === '/admin/faqs';
  };

  return (
    <ProtectedRoute>
      <AddButtonContext.Provider value={{ onAddClick, setOnAddClick }}>
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
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="gap-1">
              {/* Overview - Outside all groups */}
              <SidebarGroup className="p-2 py-0">
                <SidebarGroupContent>
                  <SidebarMenu className='gap-0'>
                    {menuItems
                      .filter(item => item.group === null)
                      .map((item) => (
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

              {/* Content Management */}
              <SidebarGroup className="p-2 py-0">
                <SidebarGroupLabel>Content Management</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className='gap-0'>
                    {menuItems
                      .filter(item => item.group === 'content')
                      .map((item) => (
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

              {/* Community & Interaction */}
              <SidebarGroup className="p-2 py-0">
                <SidebarGroupLabel>Community & Interaction</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className='gap-0'>
                    {menuItems
                      .filter(item => item.group === 'community')
                      .map((item) => (
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

              {/* User & Support */}
              <SidebarGroup className="p-2 py-1">
                <SidebarGroupLabel>User & Support</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems
                      .filter(item => item.group === 'support')
                      .map((item) => (
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

              {/* User Portal */}
              <SidebarGroup className="p-2 py-1">
                <SidebarGroupLabel>User Portal</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href={`/${user.username}/dashboard`} prefetch={true}>
                          <User className="w-4 h-4" />
                          <span>Back to Dashboard</span>
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
                  {getPageTitle() && (
                    <h1 className="text-xl font-semibold">
                      {getPageTitle()}
                    </h1>
                  )}
                </div>
                {showAddButton() && onAddClick && (
                  <Button onClick={onAddClick} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
                <ThemeToggle />
              </div>
            </div>
            
            <div className="pt-4 px-6 pb-6">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
      </AddButtonContext.Provider>
    </ProtectedRoute>
  );
}
