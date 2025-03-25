import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateColumns } from './columns';
import { DataTable } from './data-table';
import { useState, useEffect } from 'react';


interface DriverProps {
    drivers: { [key: string]: any }[];
    vehicles: { [key: string]: any }[];
    activeTab: string;
    onNextTab: () => void;
}

export default function DriverVehicle({ drivers, vehicles, activeTab }: DriverProps) {
    const [driverData, setDriverData] = useState(drivers);
    const [vehicleData, setVehicleData] = useState(vehicles);

    useEffect(() => {
        setDriverData(drivers);
    }, [drivers]);

    useEffect(() => {
        setVehicleData(vehicles);
    }, [vehicles]);

    
    const transformDriverData = driverData.map((driver) => ({
        ...driver,
        Driver: `${driver.Status ? `${driver.Status} ` : ''}${driver.FirstName}  ${driver.LastName}`,
    }));

    const transformVehicleData = vehicleData.map((vehicle) => ({
        ...vehicle,
        Vehicle: `${vehicle.Status ? `${vehicle.Status} ` : ''}${vehicle.PlateNumber}`,
    }));
    
    const formatHeader = (key: string) =>
        key.replace(/_count$/, '')
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
                .map(header => header.key)
                .filter(key => !primaryColumns.includes(key) && key !== 'Status' && key !== 'id'); 
            
            const orderedDriverHeaders = [...primaryColumns, ...driverOtherColumns];
            
            const driverColumns = generateColumns(
                orderedDriverHeaders.map(key => ({ key, label: formatHeader(key) })),
                {
                    entityType: 'drivers',
                    statusColumns: ['Status'],
                }
            );
            

            const primaryVehicleColumns = ['NPTC_ID', 'Vehicle'];

            const vehicleOtherColumns = vehicleHeaders
                .map(header => header.key)
                .filter(key => !primaryVehicleColumns.includes(key) && key !== 'Status' && key !== 'Model' && key !== 'id'); 
            
            const orderedVehicleHeaders = [...primaryVehicleColumns, ...vehicleOtherColumns];
            
            const vehicleColumns = generateColumns(
                orderedVehicleHeaders.map(key => ({ key, label: formatHeader(key) })),
                {
                    entityType: 'vehicles',
                    statusColumns: ['Status'],
                }
            );
            

    return (
        <div>
            <Tabs defaultValue="drivers" className="w-full">
                <div className="flex justify-end">
                    <TabsList className="bg-[#2A2A92] text-white">
                        <TabsTrigger value="drivers" className="px-10">
                            Drivers
                        </TabsTrigger>
                        <TabsTrigger value="vehicles" className="px-10">
                            Vehicles
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="drivers">
                    <DataTable data={transformDriverData} ColumnFilterName="FirstName" columns={driverColumns} />

                </TabsContent>

                <TabsContent value="vehicles">
                    <DataTable data={transformVehicleData} ColumnFilterName="PlateNumber" columns={vehicleColumns} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
