'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '../../lib/context/AdminAuthContext';
import Link from 'next/link';
import Image from 'next/image';
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
  Settings,
  FileText,
  Users,
  DollarSign,
  BarChart3,
  Building2,
  HelpCircle,
  User,
  LogOut,
  ChevronRight,
  ChevronDown,
  CreditCard,
  Smartphone,
  Server,
  MapPin,
  Banknote,
  Ban,
  RefreshCw,
  Globe,
  UserCog,
  Megaphone,
  Image as ImageIcon,
  Shield,
  Plug,
  List,
  MessageSquare,
  Inbox,
  TrendingUp,
  FileBarChart,
  ClipboardList,
  Building,
  Mail,
  MessageCircle,
  Route,
  ClipboardCheck,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized, logout, userData } = useAdminAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Only redirect after initialization is complete and not on login page
    if (isInitialized && !isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isInitialized, isAuthenticated, pathname, router]);

  // Show loading spinner while initializing
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Always allow login page to render
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show loading while redirecting to login
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'System Management',
      icon: Settings,
      items: [
        { title: 'Schemes', url: '/admin/system/schemes', icon: FileText },
        { title: 'Providers', url: '/admin/system/providers', icon: Smartphone },
        { title: 'Services', url: '/admin/system/services', icon: Server },
        { title: 'States', url: '/admin/system/states', icon: MapPin },
        { title: 'Banks', url: '/admin/system/banks', icon: Banknote },
        { title: 'Amount Block', url: '/admin/system/amount-block', icon: Ban },
        { title: 'Amount-wise Switch', url: '/admin/system/amount-wise-switch', icon: RefreshCw },
        { title: 'State-wise Switch', url: '/admin/system/state-wise-switch', icon: Globe },
        { title: 'User-wise Switch', url: '/admin/system/user-wise-switch', icon: UserCog },
        { title: 'Announcement', url: '/admin/system/announcement', icon: Megaphone },
        { title: 'Slider', url: '/admin/system/slider', icon: ImageIcon },
        { title: 'Role', url: '/admin/system/role', icon: Shield },
        { title: 'APIs', url: '/admin/system/apis', icon: Plug },
      ],
    },
    {
      title: 'User Management',
      icon: Users,
      items: [
        { title: 'User List', url: '/admin/users/userlist', icon: List },
        { title: 'Send Message', url: '/admin/users/send-message', icon: MessageSquare },
      ],
    },
    {
      title: 'Fund Management',
      icon: DollarSign,
      items: [
        { title: 'Fund Request', url: '/admin/fund/fund-request', icon: Inbox },
        { title: 'Fund Report', url: '/admin/fund/fund-report', icon: FileBarChart },
      ],
    },
    {
      title: 'Reports',
      icon: BarChart3,
      items: [
        { title: 'Account Report', url: '/admin/reports/account-report', icon: CreditCard },
        { title: 'Recharge Report', url: '/admin/reports/recharge-report', icon: Smartphone },
        { title: 'Admin Reports', url: '/admin/reports/admin-reports', icon: TrendingUp },
      ],
    },
    {
      title: 'Company Settings',
      icon: Building2,
      items: [
        { title: 'Manage Company', url: '/admin/company/manage-company', icon: Building },
        { title: 'Email Template', url: '/admin/company/email-template', icon: Mail },
        { title: 'SMS Template', url: '/admin/company/sms-template', icon: MessageCircle },
        { title: 'Routes Settings', url: '/admin/company/routes-settings', icon: Route },
      ],
    },
    {
      title: 'Support',
      icon: HelpCircle,
      items: [
        { title: 'Complaint', url: '/admin/support/complaint', icon: ClipboardCheck },
        { title: 'My Profile', url: '/admin/profile', icon: User },
      ],
    },
  ];

  // Initialize dropdown states based on pathname
  useEffect(() => {
    const navItemsList = [
      'System Management',
      'User Management',
      'Fund Management',
      'Reports',
      'Company Settings',
      'Support',
    ];
    
    navItemsList.forEach((title) => {
      const item = navItems.find((i) => i.title === title);
      if (item?.items) {
        const isActive = item.items.some(
          (subItem) => pathname === subItem.url || pathname.startsWith(subItem.url + '/')
        );
        if (isActive) {
          setOpenDropdowns((prev) => ({ ...prev, [title]: true }));
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleDropdown = (title: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isDropdownOpen = (title: string) => openDropdowns[title] ?? false;

  const isItemActive = (item: typeof navItems[0]) => {
    if (item.items) {
      return item.items.some(
        (subItem) => pathname === subItem.url || pathname.startsWith(subItem.url + '/')
      );
    }
    return pathname === item.url || pathname.startsWith(item.url + '/');
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-2 px-3 md:px-4 py-2.5 md:py-3">
            <Image
              src="/logo-black.png"
              alt="Payshati Admin Logo"
              width={100}
              height={80}
              className="h-6 w-auto shrink-0"
              priority
            />
            {/* <div className="flex flex-col min-w-0">
              <span className="text-base md:text-lg font-bold text-gray-900 truncate">
                Payshati Admin
              </span>
              <span className="text-xs text-gray-500 truncate hidden group-data-[collapsible=icon]:hidden">
                Admin Panel
              </span>
            </div> */}
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
                  const itemActive = isItemActive(item);

                  return (
                    <SidebarMenuItem key={item.title}>
                      {hasItems ? (
                        <>
                          <SidebarMenuButton
                            isActive={itemActive}
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
                              {item.items!.map((subItem) => {
                                const subActive =
                                  pathname === subItem.url || pathname.startsWith(subItem.url + '/');
                                return (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={subActive}
                                    >
                                      <Link href={subItem.url}>
                                        <subItem.icon className="w-4 h-4" />
                                        <span>{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                );
                              })}
                            </SidebarMenuSub>
                          )}
                        </>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          isActive={itemActive}
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
              <span className="font-medium hidden sm:inline">
                {userData.name || 'Admin'}
              </span>
              <Link
                href="/admin/profile"
                className="hidden sm:inline-block px-3 py-1.5 text-xs md:text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                Profile
              </Link>
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}
