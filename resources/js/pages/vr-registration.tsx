import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from './mainLayout';
import TemporaryAccountTabContent from './vr-register-tab1.tsx';
import ApplicationStatusTabContent from './vr-register-tab2.tsx';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'VR Registration',
        href: '/vr-registration',
    },
];

export default function VrRegistration() {
    const [activeTab, setActiveTab] = useState('tempoAccountTab');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const TabContent = ({ value, title, description }: { value: string; title: string; description?: string }) => (
        <TabsContent value={value} className="w-full rounded-sm border border-gray-300 p-2">
            <div className="ml-2 flex flex-col items-start py-2">
                <h3 className="scroll-m-20 text-lg font-semibold tracking-tight">{title}</h3>
                {description && <p className="text-sm text-gray-600">{description}</p>}
            </div>
            <Separator className="my-2" />
            {value === 'tempoAccountTab' ? <TemporaryAccountTabContent setIsDialogOpen={setIsDialogOpen} /> : <ApplicationStatusTabContent />}
        </TabsContent>
    );

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

                    <TabContent value="tempoAccountTab" title="Create Temporary Account" description="Details of the Company Owner" />
                    <TabContent value="appStatsTab" title="Application Status" description="Check the current status of your application" />
                </Tabs>
            </div>
        </MainLayout>
    );
}
