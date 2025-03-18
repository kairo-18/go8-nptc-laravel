import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BadgePlus, BookUser, Folder, LayoutGrid, Mail, Receipt, UserPlus, Wallet, BellRing } from 'lucide-react';
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
        url:'/vr-registration',
        icon:BadgePlus
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
                title: 'Driver Registration',
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
        url: '',
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
