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

export default function Dashboard() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <h1 className="text-4xl font-black">Welcome Back, Admin 1!</h1>

      {/* Overall Stats */}
      <h2 className="text-2xl font-bold mt-6">Overall</h2>
      <div className="grid grid-cols-3 gap-4">
        {[
          { title: "Registered VR Companies", value: 13 },
          { title: "Active Operators", value: 30 },
          { title: "Active Drivers", value: 200 },
        ].map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{item.value}</p>
              <p className="text-sm text-gray-500">+20.1% from last year</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Stats */}
      <h2 className="text-2xl font-bold mt-6">Pending</h2>
      <div className="grid grid-cols-3 gap-4 mt-2">
        {[
          { title: "Pending Payments", value: 27 },
          { title: "Pending Trip Tickets", value: 11 },
          { title: "Pending Registrations", value: 30 },
        ].map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{item.value}</p>
              <p className="text-sm text-gray-500">+20.1% from last year</p>
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
            <p className="text-sm text-gray-500">Last updated: 3:12 PM</p>
          </CardHeader>
          <CardContent>
            {[
              {
                name: "Olivia Martin",
                vehicle: "Honda Civic",
                route: "Cubao to Laguna",
                eta: "4:15 PM, February 15",
              },
              {
                name: "Jackson Lee",
                vehicle: "Toyota Hiace",
                route: "Manila to Benguet",
                eta: "4:28 PM, February 15",
              },
              {
                name: "Isabella Nguyen",
                vehicle: "Montero",
                route: "Manila to Baguio",
                eta: "4:33 PM, February 15",
              },
            ].map((booking, index) => (
              <div key={index} className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarFallback>{booking.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {booking.name} | {booking.vehicle}
                  </p>
                  <p className="text-sm text-gray-500">{booking.route}</p>
                  <p className="text-sm text-gray-500">ETA: {booking.eta}</p>
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
