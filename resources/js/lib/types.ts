export interface Passenger {
    lastName: string;
    firstName: string;
    contactNumber: string;
    address: string;
}

export interface DateParts {
    day: string;
    month: string;
    year: string;
}

export interface BookingFormData {
    general: {
        unitId: string;
        driverId: string;
        pickupAddress: string;
        dropoffAddress: string;
        pickupDate: DateParts;
        dropoffDate: DateParts;
        tripType: string;
    };
    tripId: integer;
    passengers: Passenger[];
    payment: {
        baseFee: number;
        additionalFee: number;
        passengerInsurance: number;
        others: number;
    };
}
