import { Button } from '@/components/ui/button';

import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from './mainLayout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'VR Registration',
        href: '/vr-registration',
    },
];

export default function VrRegistration() {
    const [activeTab, setActiveTab] = useState('tempoAccountTab');

    const TabContent = ({ value, title, description }: { value: string; title: string; description?: string }) => (
        <TabsContent value={value} className="w-full rounded-sm border border-gray-300 p-2">
            <div className="ml-2 flex flex-col items-start py-2">
                <h3 className="scroll-m-20 text-lg font-semibold tracking-tight">{title}</h3>
                {description && <p className="text-sm text-gray-600">{description}</p>}
            </div>
            <Separator className="my-2" />
            {value === 'tempoAccountTab' ? <TemporaryAccountTabContent /> : <ApplicationStatusTabContent />}
        </TabsContent>
    );

    const TemporaryAccountTabContent = () => (
        <div className="p-4">
            <form className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" placeholder="Enter last name" className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" placeholder="Enter first name" className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                        <input type="text" placeholder="Enter middle name" className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">BirthDate</label>
                        <div className="mt-1 grid grid-cols-3 gap-2">
                            <input type="text" placeholder="MM" className="block w-full rounded-md border border-gray-300 p-2" />
                            <input type="text" placeholder="DD" className="block w-full rounded-md border border-gray-300 p-2" />
                            <input type="text" placeholder="YYYY" className="block w-full rounded-md border border-gray-300 p-2" />
                        </div>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" placeholder="Enter email" className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Default Username</label>
                        <input
                            type="text"
                            placeholder="Generate username"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Default Password</label>
                        <input
                            type="text"
                            placeholder="Derived from birthdate"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            disabled
                        />
                    </div>
                </div>
            </form>

            <Button
                variant="outline"
                onClick={() => console.log('Congrats! You have generated a temporary account')}
                className="float-right mt-20 mb-5 bg-[#2A2A92] text-white hover:bg-[#5454A7] hover:text-white"
            >
                Generate Temporary Account
            </Button>
        </div>
    );

    const ApplicationStatusTabContent = () => <h1 className="p-2 text-2xl font-bold">Not yet</h1>;

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="VR register" />

            <div className="mx-auto flex w-full flex-col items-end">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex justify-end">
                        <TabsList className="bg-[#2A2A92] text-white">
                            <TabsTrigger value="tempoAccountTab" className="px-10">
                                Temporary Account
                            </TabsTrigger>
                            <TabsTrigger value="appStatsTab" className="px-10">
                                Application Status
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <TabContent value="tempoAccountTab" title="Temporary Account" description="Details of the Company Owner" />
                    <TabContent value="appStatsTab" title="Application Status" description="Check the current status of your application" />
                </Tabs>
            </div>
        </MainLayout>
    );
}
