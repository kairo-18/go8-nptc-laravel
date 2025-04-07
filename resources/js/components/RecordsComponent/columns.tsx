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
import { router } from '@inertiajs/react';
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
        entityType?: 'companies' | 'operators' | 'drivers' | 'vehicles';
        onViewFiles?: (company: any) => void; // <-- New callback function
        updateStatus?: (statusData: any) => void; // <-- New callback function
        handleContainer?: (containerType: any) => void; // <-- New callback function
    },
): ColumnDef<DataRow>[] => {
    const { sortableColumns = [], statusColumns = [], actions = true, entityType, onViewFiles, updateStatus, handleContainer } = options || {};

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

            if (statusColumns.includes(key)) {
                const statusColors: Record<string, string> = {
                    Active: 'bg-green-500',
                    Inactive: 'bg-gray-500',
                    Suspended: 'bg-yellow-500',
                    Banned: 'bg-purple-500',
                    Approved: 'bg-blue-500',
                    Rejected: 'bg-red-500',
                    Pending: 'bg-orange-500',
                };

                return <span className={`rounded px-2 py-1 text-white ${statusColors[value] || 'bg-gray-500'}`}>{value || 'Unknown'}</span>;
            }

            return value || 'N/A'; // Default text if empty
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
                const operatorData = row.original;
                const driverData = row.original;
                const vehicleData = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 !bg-transparent">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            {entityType === 'companies' ? (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.visit(`/vr-company/edit/${data.id}`); }}>Edit Company</DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleContainer?.('suspend'); }} className="cursor-pointer">Suspend</DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleContainer?.('ban'); }} className="cursor-pointer">Ban</DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewFiles?.(data); }} className="cursor-pointer">View Files</DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus?.(data); }} className="cursor-pointer">Set Status</DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleContainer?.('remove'); }} className="cursor-pointer">Remove</DropdownMenuItem>
                                </>
                            ) : entityType === 'operators' ? (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.visit(`/operator/edit/${operatorData.id}`); }}>Edit Operator</DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus?.(operatorData); }} className="cursor-pointer">Set Status</DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleContainer?.('email'); }} className="cursor-pointer">Send Email</DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleContainer?.('suspend'); }} className="cursor-pointer">Suspend</DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleContainer?.('ban'); }} className="cursor-pointer">Ban</DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleContainer?.('remove'); }} className="cursor-pointer">Remove</DropdownMenuItem>
                                </>
                            ) : entityType === 'drivers' ? (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.visit(`/drivers?id=${data.id}`)}>
                                    Edit Driver
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus?.(driverData); }} className="cursor-pointer">Set Status</DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleContainer?.('email'); }} className="cursor-pointer">Send Email</DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleContainer?.('suspend'); }} className="cursor-pointer">Suspend</DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleContainer?.('ban'); }} className="cursor-pointer">Ban</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.delete(`/driver/${data.id}`)} className="cursor-pointer">Remove</DropdownMenuItem>
                                </>
                            ) : entityType === 'vehicles' ? (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.visit(`/vehicles?id=${data.id}`)}>
                                    Edit Vehicle</DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus?.(vehicleData); }} className="cursor-pointer">Set Status</DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus?.(data); }} className="cursor-pointer">Suspend</DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus?.(data); }} className="cursor-pointer">Ban</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.delete(`/vehicles/${data.id}`)} className="cursor-pointer hover-bg-red-500 t">
                                    Remove Vehicle</DropdownMenuItem>
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
