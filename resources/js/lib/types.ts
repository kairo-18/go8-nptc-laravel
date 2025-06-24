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

export interface Operator {
    NPTC_ID: string;
    id: number;
    Status: string;
    vrCompany: string;
    LastName: string;
    FirstName: string;
    MiddleName?: string;
    DateApplied: string;
    Birthdate: string;
    Address: string;
    ContactNumber: string;
    Email: string;
    created_at: string;
    vr_company_id: number;
}

export interface Driver {
    NPTC_ID: string;
    id: number;
    operator_id: number;
    Status: string;
    LastName: string;
    FirstName: string;
    Birthday: string;
    Address: string;
    ContactNumber: string;
    email: string;
    LicenseNumber: string;
    LicenseImg: string;
    Photo1x1: string;
    NbiClearance: string;
    PoliceClearance: string;
    BirClearance: string;
    created_at: string;
    vr_company_id: number;
}

export interface Vehicle {
    NPTC_ID: string;
    id: number;
    driver_id: number;
    Status: string;
    Model: string;
    Brand: string;
    PlateNumber: string;
    SeatNumber: number;
    OrImage: string;
    CrImage: string;
    IdCard: number;
    GpsImage: string;
    InspectionCertification: string;
    CarFront: string;
    CarSideLeft: string;
    CarSideRight: string;
    CarBack: string;
    created_at: string;
    vr_company_id: number;
}

export interface VRCompany {
    NPTC_ID: string;
    id: number;
    Status: string;
    CompanyName: string;
    BusinessPermitNumber: string;
    created_at: string;
}

export type ApplicationData = (Operator | Vehicle | VRCompany) & { type: string };
