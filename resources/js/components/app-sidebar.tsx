import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, BookUser, Folder, LayoutGrid, Mail, Receipt, UserPlus, Wallet } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'NPTC Admins',
        url: '/nptc-admins',
        icon: Folder,
    },
    {
        title: 'Registration',
        url: '/create-vr-company-page',
        icon: UserPlus,
    },
    {
        title: 'Records',
        url: '/vr-owner', // Route where VR Owners list will be displayed
        icon: BookUser, // Icon representing "Records"
    },
    {
        title: 'Billings',
        url: '', // Route 
        icon: Receipt, 
    },
    {
        title: 'Bookings',
        url: '', // Route 
        icon: Wallet, 
    },
    {
        title: 'Notifications',
        url: '', // Route 
        icon: Mail, 
    },
];



export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className='text-white'>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="text-white">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className='text-white'>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
