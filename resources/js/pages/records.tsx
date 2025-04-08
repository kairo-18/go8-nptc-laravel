import { useState, useEffect } from 'react';
import Company from '../components/RecordsComponent/vr-company';
import DriverVehicle from '../components/RecordsComponent/vr-driver-vehicle';
import Operator from '../components/RecordsComponent/vr-operator';
import MainLayout from './mainLayout';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function Records({
    companies,
    operators,
    drivers,
    vehicles,
    companiesWithMedia,
}: {
    companies: { id: number; Status?: string; BusinessPermitNumber: string; CompanyName: string; media?: any[] }[];
    operators: { id: number; name: string; status: string; vr_company_id: number; user_id?: number; FirstName: string; LastName: string }[];
    drivers: { id: number; user_id: number; name: string; status: string; operator_id: number }[];
    vehicles: { id: number; name: string; driver_id: number; status: string; operator_id: number }[];
    companiesWithMedia: { id: number; media: any[] }[];
}) {
    const [localCompanies, setLocalCompanies] = useState(companies);
    const [localOperators, setLocalOperators] = useState(operators);
    const [localDrivers, setLocalDrivers] = useState(drivers);
    const [localVehicles, setLocalVehicles] = useState(vehicles);
    const { props } = usePage<{ auth: { user?: { id: number; roles?: { name: string }[] }, vr_company_id?: number } }>();
    const userRole = props.auth.user?.roles?.[0]?.name;
    const vrCompanyId = props.auth.vr_company_id;

    const [activeTab, setActiveTab] = useState(userRole === 'Operator' ? 'operator' : userRole === 'Driver' ? 'driver' : 'vr-company');
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
    const [selectedOperatorId, setSelectedOperatorId] = useState<number | null>(null);

    // Filter operators based on selectedCompanyId
    const filteredOperators = selectedCompanyId
        ? localOperators.filter((op) => op.vr_company_id === selectedCompanyId)
        : userRole === 'Operator'
        ? localOperators.filter((op) => op.user_id === props.auth.user?.id)
        : localOperators;

    const filteredDrivers = selectedOperatorId
        ? localDrivers.filter((driver) => driver.operator_id === selectedOperatorId)
        : userRole === 'Operator'
        ? localDrivers.filter((driver) => filteredOperators.some((op) => op.id === driver.operator_id))
        : userRole === 'Driver'
        ? localDrivers.filter((driver) => driver.user_id === props.auth.user?.id)
        : localDrivers;

    const filteredVehicles = selectedOperatorId
        ? localVehicles.filter((vehicle) => vehicle.operator_id === selectedOperatorId)
        : userRole === 'Operator'
        ? localVehicles.filter((vehicle) => filteredOperators.some((op) => op.id === vehicle.operator_id))
        : userRole === 'Driver'
        ? localVehicles.filter((vehicle) => filteredDrivers.some((driver) => driver.id === vehicle.driver_id))
        : localVehicles;

    console.log(filteredOperators);
    console.log(drivers)

    // Breadcrumbs with onClick navigation
    const breadcrumbs = [
        { label: 'Records', title: 'Records', href: '#', onClick: () => setActiveTab('vr-company') },
        { label: activeTab.replace('-', ' ').toUpperCase(), title: activeTab.replace('-', ' ').toUpperCase(), href: '#', onClick: () => { } },
    ];

    const handleTabChange = (tabKey: string) => {
        setActiveTab(tabKey);
        setSelectedCompanyId(null);
        setSelectedOperatorId(null);
    };


    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <div className=" mt-6 w-full p-10">
                {/* Tabs Navigation */}
                <div className="flex space-x-2 text-gray-500">
                    {[
                        ...(userRole !== 'Operator' && userRole !== 'Driver' ? [{ key: 'vr-company', label: 'VR Company' }] : []),
                        ...(userRole !== 'Driver' ? [{ key: 'operator', label: 'Operator' }] : []),
                        { key: 'driver', label: 'Driver and Vehicle' },
                    ].map((tab, index) => (
                        <span key={tab.key} className="flex items-center">
                            <button
                                onClick={() => handleTabChange(tab.key)}
                                className={`text-sm font-medium ${activeTab === tab.key ? 'font-semibold text-black' : 'hover:text-black'}`}
                            >
                                {tab.label}
                            </button>
                            {index < [...(userRole !== 'Operator' && userRole !== 'Driver' ? [{ key: 'vr-company', label: 'VR Company' }] : []), ...(userRole !== 'Driver' ? [{ key: 'operator', label: 'Operator' }] : []), { key: 'driver', label: 'Driver and Vehicle' }].length - 1 && (
                                <span className="mx-1">/</span>
                            )}
                        </span>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'vr-company' && (
                    <Company
                        companies={localCompanies}
                        companiesWithMedia={companiesWithMedia}
                        onSelectCompany={(companyId) => {
                            setSelectedCompanyId(companyId);
                            setActiveTab('operator');
                        }}
                        onStatusUpdate={(updatedCompany) => {
                            const cleanName = (name: string) =>
                                name.replace(/^(Active|Inactive|Suspended|Banned|Approved|Rejected|Pending)\s*/i, '').trim();

                            setLocalCompanies(prev =>
                                prev.map(c =>
                                    c.id === updatedCompany.id
                                        ? {
                                              ...updatedCompany,
                                              CompanyName: cleanName(updatedCompany.CompanyName),
                                          }
                                        : c
                                )
                            );
                        }}
                    />
                )}
                {activeTab === 'operator' && (
                    <Operator
                        operators={filteredOperators}
                        onSelectOperator={(operatorId) => {
                            setSelectedOperatorId(Number(operatorId));
                            setActiveTab('driver');
                        }}
                        onNextTab={() => setActiveTab('driver')}
                        onStatusUpdate={(updatedOperator) => {
                            setLocalOperators(prev =>
                                prev.map(op => op.id === updatedOperator.id ? updatedOperator : op)
                            );
                        }}
                    />
                )}
                {activeTab === 'driver' && (
                    <DriverVehicle
                        drivers={filteredDrivers}
                        vehicles={filteredVehicles}
                        onNextTab={() => setActiveTab('vehicle')}
                        activeTab={''}
                        onDriverUpdate={(updatedDriver) => {
                            setLocalDrivers(prev =>
                                prev.map(d => d.id === updatedDriver.id ? updatedDriver : d)
                            );
                        }}
                        onVehicleUpdate={(updatedVehicle) => {
                            setLocalVehicles(prev =>
                                prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v)
                            );
                        }}
                    />
                )}
            </div>
        </MainLayout>
    );
}
