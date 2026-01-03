'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/context/AuthContext';
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '../../components/ui/sidebar';
import {
  LayoutDashboard,
  Smartphone,
  Wallet,
  FileText,
  DollarSign,
  MessageSquare,
  User,
  LogOut,
  ChevronRight,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized, logout, userData } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Recharge',
      url: '/recharge',
      icon: Smartphone,
    },
    {
      title: 'Wallet',
      url: '/wallet',
      icon: Wallet,
    },
    {
      title: 'Reports',
      icon: FileText,
      items: [
        {
          title: 'Recharge Reports',
          url: '/reports/recharge',
        },
        {
          title: 'Fund Reports',
          url: '/reports/fund',
        },
        {
          title: 'Account Reports',
          url: '/reports/account',
        },
      ],
    },
    {
      title: 'Fund Request',
      url: '/fund-request',
      icon: DollarSign,
    },
    {
      title: 'Complaints',
      url: '/complaints',
      icon: MessageSquare,
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: User,
    },
  ];

  const isReportsActive = pathname?.startsWith('/reports');
  
  // Initialize dropdown state based on current pathname
  useEffect(() => {
    if (isReportsActive) {
      setOpenDropdowns((prev) => ({ ...prev, Reports: true }));
    }
  }, [isReportsActive]);

  const toggleDropdown = (title: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isDropdownOpen = (title: string) => openDropdowns[title] ?? false;

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-2 px-3 md:px-4 py-2.5 md:py-3">
            <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shrink-0">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base md:text-lg font-bold text-gray-900 truncate">Payshati</span>
              <span className="text-xs text-gray-500 truncate hidden group-data-[collapsible=icon]:hidden">Recharge Platform</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const hasItems = item.items && item.items.length > 0;
                  const dropdownOpen = hasItems ? isDropdownOpen(item.title) : false;
                  const isItemActive = hasItems 
                    ? isReportsActive 
                    : pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      {hasItems ? (
                        <>
                          <SidebarMenuButton
                            isActive={isItemActive}
                            tooltip={item.title}
                            onClick={() => toggleDropdown(item.title)}
                            className="cursor-pointer"
                          >
                            <item.icon />
                            <span>{item.title}</span>
                            {dropdownOpen ? (
                              <ChevronDown className="ml-auto transition-transform duration-200" />
                            ) : (
                              <ChevronRight className="ml-auto transition-transform duration-200" />
                            )}
                          </SidebarMenuButton>
                          {dropdownOpen && (
                            <SidebarMenuSub>
                              {item.items!.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={pathname === subItem.url}
                                  >
                                    <Link href={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          )}
                        </>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          isActive={isItemActive}
                          tooltip={item.title}
                        >
                          <Link href={item.url!}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t">
          <div className="p-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="w-4 h-4" />
              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 md:h-16 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-sm px-3 md:px-4">
          <SidebarTrigger className="-ml-1 size-7 md:size-8" />
          <div className="flex-1" />
          {userData && (
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
              <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-100">
                <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
              </div>
              <span className="font-medium hidden sm:inline">{userData.name || 'User'}</span>
            </div>
          )}
        </header>
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
