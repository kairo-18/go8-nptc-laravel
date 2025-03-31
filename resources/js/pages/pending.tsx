import PendingCompanyDetails from '@/components/Pending/pending-company-details';
import PendingDriverDetails from '@/components/Pending/pending-driver-details';
import PendingOperatorDetails from '@/components/Pending/pending-operator-details';
import PendingVehicleDetails from '@/components/Pending/pending-vehicle-details';
import { DataTable } from '@/components/RecordsComponent/data-table';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { Ellipsis, TimerIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import MainLayout from './mainLayout';

// Interfaces for different application types
interface Operator {
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

interface Driver {
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

interface Vehicle {
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

interface VRCompany {
    NPTC_ID: string;
    id: number;
    Status: string;
    CompanyName: string;
    BusinessPermitNumber: string;
    created_at: string;
}

// Unified type for the data table
type ApplicationData = (Operator  | Vehicle | VRCompany) & { type: string };

export default function Pending() {
    const [data, setData] = useState<ApplicationData[]>([]);
    const [selectedItem, setSelectedItem] = useState<ApplicationData | null>(null);

    const { props } = usePage<{ auth: { user?: { id: number; roles?: { name: string }[] } } }>();
    const userRole = props.auth.user?.roles?.[0]?.name;
    const vrCompanyId = props.auth.vr_company_id;

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pending' }];

    useEffect(() => {
        axios
            .get('/pending-data')
            .then((response) => {
                let { operators, drivers, vrCompanies, vehicles } = response.data;

                if (userRole === 'VR Admin') {
                    vrCompanies = [];
                }

                const filteredOperators =
                    userRole === 'VR Admin' ? operators.filter((operator: Operator) => operator.vr_company_id === vrCompanyId) : operators;

                const filteredDrivers = userRole === 'VR Admin' ? drivers.filter((driver: Driver) => driver.vr_company_id === vrCompanyId) : drivers;

                const filteredVehicles =
                    userRole === 'VR Admin' ? vehicles.filter((vehicle: Vehicle) => vehicle.operator.vr_company.id === vrCompanyId) : vehicles;

                const combinedData: ApplicationData[] = [
                    ...filteredOperators.map((operator: Operator) => ({
                        ...operator,
                        type: 'Operator',
                    })),
                    ...vrCompanies.map((company: VRCompany) => ({
                        ...company,
                        type: 'VR Company',
                    })),
                    ...filteredVehicles.map((vehicle: Vehicle) => ({
                        ...vehicle,
                        type: 'Vehicle',
                    })),
                ];

                setData(combinedData);
            })
            .catch((error) => {
                console.error('Error fetching pending data:', error);
            });
    }, []);

    const handleRowClick = (item: ApplicationData) => {
        setSelectedItem(item);
    };
    const updatedData = data.map((row) => ({
        ...row,
        Filter: `${row.Status ? `${row.Status} ` : ''}${row.NPTC_ID || ''}`, // ✅ Add combined value here
    }));

    const columns: ColumnDef<ApplicationData>[] = [
        {
            id: 'select',
            header: ({ table }) => <input type="checkbox" onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)} />,
            cell: ({ row }) => <input type="checkbox" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />,
        },
        {
            accessorKey: 'NPTC_ID',
            header: 'ID',
        },
        {
            accessorKey: 'type',
            header: 'Type',
            cell: ({ row }) => {
                const type = row.getValue('type');

                // Map data types to colors
                const typeColors: Record<string, string> = {
                    'VR Company': 'bg-red-500 text-white',
                    Operator: 'bg-yellow-500 text-White',
                    Driver: 'bg-green-500 text-white',
                    Vehicle: 'bg-blue-500 text-white',
                };

                return <span className={`rounded-md px-2 py-1 text-sm font-medium ${typeColors[type] || 'bg-gray-200 text-black'}`}>{type}</span>;
            },
        },

        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => {
                const item = row.original;
                if (item.type === 'Operator' || item.type === 'Driver') {
                    return `${item.user.FirstName} ${item.user.LastName}`;
                } else if (item.type === 'VR Company') {
                    return item.CompanyName;
                } else if (item.type === 'Vehicle') {
                    return item.PlateNumber;
                }
                return '-';
            },
        },

        {
            accessorKey: 'Status',
            header: 'Status',
            cell: ({ row }) => (
                <div className="flex items-center">
                    <TimerIcon className="mr-2 h-4 w-4 text-gray-600" />
                    <span>{row.getValue('Status')}</span>
                </div>
            ),
        },

        {
            accessorKey: 'created_at',
            header: 'Date of Application',
            cell: ({ row }) => {
                const date = row.original.created_at;
                return date ? new Date(date).toLocaleDateString() : '-';
            },
        },

        {
            accessorKey: 'Filter',
            header: () => <div className="hidden">Filter</div>,
            cell: ({ row }) => (
                <div className="hidden">
                    `${row.original.Status ? `${row.original.Status} ` : ''}${row.original.NPTC_ID || ''}`
                </div>
            ),
            enableHiding: false, // Prevents it from being toggled off
            meta: { className: 'hidden' }, // Applies a hidden class
        },

        {
            id: 'actions',
            cell: ({ row }) => (
                <Button variant="ghost" onClick={() => handleRowClick(row.original)}>
                    <Ellipsis className="h-4 w-4" />
                </Button>
            ),
        },
    ];

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Pending" />
            <div className="p-10">
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Pending</h2>
                    <p className="text-gray-600">Final approval of applications</p>

                    {selectedItem && (
                        <div className="relative rounded-md border bg-white p-4 shadow-md">
                            <Button className="absolute top-2 right-2" variant="ghost" onClick={() => setSelectedItem(null)}>
                                <X className="h-5 w-5" />
                            </Button>
                            {selectedItem.type === 'Operator' ? (
                                <PendingOperatorDetails item={selectedItem} role={userRole} />
                            ) : selectedItem.type === 'Driver' ? (
                                <PendingDriverDetails item={selectedItem} role={userRole} /> // Ensure this is the correct component
                            ) : selectedItem.type === 'VR Company' ? (
                                <PendingCompanyDetails item={selectedItem} />
                            ) : selectedItem.type === 'Vehicle' ? (
                                <PendingVehicleDetails item={selectedItem} />
                            ) : null}
                        </div>
                    )}
                    <DataTable columns={columns} data={updatedData} onRowClick={handleRowClick} ColumnFilterName="Filter" />
                </div>
            </div>
        </MainLayout>
    );
}
