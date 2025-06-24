import TripTicketModal from '@/components/trip-booking/view-trip-modal';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { DataTable } from '../components/RecordsComponent/data-table';
import MainLayout from './mainLayout';
import { usePage } from '@inertiajs/react';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';


export default function Bookings({ bookings }) {
    const { props } = usePage();

    const userRole = props.auth.user?.roles?.[0]?.name;
    const userId = props.auth.user?.id;

    const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
    let filteredBookings = bookings;
    // Get date from query parameter
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const date = params.get('date');
        if (date) {
            setDateFilter({ start: date, end: date });
        }
    }, []);


    // Role-based filtering
    if (userRole === 'Driver') {
        filteredBookings = bookings.filter((trip: any) => trip.driver?.user_id === userId);
    } else if (userRole === 'VR Company') {
        const userCompanyId = props.auth.user?.vr_company_id;
        filteredBookings = bookings.filter(
            (trip: any) => trip.driver?.operator?.vr_company?.id === userCompanyId
        );
    } // Admins see all

    // Date filtering
    if (dateFilter.start || dateFilter.end) {
        filteredBookings = filteredBookings.filter((trip: any) => {
            const tripDate = new Date(trip.pickupDate);

            // Set start and end boundaries
            const startDate = dateFilter.start ? new Date(dateFilter.start + 'T00:00:00') : null;
            const endDate = dateFilter.end ? new Date(dateFilter.end + 'T23:59:59') : null;

            const startOk = startDate ? tripDate >= startDate : true;
            const endOk = endDate ? tripDate <= endDate : true;
            return startOk && endOk;
        });
    }


    let transformedData = transformData(filteredBookings);


    const customDropdownMenuContent = (
        <DropdownMenuContent align="end" className="p-4 space-y-2">
            <div>
                <label className="block text-sm mb-1">Start Date</label>
                <input
                    type="date"
                    value={dateFilter.start}
                    onChange={e => setDateFilter({ ...dateFilter, start: e.target.value })}
                    className="border rounded px-2 py-1 w-full"
                />
            </div>
            <div>
                <label className="block text-sm mb-1">End Date</label>
                <input
                    type="date"
                    value={dateFilter.end}
                    onChange={e => setDateFilter({ ...dateFilter, end: e.target.value })}
                    className="border rounded px-2 py-1 w-full"
                />
            </div>
            <Button
                className="w-full mt-2"
                onClick={() => setDateFilter({ start: '', end: '' })}
                variant="outline"
            >
                Clear Dates
            </Button>
        </DropdownMenuContent>
    );

    const [open, setOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);

    const columns = [
        {
            accessorKey: 'NPTC_ID',
            header: 'NPTC_ID',
        },
        {
            accessorKey: 'status',
            header: 'Status',
        },
        {
            accessorKey: 'company_name',
            header: 'Company Name',
        },
        {
            accessorKey: 'pickupAddress',
            header: 'From',
        },
        {
            accessorKey: 'dropOffAddress',
            header: 'To',
        },
        {
            accessorKey: 'created_at',
            header: 'Date',
        },
    ];

    const breadcrumbs = [
        {
            title: 'Bookings',
            href: '/bookings',
        },
    ];

    const onSelectTrip = (trip) => {
        const foundTrip = bookings.find((item) => item.id === trip.id);
        setSelectedTrip(foundTrip);
        setOpen(true);

        console.log('Selected Trip:', foundTrip);
    };

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <div className='p-10'>
                <div className="ml-2 flex flex-col md:flex-row justify-center md:justify-between items-center md:items-start py-2 gap-5">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Table for Trips/Bookings</h3>
                    <Button className=" w-full md:w-1/4 bg-blue-900 hover:bg-white hover:text-black" onClick={() => (window.location.href = '/book-trip')}>
                        Generate Trip Ticket
                    </Button>
                </div>
                <DataTable onRowClick={onSelectTrip} columns={columns} data={transformedData} ColumnFilterName="company_name" dropdownMenuContent={customDropdownMenuContent}/>
                {selectedTrip && <TripTicketModal open={open} setOpen={setOpen} selectedTripData={selectedTrip}/>}
            </div>
        </MainLayout>
    );
}

function transformData(response) {
    return response.map((item) => ({
        NPTC_ID: item.NPTC_ID,
        id: item.id,
        status: item.status,
        company_name: item.driver?.operator?.vr_company?.CompanyName || null,
        created_at: formatDate(item.created_at),
        pickupAddress: item.pickupAddress,
        dropOffAddress: item.dropOffAddress,
    }));
}

function formatDate(dateString) {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
