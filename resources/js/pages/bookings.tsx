import TripTicketModal from '@/components/trip-booking/view-trip-modal';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { DataTable } from '../components/RecordsComponent/data-table';
import MainLayout from './mainLayout';

export default function Bookings({ bookings }) {
    let transformedData = transformData(bookings);
    console.log(transformedData);

    const [open, setOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [formattedTripData, setFormattedTripData] = useState(null);
    const columns = [
        {
            accessorKey: 'id',
            header: 'ID',
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
            <Button className="ml-auto w-1/4" onClick={() => (window.location.href = '/book-trip')}>
                Generate Trip Ticket
            </Button>
            <div className="ml-2 flex flex-col items-start py-2">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Table for Trips/Bookings</h3>
            </div>
            <DataTable onRowClick={onSelectTrip} columns={columns} data={transformedData} ColumnFilterName="company_name" />
            {selectedTrip && <TripTicketModal open={open} setOpen={setOpen} selectedTripData={selectedTrip} />}
        </MainLayout>
    );
}

function transformData(response) {
    return response.map((item) => ({
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
