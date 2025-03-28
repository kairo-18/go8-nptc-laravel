import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BadgePlus, BellRing, BookUser, Folder, LayoutGrid, Mail, Receipt, UserPlus, Wallet } from 'lucide-react';
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
        title: 'VR Temp Account Registration',
        url: '/vr-registration',
        icon: BadgePlus,
    },
    {
        title: 'Operator Temp Account Registration',
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
        url: '',
        icon: Receipt,
    },
    {
        title: 'Bookings',
        url: '/bookings',
        icon: Wallet,
    },
    {
        title: 'Notifications',
        url: '',
        icon: BellRing,
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

    let updatedNavItems = mainNavItems.map(item => 
        item.title === 'Dashboard' && userRole === 'Driver' 
            ? { ...item, title: 'Driver Dashboard', url: '/driver-dashboard' } 
            : item
    );

    let filteredNavItems = updatedNavItems;

    if (userRole === 'Temp User') {
        filteredNavItems = updatedNavItems
            .filter((item) => item.title === 'Registration' || item.title === 'Mail')
            .map((item) => ({
                ...item,
                url: item.title === 'Registration' ? '' : item.url, // Make Registration non-clickable
                children: item.title === 'Registration' 
                    ? item.children?.filter((child) => child.title === 'VR Registration') 
                    : item.children,
            }));
    } else if (userRole === 'Temp User Operator') {
        filteredNavItems = updatedNavItems
            .filter((item) => item.title === 'Registration' || item.title === 'Mail')
            .map((item) => ({
                ...item,
                url: item.title === 'Registration' ? '' : item.url, // Make Registration non-clickable
                children: item.title === 'Registration' 
                    ? item.children?.filter((child) => child.title === 'Operator Registration') 
                    : item.children,
            }));
    } else if (userRole === 'VR Admin') {
        const allowedItems = [
            'Dashboard', // Ensuring renamed Dashboard stays accessible
            'Pending',
            'Operator Temp Account Registration',
            'Records',
            'Billings',
            'Bookings',
            'Mail',
            'Notifications',
        ];
        filteredNavItems = updatedNavItems.filter((item) => allowedItems.includes(item.title));
    }else if (userRole === 'Operator') {
        const allowedItems = [
            'Dashboard', 
            'Registration',
            'Records',
            'Billings',
            'Bookings',
            'Mail',
            'Notifications',
        ];
    
        filteredNavItems = updatedNavItems
            .filter((item) => allowedItems.includes(item.title))
            .map((item) => {
                if (item.title === 'Registration' && item.children) {
                    return {
                        ...item,
                        children: item.children.filter(child => child.title === 'Unit Registration'),
                    };
                }
                return item;
            });
    }else if (userRole === 'Driver') {
        const allowedItems = [
            'Driver Dashboard',
            'Records',
            'Bookings',
            'Mail',
        ];
        filteredNavItems = updatedNavItems.filter((item) => allowedItems.includes(item.title));
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
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
                <NavMain items={filteredNavItems} currentPath={url} />
            </SidebarContent>

            <SidebarFooter className="text-white border border-white hover:border-red-700 hover:bg-white hover:text-blue-900 rounded-2xl">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
