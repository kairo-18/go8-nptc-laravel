import { showToast } from '@/components/toast';
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
            setVehicleCompleted(true);
            setActiveTab('driver');
        } else if (activeTab === 'driver') {
            showToast('Unit registration completed successfully', { type: 'success', position: 'top-center' });
        } else {
            showToast('Invalid tab switch', { type: 'error', position: 'top-center' });
        }
    };

    return (
        <MainLayout breadcrumbs={[{ title: 'Registration', href: '/registration' }]}>
            <div className="w-full p-10">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    {/* Tab Triggers (Navigation) */}
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

                    {/* Tab Contents */}
                    {activeTab === 'vehicle' && <div>{/* Vehicle tab content here */}</div>}

                    {activeTab === 'driver' && vehicleCompleted && <div>{/* Driver tab content here */}</div>}
                </Tabs>

                {/* Tab Content */}
                {activeTab === 'vehicle' && <CreateVehicle operators={operators} onNextTab={goToNextTab} />}

                {activeTab === 'driver' && (
                    <CreateDriver companies={companies} latestVehicle={latestVehicle} operator={operator} company={company} onNextTab={goToNextTab} />
                )}
            </div>
        </MainLayout>
    );
}
