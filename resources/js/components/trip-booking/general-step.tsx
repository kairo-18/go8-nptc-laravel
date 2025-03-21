'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BookingFormData } from '@/lib/types';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface GeneralStepProps {
    formData: BookingFormData;
    updateFormData: (step: string, data: any) => void;
    onNext: () => void;
    onPrevious: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
    drivers: any[];
    companies: any[];
    operators: any[];
    vehicles: any[];
}

export function GeneralStep({
    drivers,
    companies,
    operators,
    vehicles,
    formData,
    updateFormData,
    onNext,
    onPrevious,
    isFirstStep,
}: GeneralStepProps) {
    const [showTripTypeDropdown, setShowTripTypeDropdown] = useState(false);
    const [selectedTripType, setSelectedTripType] = useState(formData.general.tripType || 'Select trip type');

    const [companiesData, setCompaniesData] = useState<any[]>([]);
    const [operatorsData, setOperatorsData] = useState<any[]>([]);
    const [vehiclesData, setVehiclesData] = useState<any[]>([]);
    const [driversData, setDriversData] = useState<any[]>([]);

    const [plateNumber, setPlateNumber] = useState('');

    const [selectedCompany, setSelectedCompany] = useState<any>({});
    const [selectedOperator, setSelectedOperator] = useState<any>({});
    const [selectedVehicle, setSelectedVehicle] = useState<any>({});
    const [selectedDriver, setSelectedDriver] = useState<any>({});

    const tripTypes = [
        'Drop-off',
        'Airport Pick-up',
        'Wedding',
        'City Tour',
        'Vacation',
        'Team Building',
        'Home Transfer',
        'Corporate',
        'Government',
        'Others',
    ];

    useEffect(() => {
        setCompaniesData(companies);
        setOperatorsData(operators);
        setVehiclesData(vehicles);
        setDriversData(drivers);
    }, [companies, operators, vehicles, drivers]);

    const handleInputChange = (field: string, value: string) => {
        updateFormData('general', {
            ...formData.general,
            [field]: value,
        });
    };

    const handlePlateNumberChange = (value: string) => {
        setPlateNumber(value);
        const vehicle = vehiclesData.find((v) => v.PlateNumber === value);
        if (vehicle) {
            const driver = driversData.find((d) => d.UnitId === vehicle?.UnitId);
            const operator = operatorsData.find((o) => o.OperatorId === driver?.OperatorId);
            const company = companiesData.find((c) => c.VRCompanyId === operator?.VRCompanyId);

            setSelectedCompany(company || {});
            setSelectedOperator(operator || {});
            setSelectedVehicle(vehicle || {});
            setSelectedDriver(driver || {});
            updateFormData('general', {
                ...formData.general,
                unitId: vehicle.id,
                driverId: driver.id,
            });
        }
    };

    const handleDateChange = (dateType: 'pickup' | 'dropoff', part: 'day' | 'month' | 'year', value: string) => {
        updateFormData('general', {
            ...formData.general,
            [`${dateType}Date`]: {
                ...formData.general[`${dateType}Date`],
                [part]: value,
            },
        });
    };

    const handleTripTypeSelect = (type: string) => {
        setSelectedTripType(type);
        handleInputChange('tripType', type);
        setShowTripTypeDropdown(false);
    };

    // Validation function
    const isFormValid = () => {
        const { tripType, pickupAddress, dropoffAddress, pickupDate, dropoffDate, plateNumber, driverId, unitId } = formData.general;

        // Check if all required fields are filled
        const areRequiredFieldsFilled =
            tripType &&
            pickupAddress &&
            dropoffAddress &&
            pickupDate.day &&
            pickupDate.month &&
            pickupDate.year &&
            dropoffDate.day &&
            dropoffDate.month &&
            dropoffDate.year &&
            plateNumber &&
            driverId &&
            unitId;

        // Check if addresses are longer than 10 characters
        const areAddressesValid = pickupAddress.length > 10 && dropoffAddress.length > 10;

        return areRequiredFieldsFilled && areAddressesValid;
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="vrCompanyId">VR Company ID</Label>
                    <Input id="vrCompanyId" placeholder="Search from active VR companies" value={selectedCompany.id} disabled />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="vrCompanyName">VR Company Name</Label>
                    <Input id="vrCompanyName" placeholder="Fetch from entered VR ID" value={selectedCompany.CompanyName} disabled />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="operatorId">Operator ID</Label>
                    <Input id="operatorId" placeholder="Search from active operators" value={selectedOperator.id} disabled />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="operatorName">Operator Name</Label>
                    <Input
                        id="operatorName"
                        placeholder="Fetch from entered operator ID"
                        value={`${selectedOperator.user?.FirstName || ''} ${selectedOperator.user?.LastName || ''}`}
                        disabled
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="unitId">Unit ID (Vehicle)</Label>
                    <Input id="unitId" placeholder="Search from active operators" value={selectedVehicle.id} disabled />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="unitModel">Unit Model</Label>
                    <Input id="unitModel" placeholder="Fetch from Unit ID" value={selectedVehicle.Model} disabled />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="plateNumber">Plate Number</Label>
                    <Input
                        id="plateNumber"
                        placeholder="Enter Plate Number"
                        value={plateNumber}
                        onChange={(e) => {
                            handleInputChange('plateNumber', e.target.value);
                            handlePlateNumberChange(e.target.value);
                        }}
                    />
                    {!plateNumber && <p className="text-sm text-red-500">Plate number is required.</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="numberOfSeats">Number of Seats</Label>
                    <Input id="numberOfSeats" placeholder="Fetch from Unit ID" value={selectedVehicle.SeatNumber} disabled />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="driverId">Driver ID</Label>
                    <Input
                        id="driverId"
                        placeholder="Search from active operators"
                        value={selectedDriver.id}
                        onChange={(e) => handleInputChange('driverId', e.target.value)}
                        disabled
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="driverName">Driver Name</Label>
                    <Input
                        id="driverName"
                        placeholder="Fetch from driver ID"
                        value={`${selectedDriver.user?.FirstName || ''} ${selectedDriver.user?.LastName || ''}`}
                        disabled
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input id="licenseNumber" placeholder="Fetch from driver ID" value={selectedDriver.LicenseNumber} disabled />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="pickupAddress">Pick-up Address</Label>
                    <Input
                        id="pickupAddress"
                        placeholder="Enter full address"
                        value={formData.general.pickupAddress}
                        onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                    />
                    {!formData.general.pickupAddress && <p className="text-sm text-red-500">Pick-up address is required.</p>}
                    {formData.general.pickupAddress.length <= 10 && formData.general.pickupAddress.length > 0 && (
                        <p className="text-sm text-red-500">Pick-up address must be more than 10 characters.</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="dropoffAddress">Drop-off Address</Label>
                    <Input
                        id="dropoffAddress"
                        placeholder="Enter drop-off address"
                        value={formData.general.dropoffAddress}
                        onChange={(e) => handleInputChange('dropoffAddress', e.target.value)}
                    />
                    {!formData.general.dropoffAddress && <p className="text-sm text-red-500">Drop-off address is required.</p>}
                    {formData.general.dropoffAddress.length <= 10 && formData.general.dropoffAddress.length > 0 && (
                        <p className="text-sm text-red-500">Drop-off address must be more than 10 characters.</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Pick-up Date</Label>
                    <div className="grid grid-cols-3 gap-2">
                        <Input
                            placeholder="MM"
                            value={formData.general.pickupDate.month}
                            onChange={(e) => handleDateChange('pickup', 'month', e.target.value)}
                        />
                        <Input
                            placeholder="DD"
                            value={formData.general.pickupDate.day}
                            onChange={(e) => handleDateChange('pickup', 'day', e.target.value)}
                        />
                        <Input
                            placeholder="YYYY"
                            value={formData.general.pickupDate.year}
                            onChange={(e) => handleDateChange('pickup', 'year', e.target.value)}
                        />
                    </div>
                    {(!formData.general.pickupDate.day || !formData.general.pickupDate.month || !formData.general.pickupDate.year) && (
                        <p className="text-sm text-red-500">Pick-up date is required.</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>Drop-off Date</Label>
                    <div className="grid grid-cols-3 gap-2">
                        <Input
                            placeholder="MM"
                            value={formData.general.dropoffDate.month}
                            onChange={(e) => handleDateChange('dropoff', 'month', e.target.value)}
                        />
                        <Input
                            placeholder="DD"
                            value={formData.general.dropoffDate.day}
                            onChange={(e) => handleDateChange('dropoff', 'day', e.target.value)}
                        />
                        <Input
                            placeholder="YYYY"
                            value={formData.general.dropoffDate.year}
                            onChange={(e) => handleDateChange('dropoff', 'year', e.target.value)}
                        />
                    </div>
                    {(!formData.general.dropoffDate.day || !formData.general.dropoffDate.month || !formData.general.dropoffDate.year) && (
                        <p className="text-sm text-red-500">Drop-off date is required.</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="tripType">Trip Type</Label>
                <div className="relative">
                    <div
                        className="flex cursor-pointer items-center justify-between rounded-md border px-3 py-2"
                        onClick={() => setShowTripTypeDropdown(!showTripTypeDropdown)}
                    >
                        <span className={selectedTripType === 'Select trip type' ? 'text-muted-foreground' : ''}>{selectedTripType}</span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </div>
                    {showTripTypeDropdown && (
                        <div className="bg-background absolute z-10 mt-1 w-full rounded-md border shadow-lg">
                            {tripTypes.map((type) => (
                                <div
                                    key={type}
                                    className="hover:bg-muted cursor-pointer bg-white px-3 py-2"
                                    onClick={() => handleTripTypeSelect(type)}
                                >
                                    {type}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {!formData.general.tripType && <p className="text-sm text-red-500">Trip type is required.</p>}
            </div>

            <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" className="bg-white" onClick={onPrevious} disabled={isFirstStep}>
                    Previous
                </Button>
                <Button onClick={onNext} disabled={!isFormValid()}>
                    Next
                </Button>
            </div>
        </div>
    );
}
