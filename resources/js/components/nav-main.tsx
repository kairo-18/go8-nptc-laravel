import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Link } from '@inertiajs/react';
import { ChevronRight, type LucideIcon } from 'lucide-react';

export function NavMain({
    items,
    currentPath,
    userRole,
    totalUnreadCount,
}: {
    items: {
        title: string;
        url: string;
        icon?: LucideIcon;
        children?: { title: string; url: string; icon?: LucideIcon }[];
    }[];
    currentPath: string;
    userRole: string;
    totalUnreadCount: number;
}) {
    const isVRAdmin = userRole === 'VR Admin';

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isAnyChildActive = item.children?.some((child) => child.url === currentPath);
                    const isMainActive = !item.children && item.url === currentPath;

                    return (
                        <Collapsible key={item.title} asChild defaultOpen={isAnyChildActive} className="group/collapsible">
                            <SidebarMenuItem
                                className={`transition-all duration-200 ease-in-out ${
                                    isMainActive
                                        ? isVRAdmin
                                            ? 'bg-white text-red-500'
                                            : 'bg-white text-blue-500'
                                        : 'hover:bg-gray-100 hover:text-gray-900'
                                } `}
                            >
                                <SidebarMenuButton asChild tooltip={item.title}>
                                    <div className="flex w-full items-center">
                                        <Link
                                            href={item.url}
                                            prefetch
                                            className={`flex w-full items-center space-x-2 ${
                                                isMainActive
                                                    ? isVRAdmin
                                                        ? 'text-red-500'
                                                        : 'text-black'
                                                    : 'transition-colors duration-200 hover:text-gray-900'
                                            }`}
                                        >
                                            {item.icon && (
                                                <item.icon className="shrink-0 transition-transform duration-200 group-hover/collapsible:scale-110" />
                                            )}
                                            <span className="truncate transition-all duration-200 group-hover/collapsible:translate-x-1">
                                                {item.title}
                                            </span>
                                        </Link>
                                        {item.title === 'Mail' && totalUnreadCount > 0 && (
                                            <span className="flex items-center justify-center rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white transition-transform duration-200 hover:scale-110">
                                                {totalUnreadCount}
                                            </span>
                                        )}
                                        {item.children && (
                                            <CollapsibleTrigger asChild>
                                                <button className="ml-auto rounded p-2 transition-colors duration-200 hover:bg-gray-200">
                                                    <ChevronRight
                                                        className={`ml-auto transition-transform duration-200 ${isAnyChildActive ? 'rotate-90' : ''} group-hover/collapsible:scale-110`}
                                                    />
                                                </button>
                                            </CollapsibleTrigger>
                                        )}
                                    </div>
                                </SidebarMenuButton>

                                {/* Collapsible Dropdown Content */}
                                {item.children && (
                                    <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out">
                                        <SidebarMenuSub>
                                            {item.children.map((subItem) => {
                                                const isSubActive = subItem.url === currentPath;
                                                return (
                                                    <SidebarMenuSubItem
                                                        key={subItem.title}
                                                        className={`transition-all duration-200 ease-in-out ${
                                                            isSubActive
                                                                ? isVRAdmin
                                                                    ? 'bg-white text-red-500'
                                                                    : 'bg-white text-blue-500'
                                                                : 'hover:bg-gray-100 hover:text-gray-900'
                                                        } `}
                                                    >
                                                        <SidebarMenuSubButton asChild>
                                                            <Link
                                                                href={subItem.url}
                                                                prefetch
                                                                className={`flex items-center space-x-2 transition-all duration-200 ${
                                                                    isSubActive ? (isVRAdmin ? 'text-white' : 'text-blue-500') : 'hover:translate-x-1'
                                                                }`}
                                                            >
                                                                {subItem.icon && (
                                                                    <subItem.icon className="h-4 w-4 opacity-75 transition-transform duration-200 group-hover:scale-110" />
                                                                )}
                                                                <span>{subItem.title}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                );
                                            })}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                )}
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
