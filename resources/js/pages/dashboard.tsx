import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import MainLayout from './mainLayout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="bg-card flex h-full flex-1 flex-col gap-4 rounded-b-xl p-4"></div>
        </MainLayout>
    );
}
