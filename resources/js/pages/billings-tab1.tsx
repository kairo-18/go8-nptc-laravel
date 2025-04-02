import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { useState } from 'react';

const sortOptions = [
    { value: 'date_desc', label: 'Date (Latest)' },
    { value: 'date_asc', label: 'Date (Oldest)' },
    { value: 'company_asc', label: 'Company Name (A - Z)' },
    { value: 'company_desc', label: 'Company Name (Z - A)' },
];

interface DataReceipt {
    id: number;
    company: string;
    driver: string;
    vehicle: string;
    date: string;
    amount: number;
    billingsID: string;
    modeOfPayment: string;
    accountName: string;
    accountNumber: string;
    purpose: string;
    time: string;
    referenceNumber: string;
    requestingDocument: string | string[];
    notes: string;
    status: string;
    dueDate: string;
    media?: {
        id: number;
        original_url: string;
        file_name: string;
        // other media properties you might need
    }[];
    Receipt?: string; // Keep this if you still need it
    driverIds: string[];
    operatorId: string;
}

interface BillingsTab1Props {
    dataReceipts: DataReceipt[];
}

export default function BillingsTab1({ dataReceipts }: BillingsTab1Props) {
    const [open, setOpen] = useState(false);
    const [sortValue, setSortValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedReceipt, setSelectedReceipt] = useState<DataReceipt | null>(null);
    const [rejectNotes, setRejectNotes] = useState('');
    const { auth } = usePage<SharedData>().props;

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const filteredData = dataReceipts
        .filter(
            (receipt) =>
                receipt.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                receipt.billingsID.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .sort((a, b) => {
            if (sortValue === 'date_desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
            if (sortValue === 'date_asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
            if (sortValue === 'company_asc') return a.company.localeCompare(b.company);
            if (sortValue === 'company_desc') return b.company.localeCompare(a.company);
            return 0;
        });

    const handleApprove = async (selectedReceipt) => {
        try {
            await axios.post('/api/approve-with-docu', {
                id: selectedReceipt.operatorId,
                type: 'operator',
                user_id: auth.user.id,
                paymentId: selectedReceipt.id,
            });
            setSelectedReceipt(null);
        } catch (error) {
            console.error('Approval failed:', error);
        }
    };

    const { post, data } = useForm({});

    const handleReject = async () => {
        console.log('Notes: ' + rejectNotes);

        if (!selectedReceipt?.driver) {
            console.error('Driver information is missing');
            return;
        }

        let driverId = selectedReceipt.driverIds[0];

        if (!driverId) {
            driverId = selectedReceipt.operatorId;
        }

        console.log('Sending data:', {
            driverId: driverId,
            note: rejectNotes,
        });

        try {
            const response = await axios.post(
                route('reject.billing', { driver: driverId }),
                {
                    note: rejectNotes, // Send the note at root level
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                },
            );

            // Handle success
            setRejectNotes('');
            setSelectedReceipt(null);
            window.location.reload();
            console.log('Rejection successful', response.data);
        } catch (error) {
            console.error('Rejection failed:', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                console.error('Error data:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
            } else {
                // Something happened in setting up the request
                console.error('Error:', error.message);
            }
        }
    };

    return (
        <div className="mt-4 flex h-full flex-col">
            {/* Search bar and Controls */}
            <div className="flex items-center justify-between gap-4 pb-4">
                {/* Search bar - always visible */}
                <div className="relative w-[430px]">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                        placeholder="Search by Billing ID or Company | Ex: 1234 or Nokarin"
                        className="w-full rounded-md border border-gray-300 p-2 pl-10 placeholder:text-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Conditional render: Sort Combobox or Close button */}
                {!selectedReceipt ? (
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="flex w-[225px] items-center justify-between bg-white"
                            >
                                <span>{sortValue ? sortOptions.find((option) => option.value === sortValue)?.label : 'Sort by'}</span>
                                <ChevronsUpDown className="h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0">
                            <Command>
                                <CommandInput placeholder="Search sorting option..." />
                                <CommandList>
                                    <CommandEmpty>No options found.</CommandEmpty>
                                    <CommandGroup>
                                        {sortOptions.map((option) => (
                                            <CommandItem
                                                key={option.value}
                                                value={option.value}
                                                onSelect={(currentValue) => {
                                                    setSortValue(currentValue === sortValue ? '' : currentValue);
                                                    setOpen(false);
                                                }}
                                            >
                                                <Check className={`mr-2 h-4 w-4 ${sortValue === option.value ? 'opacity-100' : 'opacity-0'}`} />
                                                {option.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <Button
                        variant="outline"
                        className="flex w-[225px] items-center justify-center gap-2 bg-white"
                        onClick={() => setSelectedReceipt(null)}
                    >
                        Close Preview
                    </Button>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 gap-4">
                {/* Card List */}
                <div className={`h-[528px] overflow-y-auto ${selectedReceipt ? 'w-[35%]' : 'w-full'}`}>
                    <div className="space-y-2 pr-2">
                        {filteredData.map((receipt) => (
                            <Card
                                key={receipt.id}
                                className={`h-[120px] cursor-pointer gap-1 border-none transition-colors hover:bg-gray-100 ${
                                    selectedReceipt?.id === receipt.id ? 'bg-gray-200' : ''
                                }`}
                                onClick={() => setSelectedReceipt(receipt)}
                            >
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>{receipt.vehicle}</CardTitle>
                                        <CardDescription className="text-muted-foreground mt-1 text-sm">
                                            {receipt.company} • {receipt.driver && `${receipt.driver},`}
                                        </CardDescription>
                                    </div>
                                    <div className="text-muted-foreground text-sm">{formatDate(receipt.date)}</div>
                                </CardHeader>
                                <CardContent>
                                    <Badge variant="default" className="bg-[#2A2A92] text-white">
                                        <span className="text-xs font-medium">Billing ID: BL - {receipt.billingsID}</span>
                                    </Badge>
                                    <Badge variant="outline" className="ml-2">
                                        <span className="text-xs font-medium">${receipt.amount.toLocaleString()}</span>
                                    </Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Preview Panel - only visible when a card is selected */}
                {selectedReceipt && (
                    <div className="h-full w-[65%] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold">Approval</h2>

                            <div className="flex space-x-2">
                                {/* Reject Dialog */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="border-red-500 bg-transparent text-red-500 hover:bg-red-50 hover:text-red-700"
                                        >
                                            Reject and add notes
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Reject Receipt</DialogTitle>
                                            <DialogDescription>
                                                Are you sure you want to reject this receipt? Please provide a reason below.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid">
                                            <div className="grid grid-cols-1 items-center gap-4">
                                                <Textarea
                                                    placeholder="Enter rejection reason..."
                                                    className="placeholder:text-gray-400"
                                                    value={rejectNotes}
                                                    onChange={(e) => setRejectNotes(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline" className="text-white" onClick={() => setRejectNotes('')}>
                                                    Cancel
                                                </Button>
                                            </DialogClose>

                                            <Button
                                                variant="outline"
                                                className="border-red-500 bg-transparent text-red-500 hover:bg-red-50 hover:text-red-700"
                                                onClick={handleReject}
                                            >
                                                Confirm Rejection
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                {/* Approve Dialog */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="border-green-500 bg-transparent text-green-500 hover:bg-green-50 hover:text-green-700"
                                            onClick={() => handleApprove(selectedReceipt)}
                                        >
                                            Approve and generate documents
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Approve Receipt</DialogTitle>
                                            <DialogDescription>Approved and generate documents for this receipt.</DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        <Separator className="-mx-6 mb-4 !w-[calc(100%+3rem)]" />

                        <div className="max-h-[calc(100vh-21rem)] space-y-6 overflow-y-auto">
                            {/* Basic Information */}
                            <div>
                                <Avatar className="mb-1 h-[220px] w-full rounded-none">
                                    {console.log(selectedReceipt?.media)}
                                    <AvatarImage src={route('preview-media', selectedReceipt.media[0].id)} />
                                    <AvatarFallback>Receipt</AvatarFallback>
                                </Avatar>

                                <div className="grid grid-cols-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Driver</p>
                                        <p>{selectedReceipt.driver}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Company</p>
                                        <p>{selectedReceipt.company}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Vehicle</p>
                                        <p>{selectedReceipt.vehicle}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Date & Time</p>
                                        <p>
                                            {formatDate(selectedReceipt.date)} at {selectedReceipt.time}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="">
                                <h3 className="font-medium">Payment Information</h3>
                                <div className="grid grid-cols-2 gap-1">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Mode of Payment</p>
                                        <p>{selectedReceipt.modeOfPayment}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Amount</p>
                                        <p>${selectedReceipt.amount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Account Name</p>
                                        <p>{selectedReceipt.accountName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Account Number</p>
                                        <p>{selectedReceipt.accountNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Reference Number</p>
                                        <p>{selectedReceipt.referenceNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Purpose</p>
                                        <p>{selectedReceipt.purpose}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Documents and Notes */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="mt-2">
                                        <p className="text-sm font-medium text-gray-500">Requesting Documents For</p>
                                        <p>
                                            {Array.isArray(selectedReceipt.requestingDocument)
                                                ? selectedReceipt.requestingDocument.join(', ')
                                                : selectedReceipt.requestingDocument}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <div className="mt-2">
                                        <p className="text-sm font-medium text-gray-500">Notes</p>
                                        <p>{selectedReceipt.notes}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
