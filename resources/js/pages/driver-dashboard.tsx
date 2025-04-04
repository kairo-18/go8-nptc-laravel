import React, { useEffect, useState } from "react";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import MainLayout from "./mainLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axios from 'axios';
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
    scheduledBookings:any;
  }) {

    console.log(bookingsThisWeek)
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    axios
      .get("/driver/trips") // Ensure this matches your Laravel API route
      .then((response) => {
        setTrip(response.data); // Directly store the trip object
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
      .then((response) => {
        console.log("Trip started:", response.data);
  
        setTrip((prevTrip) => ({
          ...prevTrip,
          trip: { ...prevTrip.trip, status: "Ongoing" },
        }));

        alert('Trip Started Successfully!');
        location.reload();
      })
      .catch((error) => {
        console.error("Error starting trip:", error);
      });
  };

  const handleEndTrip = (tripId: number) => {
    axios
      .post(`/driver/trips/${tripId}/end`)
      .then((response) => {
        console.log("Trip ended:", response.data);
  
        setTrip((prevTrip) => ({
          ...prevTrip,
          trip: { ...prevTrip.trip, status: "Done" },
        }));

        alert('Trip Ended Successfully!');
        location.reload();
      })
      .catch((error) => {
        console.error("Error ending trip:", error);
      });
  };
  
  
  

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <h1 className="text-4xl font-black">Welcome Back, Admin 1!</h1>


        {/* Ongoing Trip Section */}
      <h2 className="text-2xl font-bold mt-6">Latest Trip</h2>
      {loading ? (
        <p>Loading trip...</p>
      ) : trip && trip.trip.status !== "Done" ? (
        <Card 
        className={`mt-4 p-4 border-2 ${
          trip.trip.status === "Ongoing"
            ? "border-yellow-500 text-yellow-500"
            : trip.trip.status === "Done"
            ? "hidden" // Hide card if trip is done
            : "border-red-500 text-red-500"
        }`}
      >
        <CardHeader>
          <h3 className="text-lg font-semibold">
            {trip.trip.status === "Ongoing" ? "In transit" : "Trip not yet started"}
          </h3>
        </CardHeader>
        <CardContent className="text-black"> 
          <div className="grid grid-cols-3 gap-4">
            <p><strong>Trip Date:</strong> {trip.trip.pickupDate}</p>
            <p><strong>Pick-up Address:</strong> {trip.trip.pickupAddress}</p>
            <p><strong>Drop-off Address:</strong> {trip.trip.dropOffAddress}</p>
            <p><strong>Trip Type:</strong> {trip.trip.tripType}</p>
            <p><strong>Status:</strong> {trip.trip.status}</p>
            <p><strong>Trip ID:</strong> {trip.trip.NPTC_ID}</p>
            <p><strong>Unit:</strong> {trip.vehicle.Model}</p>
            <p><strong>Plate:</strong> {trip.vehicle.PlateNumber}</p>
          </div>
      
          {/* Passengers Section */}
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
      
          {/* Trip Control Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            {trip.trip.status === "Ongoing" ? (
              <Button variant="default" onClick={() => handleEndTrip(trip.trip.id)}>
                End Trip
              </Button>
            ) : (
              <Button variant="default" onClick={() => handleStartTrip(trip.trip.id)}>
                Start Trip
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      ) : (
        <div className="border border-gray-300 rounded-lg p-6 flex justify-center items-center text-black text-lg font-semibold h-55">
        No upcoming trips for today
      </div>
      
      )}

      {/* Overall Stats */}
      <h2 className="text-2xl font-bold mt-6">Bookings</h2>
<div className="grid grid-cols-3 gap-4">
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
        <p className="text-3xl font-bold">{item.value}</p>
      </CardContent>
    </Card>
  ))}
</div>

      {/* Ongoing Bookings & Calendar (70:30 Ratio) */}
      <div className="grid grid-cols-[70%_30%] gap-4 mt-6">
        {/* Ongoing Bookings */}
        <Card>
    <CardHeader>
      <CardTitle>Scheduled Bookings</CardTitle>
      <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
    </CardHeader>
    <CardContent>
      {scheduledBookings.length > 0 ? (
        scheduledBookings.map((booking, index) => (
          <div key={index} className="flex items-center gap-4 mb-4">
            <Avatar>
              <AvatarFallback>{booking.driver_first_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">
                {booking.driver_first_name} {booking.driver_last_name} | {booking.vehicle.PlateNumber}
              </p>
              <p className="font-semibold">
                {booking.vehicle.Model}
              </p>
              <p className="text-sm text-gray-500">{booking.pickup_address} to {booking.dropoff_address}</p>
              <p className="text-sm text-gray-500">ETA: {booking.pickupDate} to {booking.dropOffDate}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No scheduled bookings at the moment.</p>
      )}
    </CardContent>
  </Card>

        {/* Calendar */}
        <Card className="flex justify-center items-center">
          <CardContent className="w-full h-full">
            <Calendar
                className="h-full w-full flex"
                classNames={{
                months:
                    "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                month: "space-y-4 w-full flex flex-col",
                table: "w-full h-full border-collapse space-y-1",
                head_row: "",
                row: "w-full mt-2",
                }}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
