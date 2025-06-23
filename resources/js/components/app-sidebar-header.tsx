import { Breadcrumbs } from '@/components/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { getBadgeColorForRole } from '@/components/UtilsColor';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [], userRole }: { breadcrumbs?: BreadcrumbItemType[]; userRole?: string }) {
    const badgeColor = getBadgeColorForRole(userRole);
    return (
        <header className="bg-card border-sidebar-border/50 flex h-16 shrink-0 items-center justify-between rounded-t-xl border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 bg-white" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            {userRole && <Badge className={`rounded-md px-4 py-1 text-sm capitalize ${badgeColor}`}>{userRole}</Badge>}
        </header>
    );
}
