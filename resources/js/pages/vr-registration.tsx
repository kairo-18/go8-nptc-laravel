import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cardItemVariants, containerVariants, pageVariants } from '@/lib/animations';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import MainLayout from './mainLayout';
import TemporaryAccountTabContent from './vr-register-tab1';
import ApplicationStatusTabContent from './vr-register-tab2';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'VR Registration',
        href: '/vr-registration',
    },
];

export default function VrRegistration({ companies }) {
    const [activeTab, setActiveTab] = useState('tempoAccountTab');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const TabContent = ({ value, title, description }: { value: string; title: string; description?: string }) => (
        <TabsContent value={value} className="w-full rounded-sm border border-gray-300 p-2">
            <div className="ml-2 flex flex-col items-start py-2">
                <h3 className="scroll-m-20 text-lg font-semibold tracking-tight">{title}</h3>
                {description && <p className="text-sm text-gray-600">{description}</p>}
            </div>
            <Separator className="my-2" />
            <AnimatePresence mode="wait">
                <motion.div key={value} initial="initial" animate="animate" exit="exit" variants={cardItemVariants} transition={{ duration: 0.2 }}>
                    {value === 'tempoAccountTab' ? (
                        <TemporaryAccountTabContent setIsDialogOpen={setIsDialogOpen} />
                    ) : (
                        <ApplicationStatusTabContent
                            companies={[companies]}
                            dataType="companies"
                            onSelectCompany={function (companyId: number): void {
                                throw new Error('Function not implemented.');
                            }}
                            companiesWithMedia={[]}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </TabsContent>
    );

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="VR register" />
            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} className="flex w-full flex-col items-end p-3">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <motion.div variants={containerVariants} initial="initial" animate="animate" className="mb-5 flex justify-start">
                        <TabsList className="bg-[#2A2A92] text-white">
                            <motion.div variants={cardItemVariants}>
                                <TabsTrigger value="tempoAccountTab" className="relative px-10">
                                    {activeTab === 'tempoAccountTab' && (
                                        <motion.div
                                            layoutId="activeTabIndicator"
                                            className="absolute inset-0 rounded-md bg-white"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">Vehicle Rental Temporary Account</span>
                                </TabsTrigger>
                            </motion.div>
                            <motion.div variants={cardItemVariants}>
                                <TabsTrigger value="appStatsTab" className="relative px-10">
                                    {activeTab === 'appStatsTab' && (
                                        <motion.div
                                            layoutId="activeTabIndicator"
                                            className="absolute inset-0 rounded-md bg-white"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">Application Status</span>
                                </TabsTrigger>
                            </motion.div>
                        </TabsList>
                    </motion.div>

                    <motion.div variants={cardItemVariants}>
                        <TabContent value="tempoAccountTab" title="Temporary Account" description="Details of the Company Owner" />
                    </motion.div>
                    <motion.div variants={cardItemVariants}>
                        <TabContent value="appStatsTab" title="Application Status" description="Check the current status of your application" />
                    </motion.div>
                </Tabs>
            </motion.div>
        </MainLayout>
    );
}
