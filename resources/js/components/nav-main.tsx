import { ChevronRight, type LucideIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { Link } from "@inertiajs/react";

export function NavMain({
  items, currentPath, userRole, totalUnreadCount
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

  const isVRAdmin = userRole === "VR Admin";

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isAnyChildActive = item.children?.some((child) => child.url === currentPath);
          const isMainActive = !item.children && item.url === currentPath; // Highlight main only if no children

          return (
            <Collapsible key={item.title} asChild defaultOpen={isAnyChildActive} className="group/collapsible">
              <SidebarMenuItem className={isMainActive ? (isVRAdmin ? "bg-white text-red-500" : "bg-white text-blue-500") : ""}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <div className="flex items-center w-full">
                    <Link
                      href={item.url}
                      prefetch
                      className={`flex items-center space-x-2 w-full ${
                        isMainActive ? (isVRAdmin ? "text-red-500" : "text-black") : ""
                      }`}
                    >
                      {item.icon && <item.icon className="shrink-0" />}
                      <span className="truncate">{item.title}</span>
                    </Link>
                    {item.title === "Mail" && totalUnreadCount > 0 && (
                      <span className=" bg-red-500 text-white text-xs font-bold rounded-full px-2.5 py-1 flex items-center justify-center">
                        {totalUnreadCount}
                      </span>
                    )}
                    {item.children && (
                      <CollapsibleTrigger asChild>
                        <button className="ml-auto p-2">
                          <ChevronRight
                            className={`ml-auto transition-transform duration-200 ${isAnyChildActive ? "rotate-90" : ""}`}
                          />
                        </button>
                      </CollapsibleTrigger>
                    )}
                  </div>
                </SidebarMenuButton>

                {/* Collapsible Dropdown Content */}
                {item.children && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children.map((subItem) => {
                        const isSubActive = subItem.url === currentPath;
                        return (
                          <SidebarMenuSubItem
                            key={subItem.title}
                            className={isSubActive ? (isVRAdmin ? "bg-white text-red-500" : "bg-white text-blue-500") : ""}
                          >
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={subItem.url}
                                prefetch
                                className={`flex items-center space-x-2 ${
                                  isSubActive ? (isVRAdmin ? "text-white" : "text-blue-500") : ""
                                }`}
                              >
                                {subItem.icon && <subItem.icon className="w-4 h-4 opacity-75" />}
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
