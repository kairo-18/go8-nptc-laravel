'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BookingFormData, Passenger } from '@/lib/types';
import { Plus, Trash2 } from 'lucide-react';

interface PassengersStepProps {
    formData: BookingFormData;
    updateFormData: (step: string, data: any) => void;
    onNext: () => void;
    onPrevious: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
}

export function PassengersStep({ formData, updateFormData, onNext, onPrevious }: PassengersStepProps) {
    const handleInputChange = (index: number, field: keyof Passenger, value: string) => {
        const updatedPassengers = [...formData.passengers];
        updatedPassengers[index] = {
            ...updatedPassengers[index],
            [field]: value,
        };
        updateFormData('passengers', updatedPassengers);
    };

    const addPassenger = () => {
        const updatedPassengers = [...formData.passengers, { LastName: '', FirstName: '', ContactNumber: '', Address: '' }];
        updateFormData('passengers', updatedPassengers);
    };

    const removePassenger = (index: number) => {
        if (formData.passengers.length <= 1) return;
        const updatedPassengers = formData.passengers.filter((_, i) => i !== index);
        updateFormData('passengers', updatedPassengers);
    };

    // Validation function
    const isFormValid = () => {
        return formData.passengers.every(
            (passenger) =>
                passenger.LastName.trim() !== '' &&
                passenger.FirstName.trim() !== '' &&
                passenger.ContactNumber.trim() !== '' &&
                passenger.Address.trim() !== '',
        );
    };

    return (
        <div className="space-y-6">
            {formData.passengers.map((passenger, index) => (
                <div key={index} className="relative space-y-4 rounded-md border p-4">
                    {formData.passengers.length > 1 && (
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={() => removePassenger(index)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove passenger</span>
                        </Button>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor={`lastName-${index}`}>Last Name</Label>
                            <Input
                                id={`lastName-${index}`}
                                placeholder="Enter last name"
                                value={passenger.LastName}
                                onChange={(e) => handleInputChange(index, 'LastName', e.target.value)}
                            />
                            {passenger.LastName.trim() === '' && <p className="text-sm text-red-500">Last name is required.</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`firstName-${index}`}>First Name</Label>
                            <Input
                                id={`firstName-${index}`}
                                placeholder="Enter first name"
                                value={passenger.FirstName}
                                onChange={(e) => handleInputChange(index, 'FirstName', e.target.value)}
                            />
                            {passenger.FirstName.trim() === '' && <p className="text-sm text-red-500">First name is required.</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor={`contactNumber-${index}`}>Contact Number</Label>
                            <Input
                                id={`contactNumber-${index}`}
                                placeholder="Enter contact number"
                                value={passenger.ContactNumber}
                                onChange={(e) => handleInputChange(index, 'ContactNumber', e.target.value)}
                            />
                            {passenger.ContactNumber.trim() === '' && <p className="text-sm text-red-500">Contact number is required.</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`address-${index}`}>Address</Label>
                            <Input
                                id={`address-${index}`}
                                placeholder="Enter address"
                                value={passenger.Address}
                                onChange={(e) => handleInputChange(index, 'Address', e.target.value)}
                            />
                            {passenger.Address.trim() === '' && <p className="text-sm text-red-500">Address is required.</p>}
                        </div>
                    </div>
                </div>
            ))}

            <Button className="flex w-full items-center justify-center gap-2 bg-black text-white" onClick={addPassenger}>
                <Plus className="h-4 w-4" />
                Add Passenger
            </Button>

            <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" className="bg-white" onClick={onPrevious}>
                    Previous
                </Button>
                <Button onClick={onNext} disabled={!isFormValid()}>
                    Next
                </Button>
            </div>
        </div>
    );
}
