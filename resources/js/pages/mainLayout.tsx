import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function MainLayout({ children, breadcrumbs }: MainLayoutProps) {
    const defaultBreadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Home',
            href: '/',
        },
    ];

    const finalBreadcrumbs = breadcrumbs?.length ? breadcrumbs : defaultBreadcrumbs;

    return (
        <AppLayout breadcrumbs={finalBreadcrumbs}>
            <Head title="Dashboard" />
            <div className="bg-card flex h-full flex-1 flex-col gap-4 rounded-b-xl p-4">
                {children}
            </div>
        </AppLayout>
    );
}
