import React, { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { type BreadcrumbItem } from "@/types";
import MainLayout from "./mainLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Driver Dashboard",
    href: "/driver-dashboard",
  },
];

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
      .get("/driver/trips")
      .then((response) => {
        setTrip(response.data);
      })
      .catch((error) => {
        console.error("Error fetching trip:", error);
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
          trip: { ...prevTrip.trip, status: "Ongoing" },
        }));
        setTripStartModalOpen(true);
      })
      .catch((error) => {
        console.error("Error starting trip:", error);
      });
  };

  const handleEndTrip = (tripId: number) => {
    axios
      .post(`/driver/trips/${tripId}/end`)
      .then(() => {
        setTrip((prevTrip) => ({
          ...prevTrip,
          trip: { ...prevTrip.trip, status: "Done" },
        }));
        setTripEndModalOpen(true);
      })
      .catch((error) => {
        console.error("Error ending trip:", error);
      });
  };

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="grid grid-cols-1 lg:flex lg:flex-col gap-y-3 p-2 md:p-10">
        {/* Row 1: Welcome */}
        <div className="h-full w-full">
          <h4 className="text-2xl font-black">Welcome Back, Admin 1!</h4>
        </div>

        {/* Row 2: Latest Trip */}
        <div className="h-full w-full">
          <h2 className="text-lg font-bold">Latest Trip</h2>
          {loading ? (
            <p>Loading trip...</p>
          ) : trip && trip.trip.status !== "Done" ? (
            <Card
              className={`mt-4 p-4 border-2 ${
                trip.trip.status === "Ongoing"
                  ? "border-yellow-500 text-yellow-500"
                  : "border-red-500 text-red-500"
              }`}
            >
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  {trip.trip.status === "Ongoing"
                    ? "In transit"
                    : "Trip not yet started"}
                </h3>
              </CardHeader>
              <CardContent className="text-black">
                <div className="grid-cols-1 grid md:grid-cols-3 gap-4">
                  <p><strong>Trip Date:</strong> {trip.trip.pickupDate}</p>
                  <p><strong>Pick-up Address:</strong> {trip.trip.pickupAddress}</p>
                  <p><strong>Drop-off Address:</strong> {trip.trip.dropOffAddress}</p>
                  <p><strong>Trip Type:</strong> {trip.trip.tripType}</p>
                  <p><strong>Status:</strong> {trip.trip.status}</p>
                  <p><strong>Trip ID:</strong> {trip.trip.NPTC_ID}</p>
                  <p><strong>Unit:</strong> {trip.vehicle.Model}</p>
                  <p><strong>Plate:</strong> {trip.vehicle.PlateNumber}</p>
                </div>

                <h3 className="text-lg font-semibold mt-4">Passengers</h3>
                {trip.passengers.length > 0 ? (
                  <ul className="list-disc pl-6">
                    {trip.passengers.map((passenger) => (
                      <li key={passenger.id}>
                        <p><strong>Name:</strong> {passenger.FirstName} {passenger.LastName}</p>
                        <p><strong>Contact:</strong> {passenger.ContactNumber}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No passengers declared.</p>
                )}

                <div className="flex justify-end gap-4 mt-4">
                  {trip.trip.status === "Ongoing" ? (
                    <Button onClick={() => handleEndTrip(trip.trip.id)}>End Trip</Button>
                  ) : (
                    <Button onClick={() => handleStartTrip(trip.trip.id)}>Start Trip</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="border border-gray-300 rounded-lg p-6 flex justify-center items-center text-black text-md font-semibold h-55">
              No upcoming trips for today
            </div>
          )}
        </div>

        {/* Row 3: Booking Stats */}
        <div className="h-full w-full">
          <h2 className="text-lg font-bold">Bookings</h2>

          {/* Grid layout for md and up */}
          <div className="hidden grid-cols-1 md:grid md:grid-cols-3 gap-4">
            {[
              { title: "Today's Bookings", value: bookingsToday.length },
              { title: "This Week's Bookings", value: bookingsThisWeek.length },
              { title: "This Month's Bookings", value: bookingsThisMonth.length },
            ].map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-md font-bold">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Carousel for screens below md */}
          <div className="md:hidden mt-4">
            <Carousel className="w-full max-w-full">
              <CarouselContent>
                {[
                  { title: "Today's Bookings", value: bookingsToday.length },
                  { title: "This Week's Bookings", value: bookingsThisWeek.length },
                  { title: "This Month's Bookings", value: bookingsThisMonth.length },
                ].map((item, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardHeader>
                          <CardTitle>{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center">
                          <span className="text-2xl font-semibold">{item.value}</span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>

        {/* Row 4: Scheduled Bookings + Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[70%_29%] gap-4 min-w-0">
          {/* Scheduled Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Bookings</CardTitle>
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </CardHeader>
            <CardContent>
              {scheduledBookings.length > 0 ? (
                scheduledBookings.map((booking, index) => (
                  <div key={index} className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarFallback>
                        {booking.driver_first_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {booking.driver_first_name} {booking.driver_last_name} |{" "}
                        {booking.vehicle.PlateNumber}
                      </p>
                      <p className="font-semibold">{booking.vehicle.Model}</p>
                      <p className="text-sm text-gray-500">
                        {booking.pickup_address} to {booking.dropoff_address}
                      </p>
                      <p className="text-sm text-gray-500">
                        ETA: {booking.pickupDate} to {booking.dropOffDate}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No scheduled bookings at the moment.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card className="w-full h-full overflow-hidden">
            <CardContent className="w-full h-full p-2 sm:p-4">
              <div className="w-full overflow-x-auto">
                <Calendar
                  className="w-full"
                  classNames={{
                    months: "flex w-full flex-col space-y-4",
                    month: "space-y-4 w-full flex flex-col",
                    table: "w-full border-collapse space-y-1",
                    head_row: "",
                    row: "w-full",
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trip Started Modal */}
      <Dialog open={tripStartModalOpen} onOpenChange={setTripStartModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trip Started</DialogTitle>
            <DialogDescription>
              The trip has successfully started. Safe travels!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => location.reload()}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Trip Ended Modal */}
      <Dialog open={tripEndModalOpen} onOpenChange={setTripEndModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trip Ended</DialogTitle>
            <DialogDescription>
              The trip has been successfully marked as completed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => location.reload()}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
