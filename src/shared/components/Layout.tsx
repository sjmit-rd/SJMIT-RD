'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Menu, X, Settings, Home, Building2, LayoutGrid, Activity, LogOut, Search, User as UserIcon, Users, LayoutDashboard, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../utils/cn';
import { useAuth } from '../../app/providers/AuthProvider';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';


function GlobalSearch() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/infrastructure?focusSearch=true');
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center p-2.5 rounded-full text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 focus:outline-none transition-colors"
      aria-label="Search"
    >
      <Search className="h-5 w-5" />
    </button>
  );
}

function ProfileMenu() {
  const { user, isAdmin, logout, loading } = useAuth();
  const router = useRouter();

  if (loading || !user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : '?';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-brand-start focus:ring-offset-2 focus:ring-offset-background dark:focus:ring-offset-[#0a0c10] transition-transform hover:scale-110 active:scale-100">
          <Avatar className="h-11 w-11 border-2 border-transparent group-hover:border-brand-start transition-colors">
            {user.photoURL ? (
              <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
            ) : (
              <AvatarFallback className="bg-slate-200 dark:bg-white/10 font-bold text-lg text-slate-600 dark:text-slate-300">{userInitial}</AvatarFallback>
            )}
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-[280px] max-w-sm p-2 mt-2">
        <DropdownMenuLabel className='font-normal p-3'>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              {user.photoURL ? <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} /> : <AvatarFallback>{userInitial}</AvatarFallback>}
            </Avatar>
            <div className="flex flex-col space-y-1 min-w-0 flex-1">
              <p className="text-sm font-bold leading-tight text-slate-900 dark:text-white break-all">{user.displayName || user.email}</p>
              <p className="text-xs leading-none text-slate-500 dark:text-slate-400">
                {isAdmin ? 'Administrator' : 'User'}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin && (
          <DropdownMenuItem onSelect={() => router.push('/docs')} className="font-medium cursor-pointer">
            <HelpCircle className="mr-2 h-4 w-4 text-brand-start" />
            <span>Admin Help & Docs</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={handleLogout} className="text-rose-500 dark:text-rose-500 focus:bg-rose-500/10 focus:text-rose-600 dark:focus:text-rose-400 font-bold cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAdmin, loading } = useAuth();
  const activeAdminTab = searchParams.get('tab') || 'dashboard';

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Departments', href: '/departments', icon: Building2 },
    { name: 'Facilities', href: '/facilities', icon: LayoutGrid },
    { name: 'Services', href: '/services', icon: Activity },
  ];

  const adminNavItems = [
    { name: 'Dashboard', href: '/admin?tab=dashboard', icon: LayoutDashboard, tab: 'dashboard' },
    { name: 'Departments', href: '/admin?tab=department', icon: Users, tab: 'department' },
    { name: 'Facilities', href: '/admin?tab=facility', icon: Building2, tab: 'facility' },
    { name: 'Services', href: '/admin?tab=service', icon: Activity, tab: 'service' },
  ];

  const isViewingAdmin = pathname.startsWith('/admin');

  return (
    <header className="glass-nav h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <img src="https://sjmit.ac.in/wp-content/themes/sjmit/img/sjmit-logo.png" alt="SJMIT Logo" className="h-12 w-12 object-contain group-hover:scale-110 transition-transform" />
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center justify-center p-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full">
          {(isViewingAdmin && isAdmin ? adminNavItems : navItems).map((item) => {
            const isActive = isViewingAdmin
              ? activeAdminTab === (item as typeof adminNavItems[0]).tab
              : pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2',
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                )}
              >
                {isViewingAdmin && <item.icon size={14} />}
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <GlobalSearch />
          <div className="hidden sm:block">
            <ThemeSwitcher />
          </div>
          <ProfileMenu />
          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button
                  className="inline-flex items-center justify-center p-2.5 rounded-full text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 focus:outline-none transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0 border-r-0 bg-white/80 dark:bg-[#0a0c10]/80 backdrop-blur-xl">
                <SheetTitle className="sr-only">Main Menu</SheetTitle>
                <div className="p-6 pt-12 h-full overflow-y-auto">
                  <div className="flex items-center mb-10">
                    <img src="https://sjmit.ac.in/wp-content/themes/sjmit/img/sjmit-logo.png" alt="SJMIT Logo" className="h-12 w-12 object-contain" />
                  </div>
                  <div className="space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'block px-4 py-3 rounded-xl text-base font-bold flex items-center space-x-3',
                          pathname === item.href && !isViewingAdmin
                            ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-brand-start'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-950 dark:hover:text-white'
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    )
                    )}
                  </div>
                  {!loading && isAdmin && (
                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
                      <p className="px-4 mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Admin</p>
                      <div className="space-y-1">
                        {adminNavItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              'block px-4 py-3 rounded-xl text-base font-bold flex items-center space-x-3',
                              isViewingAdmin && activeAdminTab === item.tab
                                ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-brand-start'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-950 dark:hover:text-white'
                            )}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 sm:hidden">
                    <p className="px-4 mb-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Appearance</p>
                    <div className="px-4">
                      <ThemeSwitcher />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const pathname = usePathname();
  const isViewingAdmin = pathname.startsWith('/admin');

  const { user, isAdmin, loading } = useAuth();
  const adminLinkHref = !loading && user && isAdmin ? '/admin' : '/login';

  return (
    <footer className="bg-slate-50 dark:bg-[#0a0c10] border-t border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 py-12 mt-auto relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-start space-x-4 mb-6">
              <img src="https://sjmit.ac.in/wp-content/themes/sjmit/img/sjmit-logo.png" alt="SJMIT Logo" className="h-16 w-16 object-contain flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">S J M Vidyapeetha's</h3>
                <h2 className="font-bold text-2xl text-slate-900 dark:text-white tracking-tight leading-tight">SJM INSTITUTE OF TECHNOLOGY</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">(Recognised by AICTE, New Delhi & Affiliated to Visvesvaraya Technological University, Belagavi)</p>
              </div>
            </div>
            <address className="text-sm leading-relaxed font-medium not-italic">
              NH-4 Bypass, P.B No:73, Chitradurga - 577502, Karnataka State, India.
              <br />
              <a href="mailto:rnd@sjmit.ac.in" className="text-slate-950 dark:text-slate-100 font-bold hover:text-brand-start transition-colors">rnd@sjmit.ac.in</a>
            </address>
          </div>
          <div>
            <h3 className="text-slate-950 dark:text-white text-sm font-bold uppercase tracking-widest mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/" className="hover:text-blue-700 dark:hover:text-brand-start transition-colors">Home</Link></li>
              <li><Link href="/departments" className="hover:text-blue-700 dark:hover:text-brand-start transition-colors">Departments</Link></li>
              <li><Link href="/facilities" className="hover:text-blue-700 dark:hover:text-brand-start transition-colors">Facilities</Link></li>
              <li><Link href="/services" className="hover:text-blue-700 dark:hover:text-brand-start transition-colors">Services</Link></li>
              {!loading && isAdmin && (
                <li><Link href="/docs" className="hover:text-blue-700 dark:hover:text-brand-start transition-colors">Admin Guide</Link></li>
              )}
              {!isViewingAdmin && (
                <li><Link href={adminLinkHref} className="hover:text-blue-700 dark:hover:text-brand-start transition-colors">Admin Login</Link></li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold">
          <p>&copy; {new Date().getFullYear()} SJMIT R&D Center. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-950 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-950 dark:hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0c10]">
      <React.Suspense fallback={<header className="glass-nav h-20" />}>
        <Navbar />
      </React.Suspense>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
