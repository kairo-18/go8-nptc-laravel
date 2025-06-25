import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { headerVariants, statCardVariants } from '@/lib/animations';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Car, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import MainLayout from './mainLayout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Driver Dashboard',
        href: '/driver-dashboard',
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
    <motion.div {...statCardVariants}>
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

export default function DriverDashboard({
    bookingsToday,
    bookingsThisWeek,
    bookingsThisMonth,
    scheduledBookings,
}: {
    bookingsToday: any;
    bookingsThisWeek: any;
    bookingsThisMonth: any;
    scheduledBookings: any;
}) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [trip, setTrip] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [tripStartModalOpen, setTripStartModalOpen] = useState(false);
    const [tripEndModalOpen, setTripEndModalOpen] = useState(false);

    useEffect(() => {
        axios
            .get('/driver/trips')
            .then((response) => {
                setTrip(response.data);
            })
            .catch((error) => {
                console.error('Error fetching trip:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleStartTrip = (tripId: number) => {
        axios
            .post(`/driver/trips/${tripId}/start`)
            .then(() => {
                setTrip((prevTrip) => ({
                    ...prevTrip,
                    trip: { ...prevTrip.trip, status: 'Ongoing' },
                }));
                setTripStartModalOpen(true);
            })
            .catch((error) => {
                console.error('Error starting trip:', error);
            });
    };

    const handleEndTrip = (tripId: number) => {
        axios
            .post(`/driver/trips/${tripId}/end`)
            .then(() => {
                setTrip((prevTrip) => ({
                    ...prevTrip,
                    trip: { ...prevTrip.trip, status: 'Done' },
                }));
                setTripEndModalOpen(true);
            })
            .catch((error) => {
                console.error('Error ending trip:', error);
            });
    };

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <motion.div {...headerVariants} className="p-2">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Welcome Back, <span className="text-primary">Admin 1</span>!
                </h1>
                <p className="text-muted-foreground mt-2">Here's what's happening with your trips today</p>
            </motion.div>

            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 gap-6 p-2">
                {/* Latest Trip */}
                <div className="space-y-4">
                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                        <Car className="h-5 w-5 text-blue-500" />
                        Latest Trip
                    </h2>
                    {loading ? (
                        <p>Loading trip...</p>
                    ) : trip && trip.trip.status !== 'Done' ? (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Card
                                className={`bg-gradient-to-br from-white to-gray-100 transition-all duration-300 hover:shadow-lg ${
                                    trip.trip.status === 'Ongoing' ? 'border-yellow-500' : 'border-red-500'
                                }`}
                            >
                                <CardHeader>
                                    <h3 className="text-lg font-semibold">
                                        {trip.trip.status === 'Ongoing' ? 'In transit' : 'Trip not yet started'}
                                    </h3>
                                </CardHeader>
                                <CardContent className="text-black">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <p>
                                            <strong>Trip Date:</strong> {trip.trip.pickupDate}
                                        </p>
                                        <p>
                                            <strong>Pick-up Address:</strong> {trip.trip.pickupAddress}
                                        </p>
                                        <p>
                                            <strong>Drop-off Address:</strong> {trip.trip.dropOffAddress}
                                        </p>
                                        <p>
                                            <strong>Trip Type:</strong> {trip.trip.tripType}
                                        </p>
                                        <p>
                                            <strong>Status:</strong> {trip.trip.status}
                                        </p>
                                        <p>
                                            <strong>Trip ID:</strong> {trip.trip.NPTC_ID}
                                        </p>
                                        <p>
                                            <strong>Unit:</strong> {trip.vehicle.Model}
                                        </p>
                                        <p>
                                            <strong>Plate:</strong> {trip.vehicle.PlateNumber}
                                        </p>
                                    </div>

                                    <h3 className="mt-4 text-lg font-semibold">Passengers</h3>
                                    {trip.passengers.length > 0 ? (
                                        <ul className="list-disc pl-6">
                                            {trip.passengers.map((passenger: any) => (
                                                <li key={passenger.id}>
                                                    <p>
                                                        <strong>Name:</strong> {passenger.FirstName} {passenger.LastName}
                                                    </p>
                                                    <p>
                                                        <strong>Contact:</strong> {passenger.ContactNumber}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No passengers declared.</p>
                                    )}

                                    <div className="mt-4 flex justify-end gap-4">
                                        {trip.trip.status === 'Ongoing' ? (
                                            <Button onClick={() => handleEndTrip(trip.trip.id)}>End Trip</Button>
                                        ) : (
                                            <Button onClick={() => handleStartTrip(trip.trip.id)}>Start Trip</Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex h-55 items-center justify-center rounded-lg border border-gray-300 bg-gradient-to-br from-white to-gray-100 p-6 text-lg font-semibold text-black transition-all duration-300 hover:shadow-lg"
                        >
                            No upcoming trips for today
                        </motion.div>
                    )}
                </div>

                {/* Booking Stats */}
                <div className="space-y-4">
                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                        <Clock className="h-5 w-5 text-blue-500" />
                        Bookings
                    </h2>

                    {/* Grid layout for md and up */}
                    <div className="hidden grid-cols-1 gap-4 md:grid md:grid-cols-3">
                        {[
                            { title: "Today's Bookings", value: bookingsToday.length, icon: Clock, trend: 'neutral' },
                            { title: "This Week's Bookings", value: bookingsThisWeek.length, icon: Clock, trend: 'up' },
                            { title: "This Month's Bookings", value: bookingsThisMonth.length, icon: Clock, trend: 'up' },
                        ].map((item, index) => (
                            <StatCard key={index} title={item.title} value={item.value} icon={item.icon} trend={item.trend} />
                        ))}
                    </div>

                    {/* Carousel for screens below md */}
                    <div className="mt-4 md:hidden">
                        <Carousel className="w-full max-w-full">
                            <CarouselContent>
                                {[
                                    { title: "Today's Bookings", value: bookingsToday.length },
                                    { title: "This Week's Bookings", value: bookingsThisWeek.length },
                                    { title: "This Month's Bookings", value: bookingsThisMonth.length },
                                ].map((item, index) => (
                                    <CarouselItem key={index}>
                                        <div className="p-1">
                                            <motion.div {...statCardVariants}>
                                                <Card className="bg-gradient-to-br from-white to-gray-100 transition-all duration-300 hover:shadow-lg">
                                                    <CardHeader>
                                                        <CardTitle>{item.title}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="flex items-center justify-center">
                                                        <span className="text-2xl font-semibold">{item.value}</span>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                </div>

                {/* Scheduled Bookings + Calendar */}
                <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-[70%_30%]">
                    {/* Scheduled Bookings */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col">
                        <Card className="flex flex-1 flex-col bg-gradient-to-br from-white to-gray-100 transition-all duration-300 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle>Scheduled Bookings</CardTitle>
                                <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto">
                                {scheduledBookings.length > 0 ? (
                                    <div className="space-y-4">
                                        {scheduledBookings.map((booking: any, index: number) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center gap-4"
                                            >
                                                <Avatar>
                                                    <AvatarFallback>{booking.driver_first_name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">
                                                        {booking.driver_first_name} {booking.driver_last_name} | {booking.vehicle.PlateNumber}
                                                    </p>
                                                    <p className="font-semibold">{booking.vehicle.Model}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {booking.pickup_address} to {booking.dropoff_address}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        ETA: {booking.pickupDate} to {booking.dropOffDate}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <p className="text-sm text-gray-500">No scheduled bookings at the moment.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Calendar */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col">
                        <Card className="h-full w-full flex-1 overflow-hidden bg-gradient-to-br from-white to-gray-100 transition-all duration-300 hover:shadow-lg">
                            <CardContent className="h-full w-full p-2 sm:p-4">
                                <div className="h-full w-full overflow-x-auto">
                                    <Calendar
                                        className="h-full w-full"
                                        classNames={{
                                            months: 'flex w-full flex-col space-y-4',
                                            month: 'space-y-4 w-full flex flex-col',
                                            table: 'w-full border-collapse space-y-1',
                                            head_row: '',
                                            row: 'w-full',
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.section>

            {/* Trip Started Modal */}
            <Dialog open={tripStartModalOpen} onOpenChange={setTripStartModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Trip Started</DialogTitle>
                        <DialogDescription>The trip has successfully started. Safe travels!</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => router.reload()}>OK</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Trip Ended Modal */}
            <Dialog open={tripEndModalOpen} onOpenChange={setTripEndModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Trip Ended</DialogTitle>
                        <DialogDescription>The trip has been successfully marked as completed.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => router.reload()}>OK</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}
