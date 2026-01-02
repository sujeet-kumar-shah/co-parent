import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard,
    List,
    Users,
    LogOut,
    Home,
    Menu,
    Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const AdminLayout = () => {
    const { user, logout, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { toast } = useToast();
    useEffect(() => {
        if (!loading && (!isAuthenticated || user?.type !== 'admin')) {
            navigate('/login');
        }
    }, [user, loading, isAuthenticated, navigate]);

    if (loading) return <div>Loading...</div>; // Or a spinner component

    const handleLogout = () => {
        toast({
            title: "Logged out!",
            description: "You’ve been logged out securely. See you soon!",
        });
        logout();
        navigate('/login');
    };

    const sidebarLinks = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: List, label: 'Manage Listings', path: '/admin/listings' },
        { icon: Users, label: 'Manage Users', path: '/admin/users' },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-lg object-contain" />
                    <h1 className="text-xl font-bold font-display text-gray-900">Admin Panel</h1>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {sidebarLinks.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMobileOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`
                        }
                    >
                        <link.icon className="w-5 h-5" />
                        <span className="font-medium">{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100 space-y-2">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-gray-600 hover:text-gray-900 rounded-xl"
                    onClick={() => navigate('/')}
                >
                    <Home className="w-5 h-5" />
                    Back to Home
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50/50">
            {/* Desktop Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col fixed inset-y-0 z-30 shadow-sm">
                <SidebarContent />
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col md:pl-72 min-h-screen transition-all duration-300">
                {/* Header */}
                <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden hover:bg-gray-100">
                                    <Menu className="w-6 h-6 text-gray-600" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-72">
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>
                        <h2 className="text-lg font-semibold md:hidden text-gray-900">Admin Dashboard</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end mr-2">
                            <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
                            <span className="text-xs text-muted-foreground">Admin</span>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-transparent">
                                    <Avatar className="h-10 w-10 border border-gray-200 shadow-sm">
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
               <footer className="bg-white ">
                    <div className="container py-4">
                    {/* Bottom Bar */}
                        <div className="mt-1 pb-2  border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="  text-black text-sm">
                            © 2026 CO-PARENTS. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
            <Toaster />
        </div>
    );
};

export default AdminLayout;
