'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
<<<<<<< Updated upstream
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
=======
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuTrigger,} from '@/components/ui/dropdown-menu';
import { router } from '@inertiajs/react';
>>>>>>> Stashed changes
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
        entityType?: 'companies' | 'operators';
        onViewFiles?: (company: any) => void;
    },
): ColumnDef<DataRow>[] => {
    const { sortableColumns = [], statusColumns = [], actions = true, entityType, onViewFiles } = options || {};

    console.log('Status Columns Config:', statusColumns); // Debugging

    const dynamicColumns: ColumnDef<DataRow>[] = headers.map(({ key, label }) => ({
        id: key,
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
            return label;
        },
        cell: ({ row }) => {
            const rawValue = row.getValue(key);
            const value = String(rawValue || '').trim(); // Ensure it's a string

            console.log(`Row Value for ${key}:`, value); // Debugging

            if (statusColumns.includes(key)) {
                const statusColors: Record<string, string> = {
                    Active: 'bg-green-500',
                    Inactive: 'bg-red-500',
                    Suspended: 'bg-yellow-500',
                    Banned: 'bg-purple-500',
                    Approved: 'bg-blue-500',
                    Rejected: 'bg-gray-800',
                    Pending: 'bg-orange-500',
                };

                return (
                    <span className={`rounded px-2 py-1 text-white ${statusColors[value] || 'bg-gray-500'}`}>
                        {value || 'Unknown'}
                    </span>
                );
            }

            return value || 'N/A';
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

                            {entityType === 'companies' ? (
                                <>
                                    <DropdownMenuItem onClick={() => alert(`Editing Company: ${data.CompanyName}`)}>Edit Company</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevents triggering row click
                                            onViewFiles?.(data);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        View Files
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
