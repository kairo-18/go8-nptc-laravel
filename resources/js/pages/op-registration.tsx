import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import MainLayout from './mainLayout';
import TemporaryAccountTabContent from './vr-register-tab1';
import ApplicationStatusTabContent from './vr-register-tab2';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Operator Registration',
        href: '/op-registration',
    },
];

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
            ease: 'easeIn',
        },
    },
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function OpRegistration({ operators }) {
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
                <motion.div
                    key={value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {value === 'tempoAccountTab' ? (
                        <TemporaryAccountTabContent type="operator" setIsDialogOpen={setIsDialogOpen} />
                    ) : (
                        <ApplicationStatusTabContent
                            operators={[operators]}
                            dataType="operators"
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
            <Head title="OP register" />

            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} className="flex w-full flex-col items-end p-3">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="mb-5 flex justify-start">
                        <TabsList className="bg-[#2A2A92] text-white">
                            <motion.div variants={itemVariants}>
                                <TabsTrigger value="tempoAccountTab" className="relative px-10">
                                    {activeTab === 'tempoAccountTab' && (
                                        <motion.div
                                            layoutId="activeTabIndicator"
                                            className="absolute inset-0 rounded-md bg-white"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">Operator Temporary Account</span>
                                </TabsTrigger>
                            </motion.div>
                            <motion.div variants={itemVariants}>
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

                    <motion.div variants={itemVariants}>
                        <TabContent value="tempoAccountTab" title="Temporary Account" description="Details of the Company Owner" />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <TabContent value="appStatsTab" title="Application Status" description="Check the current status of your application" />
                    </motion.div>
                </Tabs>
            </motion.div>
        </MainLayout>
    );
}
