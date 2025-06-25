import { showToast } from '@/components/toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tabContainerVariants, tabContentVariants, tabItemVariants } from '@/lib/animations';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'react-toastify';
import CreateDriver from './create-driver';
import CreateVehicle from './create-vehicle';
import MainLayout from './mainLayout';

export default function UnitRegistration({ companies, latestVehicle, operator, company, operators }) {
    const [activeTab, setActiveTab] = useState('vehicle');
    const [vehicleCompleted, setVehicleCompleted] = useState(false);

    const goToNextTab = () => {
        if (activeTab === 'vehicle') {
            const loadingToast = showToast('Completing vehicle registration...', {
                type: 'loading',
                isLoading: true,
                position: 'top-center',
                autoClose: false,
            });

            setVehicleCompleted(true);
            setActiveTab('driver');

            toast.dismiss(loadingToast);
        } else if (activeTab === 'driver') {
            const loadingToast = showToast('Finalizing registration...', {
                type: 'loading',
                isLoading: true,
                position: 'top-center',
                autoClose: false,
            });
            setTimeout(() => {
                toast.dismiss(loadingToast);
            }, 1000);
        } else {
            showToast('Invalid tab switch', {
                type: 'error',
                position: 'top-center',
            });
        }
    };

    return (
        <MainLayout breadcrumbs={[{ title: 'Registration', href: '/registration' }]}>
            <div className="w-full p-2">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <motion.div variants={tabContainerVariants} initial="hidden" animate="show" className="absolute top-28 right-8">
                        <TabsList className="bg-[#2A2A92] text-white">
                            <motion.div variants={tabItemVariants}>
                                <TabsTrigger value="vehicle" className="relative px-10 text-sm">
                                    {activeTab === 'vehicle' && (
                                        <motion.div
                                            layoutId="activeTabIndicator"
                                            className="absolute inset-0 rounded-md bg-white"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">Vehicle</span>
                                </TabsTrigger>
                            </motion.div>
                            <motion.div variants={tabContentVariants}>
                                <TabsTrigger
                                    value="driver"
                                    className="relative px-10 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                                    disabled={!vehicleCompleted}
                                >
                                    {activeTab === 'driver' && (
                                        <motion.div
                                            layoutId="activeTabIndicator"
                                            className="absolute inset-0 rounded-md bg-white"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">Driver</span>
                                </TabsTrigger>
                            </motion.div>
                        </TabsList>
                    </motion.div>

                    {/* Content with its own animation */}
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial="initial" animate="animate" exit="exit" variants={tabContentVariants}>
                            {activeTab === 'vehicle' && <CreateVehicle operators={operators} onNextTab={goToNextTab} />}
                            {activeTab === 'driver' && (
                                <CreateDriver
                                    companies={companies}
                                    latestVehicle={latestVehicle}
                                    operator={operator}
                                    company={company}
                                    onNextTab={goToNextTab}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </Tabs>
            </div>
        </MainLayout>
    );
}
