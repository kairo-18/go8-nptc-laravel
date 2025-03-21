import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Ellipsis, TimerIcon, X } from "lucide-react";
import { DataTable } from "@/components/RecordsComponent/data-table";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import MainLayout from "./mainLayout";
import axios from "axios";
import PendingCompanyDetails from "@/components/Pending/pending-company-details";
import PendingOperatorDetails from "@/components/Pending/pending-operator-details";
import PendingVehicleDetails from "@/components/Pending/pending-vehicle-details";
import PendingDriverDetails from "@/components/Pending/pending-driver-details";

// Interfaces for different application types
interface Operator {
  id: number;
  Status: string;
  vrCompany: string;
  LastName: string;
  FirstName: string;
  MiddleName?: string;
  DateApplied: string;
  Birthdate: string;
  Address: string;
  ContactNumber: string;
  Email: string;
  created_at: string;
}

interface Driver {
  id: number;
  Status: string;
  LastName: string;
  FirstName: string;
  Birthday: string;
  Address: string;
  ContactNumber: string;
  email: string;
  LicenseNumber: string;
  LicenseImg: string;
  Photo1x1: string;
  NbiClearance: string;
  PoliceClearance: string;
  BirClearance: string;
  created_at: string;
}

interface Vehicle {
  id: number;
  Status: string;
  Model: string;
  Brand: string;
  PlateNumber: string;
  SeatNumber: number;
  OrImage: string;
  CrImage: string;
  IdCard: number;
  GpsImage: string;
  InspectionCertification: string;
  CarFront: string;
  CarSideLeft: string;
  CarSideRight: string;
  CarBack: string;
  created_at: string;
}

interface VRCompany {
  id: number;
  Status: string;
  CompanyName: string;
  BusinessPermitNumber: string;
  created_at: string;
}

// Unified type for the data table
type ApplicationData = (Operator | Driver | Vehicle | VRCompany) & { type: string };

export default function Pending() {
  const [data, setData] = useState<ApplicationData[]>([]);
  const [selectedItem, setSelectedItem] = useState<ApplicationData | null>(null);

  const breadcrumbs: BreadcrumbItem[] = [{ title: "Pending" }];

  useEffect(() => {
    axios
      .get("/api/pending-data")
      .then((response) => {
        const { operators, drivers, vrCompanies, vehicles } = response.data;

        const combinedData: ApplicationData[] = [
          ...operators.map((operator: Operator) => ({
            ...operator,
            type: "Operator",
          })),
          ...drivers.map((driver: Driver) => ({
            ...driver,
            type: "Driver",
          })),
          ...vrCompanies.map((company: VRCompany) => ({
            ...company,
            type: "VR Company",
          })),
          ...vehicles.map((vehicle: Vehicle) => ({
            ...vehicle,
            type: "Vehicle",
          })),
        ];

        setData(combinedData);
      })
      .catch((error) => {
        console.error("Error fetching pending data:", error);
      });
  }, []);

  const handleRowClick = (item: ApplicationData) => {
    setSelectedItem(item);
  };

  const columns: ColumnDef<ApplicationData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input type="checkbox" onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)} />
      ),
      cell: ({ row }) => (
        <input type="checkbox" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
      ),
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="px-2 py-1 text-sm font-medium border border-black text-black rounded-md">
          {row.getValue("type")}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const item = row.original;
        if (item.type === "Operator" || item.type === "Driver") {
          return `${item.user.FirstName} ${item.user.LastName}`;
        } else if (item.type === "VR Company") {
          return item.CompanyName;
        } else if (item.type === "Vehicle") {
          return item.PlateNumber;
        }
        return "-";
      },
    },
    {
      accessorKey: "Status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center">
          <TimerIcon className="w-4 h-4 text-gray-600 mr-2" />
          <span>{row.getValue("Status")}</span>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Date of Application",
      cell: ({ row }) => {
        const date = row.original.created_at;
        return date ? new Date(date).toLocaleDateString() : "-";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" onClick={() => handleRowClick(row.original)}>
          <Ellipsis className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <Head title="Pending" />
      <div className="rounded-md border border-gray-300 p-5">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Pending</h2>
          <p className="text-gray-600">Final approval of applications</p>

          {selectedItem && (
            <div className="relative p-4 border rounded-md bg-white shadow-md">
                <Button className="absolute top-2 right-2" variant="ghost" onClick={() => setSelectedItem(null)}>
                <X className="h-5 w-5" />
                </Button>
                {selectedItem.type === "Operator" ? (
                <PendingOperatorDetails item={selectedItem} />
                ) : selectedItem.type === "Driver" ? (
                <PendingDriverDetails item={selectedItem} /> // Ensure this is the correct component
                ) : selectedItem.type === "VR Company" ? (
                <PendingCompanyDetails item={selectedItem} />
                ) : selectedItem.type === "Vehicle" ? (
                <PendingVehicleDetails item={selectedItem} />
                ) : null}
            </div>
            )}
          <DataTable columns={columns} data={data} enableRowSelection onRowClick={handleRowClick} />
        </div>
      </div>
    </MainLayout>
  );
}
