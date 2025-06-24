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
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().slice(0, 16);

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

    const toDate = (dateObj: any) => {
        if (
            !dateObj.year ||
            !dateObj.month ||
            !dateObj.day ||
            !dateObj.hours ||
            !dateObj.minutes
        ) {
            return null;
        }
        return new Date(
            Number(dateObj.year),
            Number(dateObj.month) - 1,
            Number(dateObj.day),
            Number(dateObj.hours),
            Number(dateObj.minutes)
        );
    };


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
    
    const [noDataFound, setNoDataFound] = useState(false);
    
  // Ensure plateNumber is updated both in the state and formData
const handlePlateNumberChange = (value: string) => {
    setPlateNumber(value);
    
    const vehicle = vehiclesData.find((v) => v.PlateNumber === value);
    if (vehicle) {
        const driver = driversData.find((d) => d.id === vehicle.driver_id); 
        const operator = operatorsData.find((o) => o.OperatorId === driver?.OperatorId);
        const company = companiesData.find((c) => c.VRCompanyId === operator?.VRCompanyId);
        
        setSelectedCompany(company || {});
        setSelectedOperator(operator || {});
        setSelectedVehicle(vehicle || {});
        setSelectedDriver(driver || {});
        
        updateFormData('general', {
            ...formData.general,
            plateNumber: value,  // Update plateNumber explicitly in formData
            unitId: vehicle.id,
            driverId: vehicle?.driver_id || '',
        });

        setNoDataFound(false);  // Data found, so reset noDataFound state
    } else {
        // No matching vehicle found
        setNoDataFound(true);
        setSelectedCompany({});
        setSelectedOperator({});
        setSelectedVehicle({});
        setSelectedDriver({});
    }
};

    

    const handleDateTimeChange = (dateType: 'pickup' | 'dropoff', value: string) => {
        const [date, time] = value.split('T');
        const [year, month, day] = date.split('-');
        const [hours, minutes] = time.split(':');
    
        updateFormData('general', {
            ...formData.general,
            [`${dateType}Date`]: {
                year,
                month,
                day,
                hours,
                minutes,
            },
        });
    };
    

    const handleTripTypeSelect = (type: string) => {
        setSelectedTripType(type);
        handleInputChange('tripType', type);
        setShowTripTypeDropdown(false);
    };

    const isPickupBeforeDropoff = () => {
        const pickup = toDate(formData.general.pickupDate);
        const dropoff = toDate(formData.general.dropoffDate);
        if (!pickup || !dropoff) return true; // Don't block if either is missing
        return pickup < dropoff;
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

        const isDateOrderValid = isPickupBeforeDropoff();

        return areRequiredFieldsFilled && areAddressesValid && isDateOrderValid;
    };

    return (
        <div className="space-y-6">
            <div className={`flex flex-col p-2 rounded-xl transition-all duration-300 ${
                !plateNumber ? 'border border-red-600' : 'border border-transparent'
            }`}>
                <div className='grid grid-cols-1 gap-6 py-6'>
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
                    
                </div>
            </div>


            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${
                !plateNumber
                    ? 'opacity-0 pointer-events-none h-0'
                    : 'opacity-100 pointer-events-auto h-full'
                }`}>
                {noDataFound ? (
                    <div className="flex items-center justify-center p-6 text-gray-500">
                        <p>Nothing found.</p>
                    </div>
                ) : (
                    <>
                    <div className="space-y-2">
                        <Label htmlFor="vrCompanyId">VR Company ID</Label>
                        <Input id="vrCompanyId" placeholder="Search from active VR companies" value={selectedCompany.id || 'No Data Found'} disabled className='border-0 shadow-none bg-transparent'/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="vrCompanyName">VR Company Name</Label>
                        <Input id="vrCompanyName" placeholder="Fetch from entered VR ID" value={selectedCompany.CompanyName || 'No Data Found'} disabled className='border-0 shadow-none bg-transparent'/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="operatorId">Operator ID</Label>
                        <Input id="operatorId" placeholder="Search from active operators" value={selectedOperator.id || 'No Data Found'} disabled className='border-0 shadow-none bg-transparent'/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="operatorName">Operator Name</Label>
                        <Input
                            id="operatorName"
                            placeholder="Fetch from entered operator ID"
                            value={`${selectedOperator.user?.FirstName || ''} ${selectedOperator.user?.LastName || ''}` || 'No Data Found'}
                            disabled
                            className='border-0 shadow-none bg-transparent'
                        />
                    </div>
                
                    <div className="space-y-2">
                        <Label htmlFor="unitId">Unit ID (Vehicle)</Label>
                        <Input id="unitId" placeholder="Search from active operators" value={selectedVehicle.id || 'No Data Found'} disabled className='border-0 shadow-none bg-transparent'/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="unitModel">Unit Model</Label>
                        <Input id="unitModel" placeholder="Fetch from Unit ID" value={selectedVehicle.Model || 'No Data Found'} disabled className='border-0 shadow-none bg-transparent'/>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="numberOfSeats">Number of Seats</Label>
                        <Input id="numberOfSeats" placeholder="Fetch from Unit ID" value={selectedVehicle.SeatNumber || 'No Data Found'} disabled className='border-0 shadow-none bg-transparent'/>
                    </div>
                

                
                    <div className="space-y-2">
                        <Label htmlFor="driverId">Driver ID</Label>
                        <Input
                            id="driverId"
                            placeholder="Search from active operators"
                            value={selectedVehicle.driver_id || 'No Data Found'}
                            onChange={(e) => handleInputChange('driverId', e.target.value)}
                            disabled
                            className='border-0 shadow-none bg-transparent'/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="driverName">Driver Name</Label>
                        <Input
                            id="driverName"
                            placeholder="Fetch from driver ID"
                            value={`${selectedDriver.user?.FirstName || ''} ${selectedDriver.user?.LastName || 'No Data Found'}`}
                            disabled
                            className='border-0 shadow-none bg-transparent'/>
                    </div>
                

                
                    <div className="space-y-2">
                        <Label htmlFor="licenseNumber">License Number</Label>
                        <Input id="licenseNumber" placeholder="Fetch from driver ID" value={selectedDriver.LicenseNumber || 'No Data Found' } disabled className='border-0 shadow-none bg-transparent'/>
                    </div>
                    </>
                )
                }
            
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                  <div className="space-y-2">
    <Label>Pick-up Date and Time</Label>
    <div className="grid grid-cols-1 gap-2">
        <Input
            id="pickupDateTime"
            type="datetime-local"
            className="block w-full rounded-md border border-gray-300 p-2"
            value={`${formData.general.pickupDate.year}-${formData.general.pickupDate.month?.padStart(2, '0')}-${formData.general.pickupDate.day?.padStart(2, '0')}T${formData.general.pickupDate.hours?.padStart(2, '0')}:${formData.general.pickupDate.minutes?.padStart(2, '0')}`}
            onChange={(e) => handleDateTimeChange('pickup', e.target.value)}
            min={currentDateString} // This will set the minimum date and time to now
        />
    </div>
    {(!formData.general.pickupDate.day || !formData.general.pickupDate.month || !formData.general.pickupDate.year || !formData.general.pickupDate.hours || !formData.general.pickupDate.minutes) && (
        <p className="text-sm text-red-500">Pick-up date and time are required.</p>
    )}
</div>

<div className="space-y-2">
    <Label>Drop-off Date and Time</Label>
    <div className="grid grid-cols-1 gap-2">
        <Input
            id="dropoffDateTime"
            type="datetime-local"
            className="block w-full rounded-md border border-gray-300 p-2"
            value={`${formData.general.dropoffDate.year}-${formData.general.dropoffDate.month?.padStart(2, '0')}-${formData.general.dropoffDate.day?.padStart(2, '0')}T${formData.general.dropoffDate.hours?.padStart(2, '0')}:${formData.general.dropoffDate.minutes?.padStart(2, '0')}`}
            onChange={(e) => handleDateTimeChange('dropoff', e.target.value)}
            min={currentDateString} // This will set the minimum date and time to now
        />
    </div>
    {(!formData.general.dropoffDate.day || !formData.general.dropoffDate.month || !formData.general.dropoffDate.year || !formData.general.dropoffDate.hours || !formData.general.dropoffDate.minutes) && (
        <p className="text-sm text-red-500">Drop-off date and time are required.</p>
    )}
    {!isPickupBeforeDropoff() && (
    <p className="text-sm text-red-500">
        Pick-up date and time must be earlier than drop-off date and time.
    </p>
)}
</div>


            </div>
            
            <div className='grid grid-cols-1'>
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
