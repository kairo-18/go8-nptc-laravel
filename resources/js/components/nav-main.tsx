import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    children?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
}) {
  const page = usePage();
  const currentUrl = page.url;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            item.url === currentUrl || item.children?.some((child) => child.url === currentUrl);

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>

                <SidebarMenuButton asChild tooltip={item.title}>
                  <div>
                <Link href={item.url} prefetch className="flex items-center space-x-2 w-full">
                  {item.icon && <item.icon className="shrink-0" />}
                  <span className="truncate">{item.title}</span>
                  </Link>
                  {item.children && (
                    <CollapsibleTrigger asChild>
                      <button className="ml-auto p-2">
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </button>
                    </CollapsibleTrigger>
                  )}
                  </div>
           
              </SidebarMenuButton>
                
                
                {/* Collapsible Dropdown Content */}
                {item.children && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url} prefetch className="flex items-center space-x-2">
                              {subItem.icon && <subItem.icon className="w-4 h-4 opacity-75" />}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
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
