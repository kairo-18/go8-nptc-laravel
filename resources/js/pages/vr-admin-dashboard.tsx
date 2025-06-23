import React from "react";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import MainLayout from "./mainLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "VR Admin Dashboard",
    href: "/vr-admin-dashboard",
  },
];

export default function VRAdminDashboard({
  activeOperatorsCount = 0,
  activeDriversCount = 0,
  scheduledBookings = [],
  pendingRegistrationsCount = 0,
  bookingsToday = 0,
  bookingsThisWeek = 0,
  bookingsThisMonth = 0,
  vrCompanyName = 'VR Company',
}: {
  activeOperatorsCount?: number;
  activeDriversCount?: number;
  scheduledBookings?: Array<{
    id: number;
    pickupDate: string;
    pickupAddress: string;
    dropOffAddress: string;
    driver_first_name: string;
    driver_last_name: string;
    vehicle_plate: string;
  }>;
  pendingRegistrationsCount?: number;
  bookingsToday?: number;
  bookingsThisWeek?: number;
  bookingsThisMonth?: number;
  vrCompanyName?: string;
}) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <Head title="VR Admin Dashboard" />
      <h1 className="text-4xl font-black">Welcome Back, {vrCompanyName}!</h1>

      {/* Overall Stats */}
      <h2 className="text-2xl font-bold mt-6">Company Overview</h2>
      <div className="grid grid-cols-3 gap-4">
        {[ 
          { title: "Active Operators", value: activeOperatorsCount },
          { title: "Active Drivers", value: activeDriversCount },
          { title: "Pending Registrations", value: pendingRegistrationsCount },
          { title: "Today's Bookings", value: bookingsToday },
          { title: "This Week's Bookings", value: bookingsThisWeek },
          { title: "This Month's Bookings", value: bookingsThisMonth },
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

      {/* Scheduled Bookings & Calendar (70:30 Ratio) */}
      <div className="grid grid-cols-[70%_30%] gap-4 mt-6">
        {/* Scheduled Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {scheduledBookings.length > 0 ? (
              scheduledBookings.map((booking, index) => (
                <div key={index} className="flex items-center gap-4 mb-4 p-3 border rounded-lg">
                  <Avatar>
                    <AvatarFallback>
                      {booking.driver_first_name?.[0]}{booking.driver_last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">
                      {booking.driver_first_name} {booking.driver_last_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Vehicle: {booking.vehicle_plate}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.pickupAddress} to {booking.dropOffAddress}
                    </p>
                    <p className="text-sm text-gray-500">
                      Pickup: {new Date(booking.pickupDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No scheduled bookings found</p>
            )}
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className="flex justify-center items-center">
          <CardContent className="w-full h-full">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}