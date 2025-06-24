import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, ClipboardList, Clock, TrendingUp, MapPinX} from 'lucide-react';
import MainLayout from './mainLayout';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
}: {
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    trend?: 'up' | 'down' | 'neutral';
}) => (
    <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
        <Card className="h-full bg-gradient-to-br from-white to-gray-100 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
                <Icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between">
                    <p className="text-2xl font-bold">{value}</p>
                    {trend && (
                        <span
                            className={`flex items-center text-2xl ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}
                        >
                            {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

export default function Dashboard({
    vrCompaniesCount,
    activeOperatorsCount,
    activeDriversCount,
    pendingPaymentsCount,
    ongoingTripsCount,
    ongoingBookings,
    pendingRegistrationsCount,
}: {
    vrCompaniesCount: number | null;
    activeOperatorsCount: number | null;
    activeDriversCount: number | null;
    pendingPaymentsCount: number | null;
    ongoingTripsCount: number | null;
    ongoingBookings: Array<{ name: string; vehicle: string; route: string; eta: string }> | null;
    pendingRegistrationsCount: number | null;
}) {
    const {
        props: {
            auth: { user },
        },
    } = usePage<{ auth: { user: User } }>();
    const [tripDates, setTripDates] = useState<Date[]>([]);
    const [trips, setTrips] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [tripsForSelectedDate, setTripsForSelectedDate] = useState<any[]>([]);
    useEffect(() => {
        axios.get('/api/bookings')
            .then(res => {
                const trips = res.data;
                setTrips(trips);
                // Collect unique pickupDates as Date objects
                const dates = trips
                    .map((t: any) => t.pickupDate && new Date(t.pickupDate))
                    .filter(Boolean);
                setTripDates(dates);
            })
            .catch(() => {
                setTrips([]);
                setTripDates([]);
            });
    }, []);
    useEffect(() => {
        if (!selectedDate) {
            setTripsForSelectedDate([]);
            return;
        }
        // Filter trips for the selected date (ignoring time)
        const filtered = trips.filter((t: any) => {
            const tripDate = new Date(t.pickupDate);
            return (
                tripDate.getFullYear() === selectedDate.getFullYear() &&
                tripDate.getMonth() === selectedDate.getMonth() &&
                tripDate.getDate() === selectedDate.getDate()
            );
        });
        setTripsForSelectedDate(filtered);
    }, [selectedDate, trips]);

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Welcome Back,{' '}
                    <span className="text-primary">
                        {user?.FirstName} {user?.LastName}
                    </span>
                    !
                </h1>
                <p className="text-muted-foreground mt-2">Here's what's happening with your system today</p>
            </motion.div>

            {/* Stats Grid */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
                {/* System Overview */}
                <div className="space-y-4 lg:col-span-2">
                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                        <TrendingUp className="text-primary h-5 w-5" />
                        System Overview
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                        <StatCard title="VR Companies" value={vrCompaniesCount ?? 0} icon={CheckCircle} trend="up" />
                        <StatCard title="Operators" value={activeOperatorsCount ?? 0} icon={CheckCircle} trend="neutral" />
                        <StatCard title="Drivers" value={activeDriversCount ?? 0} icon={CheckCircle} trend="up" />
                    </div>
                </div>

                {/* Pending Actions */}
                <div className="space-y-4 lg:col-span-2">
                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        Pending Actions
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                        <StatCard title="Payments" value={pendingPaymentsCount ?? 0} icon={AlertCircle} trend="down" />
                        <StatCard title="Trips" value={trips.length ?? 0} icon={AlertCircle} trend="neutral" />
                        <StatCard title="Registrations" value={pendingRegistrationsCount ?? 0} icon={AlertCircle} trend="down" />
                    </div>
                </div>

                {/* Ongoing Bookings */}
                <div className="flex h-full flex-col space-y-2 md:col-span-3 lg:col-span-3">
                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                        <ClipboardList className="h-5 w-5 text-blue-500" />
                        Ongoing Bookings
                        <span className="ml-2 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {trips.length ?? 0} Active
                        </span>
                    </h2>
                    <Card className="h-[500px] overflow-hidden bg-gradient-to-br from-white to-gray-100 shadow-lg">
                        <div className="flex h-full flex-col">
                            <CardHeader className="px-6">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-medium">Current Trips</CardTitle>
                                    <button className="text-sm font-medium text-blue-600 hover:text-blue-800">View All</button>
                                </div>
                            </CardHeader>
                            <CardContent 
                                className="grid flex-1 grid-cols-1 gap-4 px-6 pb-6 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto"
                                style={{ maxHeight: '500px' }} 
                            >
                                {trips.length === 0 ? (
                                    <div className="col-span-full flex h-full w-full flex-col items-center justify-center">
                                        <motion.div
                                            initial={{ y: 0 }}
                                            animate={{ y: [0, -20, 0, 12, 0] }}
                                            transition={{ duration: 2.5, repeat: Infinity, repeatType: "loop", ease: [0.45, .45, 0.45, 0.45],}}
                                        >
                                            <MapPinX className="mb-4 h-20 w-20 text-blue-300" />
                                        </motion.div>
                                        <div className="text-3xl font-bold text-muted-foreground mb-2">No Trips Yet</div>
                                        <div className="text-lg text-muted-foreground text-center max-w-md">
                                            We're waiting for new trips to appear.<br />
                                            As soon as a trip is booked, you'll see it here!
                                        </div>
                                    </div>
                                    
                                ) : (
                                    trips.map((booking, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start gap-4 rounded-lg border p-4 transition-all hover:border-blue-200 hover:shadow-sm"
                                        >
                                            <Avatar className="mt-0.5 h-9 w-9">
                                                <AvatarFallback className="bg-blue-100 font-medium text-blue-600">
                                                    {booking.driver_first_name?.[0]}
                                                    {booking.driver_last_name?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-medium">
                                                        {booking.driver_first_name} {booking.driver_last_name}
                                                    </h3>
                                                    <span className="rounded bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                                                        {booking.NPTC_ID}
                                                    </span>
                                                </div>
                                                <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                                                    <span className="text-foreground font-medium">Route:</span>
                                                    <span>
                                                        {booking.pickupAddress} → {booking.dropOffAddress}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-1 text-xs">
                                                    <div className="space-y-0.5">
                                                        <p className="text-muted-foreground">Pickup</p>
                                                        <p className="font-medium">{booking.pickupDate}</p>
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-muted-foreground">Dropoff</p>
                                                        <p className="font-medium">{booking.dropOffDate}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </CardContent>
                        </div>
                    </Card>
                </div>

                {/* Calendar */}
                <div className="md:col-span-1 lg:col-span-1">
                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                        <Clock className="h-5 w-5 text-blue-500" />
                        Calendar
                    </h2>
                    <Card className="mx-auto mt-2 h-auto w-fit bg-gradient-to-br from-white to-gray-100 shadow-lg">
                        <CardContent className="p-0">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => {
                                    if (date) {
                                        const formatted =
                                            date.getFullYear() +
                                            '-' +
                                            String(date.getMonth() + 1).padStart(2, '0') +
                                            '-' +
                                            String(date.getDate()).padStart(2, '0');
                                        router.visit(`/bookings?date=${formatted}`);
                                    }
                                }}
                                className="rounded-md border-0"
                                classNames={{
                                    day_selected: 'bg-primary text-primary-foreground hover:bg-primary/90',
                                    day_today: 'bg-accent text-accent-foreground font-bold',
                                    head_cell: 'text-muted-foreground text-xs font-medium uppercase tracking-wider',
                                    cell: 'h-8 w-8 text-sm rounded-full hover:bg-muted',
                                    day: 'h-8 w-8 p-0 font-normal aria-selected:opacity-100',
                                    caption: 'flex justify-center pt-1 relative items-center',
                                    nav_button: 'h-6 w-6 bg-transparent hover:bg-muted',
                                }}
                                components={{
                                    caption: ({ children }) => <div className="flex items-center justify-between px-2 py-1">{children}</div>,
                                }}
                                modifiers={{
                                    booked: tripDates,
                                }}
                                modifiersClassNames={{
                                    booked: 'bg-blue-100 bg-blue-300 text-white-1',
                                }}
                            />
                        </CardContent>
                    </Card>
               
                </div>
            </motion.section>
        </MainLayout>
    );
}
