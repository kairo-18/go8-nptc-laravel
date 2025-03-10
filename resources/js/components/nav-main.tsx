import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const currentUrl = page.url; 

    const isActive = (item: NavItem) =>
        item.url === currentUrl || (item.children && item.children.some((child) => child.url === currentUrl));

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <div key={item.title}>

                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive(item)}>
                                <Link href={item.url} prefetch className="flex items-center space-x-2">
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        {item.children && isActive(item) && (
                            <div className="ml-6 border-l border-gray-500 pl-4">
                                {item.children.map((child) => (
                                    <SidebarMenuItem key={child.title} className="mt-1">
                                        <SidebarMenuButton asChild isActive={child.url === currentUrl}>
                                            <Link href={child.url} prefetch className="flex items-center space-x-2 text-sm">
                                                {child.icon && <child.icon className="w-4 h-4 opacity-75" />}
                                                <span>{child.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
