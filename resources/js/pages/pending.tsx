/* eslint-disable @typescript-eslint/no-unused-vars */
import { generateColumns } from '@/components/RecordsComponent/columns';
import { DataTable } from '@/components/RecordsComponent/data-table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Filter } from 'lucide-react';
import { useState } from 'react';
import MainLayout from './mainLayout';
import { OperatorDetails } from './pending-operator-details';

interface Owner {
    VR_FK: number;
    Owner_ID: number;
    LastName: string;
    FirstName: string;
    Address: string;
    BirthDate: string;
    ContactNumber: string;
    Email: string;
}

interface VR {
    VR_ID: number;
    BusinessPermit: media;
    BusinessPermitNumber: string;
    CompanyName: string;
    BIR_2303: media;
    DTI_Permit: media;
    BrandLogo: media;
    SalesInvoice: media;
    FirstName: string;
    LastName: string;
    Position: string;
    ContactNumber: string;
    Email: string;
}

interface Operator {
    OP_ID: number;
    VR_FK: number;
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
}

interface Driver {
    Driver_ID: number;
    Operator_ID: number;
    Unit_ID: number;
    LastName: string;
    FirstName: string;
    BirthDate: string;
    Address: string;
    ContactNumber: number;
    Email: string;
    Status: string;
    License: media;
    LicenseNumber: number;
    Photo: media;
    NBI_clearance: media;
    Police_clearance: media;
    BIR_clearance: media;
}

interface Unit {
    Unit_ID: number;
    Operator_ID: number;
    Model: string;
    Brand: string;
    PlateNumber: string;
    Seats: number;
    OR: media;
    CR: media;
    ID_card: media;
    GPS_Certificate: media;
    Inspection_certificate: media;
    Front_photo: media;
    Back_photo: media;
    Side_photo: media;
    Front_photo: media;
}

export default function Pending() {
    const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
    const [selectedItemDD1, setSelectedItemDD1] = useState('All');
    const [selectedItemDD2, setSelectedItemDD2] = useState('All');

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pending' }];

    const columns = generateColumns(
        [
            // Column for displaying the title based on the type of record
            {
                key: 'title',
                label: 'Title',
                cell: ({ row }) => {
                    const data = row.original;

                    // If it's a VR, show the company name
                    if (data.VR_ID) {
                        return data.CompanyName || 'Unknown Company';
                    }

                    // If it's an Operator or Driver, show the full name
                    if (data.OP_ID || data.Driver_ID) {
                        return `${data.FirstName} ${data.MiddleName ? data.MiddleName + '.' : ''} ${data.LastName}`;
                    }

                    // If it's a Unit, show the license plate
                    if (data.Unit_ID) {
                        return data.PlateNumber || 'Unknown Plate';
                    }

                    // Default fallback
                    return 'Unknown';
                },
            },
            // Column for Status
            { key: 'Status', label: 'Status' },
            // Column for Date Applied
            { key: 'DateApplied', label: 'Date Applied' },
        ],
        {
            sortableColumns: ['title', 'Status', 'DateApplied'], // Allow sorting by title, status, and date applied
            statusColumns: ['Status'], // Apply status styling to the Status column
            entityType: 'operators', // Set the entity type to operators
        },
    );

    const operators: Operator[] = [
        {
            OP_ID: 1234,
            VR_ID: 1,
            Status: 'Complete',
            vrCompany: 'Nokarin',
            LastName: 'Co Young',
            FirstName: 'Sue',
            MiddleName: 'B',
            DateApplied: '2024-02-15',
            Birthdate: '12/30/1984',
            Address: 'BB Fisher Mall Malabon #23 Batumbakal Street',
            ContactNumber: '09163939373',
            Email: 'coyoung@nokarin.com',
        },
        {
            OP_ID: 1235,
            VR_ID: 2,
            Status: 'Complete',
            vrCompany: 'Nokarin',
            LastName: 'Latko',
            FirstName: 'Cathy',
            MiddleName: 'B',
            DateApplied: '2024-03-10',
            Birthdate: '12/30/1984',
            Address: 'BB Fisher Mall Malabon #23 Batumbakal Street',
            ContactNumber: '09163939373',
            Email: 'latko@nokarin.com',
        },
        {
            OP_ID: 1236,
            VR_ID: 1,
            Status: 'Pending',
            vrCompany: 'Alps',
            LastName: 'Owako',
            FirstName: 'Bob',
            DateApplied: '2024-04-05',
            Birthdate: '12/30/1984',
            Address: 'BB Fisher Mall Malabon #23 Batumbakal Street',
            ContactNumber: '09163939373',
            Email: 'owako@alps.com',
        },
        {
            OP_ID: 1237,
            VR_ID: 1,
            Status: 'Pending',
            vrCompany: 'Alps',
            LastName: 'Kalbo',
            FirstName: 'Allen',
            DateApplied: '2024-04-05',
            Birthdate: '12/30/1984',
            Address: 'BB Fisher Mall Malabon #23 Batumbakal Street',
            ContactNumber: '09163939373',
            Email: 'kalbo@alps.com',
        },
        {
            OP_ID: 1238,
            VR_ID: 1,
            Status: 'Rejected',
            vrCompany: 'Alps',
            LastName: 'James III',
            FirstName: 'Lebron',
            DateApplied: '2024-04-05',
            Birthdate: '12/30/1984',
            Address: 'BB Fisher Mall Malabon #23 Batumbakal Street',
            ContactNumber: '09163939373',
            Email: 'lebron@alps.com',
        },
    ];

    const owners: Owner[] = [
        {
            Owner_ID: 1331,
            VR_ID: 1,
            LastName: 'Laxamana',
            FirstName: 'Justin',
            Address: 'BB Fisher Mall Malabon #23 Batumbakal Street',
            BirthDate: '12/30/1984',
            ContactNumber: '09163939373',
            Email: 'kalbo@victory.com',
        },
        {
            Owner_ID: 1332,
            VR_ID: 2,
            LastName: 'Aquino',
            FirstName: 'Crystal Kate',
            Address: 'BB Fisher Mall Malabon #23 Batumbakal Street',
            BirthDate: '12/30/2002',
            ContactNumber: '09163939373',
            Email: 'aquino@nokarin.com',
        },
    ];

    const vrs: VR[] = [
        {
            VR_ID: 9876,
            BusinessPermit:
                'https://64.media.tumblr.com/e60b89b8ea13a3c9f2df6d55bfeeb45e/b56bdb39803ed67d-ea/s1280x1920/bc3701015454c0f774ad07982d1e2c9e77ea9936.png',
            BusinessPermitNumber: '123456789',
            CompanyName: 'Nokarin',
            BIR_2303:
                'https://64.media.tumblr.com/e60b89b8ea13a3c9f2df6d55bfeeb45e/b56bdb39803ed67d-ea/s1280x1920/bc3701015454c0f774ad07982d1e2c9e77ea9936.png',
            DTI_Permit:
                'https://64.media.tumblr.com/e60b89b8ea13a3c9f2df6d55bfeeb45e/b56bdb39803ed67d-ea/s1280x1920/bc3701015454c0f774ad07982d1e2c9e77ea9936.png',
            BrandLogo:
                'https://64.media.tumblr.com/e60b89b8ea13a3c9f2df6d55bfeeb45e/b56bdb39803ed67d-ea/s1280x1920/bc3701015454c0f774ad07982d1e2c9e77ea9936.png',
            SalesInvoice:
                'https://64.media.tumblr.com/e60b89b8ea13a3c9f2df6d55bfeeb45e/b56bdb39803ed67d-ea/s1280x1920/bc3701015454c0f774ad07982d1e2c9e77ea9936.png',
            FirstName: 'Sue',
            LastName: 'Co Young',
            MiddleName: 'B',
            Position: 'CEO',
            ContactNumber: '09163939373',
            Email: 'coyoung@nokarin.com',
        },
        {
            VR_ID: 9877,
            BusinessPermit:
                'https://preview.redd.it/no-spoilers-give-me-your-arcane-memes-and-i-shall-giveth-v0-xietz7vij81e1.jpeg?width=640&crop=smart&auto=webp&s=a14e22f16d97fc5426767364b1e64fd44e3065be0',
            BusinessPermitNumber: '123456789',
            CompanyName: 'Alps',
            BIR_2303:
                'https://preview.redd.it/no-spoilers-give-me-your-arcane-memes-and-i-shall-giveth-v0-xietz7vij81e1.jpeg?width=640&crop=smart&auto=webp&s=a14e22f16d97fc5426767364b1e64fd44e3065be',
            DTI_Permit:
                'https://preview.redd.it/no-spoilers-give-me-your-arcane-memes-and-i-shall-giveth-v0-xietz7vij81e1.jpeg?width=640&crop=smart&auto=webp&s=a14e22f16d97fc5426767364b1e64fd44e3065be',
            BrandLogo:
                'https://preview.redd.it/no-spoilers-give-me-your-arcane-memes-and-i-shall-giveth-v0-xietz7vij81e1.jpeg?width=640&crop=smart&auto=webp&s=a14e22f16d97fc5426767364b1e64fd44e3065be',
            SalesInvoice:
                'https://preview.redd.it/no-spoilers-give-me-your-arcane-memes-and-i-shall-giveth-v0-xietz7vij81e1.jpeg?width=640&crop=smart&auto=webp&s=a14e22f16d97fc5426767364b1e64fd44e3065be ',
            FirstName: 'Bob',
            LastName: 'Owako',
            Position: 'CEO',
            ContactNumber: '09163939373',
            Email: 'owako@alps.com',
        },
    ];

    const drivers: Driver[] = [
        {
            Driver_ID: 1,
            Operator_ID: 101,
            Unit_ID: 201,
            LastName: 'Dela Cruz',
            FirstName: 'Juan',
            BirthDate: '04-15-1985',
            Address: '123 Sampaguita St., Manila',
            ContactNumber: 9123456789,
            Email: 'juan.delacruz@example.com',
            Status: 'assigned',
            License: 'https://example.com/licenses/juan_license.jpg',
            LicenseNumber: 123456789,
            Photo: 'https://example.com/photos/juan_photo.jpg',
            NBI_clearance: 'https://example.com/documents/juan_nbi.jpg',
            Police_clearance: 'https://example.com/documents/juan_police.jpg',
            BIR_clearance: 'https://example.com/documents/juan_bir.jpg',
        },
        {
            Driver_ID: 2,
            Operator_ID: 102,
            Unit_ID: 202,
            LastName: 'Reyes',
            FirstName: 'Maria',
            BirthDate: '08-22-1990',
            Address: '456 Rizal Ave., Quezon City',
            ContactNumber: 9123456788,
            Email: 'maria.reyes@example.com',
            Status: 'onStandby',
            License: 'https://example.com/licenses/maria_license.jpg',
            LicenseNumber: 987654321,
            Photo: 'https://example.com/photos/maria_photo.jpg',
            NBI_clearance: 'https://example.com/documents/maria_nbi.jpg',
            Police_clearance: 'https://example.com/documents/maria_police.jpg',
            BIR_clearance: 'https://example.com/documents/maria_bir.jpg',
        },
    ];

    const units: Unit[] = [
        [
            {
                Unit_ID: 201,
                Operator_ID: 101,
                Model: 'HiAce Commuter',
                Brand: 'Toyota',
                PlateNumber: 'ABC-1234',
                Seats: 15,
                OR: 'https://example.com/documents/vehicle201_or.jpg',
                CR: 'https://example.com/documents/vehicle201_cr.jpg',
                ID_card: 'https://example.com/documents/vehicle201_idcard.jpg',
                GPS_Certificate: 'https://example.com/documents/vehicle201_gps.jpg',
                Inspection_certificate: 'https://example.com/documents/vehicle201_inspection.jpg',
                Front_photo: 'https://example.com/photos/vehicle201_front.jpg',
                Back_photo: 'https://example.com/photos/vehicle201_back.jpg',
                Side_left_photo: 'https://example.com/photos/vehicle201_left.jpg',
                Side_right_photo: 'https://example.com/photos/vehicle201_right.jpg',
            },
            {
                Unit_ID: 202,
                Operator_ID: 102,
                Model: 'L300 Exceed',
                Brand: 'Mitsubishi',
                PlateNumber: 'XYZ-5678',
                Seats: 17,
                OR: 'https://example.com/documents/vehicle202_or.jpg',
                CR: 'https://example.com/documents/vehicle202_cr.jpg',
                ID_card: 'https://example.com/documents/vehicle202_idcard.jpg',
                GPS_Certificate: null,
                Inspection_certificate: 'https://example.com/documents/vehicle202_inspection.jpg',
                Front_photo: 'https://example.com/photos/vehicle202_front.jpg',
                Back_photo: 'https://example.com/photos/vehicle202_back.jpg',
                Side_left_photo: 'https://example.com/photos/vehicle202_left.jpg',
                Side_right_photo: 'https://example.com/photos/vehicle202_right.jpg',
            },
        ],
    ];

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Pending" />

            {selectedOperator ? (
                <OperatorDetails
                    operator={selectedOperator}
                    onBack={() => setSelectedOperator(null)}
                    vr={vrs.find((vr) => vr.CompanyName === selectedOperator.vrCompany) || null}
                    owner={owners.find((owner) => owner.VR_ID === vrs.find((vr) => vr.CompanyName === selectedOperator.vrCompany)?.VR_ID) || null}
                />
            ) : (
                <>
                    <div className="ml-5 flex items-center">
                        <h2 className="text-xl font-semibold">{selectedItemDD1} - (Still not functional)</h2>
                        <div className="ml-auto">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="flex w-40 items-center justify-start gap-2 bg-white text-black hover:bg-[#2A2A92] hover:text-white"
                                    >
                                        {selectedItemDD1}
                                        <Filter className="ml-auto h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-40">
                                    <DropdownMenuItem onClick={() => setSelectedItemDD1('All')}>All</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedItemDD1('Vehicle Rentals')}>Vehicle Rentals</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedItemDD1('Operators')}>Operators</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedItemDD1('Vehicle')}>Vehicle</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedItemDD1('Drivers')}>Drivers</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="rounded-sm border border-gray-300 p-5">
                        <DataTable data={operators} columns={columns} onRowClick={(row) => setSelectedOperator(row)} />
                    </div>
                </>
            )}
        </MainLayout>
    );
}
