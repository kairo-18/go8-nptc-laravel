import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateColumns } from './columns';
import { DataTable } from './data-table';
import { useState, useEffect } from 'react';
import SetStatus from './set-status';
import Container from './container';
import axios from 'axios';

interface DriverProps {
    drivers: { [key: string]: any }[];
    vehicles: { [key: string]: any }[];
    activeTab: string;
    onNextTab: () => void;
}

export default function DriverVehicle({ drivers, vehicles, activeTab }: DriverProps) {
    const [containerType, setContainerType] = useState(String);
    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [openContainerModal, setOpenContainerModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [inputValue, setInputValue] = useState('');
    const formatHeader = (key) =>
        key
            .replace(/_count$/, '') // Remove "_count" suffix
            .replace(/^vr_/, 'VR ') // Replace "vr_" prefix with "VR "
            .replace(/_/g, ' ') // Replace underscores with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word

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

    const driverColumns = generateColumns(driverHeaders, {
        entityType: 'drivers',
        statusColumns: ['Status'],
    });

    const vehicleColumns = generateColumns(vehicleHeaders, {
        entityType: 'vehicles',
        statusColumns: ['Status'],
    });

    console.log(drivers);

    return (
        <div>
            <Tabs defaultValue="drivers" className="w-full">
                <div className="flex justify-end">
                    <TabsList className="bg-[#2A2A92] text-white">
                        <TabsTrigger value="drivers" onClick={() => setActiveTab('drivers')} className="px-10">
                            Drivers
                        </TabsTrigger>
                        <TabsTrigger value="vehicles" onClick={() => setActiveTab('vehicles')} className="px-10">
                            Vehicles
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="drivers">
                    <DataTable data={drivers} ColumnFilterName="FirstName" columns={driverColumns} />
                </TabsContent>

                <TabsContent value="vehicles">
                    <DataTable data={vehicles} ColumnFilterName="PlateNumber" columns={vehicleColumns} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
