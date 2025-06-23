'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {ColumnFiltersState,SortingState,VisibilityState,getCoreRowModel,getFilteredRowModel,getPaginationRowModel,getSortedRowModel,useReactTable,} from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { useState, useEffect } from 'react'; 

type DataTableProps<TData, TValue> = {
    data: TData[];
    columns: any;
    ColumnFilterName: string;
    onRowClick?: (row: TData) => void;
};

const statusHierarchy = ["Pending", "Approved", "Rejected", "For Payment", "Active", "Inactive", "Suspended", "Banned", "For NPTC Approval", "For VR Approval"];


export function DataTable<TData, TValue>({ data, onRowClick, columns, ColumnFilterName }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [selectedStatus, setSelectedStatus] = React.useState<string | null>(null);
    const [pageSize, setPageSize] = React.useState(3); // Default page size
    const [selectedColumnFilter, setSelectedColumnFilter] = React.useState<string | null>(null);
    const [pageIndex, setPageIndex] = React.useState(0);

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
        manualPagination: false,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: {
                pageIndex, 
                pageSize,
            },
            
        },
        onPaginationChange: (updater) => {
            const newPagination = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
            setPageIndex(newPagination.pageIndex);
            setPageSize(newPagination.pageSize);
        },
    });

    const handleStatusFilter = (status: string) => {
        // Get the column safely
        const statusColumn = selectedColumnFilter ? table.getColumn(selectedColumnFilter) : null;
    
        if (!statusColumn) {
            console.error("Column 'status' not found!"); // Debugging message
            return;
        }
    
        if (status === "All Status") {
            statusColumn.setFilterValue(undefined); // Reset filter
            setSelectedStatus(null);
        } else {
            statusColumn.setFilterValue(status);
            setSelectedStatus(status);
        }
    
        table.setPageIndex(0); // Reset pagination
    };

    const statusHierarchy = ["Pending", "Approved", "Rejected", "For Payment", "Active", "Inactive", "Suspended", "Banned", "For NPTC Approval", "For VR Approval"];

    return (
        <div className="w-full">
            <div className="flex flex-row items-start justify-center md:justify-between md:py-4 gap-3 mb-3">
                <Input
                    placeholder="Filter data..."
                    value={(selectedColumnFilter && table.getColumn(selectedColumnFilter)?.getFilterValue() as string) ?? ''}
                    onChange={(event) => selectedColumnFilter && table.getColumn(selectedColumnFilter)?.setFilterValue(event.target.value)}
                    className="w-full md:max-w-80"
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className='text-white'>
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
                        <DropdownMenuRadioItem value="All Status" onClick={() => handleStatusFilter("All Status")}>
                            All Status
                        </DropdownMenuRadioItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>


            {/* Above here the row navigate pagination will appear when the is reached a md size */}

            {/* Table*/}
            <div className="rounded-md border">
                <Table className="w-full max-w-full overflow-auto ">
                    {/* Actual Header (hidden on small screens) */}
                    <TableHeader className="hidden md:table-header-group bg-[#252583] text-white">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-white">
                                        {typeof header.column.columnDef.header === 'function'
                                            ? header.column.columnDef.header(header.getContext())
                                            : header.column.columnDef.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    {/* Table Body */}
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="cursor-pointer hover:bg- flex flex-col md:table-row border-b md:border-0 p-2 md:p-0" onClick={() => onRowClick?.(row.original)}>
                                    {/* Mapped headers for small screens */}
                                    <div className="md:hidden block space-y-1">
                                        {/* Render the action button FIRST */}
                                        {row.getVisibleCells()
                                            .filter((cell) => cell.column.id === "actions")
                                            .map((cell) => {
                                            const cellValue = cell.getValue() as string;
                                            const statusWords = ["Pending", "Approved", "Rejected", "For Payment", "Active", "Inactive", "Suspended", "Banned", "For NPTC Approval", "For VR Approval"];
                                            const highlightableColumns = ["CompanyName", "Operator", "Driver", "Vehicle"];

                                            const getStatusClass = (status: string) => {
                                                switch (status) {
                                                case "Pending": return "bg-orange-500";
                                                case "Approved": return "bg-blue-500";
                                                case "Rejected": return "bg-gray-800";
                                                case "For Payment": return "bg-pink-500";
                                                case "Active": return "bg-green-600";
                                                case "Inactive": return "bg-red-500";
                                                case "Suspended": return "bg-yellow-500";
                                                case "Banned": return "bg-purple-500";
                                                case "For NPTC Approval": return "bg-yellow-500";
                                                case "For VR Approval": return "bg-emerald-500";
                                                default: return "bg-amber-800";
                                                }
                                            };

                                            const highlightedText =
                                                highlightableColumns.includes(cell.column.id) &&
                                                typeof cellValue === "string" &&
                                                statusWords.includes(cellValue)
                                                    ? (
                                                        <span className={`px-2 py-0.5 rounded text-white font-medium ${getStatusClass(cellValue)}`}>
                                                        {cellValue}
                                                        </span>
                                                    )
                                                    : (
                                                        <span className="text-black font-regular">{cellValue || "N/A"}</span>
                                                    );

                                                return (
                                                    <div key={cell.id} className="flex flex-row justify-between">
                                                        <TableCell>
                                                        Status:
                                                        {/* Check if the value is a string and should be highlighted */}
                                                        {highlightableColumns.includes(cell.column.id) && typeof cell.getValue() === "string" ? (
                                                            <span className="text-black font-regular">
                                                            {/* Get the status value from the cell */}
                                                            {String(cell.getValue() || "") // Safeguard for undefined/null value
                                                                .split(new RegExp(`(${statusWords.join("|")})`, "gi"))
                                                                .map((part, idx) =>
                                                                statusWords.includes(part) ? (
                                                                    <span key={idx} className={`px-2 py-0.5 rounded text-white font-medium ${getStatusClass(part)}`}>
                                                                    {part}
                                                                    </span>
                                                                ) : (
                                                                    part
                                                                )
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span className="text-black font-regular">{String(cell.getValue() || "N/A")}</span> 
                                                        )}
                                                        </TableCell>

                                                      <TableCell>
                                                        {typeof cell.column.columnDef.cell === "function"
                                                          ? cell.column.columnDef.cell(cell.getContext())
                                                          : cell.getValue()}
                                                      </TableCell>
                                                  
                                                      {/* Render the status separately */}
                                                      {highlightableColumns.includes(cell.column.id) && typeof cell.getValue() === "string" ? (
                                                        <div className="flex items-center">
                                                          {(String(cell.getValue()).split(new RegExp(`(${statusWords.join("|")})`, "gi"))).map((part, idx) =>
                                                            statusWords.includes(part) ? (
                                                              <span key={idx} className={`px-2 py-0.5 rounded text-white font-medium ${getStatusClass(part)}`}>
                                                                {part}
                                                              </span>
                                                            ) : (
                                                              part
                                                            )
                                                          )}
                                                        </div>
                                                      ) : null}
                                                    </div>
                                                  );
                                            })}

                                        {/* Then render the rest of the cells */}
                                        {row.getVisibleCells()
                                            .filter((cell) => cell.column.id !== "actions")
                                            .map((cell, index) => {
                                            const header = table.getHeaderGroups()[0].headers[index];
                                            const cellValue = cell.getValue() as string;
                                            const statusWords = ["Pending", "Approved", "Rejected", "For Payment", "Active", "Inactive", "Suspended", "Banned", "For NPTC Approval", "For VR Approval"];
                                            const highlightableColumns = ["CompanyName", "Operator", "Driver", "Vehicle"];

                                            const getStatusClass = (status: string) => {
                                                switch (status) {
                                                case "Pending": return "bg-orange-500";
                                                case "Approved": return "bg-blue-500";
                                                case "Rejected": return "bg-gray-800";
                                                case "For Payment": return "bg-pink-500";
                                                case "Active": return "bg-green-600";
                                                case "Inactive": return "bg-red-500";
                                                case "Suspended": return "bg-yellow-500";
                                                case "Banned": return "bg-purple-500";
                                                default: return "bg-gray-400";
                                                }
                                            };

                                            const highlightedText = highlightableColumns.includes(cell.column.id) && typeof cellValue === "string"
                                                ? cellValue.split(new RegExp(`(${statusWords.join("|")})`, "gi")).map((part, idx) =>
                                                    statusWords.includes(part) ? (
                                                    <span key={idx} className={`px-2 py-0.5 rounded text-white font-medium ${getStatusClass(part)}`}>
                                                        {part}
                                                    </span>
                                                    ) : (
                                                    part
                                                    )
                                                )
                                                : cellValue;

                                            return (
                                                <div key={cell.id} className="text-sm flex flex-row justify-between">
                                                    <span className="text-black font-semibold">
                                                        {typeof header.column.columnDef.header === 'function'
                                                        ? header.column.columnDef.header(header.getContext())
                                                        : header.column.columnDef.header}:
                                                    </span>
                                                    <span className="text-black font-regular">{highlightedText}</span>
                                                </div>
                                            );
                                            })}
                                    </div>


                                    {/* Actual Table Cells */}
                                    {row.getVisibleCells().map((cell) => {
                                        const cellValue = cell.getValue() as string;
                                        const statusWords = ["Pending", "Approved", "Rejected", "For Payment", "Active", "Inactive", "Suspended", "Banned", "For NPTC Approval", "For VR Approval"];
                                        const highlightableColumns = ["CompanyName", "Operator", "Driver", "Vehicle"];
                
                                        const getStatusClass = (status: string) => {
                                            switch (status) {
                                                case "Pending": return "bg-orange-500";
                                                case "Approved": return "bg-blue-500";
                                                case "Rejected": return "bg-gray-800";
                                                case "For Payment": return "bg-pink-500";
                                                case "Active": return "bg-green-600";
                                                case "Inactive": return "bg-red-500";
                                                case "Suspended": return "bg-yellow-500";
                                                case "Banned": return "bg-purple-500";
                                                default: return "bg-gray-400";
                                            }
                                        };
                
                                        if (highlightableColumns.includes(cell.column.id) && typeof cellValue === "string") {
                                            const highlightedText = cellValue.split(new RegExp(`(${statusWords.join("|")})`, "gi"))
                                                .map((part, index) =>
                                                    statusWords.includes(part) ? (
                                                        <span key={index} className={`px-2 py-0.5 rounded text-white font-medium ${getStatusClass(part)}`}>
                                                            {part}
                                                        </span>
                                                    ) : (
                                                        part
                                                    )
                                                );
                
                                            return <TableCell key={cell.id} className="hidden md:block">
                                                        {highlightedText}
                                                    </TableCell>;
                                        }

                                        return (
                                            <TableCell key={cell.id} className='hidden md:table-cell'>
                                                {typeof cell.column.columnDef.cell === "function"
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




            {/* Row navigate pagination*/}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-end space-x-2 py-4 ">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="flex items-center space-x-4">
                    <label className="text-sm">Rows per page:</label>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => {
                            const newSize = Number(value);
                            setPageSize(newSize);
                            table.setPageSize(newSize); // Ensure page size is correctly set
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={`${pageSize}`} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[2, 3, 4, 6, 8].map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="space-x-2 text-white">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.setPageIndex(0)} // Set page index directly on the table
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.setPageIndex((prev) => Math.max(prev - 1, 0))} // Set page index properly
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.setPageIndex((prev) => Math.min(prev + 1, table.getPageCount() - 1))} // Set page index properly
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)} // Set page index directly on the table
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight />
                    </Button>
                </div>
            </div>

        </div>
    );
}
