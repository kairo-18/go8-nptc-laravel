import { showToast } from '@/components/toast';
import { toast } from 'react-toastify';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import CreateDriver from './create-driver';
import CreateVehicle from './create-vehicle';
import MainLayout from './mainLayout';

export default function UnitRegistration({ companies, latestVehicle, operator, company, operators }) {
    const [activeTab, setActiveTab] = useState('vehicle');
    const [vehicleCompleted, setVehicleCompleted] = useState(false);

    const goToNextTab = () => {
        if (activeTab === 'vehicle') {
            // Show loading toast for vehicle registration
            const loadingToast = showToast('Completing vehicle registration...', {
                type: 'loading',
                isLoading: true,
                position: 'top-center',
                autoClose: false
            });

            setVehicleCompleted(true);
            setActiveTab('driver');
            
            // Dismiss loading and show success
            toast.dismiss(loadingToast);
        } 
        else if (activeTab === 'driver') {
            // Show loading toast for final registration
            const loadingToast = showToast('Finalizing registration...', {
                type: 'loading',
                isLoading: true,
                position: 'top-center',
                autoClose: false
            });

            // Simulate processing time (replace with actual async operation if needed)
            setTimeout(() => {
                toast.dismiss(loadingToast);
            }, 1000);
        } 
        else {
            showToast('Invalid tab switch', { 
                type: 'error', 
                position: 'top-center' 
            });
        }
    };

    return (
        <MainLayout breadcrumbs={[{ title: 'Registration', href: '/registration' }]}>
            <div className="w-full p-10">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="mb-4">
                        <TabsList className="bg-[#2A2A92] text-white">
                            <TabsTrigger value="vehicle" className="text-sm">
                                Vehicle
                            </TabsTrigger>
                            <TabsTrigger
                                value="driver"
                                className="text-sm disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={!vehicleCompleted}
                            >
                                Driver
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {activeTab === 'vehicle' && (
                        <CreateVehicle operators={operators} onNextTab={goToNextTab} />
                    )}

                    {activeTab === 'driver' && (
                        <CreateDriver 
                            companies={companies} 
                            latestVehicle={latestVehicle} 
                            operator={operator} 
                            company={company} 
                            onNextTab={goToNextTab}
                        />
                    )}
                </Tabs>
            </div>
        </MainLayout>
    );
}