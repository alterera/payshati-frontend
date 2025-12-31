'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '../../lib/context/AdminAuthContext';
import Link from 'next/link';

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized, logout, userData } = useAdminAuth();

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

  const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    {
      label: 'System Management',
      icon: '⚙️',
      children: [
        { href: '/admin/system/schemes', label: 'Schemes', icon: '📋' },
        { href: '/admin/system/providers', label: 'Providers', icon: '📱' },
        { href: '/admin/system/services', label: 'Services', icon: '🔧' },
        { href: '/admin/system/states', label: 'States', icon: '🗺️' },
        { href: '/admin/system/banks', label: 'Banks', icon: '🏦' },
        { href: '/admin/system/amount-block', label: 'Amount Block', icon: '🚫' },
        { href: '/admin/system/amount-wise-switch', label: 'Amount-wise Switch', icon: '🔄' },
        { href: '/admin/system/state-wise-switch', label: 'State-wise Switch', icon: '🗺️' },
        { href: '/admin/system/user-wise-switch', label: 'User-wise Switch', icon: '👤' },
        { href: '/admin/system/announcement', label: 'Announcement', icon: '📢' },
        { href: '/admin/system/slider', label: 'Slider', icon: '🖼️' },
        { href: '/admin/system/role', label: 'Role', icon: '🎭' },
        { href: '/admin/system/apis', label: 'APIs', icon: '🔌' },
      ],
    },
    {
      label: 'User Management',
      icon: '👥',
      children: [
        { href: '/admin/users/userlist', label: 'User List', icon: '📝' },
        { href: '/admin/users/send-message', label: 'Send Message', icon: '💬' },
      ],
    },
    {
      label: 'Fund Management',
      icon: '💰',
      children: [
        { href: '/admin/fund/fund-request', label: 'Fund Request', icon: '📥' },
        { href: '/admin/fund/fund-report', label: 'Fund Report', icon: '📊' },
      ],
    },
    {
      label: 'Reports',
      icon: '📈',
      children: [
        { href: '/admin/reports/account-report', label: 'Account Report', icon: '💳' },
        { href: '/admin/reports/recharge-report', label: 'Recharge Report', icon: '📱' },
        { href: '/admin/reports/admin-reports', label: 'Admin Reports', icon: '📊' },
      ],
    },
    {
      label: 'Company Settings',
      icon: '🏢',
      children: [
        { href: '/admin/company/manage-company', label: 'Manage Company', icon: '🏛️' },
        { href: '/admin/company/email-template', label: 'Email Template', icon: '📧' },
        { href: '/admin/company/sms-template', label: 'SMS Template', icon: '💬' },
        { href: '/admin/company/routes-settings', label: 'Routes Settings', icon: '🛣️' },
      ],
    },
    {
      label: 'Support',
      icon: '🆘',
      children: [
        { href: '/admin/support/complaint', label: 'Complaint', icon: '📋' },
        { href: '/admin/profile', label: 'My Profile', icon: '👤' },
      ],
    },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">Payshati Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              {userData && (
                <span className="text-sm text-gray-700">
                  {userData.name || 'Admin'}
                </span>
              )}
              <Link
                href="/admin/profile"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md min-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="p-4">
            <ul className="space-y-1">
              {navLinks.map((link) => {
                if (link.children) {
                  return (
                    <li key={link.label} className="mb-2">
                      <div className="flex items-center px-4 py-2 text-gray-700 font-medium text-sm uppercase">
                        <span className="mr-2">{link.icon}</span>
                        {link.label}
                      </div>
                      <ul className="ml-4 mt-1 space-y-1">
                        {link.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={`flex items-center px-4 py-2 rounded-lg transition-colors text-sm ${
                                isActive(child.href)
                                  ? 'bg-blue-100 text-blue-700 font-medium'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <span className="mr-2">{child.icon}</span>
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                }
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        isActive(link.href)
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-2">{link.icon}</span>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
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
