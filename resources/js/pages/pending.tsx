import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import MainLayout from './mainLayout';

export default function Pending() {
    //So dapat ang mangyayare dito is yung parang asa registration page, di sya palipat lipat ng page
    //Dapat yung variables mo nagreresemble sa mga fields/columns na meron ang isang Table.
    //Dagdag ka nalang ng ibang mga objects, like Driver, Operators, Vehicles

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pending',
            href: '/pending',
        },
    ];

    const operators = [
        {
            Status: 'Rejected',
            LastName: 'Glad',
            FirstName: 'Glad',
        },
        {
            Status: 'Rejected',
            LastName: 'Glad1',
            FirstName: 'Glad',
        },
        {
            Status: 'Rejected',
            LastName: 'Glad2',
            FirstName: 'Glad',
        },
    ];
    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Pending" />
            <div className="bg-card flex h-full flex-1 flex-col gap-4 rounded-b-xl p-4"></div>
        </MainLayout>
    );
}
