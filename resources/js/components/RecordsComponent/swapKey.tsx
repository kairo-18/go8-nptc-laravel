import { showToast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface SwapKeyProps {
    id: number;
    type: string;
    openSwapModal: boolean;
    setOpenSwapModal: (open: boolean) => void;
    selectedData: any;
    drivers: Driver[];
    vehicles: Vehicle[];
}

interface Driver {
    id: number;
    FirstName: string;
    LastName: string;
    operator_id: number;
}

interface Vehicle {
    id: number;
    PlateNumber: string;
    Model: string;
    Brand: string;
    driver_id: number;
    operator_id: number;
}

export default function SwapKey({ id, type, openSwapModal, setOpenSwapModal, selectedData, drivers = [], vehicles = [] }: SwapKeyProps) {
    const [loading, setLoading] = useState(false);

    const filteredDrivers = type === 'vehicles' ? drivers.filter((driver) => driver.operator_id === selectedData?.operator_id) : drivers;

    // Find the current vehicle assigned to the selected driver
    const currentVehicle = type === 'drivers' ? vehicles.find((vehicle) => vehicle.driver_id === selectedData?.id) : null;
    const { data, setData, post, processing, errors } = useForm({
        newId: '', // Rename to be more generic
    });

    // Filtered lists based on relationships
    const filteredVehicles =
        type === 'drivers'
            ? vehicles.filter((vehicle) => vehicle.operator_id === selectedData?.operator_id && vehicle.driver_id !== selectedData?.id)
            : vehicles;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const endpoint = type === 'drivers' ? `/drivers/${id}/swap-vehicle` : `/vehicles/${id}/swap-driver`;

        post(endpoint, {
            preserveScroll: true,
            onSuccess: () => {
                setOpenSwapModal(false);
                setData({ newId: '' });
                showToast(type === 'drivers' ? 'Vehicle swapped successfully' : 'Driver swapped successfully', {
                    type: 'success',
                    position: 'top-center',
                });
            },
            onError: (errors) => {
                showToast(Object.values(errors).join('\n'), { type: 'error', position: 'top-center' });
            },
        });
    };

    // Reset form when modal opens/closes
    useEffect(() => {
        setData({ newId: '' });
    }, [openSwapModal]);

    return (
        <Dialog open={openSwapModal} onOpenChange={setOpenSwapModal}>
            <DialogContent className="!w-full !max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>{type === 'drivers' ? 'Swap Vehicle' : 'Swap Driver'}</DialogTitle>
                </DialogHeader>

                <div className="p-2">
                    {selectedData ? (
                        <Card>
                            <CardContent className="space-y-6">
                                {type === 'drivers' && currentVehicle && (
                                    <div className="rounded border bg-gray-50 p-2">
                                        <p className="mb-1 text-sm font-semibold">Current Vehicle:</p>
                                        <p className="text-sm">
                                            {currentVehicle.PlateNumber} - {currentVehicle.Model}
                                        </p>
                                    </div>
                                )}
                                <h2 className="text-sm">
                                    {type === 'drivers' ? 'Select a new vehicle for this driver.' : 'Select a new driver for this vehicle.'}
                                </h2>

                                {loading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <Select value={data.newId} onValueChange={(value) => setData('newId', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={type === 'drivers' ? 'Select a vehicle' : 'Select a driver'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {type === 'drivers' && filteredVehicles.length > 0 ? (
                                                filteredVehicles.map((vehicle) => (
                                                    <SelectItem key={vehicle.id.toString()} value={vehicle.id.toString()}>
                                                        {vehicle.PlateNumber} - {vehicle.Model} - {vehicle.Brand}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value={undefined} disabled>
                                                    No vehicles available
                                                </SelectItem>
                                            )}
                                            {type === 'vehicles' &&
                                                filteredDrivers.map((driver) => (
                                                    <SelectItem key={driver.id.toString()} value={driver.id.toString()}>
                                                        {driver.FirstName} {driver.LastName}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                )}

                                {errors.newId && <p className="text-sm text-red-500">{errors.newId}</p>}

                                <div className="flex justify-end space-x-3">
                                    <Button variant="outline" onClick={() => setOpenSwapModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSubmit} disabled={processing || !data.newId}>
                                        {processing ? 'Swapping...' : type === 'drivers' ? 'Swap Vehicle' : 'Swap Driver'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <p className="text-gray-500">{type === 'drivers' ? 'No driver selected.' : 'No vehicle selected.'}</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
