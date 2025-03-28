import TripTicketModal from '@/components/trip-booking/view-trip-modal';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { DataTable } from '../components/RecordsComponent/data-table';
import MainLayout from './mainLayout';
import { usePage } from '@inertiajs/react';

export default function Bookings({ bookings }) {
    const { props } = usePage();

    const userRole = props.auth.user?.roles?.[0]?.name;
    const userId = props.auth.user?.id;
    
    let filteredBookings = bookings;
    if (userRole === 'Driver') {
        filteredBookings = bookings.filter(trip => trip.driver.user_id === userId);
    }

    console.log('Filtered Bookings:', filteredBookings);

    let transformedData = transformData(filteredBookings);

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
                <div className="ml-2 flex flex-row items-start py-2">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Table for Trips/Bookings</h3>
                    <Button className="ml-auto w-1/4 bg-blue-900 hover:bg-white hover:text-black" onClick={() => (window.location.href = '/book-trip')}>
                        Generate Trip Ticket
                    </Button>
                </div>
                <DataTable onRowClick={onSelectTrip} columns={columns} data={transformedData} ColumnFilterName="company_name" />
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
