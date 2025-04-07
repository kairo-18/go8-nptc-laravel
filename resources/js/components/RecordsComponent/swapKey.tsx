import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";

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
}

interface Vehicle {
    id: number;
    PlateNumber: string;
    Model: string;
    Brand: string;
}

export default function SwapKey({
    id,
    type,
    openSwapModal,
    setOpenSwapModal,
    selectedData,
    drivers = [],
    vehicles = []
}: SwapKeyProps) {
    const [loading, setLoading] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        newId: '', // Rename to be more generic
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const endpoint = type === 'drivers'
            ? `/drivers/${id}/swap-vehicle`
            : `/vehicles/${id}/swap-driver`;

        post(endpoint, {
            preserveScroll: true,
            onSuccess: () => {
                setOpenSwapModal(false);
                setData({ newId: '' });
                alert({
                    title: "Success",
                    description: type === 'drivers'
                        ? "Vehicle swapped successfully"
                        : "Driver swapped successfully",
                });
            },
            onError: (errors) => {
                alert({
                    title: "Error",
                    description: Object.values(errors).join('\n'),
                    variant: "destructive",
                });
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
                    <DialogTitle>
                        {type === 'drivers' ? 'Swap Vehicle' : 'Swap Driver'}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-2">
                    {selectedData ? (
                        <Card>
                            <CardContent className="space-y-6">
                                <h2 className="text-sm">
                                    {type === 'drivers'
                                        ? 'Select a new vehicle for this driver.'
                                        : 'Select a new driver for this vehicle.'}
                                </h2>

                                {loading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <Select
                                        value={data.newId}
                                        onValueChange={(value) =>
                                            setData('newId', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={
                                                    type === 'drivers'
                                                        ? 'Select a vehicle'
                                                        : 'Select a driver'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {type === 'drivers' &&
                                                vehicles.map((vehicle) => (
                                                    <SelectItem
                                                        key={vehicle.id.toString()}
                                                        value={vehicle.id.toString()}
                                                    >
                                                        {vehicle.PlateNumber} - {vehicle.Model} - {vehicle.Brand}
                                                    </SelectItem>
                                                ))}
                                            {type === 'vehicles' &&
                                                drivers.map((driver) => (
                                                    <SelectItem
                                                        key={driver.id.toString()}
                                                        value={driver.id.toString()}
                                                    >
                                                        {driver.FirstName}{' '}
                                                        {driver.LastName}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                )}

                                {errors.newId && (
                                    <p className="text-red-500 text-sm">
                                        {errors.newId}
                                    </p>
                                )}

                                <div className="flex justify-end space-x-3">
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setOpenSwapModal(false)
                                        }
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={
                                            processing || !data.newId
                                        }
                                    >
                                        {processing
                                            ? 'Swapping...'
                                            : type === 'drivers'
                                            ? 'Swap Vehicle'
                                            : 'Swap Driver'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <p className="text-gray-500">
                            {type === 'drivers'
                                ? 'No driver selected.'
                                : 'No vehicle selected.'}
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
