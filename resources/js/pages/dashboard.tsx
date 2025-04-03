import React from "react";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import MainLayout from "./mainLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
];

export default function Dashboard({
  vrCompaniesCount,
  activeOperatorsCount,
  activeDriversCount,
  pendingPaymentsCount,
  ongoingTripsCount,
  ongoingBookings,
  pendingRegistrationsCount,  // Added this prop
}: {
  vrCompaniesCount: number | null;
  activeOperatorsCount: number | null;
  activeDriversCount: number | null;
  pendingPaymentsCount: number | null;
  ongoingTripsCount: number | null;
  ongoingBookings: Array<{ name: string; vehicle: string; route: string; eta: string }> | null;
  pendingRegistrationsCount: number | null;  // Added this prop
}) {
  // Log the props to the console for debugging
  console.log("Dashboard Props:", {
    vrCompaniesCount,
    activeOperatorsCount,
    activeDriversCount,
    pendingPaymentsCount,
    ongoingTripsCount,
    ongoingBookings,
    pendingRegistrationsCount,  // Log the pending registrations count
  });

  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <h1 className="text-4xl font-black">Welcome Back, Admin 1!</h1>

      {/* Overall Stats */}
      <h2 className="text-2xl font-bold mt-6">Overall</h2>
      <div className="grid grid-cols-3 gap-4">
        {[ 
          { title: "Registered VR Companies", value: vrCompaniesCount ?? 0 },
          { title: "Active Operators", value: activeOperatorsCount ?? 0 },
          { title: "Active Drivers", value: activeDriversCount ?? 0 },
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

      {/* Pending Stats */}
      <h2 className="text-2xl font-bold mt-6">Pending</h2>
      <div className="grid grid-cols-3 gap-4 mt-2">
        {[ 
          { title: "Pending Payments", value: pendingPaymentsCount ?? 0 },
          { title: "Pending Trip Tickets", value: ongoingTripsCount ?? 0 },
          { title: "Pending Registrations", value: pendingRegistrationsCount ?? 0 },  // Display pending registrations count
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
            <CardTitle>Ongoing Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {(ongoingBookings ?? []).map((booking, index) => (
              <div key={index} className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarFallback>{booking.driver_first_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {booking.driver_first_name} {booking.driver_last_name} | {booking.NPTC_ID}
                  </p>
                  <p className="text-sm text-gray-500">{booking.pickupAddress} to {booking.dropOffAddress}</p>
                  <p className="text-sm text-gray-500">Pickup: {booking.pickupDate} | Dropoff: {booking.dropOffDate}</p>
                </div>
              </div>
            ))}
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
