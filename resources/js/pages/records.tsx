import { slideTransitionVariants, tabContainerVariants, tabContentVariants, tabItemVariants } from '@/lib/animations';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
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
    const { props } = usePage<{ auth: { user?: { id: number; roles?: { name: string }[] }; vr_company_id?: number } }>();
    const userRole = props.auth.user?.roles?.[0]?.name;
    const vrCompanyId = props.auth.vr_company_id;

    const [activeTab, setActiveTab] = useState(userRole === 'Operator' ? 'operator' : userRole === 'Driver' ? 'driver' : 'vr-company');
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
    const [selectedOperatorId, setSelectedOperatorId] = useState<number | null>(null);
    const [direction, setDirection] = useState(0);

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
    console.log(drivers);

    // Breadcrumbs with onClick navigation
    const breadcrumbs = [
        { label: 'Records', title: 'Records', href: '#', onClick: () => setActiveTab('vr-company') },
        { label: activeTab.replace('-', ' ').toUpperCase(), title: activeTab.replace('-', ' ').toUpperCase(), href: '#', onClick: () => {} },
    ];

    const handleTabChange = (tabKey: string) => {
        setActiveTab(tabKey);
        setSelectedCompanyId(null);
        setSelectedOperatorId(null);
        const tabs = [
            ...(userRole !== 'Operator' && userRole !== 'Driver' ? ['vr-company'] : []),
            ...(userRole !== 'Driver' ? ['operator'] : []),
            'driver',
        ];

        const currentIndex = tabs.indexOf(activeTab);
        const newIndex = tabs.indexOf(tabKey);

        setDirection(newIndex > currentIndex ? 1 : -1);
        setActiveTab(tabKey);
    };

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <div className="w-full p-2">
                {/* Enhanced Animated Tabs */}
                <motion.div className="flex gap-1 rounded-lg bg-[#2A2A92] p-1" variants={tabContainerVariants} initial="hidden" animate="show">
                    {[
                        ...(userRole !== 'Operator' && userRole !== 'Driver' ? [{ key: 'vr-company', label: 'VR Company' }] : []),
                        ...(userRole !== 'Driver' ? [{ key: 'operator', label: 'Operator' }] : []),
                        { key: 'driver', label: 'Driver & Vehicle' },
                    ].map((tab) => (
                        <motion.button
                            key={tab.key}
                            variants={tabItemVariants}
                            onClick={() => handleTabChange(tab.key)}
                            className={`relative flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                                activeTab === tab.key ? 'text-[#2A2A92] shadow-sm' : 'text-white hover:bg-white/20'
                            }`}
                            whileHover={activeTab !== tab.key ? { scale: 1.05 } : {}}
                            whileTap={activeTab !== tab.key ? { scale: 0.95 } : {}}
                        >
                            {/* Text container with higher z-index */}
                            <span className="relative z-10 block w-full text-center">{tab.label}</span>

                            {activeTab === tab.key && (
                                <motion.div
                                    className="absolute inset-0 z-0 rounded-md bg-white"
                                    layoutId="activeTabBg"
                                    transition={{
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 30,
                                        duration: 0.3,
                                    }}
                                    style={{
                                        // Constrain the animation within bounds
                                        originX: 0,
                                        originY: 0,
                                    }}
                                />
                            )}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={activeTab}
                        custom={direction}
                        variants={slideTransitionVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                            duration: 0.5,
                        }}
                        className="mt-4"
                    >
                        {activeTab === 'vr-company' && (
                            <motion.div variants={tabContentVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
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

                                        setLocalCompanies((prev) =>
                                            prev.map((c) =>
                                                c.id === updatedCompany.id
                                                    ? {
                                                          ...updatedCompany,
                                                          CompanyName: cleanName(updatedCompany.CompanyName),
                                                      }
                                                    : c,
                                            ),
                                        );
                                    }}
                                />
                            </motion.div>
                        )}
                        {activeTab === 'operator' && (
                            <motion.div variants={tabContentVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                                <Operator
                                    operators={filteredOperators}
                                    onSelectOperator={(operatorId) => {
                                        setSelectedOperatorId(Number(operatorId));
                                        setActiveTab('driver');
                                    }}
                                    onNextTab={() => setActiveTab('driver')}
                                    onStatusUpdate={(updatedOperator) => {
                                        setLocalOperators((prev) => prev.map((op) => (op.id === updatedOperator.id ? updatedOperator : op)));
                                    }}
                                />
                            </motion.div>
                        )}
                        {activeTab === 'driver' && (
                            <motion.div variants={tabContentVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                                <DriverVehicle
                                    drivers={filteredDrivers}
                                    vehicles={filteredVehicles}
                                    onNextTab={() => setActiveTab('vehicle')}
                                    activeTab={''}
                                    onDriverUpdate={(updatedDriver) => {
                                        setLocalDrivers((prev) => prev.map((d) => (d.id === updatedDriver.id ? updatedDriver : d)));
                                    }}
                                    onVehicleUpdate={(updatedVehicle) => {
                                        setLocalVehicles((prev) => prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v)));
                                    }}
                                />
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </MainLayout>
    );
}
