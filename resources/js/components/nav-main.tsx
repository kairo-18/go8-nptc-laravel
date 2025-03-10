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
    const currentUrl = page.url; // Get the current page URL

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <div key={item.title}>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={item.url === currentUrl}>
                                <Link href={item.url} prefetch className="flex items-center space-x-2">
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        {/* Show children ONLY if the current page is "VR Registration" */}
                        {item.children && item.url === currentUrl && (
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
