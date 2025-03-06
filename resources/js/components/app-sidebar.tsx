import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BadgePlus, BookUser, Folder, LayoutGrid, Mail, Receipt, UserPlus, Wallet } from 'lucide-react';
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
        title: 'VR Registration',
        url: '/vr-registration',
        icon: BadgePlus,
    },
    {
        title: 'Registration',
        url: '/registration',
        icon: UserPlus,
    },
    {
        title: 'Pending',
        url: '/pending',
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
    const { props } = usePage();
    const userRole = props.auth.user?.roles?.[0]?.name;

    const filteredNavItems = userRole === 'Temp User' ? mainNavItems.filter((item) => item.title === 'Registration') : mainNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="text-white">
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="text-white">
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter className="text-white">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
