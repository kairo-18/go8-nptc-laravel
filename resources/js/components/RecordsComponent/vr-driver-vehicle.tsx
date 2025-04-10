import { showToast } from '@/components/toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { generateColumns } from './columns';
import { DataTable } from './data-table';
import SetStatus from './set-status';
import SwapKey from './swapKey';
import { getBackgroundColorForRole } from '@/components/UtilsColor';

interface DriverProps {
    drivers: { [key: string]: any }[];
    vehicles: { [key: string]: any }[];
    activeTab: string;
    onNextTab: () => void;
    onDriverUpdate?: (updatedDriver: any) => void;
    onVehicleUpdate?: (updatedVehicle: any) => void;
}

export default function DriverVehicle({ drivers, vehicles, activeTab, onDriverUpdate, onVehicleUpdate }: DriverProps) {
    const [driverData, setDriverData] = useState(drivers);
    const [selectedDriver, setSelectedDriver] = useState<any>(null);
    const [vehicleData, setVehicleData] = useState(vehicles);
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [openSwapModal, setOpenSwapModal] = useState(false);

    const { props } = usePage<{ auth: { user?: { id: number; roles?: { name: string }[] }; vr_company_id?: number } }>();
    const userRole = props.auth.user?.roles?.[0]?.name;

    useEffect(() => {
        setDriverData(drivers);
    }, [drivers]);

    useEffect(() => {
        setVehicleData(vehicles);
    }, [vehicles]);

    const handleDriverSetStatus = (statusData: any) => {
        setSelectedDriver(statusData);
        setOpenStatusModal(true);
    };

    const handleVehicleSetStatus = (statusData: any) => {
        setSelectedVehicle(statusData);
        setOpenStatusModal(true);
    };

    const handleSubmitToDriver = async () => {
        if (!selectedDriver) {
            showToast('No driver selected', { type: 'error', position: 'top-center' });
            return;
        }

        await axios.patch(`driver/updateStatus/${selectedDriver.id}`, {
            status: selectedStatus,
        });

        const updatedDriver = {
            ...selectedDriver,
            Status: selectedStatus,
        };

        if (onDriverUpdate) {
            onDriverUpdate(updatedDriver);
        }

        setOpenStatusModal(false);
    };

    const handleSwapDriver = (driverData: any) => {
        setSelectedDriver(driverData); // Make sure this is setting the driver
        setOpenSwapModal(true);
    };

    const handleSwapVehicle = (vehicleData: any) => {
        setSelectedVehicle(vehicleData); // Make sure this is setting the vehicle
        setOpenSwapModal(true);
    };

    const handleSubmitToVehicle = async () => {
        if (!selectedVehicle) {
            showToast('No vehicle selected', { type: 'error', position: 'top-center' });
            return;
        }

        await axios.patch(`vehicle/updateStatus/${selectedVehicle.id}`, {
            status: selectedStatus,
        });

        const updatedVehicle = {
            ...selectedVehicle,
            Status: selectedStatus,
        };

        if (onVehicleUpdate) {
            onVehicleUpdate(updatedVehicle);
        }

        setOpenStatusModal(false);
    };

    const transformDriverData = driverData.map((driver) => ({
        ...driver,
        Driver: `${driver.Status ? `${driver.Status} ` : ''}${driver.FirstName}  ${driver.LastName}`,
    }));

    const transformVehicleData = vehicleData.map((vehicle) => ({
        ...vehicle,
        Vehicle: `${vehicle.Status ? `${vehicle.Status} ` : ''}${vehicle.PlateNumber}`,
    }));

    const formatHeader = (key: string) =>
        key
            .replace(/_count$/, '')
            .replace(/^vr_/, 'VR ')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());

    const driverHeaders =
        drivers.length > 0
            ? Object.keys(drivers[0]).map((key) => ({
                  key,
                  label: formatHeader(key),
              }))
            : [];

    const vehicleHeaders =
        vehicles.length > 0
            ? Object.keys(vehicles[0]).map((key) => ({
                  key,
                  label: formatHeader(key),
              }))
            : [];
    const primaryColumns = ['NPTC_ID', 'Driver'];

    const driverOtherColumns = driverHeaders
        .map((header) => header.key)
        .filter((key) => !primaryColumns.includes(key) && key !== 'Status' && key !== 'id');

    const orderedDriverHeaders = [...primaryColumns, ...driverOtherColumns];

    const driverColumns = generateColumns(
        orderedDriverHeaders.map((key) => ({ key, label: formatHeader(key) })),
        {
            entityType: 'drivers',
            statusColumns: ['Status'],
            updateStatus: handleDriverSetStatus,
            swapVehicle: handleSwapDriver,
        },
    );

    const primaryVehicleColumns = ['NPTC_ID', 'Vehicle'];

    const vehicleOtherColumns = vehicleHeaders
        .map((header) => header.key)
        .filter((key) => !primaryVehicleColumns.includes(key) && key !== 'Status' && key !== 'Model' && key !== 'id');

    const orderedVehicleHeaders = [...primaryVehicleColumns, ...vehicleOtherColumns];

    const vehicleColumns = generateColumns(
        orderedVehicleHeaders.map((key) => ({ key, label: formatHeader(key) })),
        {
            entityType: 'vehicles',
            statusColumns: ['Status'],
            updateStatus: handleVehicleSetStatus,
        },
    );

    return (
        <div className="w-full gap-4">
            <Tabs defaultValue="drivers" className="w-full">
                <div className="mt-5 flex justify-center md:justify-end">
                <TabsList className={`${getBackgroundColorForRole(userRole)} text-white`}>
                    <TabsTrigger 
                        value="drivers" 
                        className={`px-10 !${getBackgroundColorForRole(userRole)} data-[state=active]:!bg-white data-[state=active]:text-black`}
                    >
                        Drivers
                    </TabsTrigger>
                    <TabsTrigger 
                        value="vehicles" 
                        className={`px-10 !${getBackgroundColorForRole(userRole)} data-[state=active]:!bg-white data-[state=active]:text-black`}
                    >
                        Vehicles
                    </TabsTrigger>
                </TabsList>
                </div>

                <TabsContent value="drivers">
                    <DataTable data={transformDriverData} ColumnFilterName="Driver" columns={driverColumns} />
                    <SetStatus
                        selectedData={selectedDriver}
                        openStatusModal={openStatusModal}
                        setOpenStatusModal={setOpenStatusModal}
                        selectedStatus={selectedStatus}
                        setStatusData={handleDriverSetStatus}
                        setSelectedStatus={setSelectedStatus}
                        handleSubmit={handleSubmitToDriver}
                    />
                    <SwapKey
                        id={selectedDriver?.id}
                        type="drivers"
                        openSwapModal={openSwapModal}
                        setOpenSwapModal={setOpenSwapModal}
                        selectedData={selectedDriver}
                        drivers={[]}
                        vehicles={vehicleData}
                    />
                </TabsContent>

                <TabsContent value="vehicles">
                    <DataTable data={transformVehicleData} ColumnFilterName="Vehicles" columns={vehicleColumns} />
                    <SetStatus
                        selectedData={selectedVehicle}
                        openStatusModal={openStatusModal}
                        setOpenStatusModal={setOpenStatusModal}
                        selectedStatus={selectedStatus}
                        setStatusData={handleVehicleSetStatus}
                        setSelectedStatus={setSelectedStatus}
                        handleSubmit={handleSubmitToVehicle}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
