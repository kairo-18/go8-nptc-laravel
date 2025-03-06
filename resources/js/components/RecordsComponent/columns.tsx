"use client"

import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"

export type Payment = {
  [key: string]: any // Dynamic object type to accept any keys
}

export const generateColumns = (headers: { key: string; label: string }[]): ColumnDef<Payment>[] => {
  const dynamicColumns: ColumnDef<Payment>[] = headers.map(({ key, label }) => ({
    accessorKey: key,
    header: ({ column }) =>
      key === "email" ? (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {label}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <div className="text-left font-semibold">{label}</div>
      ),
    cell: ({ row }) =>
      key === "status" ? (
        <span
          className={`px-2 py-1 rounded text-white ${
            row.getValue(key) === "Active"
              ? "bg-green-500"
              : row.getValue(key) === "Inactive"
              ? "bg-red-500"
              : row.getValue(key) === "Suspended"
              ? "bg-yellow-500"
              : row.getValue(key) === "Banned"
              ? "bg-violet-500"
              : "bg-gray-500"
          }`}
        >
          {row.getValue(key)}
        </span>
      ) : (
        <div>{row.getValue(key)}</div>
      ),
  }))

  // Select All Checkbox
  dynamicColumns.unshift({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  })

  // Dynamic Actions Column
  dynamicColumns.push({
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => alert(`Editing ${payment.email}`)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Sending Mail to ${payment.email}`)}>
              Send Mail
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => alert(`Removing ${payment.email}`)}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Remove User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  })

  return dynamicColumns
}

