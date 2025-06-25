import TripTicketModal from '@/components/trip-booking/view-trip-modal';
import { Button } from '@/components/ui/button';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { bookingCardVariants, fadeOnly, pageVariants, tableRowVariants } from '@/lib/animations';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { DataTable } from '../components/RecordsComponent/data-table';
import MainLayout from './mainLayout';

export default function Bookings({ bookings }) {
    const { props } = usePage();
    const userRole = props.auth.user?.roles?.[0]?.name;
    const userId = props.auth.user?.id;

    const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
    let filteredBookings = bookings;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const date = params.get('date');
        if (date) {
            setDateFilter({ start: date, end: date });
        }
    }, []);

    if (userRole === 'Driver') {
        filteredBookings = bookings.filter((trip: any) => trip.driver?.user_id === userId);
    } else if (userRole === 'VR Company') {
        const userCompanyId = props.auth.user?.vr_company_id;

        filteredBookings = bookings.filter((trip: any) => trip.driver?.operator?.vr_company?.id === userCompanyId);
    }

    if (dateFilter.start || dateFilter.end) {
        filteredBookings = filteredBookings.filter((trip: any) => {
            const tripDate = new Date(trip.pickupDate);
            const startDate = dateFilter.start ? new Date(dateFilter.start + 'T00:00:00') : null;
            const endDate = dateFilter.end ? new Date(dateFilter.end + 'T23:59:59') : null;
            const startOk = startDate ? tripDate >= startDate : true;
            const endOk = endDate ? tripDate <= endDate : true;
            return startOk && endOk;
        });
    }

    const transformedData = transformData(filteredBookings);

    const customDropdownMenuContent = (
        <DropdownMenuContent align="end" className="space-y-2 p-4">
            <div>
                <label className="mb-1 block text-sm">Start Date</label>
                <input
                    type="date"
                    value={dateFilter.start}
                    onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                    className="w-full rounded border px-2 py-1"
                />
            </div>
            <div>
                <label className="mb-1 block text-sm">End Date</label>
                <input
                    type="date"
                    value={dateFilter.end}
                    onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                    className="w-full rounded border px-2 py-1"
                />
            </div>
            <Button className="mt-2 w-full" onClick={() => setDateFilter({ start: '', end: '' })} variant="outline">
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
            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} className="p-2">
                <motion.div
                    variants={bookingCardVariants}
                    className="ml-2 flex flex-col items-center justify-center gap-5 py-2 md:flex-row md:items-start md:justify-between"
                >
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Table for Trips/Bookings</h3>
                    <motion.div whileHover={{ scale: 1.02 }}>
                        <Button
                            className="w-full bg-blue-900 hover:border hover:bg-white hover:text-black md:w-auto"
                            onClick={() => (window.location.href = '/book-trip')}
                        >
                            Generate Trip Ticket
                        </Button>
                    </motion.div>
                </motion.div>
                <motion.div variants={fadeOnly}>
                    <DataTable
                        onRowClick={onSelectTrip}
                        columns={columns}
                        data={transformedData}
                        ColumnFilterName="company_name"
                        dropdownMenuContent={customDropdownMenuContent}
                        rowVariants={tableRowVariants}
                    />
                </motion.div>
                {selectedTrip && (
                    <motion.div variants={fadeOnly}>
                        <TripTicketModal open={open} setOpen={setOpen} selectedTripData={selectedTrip} />
                    </motion.div>
                )}
            </motion.div>
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
