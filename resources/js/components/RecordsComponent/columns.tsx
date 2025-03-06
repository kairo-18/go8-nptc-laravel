'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

export type DataRow = {
    [key: string]: any; // Dynamic object type to accept any keys
};

export const generateColumns = (
    headers: { key: string; label: string }[],
    options?: {
        sortableColumns?: string[];
        statusColumns?: string[];
        actions?: boolean;
        entityType?: 'companies' | 'operators'; // Add entityType for conditional actions
    },
): ColumnDef<DataRow>[] => {
    const { sortableColumns = [], statusColumns = [], actions = true, entityType } = options || {};

    const dynamicColumns: ColumnDef<DataRow>[] = headers.map(({ key, label }) => ({
        id: key, // Ensure each column has a unique ID
        accessorKey: key,
        header: ({ column }) => {
            if (sortableColumns.includes(key)) {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        {label}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            }
            return label; // Ensuring the default header is a string
        },
        cell: ({ row }) => {
            const value = row.getValue(key);
            if (statusColumns.includes(key)) {
                return (
                    <span
                        className={`rounded px-2 py-1 text-white ${
                            {
                                Active: 'bg-green-500',
                                Inactive: 'bg-red-500',
                                Suspended: 'bg-yellow-500',
                                Banned: 'bg-violet-500',
                                Approved: 'bg-blue-500',
                                Rejected: 'bg-black-500',
                                Pending: 'bg-orange-500',
                            }[value] || 'bg-gray-500'
                        }`}
                    >
                        {value}
                    </span>
                );
            }
            return value; // Ensure default cell rendering
        },
    }));

    // Add select checkbox column
    dynamicColumns.unshift({
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        ),
        enableSorting: false,
        enableHiding: false,
    });

    // Add actions column if enabled
    if (actions) {
        dynamicColumns.push({
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const data = row.original;

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

                            {/* Different actions based on entity type */}
                            {entityType === 'companies' ? (
                                <>
                                    <DropdownMenuItem onClick={() => alert(`Editing Company: ${data.CompanyName}`)}>Edit Company</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => alert(`Removing Company: ${data.CompanyName}`)}
                                        className="bg-red-500 text-white hover:bg-red-600"
                                    >
                                        Remove Company
                                    </DropdownMenuItem>
                                </>
                            ) : entityType === 'operators' ? (
                                <>
                                    <DropdownMenuItem onClick={() => alert(`Editing Operator: ${data.username}`)}>Edit Operator</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => alert(`Deactivating Operator: ${data.username}`)}>
                                        Deactivate Operator
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => alert(`Removing Operator: ${data.username}`)}>Remove Operator</DropdownMenuItem>
                                </>
                            ) : null}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        });
    }

    return dynamicColumns;
};
