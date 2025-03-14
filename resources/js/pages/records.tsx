import { useState } from 'react';
import Company from '../components/RecordsComponent/vr-company';
import DriverVehicle from '../components/RecordsComponent/vr-driver-vehicle';
import Operator from '../components/RecordsComponent/vr-operator';
import MainLayout from './mainLayout';

export default function Records({
    companies,
    operators,
    drivers,
    vehicles,
    companiesWithMedia,
}: {
    companies: { id: number; BusinessPermitNumber: string }[];
    operators: { id: number; name: string; status: string; vr_company_id: number }[];
    drivers: { id: number; name: string; status: string; operator_id: number }[];
    vehicles: { id: number; name: string; status: string; operator_id: number }[];
    companiesWithMedia: { id: number; media: any[] }[];
}) {
    const [activeTab, setActiveTab] = useState('vr-company');
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
    const [selectedOperatorId, setSelectedOperatorId] = useState<number | null>(null);

    // Filter operators based on selectedCompanyId
    const filteredOperators = selectedCompanyId ? operators.filter((op) => op.vr_company_id === selectedCompanyId) : operators;
    const filteredDrivers = selectedOperatorId ? drivers.filter((driver) => driver.operator_id === selectedOperatorId) : drivers;
    const filteredVehicles = selectedOperatorId ? vehicles.filter((vehicle) => vehicle.operator_id === selectedOperatorId) : vehicles;

    // Breadcrumbs with onClick navigation
    const breadcrumbs = [
        { label: 'Records', title: 'Records', href: '#', onClick: () => setActiveTab('vr-company') },
        { label: activeTab.replace('-', ' ').toUpperCase(), title: activeTab.replace('-', ' ').toUpperCase(), href: '#', onClick: () => {} },
    ];

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto mt-6 w-full max-w-6xl">
                {/* Tabs Navigation */}
                <div className="flex space-x-2 text-gray-500">
                    {[
                        { key: 'vr-company', label: 'VR Company' },
                        { key: 'operator', label: 'Operator' },
                        { key: 'driver', label: 'Driver and Vehicle' },
                    ].map((tab, index) => (
                        <span key={tab.key} className="flex items-center">
                            <button
                                onClick={() => setActiveTab(tab.key)}
                                className={`text-sm font-medium ${activeTab === tab.key ? 'font-semibold text-black' : 'hover:text-black'}`}
                            >
                                {tab.label}
                            </button>
                            {index < 3 && <span className="mx-1">/</span>}
                        </span>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'vr-company' && (
                    <Company
                        companies={companies}
                        companiesWithMedia={companiesWithMedia}
                        onSelectCompany={(companyId) => {
                            setSelectedCompanyId(companyId);
                            setActiveTab('operator');
                        }}
                    />
                )}
                {activeTab === 'operator' && (
                    <Operator
                        operators={filteredOperators}
                        onSelectOperator={(operatorId) => {
                            setSelectedOperatorId(operatorId);
                            setActiveTab('driver');
                        }}
                        onNextTab={() => setActiveTab('driver')}
                    />
                )}
                {activeTab === 'driver' && (
                    <DriverVehicle drivers={filteredDrivers} onNextTab={() => setActiveTab('vehicle')} vehicles={filteredVehicles} activeTab={''} />
                )}
            </div>
        </MainLayout>
    );
}
