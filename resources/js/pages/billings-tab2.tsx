import { DataTable } from '@/components/RecordsComponent/data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { useState } from 'react';

interface BillingRecord {
    id: number;
    billingsID: string;
    company: string;
    driver: string[];
    vehicle: string;
    date: string;
    amount: number;
    modeOfPayment: string;
    accountName: string;
    accountNumber: string;
    purpose: string;
    time: string;
    referenceNumber: string;
    requestingDocument: string | string[];
    notes: string;
    status: 'Pending' | 'Rejected';
    dueDate: string;
}

interface BillingsTab2Props {
    dataReceipts: BillingRecord[];
}

export default function BillingsTab2({ dataReceipts }: BillingsTab2Props) {
    const [selectedItem, setSelectedItem] = useState<BillingRecord | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter data by billing ID (Ex. 1234)
    const filteredData = dataReceipts.filter((receipt) => receipt.billingsID.includes(searchQuery.replace(/\D/g, '')));

    const handleRowClick = (row: BillingRecord) => {
        setSelectedItem(row);
        setDialogOpen(true);
    };

    const columns: ColumnDef<BillingRecord>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <input
                    type="checkbox"
                    onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#2A2A92] focus:ring-[#2A2A92]"
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                    className="h-4 w-4 rounded border-gray-300 text-[#2A2A92] focus:ring-[#2A2A92]"
                />
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                return (
                    <span
                        className={`rounded-md px-2 py-1 text-xs font-medium ${
                            status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {status}
                    </span>
                );
            },
        },
        {
            accessorKey: 'billingsID',
            header: 'Billing ID',
            cell: ({ row }) => <span className="font-medium">BL-{row.getValue('billingsID')}</span>,
        },
        {
            accessorKey: 'driver',
            header: 'Name',
            cell: ({ row }) => {
                const drivers = row.getValue('driver');
                return Array.isArray(drivers) ? drivers.join(', ') : drivers;
            },
        },
        
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => <span className="font-medium">P {Number(row.getValue('amount')).toLocaleString()}</span>,
        },
        {
            accessorKey: 'dueDate',
            header: 'Due',
            cell: ({ row }) => (
                <div className="text-sm text-gray-600">
                    {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(row.getValue('dueDate')))}
                </div>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <Button variant="ghost" onClick={() => setSelectedItem(row.original)} className="h-8 w-8 p-0">
                    <Ellipsis className="h-4 w-4" />
                </Button>
            ),
        },
    ];

    return (
        <div>
            <DataTable columns={columns} data={filteredData} ColumnFilterName="billingsID" onRowClick={handleRowClick} />

            {/* Compact Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                {selectedItem && (
                    <DialogContent className="max-w-md">
                        {' '}
                        {/* Reduced from max-w-4xl */}
                        <DialogHeader>
                            <DialogTitle className="text-sm">BL - {selectedItem.billingsID}</DialogTitle> {/* Reduced text size */}
                        </DialogHeader>
                        {/* Smaller avatar */}
                        <Avatar className="mb-2 h-32 w-full rounded-none">
                            {' '}
                            {/* Reduced from h-[220px] */}
                            <AvatarImage src="https://us1.discourse-cdn.com/flex019/uploads/manager1/optimized/2X/7/71bfea85ebeba2ed4409a76cb38b8f3336847440_2_690x299.png" />
                            <AvatarFallback>Receipt</AvatarFallback>
                        </Avatar>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 py-2">
                            {' '}
                            {/* Reduced gaps */}
                            <div className="space-y-1">
                                <DetailItem label="Company" value={selectedItem.company} className="text-xs" />
                                <DetailItem label="Driver" value={Array.isArray(selectedItem.driver) ? selectedItem.driver.join(',  ') : selectedItem.driver} className="text-xs" />
                                <DetailItem label="Vehicle" value={selectedItem.vehicle} className="text-xs" />
                                <DetailItem label="Date" value={selectedItem.date} className="text-xs" />
                                <DetailItem label="Time" value={selectedItem.time} className="text-xs" />
                            </div>
                            <div className="space-y-1">
                                <DetailItem label="Amount" value={`P ${selectedItem.amount.toLocaleString()}`} className="text-xs" />
                                <DetailItem label="Mode of Payment" value={selectedItem.modeOfPayment} className="text-xs" />
                                <DetailItem label="Account Name" value={selectedItem.accountName} className="text-xs" />
                                <DetailItem label="Account Number" value={selectedItem.accountNumber} className="text-xs" />
                                <DetailItem label="Status" value={selectedItem.status} className="text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <DetailItem label="Purpose" value={selectedItem.purpose} className="text-xs" />
                            <DetailItem label="Reference Number" value={selectedItem.referenceNumber} className="text-xs" />
                            <DetailItem
                                label="Requesting Document"
                                value={
                                    Array.isArray(selectedItem.requestingDocument)
                                        ? selectedItem.requestingDocument.join(', ')
                                        : selectedItem.requestingDocument
                                }
                                className="text-xs"
                            />
                            <DetailItem label="Notes" value={selectedItem.notes} className="text-xs" />
                            <DetailItem label="Due Date" value={selectedItem.dueDate} className="text-xs" />
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}

function DetailItem({ label, value, className = '' }: { label: string; value: string | number; className?: string }) {
    return (
        <div className={className}>
            <p className="text-xs font-medium text-gray-500">{label}</p> {/* Reduced text size */}
            <p className="text-xs">{value || '-'}</p> {/* Reduced text size */}
        </div>
    );
}
