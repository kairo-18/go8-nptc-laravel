import { useState } from 'react';
import CreateDriver from './create-driver';
import MainLayout from './mainLayout';
import CreateVehicle from './create-vehicle';

export default function UnitRegistration({ companies, latestVehicle, operator, company, operators }) {
    const [activeTab, setActiveTab] = useState('vehicle');
    const [vehicleCompleted, setVehicleCompleted] = useState(false);

    const goToNextTab = () => {
        if (activeTab === 'vehicle') {
            setVehicleCompleted(true);
            setActiveTab('driver');
        } else if (activeTab === 'driver') {
            alert('Registration complete!');
        }
    };

    return (
        <MainLayout breadcrumbs={[{ title: 'Registration', href: '/registration' }]}>
            <div className="mx-auto mt-6 w-full max-w-6xl">
                {/* Tabs Navigation */}
                <div className="flex space-x-2 text-gray-500 mb-6">
                    {[{ key: 'vehicle', label: 'Vehicle' }, { key: 'driver', label: 'Driver' }].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => tab.key === 'vehicle' || (tab.key === 'driver' && vehicleCompleted) ? setActiveTab(tab.key) : null}
                            className={`text-sm font-medium ${activeTab === tab.key ? 'font-semibold text-black' : 'hover:text-black'} ${tab.key === 'driver' && !vehicleCompleted ? 'cursor-not-allowed text-gray-400' : ''}`}
                            disabled={tab.key === 'driver' && !vehicleCompleted}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'vehicle' && (
                    <CreateVehicle
                        operators={operators}
                        onNextTab={goToNextTab}
                    />
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
            </div>
        </MainLayout>
    );
}