'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';
import { useEffect } from 'react';

type DataTableProps<TData, TValue> = {
    data: TData[];
    columns: any;
    ColumnFilterName: string;
};

const statusHierarchy = ['Active', 'Inactive', 'Suspended', 'Banned'];

export function DataTable<TData, TValue>({ data, onRowClick, columns, ColumnFilterName }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [selectedStatus, setSelectedStatus] = React.useState<string | null>(null);
    const [pageSize, setPageSize] = React.useState(5); // Default page size
    const [selectedColumnFilter, setSelectedColumnFilter] = React.useState<string | null>(null);

    useEffect(() => {
        setSelectedColumnFilter(ColumnFilterName);
    }, []);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: {
                pageSize,
                pageIndex: 0,
            },
        },
    });

    const handleStatusFilter = (status: string) => {
        if (status === 'All Status') {
            table.getColumn('status')?.setFilterValue(undefined); // Reset filter
            setSelectedStatus(null);
        } else {
            setSelectedStatus(status);
            table.getColumn('status')?.setFilterValue(status);
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Filter data..."
                    value={(table.getColumn(selectedColumnFilter)?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn(selectedColumnFilter)?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Filter Status <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {statusHierarchy.map((status) => (
                            <DropdownMenuRadioItem key={status} value={status} onClick={() => handleStatusFilter(status)}>
                                {status}
                            </DropdownMenuRadioItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioItem value="All Status" onClick={() => handleStatusFilter('All Status')}>
                            All Status
                        </DropdownMenuRadioItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {typeof header.column.columnDef.header === 'function'
                                            ? header.column.columnDef.header(header.getContext())
                                            : header.column.columnDef.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="cursor-pointer hover:bg-gray-100" onClick={() => onRowClick?.(row.original)}>
                                    {row.getVisibleCells().map((cell) => {
                                        const cellValue = cell.getValue() as string;
                                        const statusWords = ['Pending', 'Approved', 'Rejected', 'For Payment', 'Active', 'Inactive'];

                                        // Highlight statuses if it's the CompanyName column
                                        if (cell.column.id === 'CompanyName' && typeof cellValue === 'string') {
                                            const highlightedText = cellValue
                                                .split(new RegExp(`(${statusWords.join('|')})`, 'gi'))
                                                .map((part, index) =>
                                                    statusWords.includes(part) ? (
                                                        <span
                                                            key={index}
                                                            className={`rounded px-2 py-0.5 font-medium text-white ${
                                                                part === 'Pending'
                                                                    ? 'bg-yellow-500'
                                                                    : part === 'Approved'
                                                                      ? 'bg-green-500'
                                                                      : part === 'Rejected'
                                                                        ? 'bg-red-500'
                                                                        : part === 'For Payment'
                                                                          ? 'bg-blue-500'
                                                                          : part === 'Active'
                                                                            ? 'bg-green-600'
                                                                            : 'bg-gray-400'
                                                            }`}
                                                        >
                                                            {part}
                                                        </span>
                                                    ) : (
                                                        part
                                                    ),
                                                );

                                            return <TableCell key={cell.id}>{highlightedText}</TableCell>;
                                        }

                                        return (
                                            <TableCell key={cell.id}>
                                                {typeof cell.column.columnDef.cell === 'function'
                                                    ? cell.column.columnDef.cell(cell.getContext())
                                                    : (cellValue as React.ReactNode)}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="flex items-center space-x-4">
                    <label className="text-sm">Rows per page:</label>
                    <Input
                        type="number"
                        min={1}
                        value={pageSize}
                        onChange={(e) => {
                            const newSize = Number(e.target.value);
                            setPageSize(newSize);
                            table.setPageSize(newSize);
                        }}
                        className="max-w-[100px]"
                    />
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
