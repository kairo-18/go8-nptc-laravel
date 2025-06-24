// src/components/AppSidebar.tsx
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { getBackgroundColorForRole } from '@/components/UtilsColor';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BadgePlus, BookUser, Folder, LayoutGrid, Mail, Receipt, UserPlus, Wallet } from 'lucide-react';
import AppLogo from './app-logo';

// Import the useUnreadCount hook
import { useUnreadCount } from '@/pages/UnreadCountContext';

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
        title: 'Register Temp VR',
        url: '/vr-registration',
        icon: BadgePlus,
    },
    {
        title: 'Register Temp Operator',
        url: '/op-registration',
        icon: BadgePlus,
    },
    {
        title: 'Registration',
        url: '/registration',
        icon: UserPlus,
        children: [
            {
                title: 'VR Registration',
                url: '/registration',
            },
            {
                title: 'Operator Registration',
                url: '/create-operator',
            },
            {
                title: 'Unit Registration',
                url: '/unit-registration',
            },
        ],
    },
    {
        title: 'Pending',
        url: '/pending',
        icon: UserPlus,
    },
    {
        title: 'Records',
        url: '/vr-owner',
        icon: BookUser,
    },
    {
        title: 'Billings',
        url: '/billings',
        icon: Receipt,
    },
    {
        title: 'Bookings',
        url: '/bookings',
        icon: Wallet,
    },
    {
        title: 'Mail',
        url: '/mails',
        icon: Mail,
    },
];

export function AppSidebar() {
    const { props, url } = usePage();
    const userRole = props.auth.user?.roles?.[0]?.name;

    const status = props.auth.Status || '';

    // Use the unread count from the context
    const { totalUnreadCount } = useUnreadCount(); // Access the unread count from context

    const updatedNavItems = mainNavItems.map((item) =>
        item.title === 'Dashboard' && userRole === 'Driver' ? { ...item, title: 'Driver Dashboard', url: '/driver-dashboard' } : item,
    );

    let filteredNavItems = updatedNavItems;

    if (status !== 'Approved' && userRole !== 'NPTC Admin' && userRole !== 'NPTC Super Admin') {
        const allowedItems = ['Mail'];
        if (status === 'For Vehicle Registration') {
            filteredNavItems = updatedNavItems
                .filter((item) => item.title === 'Registration' || item.title === 'Mail')
                .map((item) => ({
                    ...item,
                    url: item.title === 'Registration' ? '' : item.url,
                    children: item.title === 'Registration' ? item.children?.filter((child) => child.title === 'Unit Registration') : item.children,
                }));
        } else {
            filteredNavItems = updatedNavItems.filter((item) => allowedItems.includes(item.title));
        }
    } else {
        if (userRole === 'Temp User') {
            filteredNavItems = updatedNavItems
                .filter((item) => item.title === 'Registration' || item.title === 'Mail')
                .map((item) => ({
                    ...item,
                    url: item.title === 'Registration' ? '' : item.url,
                    children: item.title === 'Registration' ? item.children?.filter((child) => child.title === 'VR Registration') : item.children,
                }));
        } else if (userRole === 'Temp User Operator') {
            filteredNavItems = updatedNavItems
                .filter((item) => item.title === 'Registration' || item.title === 'Mail')
                .map((item) => ({
                    ...item,
                    url: item.title === 'Registration' ? '' : item.url,
                    children:
                        item.title === 'Registration' ? item.children?.filter((child) => child.title === 'Operator Registration') : item.children,
                }));
        } else if (userRole === 'VR Admin') {
            const allowedItems = ['Dashboard', 'Pending', 'Operator Temp Account Registration', 'Records', 'Billings', 'Bookings', 'Mail'];
            filteredNavItems = updatedNavItems.filter((item) => allowedItems.includes(item.title));
        } else if (userRole === 'Operator') {
            const allowedItems = ['Dashboard', 'Registration', 'Records', 'Billings', 'Bookings', 'Mail'];

            filteredNavItems = updatedNavItems
                .filter((item) => allowedItems.includes(item.title))
                .map((item) => {
                    if (item.title === 'Registration' && item.children) {
                        return {
                            ...item,
                            children: item.children.filter((child) => child.title === 'Unit Registration'),
                        };
                    }
                    return item;
                });
        } else if (userRole === 'Driver') {
            const allowedItems = ['Driver Dashboard', 'Records', 'Bookings', 'Mail'];
            filteredNavItems = updatedNavItems.filter((item) => allowedItems.includes(item.title));
        }
    }

    const sidebarBgColor = getBackgroundColorForRole(userRole);

    return (
        <Sidebar collapsible="icon" variant="inset" className={sidebarBgColor}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="text-white">
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={userRole === 'Driver' ? '/driver-dashboard' : '/dashboard'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="text-white">
                <NavMain items={filteredNavItems} currentPath={url} userRole={userRole} totalUnreadCount={totalUnreadCount} />
            </SidebarContent>

            <SidebarFooter className="group transform rounded-2xl border border-white/50 text-white shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-white hover:bg-white/20 hover:text-white hover:shadow-xl">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
