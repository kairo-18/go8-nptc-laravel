import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ChevronsUpDown,
    Ellipsis,
    Filter,
    SlidersHorizontal,
} from 'lucide-react';
import { useState } from 'react';
import MainLayout from './mainLayout';

interface Operator {
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
}

export default function Pending() {
    const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
    const [selectedItemDD1, setSelectedItemDD1] = useState('All');
    const [selectedItemDD2, setSelectedItemDD2] = useState('All');

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pending' }];
    const operators: Operator[] = [
        {
            Status: 'Complete',
            vrCompany: 'Nokarin',
            LastName: 'Co Young',
            FirstName: 'Sue',
            MiddleName: 'B',
            DateApplied: '2024-02-15',
            Birthdate: '12/30/1984',
            Address: 'BB Fisher Mall Malabon #23 Batumbakal Street',
            ContactNumber: '09163939373',
            Email: 'coyoung@nokarin.com',
        },
        {
            Status: 'Complete',
            vrCompany: 'Nokarin',
            LastName: 'Latko',
            FirstName: 'Cathy',
            MiddleName: 'B',
            DateApplied: '2024-03-10',
            Birthdate: '12/30/1984',
            Address: 'BB Fisher Mall Malabon #23 Batumbakal Street',
            ContactNumber: '09163939373',
            Email: 'latko@nokarin.com',
        },
        {
            Status: 'Pending',
            vrCompany: 'Alps',
            LastName: 'Owako',
            FirstName: 'Bob',
            DateApplied: '2024-04-05',
            Birthdate: '12/30/1984',
            Address: 'BB Fisher Mall Malabon #23 Batumbakal Street',
            ContactNumber: '09163939373',
            Email: 'owako@alps.com',
        },
        {
            Status: 'Pending',
            vrCompany: 'Victory',
            LastName: 'Kalbo',
            FirstName: 'Allen',
            DateApplied: '2024-04-05',
            Birthdate: '12/30/1984',
            Address: 'BB Fisher Mall Malabon #23 Batumbakal Street',
            ContactNumber: '09163939373',
            Email: 'kalbo@victory.com',
        },
        {
            Status: 'Rejected',
            vrCompany: 'Alps',
            LastName: 'James III',
            FirstName: 'Lebron',
            DateApplied: '2024-04-05',
            Birthdate: '12/30/1984',
            Address: 'BB Fisher Mall Malabon #23 Batumbakal Street',
            ContactNumber: '09163939373',
            Email: 'lebron@alps.com',
        },
    ];

    const StatusButton = ({ color, text, onClick }: { color: 'red' | 'green'; text: string; onClick?: () => void }) => {
        const colorClasses = {
            red: 'border-red-500 text-red-500 hover:bg-red-50',
            green: 'border-green-500 text-green-500 hover:bg-green-50',
        };
        return (
            <Button className={`rounded-sm border bg-transparent px-4 py-2 text-sm ${colorClasses[color]}`} onClick={onClick}>
                {text}
            </Button>
        );
    };

    // RejectButtonDialog Component
    const RejectButtonDialog = () => {
        const handleReject = () => {
            console.log('Application rejected');
        };

        return (
            <Dialog>
                <DialogTrigger asChild>
                    <StatusButton color="red" text="Reject and add notes" />
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogTitle className="text-lg text-red-500">Reject application</DialogTitle>
                    <DialogDescription>Are you sure you want to reject this application?</DialogDescription>
                    <Textarea placeholder="Let them know why you rejected their application. Type your message here." rows={4} />
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button
                                variant="secondary"
                                className="border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-600"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleReject} className="bg-red-500 text-white hover:bg-red-600">
                            Reject and send
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    const ApproveButtonDialog = () => {
        const handleApprove = () => {
            // Add logic to handle approval (e.g., send message, update status, etc.)
            console.log('Application approved');
        };

        return (
            <Dialog>
                <DialogTrigger asChild>
                    <StatusButton color="green" text="Approve and prompt for payment" />
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogTitle className="text-lg text-green-500">Approve application</DialogTitle>
                    <DialogDescription>Success! The billing will be automatically sent to the VR’s mail in a few moments.</DialogDescription>

                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button
                                variant="secondary"
                                className="border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-600"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="primary" onClick={handleApprove} className="bg-green-500 text-white hover:bg-green-600">
                            Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    const OwnerInfoSection = ({ operator }: { operator: Operator }) => (
        <div className="mt-5 rounded-sm border border-gray-300 p-2">
            <h3 className="ml-2 text-lg font-semibold">Owner Information</h3>
            <p className="ml-2 text-sm text-gray-500">Details of the Company Owner</p>
            <Separator className="my-2" />

            <div className="m-2">
                <div className="grid grid-cols-2 gap-4">
                    <div className="w-full">
                        <Label>Company Name</Label>
                        <Input disabled className="w-full" placeholder={operator.vrCompany} />
                    </div>
                    <div className="w-full">
                        <Label>Email</Label>
                        <Input disabled className="w-full" type="email" placeholder={operator.email} />
                    </div>
                </div>

                {/* Name Fields */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                    <div>
                        <Label>Last Name</Label>
                        <Input disabled placeholder={operator.LastName} />
                    </div>
                    <div>
                        <Label>First Name</Label>
                        <Input placeholder={operator.FirstName} disabled />
                    </div>
                    <div>
                        <Label>Middle Name</Label>
                        <Input placeholder={operator.MiddleName} disabled />
                    </div>
                </div>

                {/* BirthDate & Contact Number */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <Label>BirthDate</Label>
                            <Input placeholder="January" disabled />
                        </div>
                        <div>
                            <Label>&nbsp;</Label>
                            <Input placeholder="1" disabled />
                        </div>
                        <div>
                            <Label>&nbsp;</Label>
                            <Input placeholder="1987" disabled />
                        </div>
                    </div>
                    <div>
                        <Label>Contact Number</Label>
                        <Input placeholder={operator.ContactNumber} disabled />
                    </div>
                </div>

                {/* Address */}
                <div className="mt-4">
                    <Label>Address</Label>
                    <Input placeholder={operator.Address} disabled />
                </div>
            </div>
        </div>
    );

    const PreviewButton = () => (
        <Button
            variant="outline"
            className="absolute top-1/2 right-2 h-7 -translate-y-1/2 border border-blue-500 bg-transparent px-10 text-sm text-blue-500 hover:bg-blue-50"
        >
            Preview
        </Button>
    );

    const CompanyInfoSection = ({ operator }: { operator: Operator }) => (
        <div className="mt-5 rounded-sm border border-gray-300 p-2">
            <h3 className="ml-2 text-lg font-semibold">Company Information</h3>
            <p className="ml-2 text-sm text-gray-500">Details of Vehicle Rental Company Owner</p>
            <Separator className="my-2" />

            <div className="m-2 mt-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="w-full">
                        <Label>DTI or SEC Permit</Label>
                        <div className="relative w-full">
                            <Input disabled className="w-full pr-16" placeholder={operator.vrCompany} />
                            <PreviewButton />
                        </div>
                    </div>
                    <div className="w-full">
                        <Label>BIR 2303</Label>
                        <div className="relative w-full">
                            <Input disabled className="w-full pr-16" placeholder={operator.Email} />
                            <PreviewButton />
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="w-full">
                        <Label>Business Permit</Label>
                        <div className="relative w-full">
                            <Input disabled className="w-full pr-16" placeholder={operator.ContactNumber} />
                            <PreviewButton />
                        </div>
                    </div>
                    <div className="w-full">
                        <Label>Brand Logo</Label>
                        <div className="relative w-full">
                            <Input disabled className="w-full pr-16" placeholder={operator.Address} />
                            <PreviewButton />
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="w-full">
                        <Label>Business Permit Number</Label>
                        <div className="relative w-full">
                            <Input disabled className="w-full pr-16" placeholder={operator.ContactNumber} />
                        </div>
                    </div>
                    <div className="w-full">
                        <Label>Samples Sales Invoice</Label>
                        <div className="relative w-full">
                            <Input disabled className="w-full pr-16" placeholder={operator.Address} />
                            <PreviewButton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const ContactInfoSection = ({ operator }: { operator: Operator }) => (
        <div className="mt-5 rounded-sm border border-gray-300 p-2">
            <h3 className="ml-2 text-lg font-semibold">Contact Information</h3>
            <p className="ml-2 text-sm text-gray-500">Details of the Organizational hierarchy</p>
            <Separator className="my-2" />

            <div className="m-2">
                <div className="grid grid-cols-2 gap-4">
                    <div className="w-full">
                        <Label>Company Name</Label>
                        <Input disabled className="w-full" placeholder={operator.vrCompany} />
                    </div>
                    <div className="w-full">
                        <Label>Email</Label>
                        <Input disabled className="w-full" placeholder={operator.Email} />
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                    <div>
                        <Label>Last Name</Label>
                        <Input placeholder={operator.LastName} disabled />
                    </div>
                    <div>
                        <Label>First Name</Label>
                        <Input placeholder={operator.FirstName} disabled />
                    </div>
                    <div>
                        <Label>Middle Name</Label>
                        <Input placeholder={operator.MiddleName} disabled />
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="w-full">
                        <Label>Position</Label>
                        <Input disabled className="w-full" placeholder="Head of Marketing Department" />
                    </div>
                    <div className="w-full">
                        <Label>Contact Number</Label>
                        <Input disabled className="w-full" placeholder={operator.ContactNumber} />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Pending" />

            {selectedOperator ? (
                <div className="rounded-sm border border-gray-300 p-5">
                    <div>
                        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Operator Info</h4>
                        <p className="text-sm text-gray-600">Details of Operator Info</p>
                        <div className="mt-3 flex items-center justify-between space-x-5 rounded-sm border border-gray-300 p-5">
                            <div className="flex space-x-4">
                                <Avatar className="h-25 w-25 rounded-sm border border-gray-300">
                                    <AvatarImage
                                        src="https://ih1.redbubble.net/image.5497566438.4165/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg"
                                        alt="AvatarProfile"
                                    />
                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-5xl text-black dark:bg-neutral-700 dark:text-white">
                                        {selectedOperator.FirstName?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col leading-tight">
                                    <h2 className="font-bold">
                                        {selectedOperator.FirstName} {selectedOperator.MiddleName ? selectedOperator.MiddleName + ' ' : ''}
                                        {selectedOperator.LastName}
                                    </h2>
                                    <p className="text-sm text-gray-600">Operator</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RejectButtonDialog />
                                <ApproveButtonDialog />
                            </div>
                        </div>

                        <OwnerInfoSection operator={selectedOperator} />

                        <CompanyInfoSection operator={selectedOperator} />

                        <ContactInfoSection operator={selectedOperator} />
                    </div>
                </div>
            ) : (
                <>
                    <div className="ml-5 flex items-center">
                        <h2 className="text-xl font-semibold">{selectedItemDD1}</h2>
                        {/*  Sort by ID and Title */}
                        <div className="ml-auto">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="flex w-40 items-center justify-start gap-2 bg-white text-black hover:bg-[#2A2A92] hover:text-white"
                                    >
                                        {selectedItemDD1}
                                        <Filter className="ml-auto h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-40">
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setSelectedItemDD1('All');
                                        }}
                                    >
                                        All
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setSelectedItemDD1('Vehicle Rentals');
                                        }}
                                    >
                                        Vehicle Rentals
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setSelectedItemDD1('Operators');
                                        }}
                                    >
                                        Operators
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setSelectedItemDD1('Vehicle');
                                        }}
                                    >
                                        Vehicle
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setSelectedItemDD1('Drivers');
                                        }}
                                    >
                                        Drivers
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="rounded-sm border border-gray-300 p-5">
                        <div className="mb-5 flex items-center space-x-2">
                            <Input placeholder="Filter application" className="w-60" />
                            {/* Sort the Header Titles */}
                            <div className="ml-auto">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="flex items-center justify-start gap-2 bg-white text-black hover:bg-[#2A2A92] hover:text-white"
                                        >
                                            <SlidersHorizontal className="h-4 w-4" /> {selectedItemDD2}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-40">
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setSelectedItemDD2('Hello');
                                            }}
                                        >
                                            Hello
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setSelectedItemDD2('World');
                                            }}
                                        >
                                            World
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <Table className="w-full rounded-sm border border-gray-300 text-sm">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px] px-2 text-center text-gray-500"></TableHead>
                                    <TableHead className="px-4 py-2 text-gray-600">VR Company</TableHead>
                                    <TableHead className="px-4 py-2 text-gray-600">
                                        Operator <ArrowUpDown className="ml-1 inline-block size-4" />
                                    </TableHead>
                                    <TableHead className="px-4 py-2 text-right text-gray-600">Date Applied</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {operators.map((operator) => (
                                    <TableRow
                                        key={operator.Email}
                                        className="cursor-pointer transition hover:bg-gray-100"
                                        onClick={() => setSelectedOperator(operator)}
                                    >
                                        <TableCell className="w-[80px] px-2 text-center">
                                            <div
                                                className={`inline-block h-4 w-4 rounded-sm border-[3px] ${
                                                    operator.Status === 'Complete'
                                                        ? 'border-green-500'
                                                        : operator.Status === 'Pending'
                                                          ? 'border-yellow-500'
                                                          : 'border-red-500'
                                                }`}
                                            />
                                        </TableCell>
                                        <TableCell className="px-4 py-5 font-medium">{operator.vrCompany ?? 'Unknown'}</TableCell>
                                        <TableCell className="px-4 py-2">
                                            {operator.FirstName} {operator.MiddleName ? operator.MiddleName + '.' : ''} {operator.LastName}
                                        </TableCell>
                                        <TableCell className="px-7 py-2 text-right">{operator.DateApplied}</TableCell>
                                        <TableCell className="py-2 text-right">
                                            <Ellipsis
                                                className="mx-auto size-4 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log('ellipsis clicked', operator);
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        <div className="mt-2 flex items-center justify-between">
                            {/* Left Side */}
                            <p className="text-sm text-gray-500">0 of 100 row(s) selected.</p>

                            {/* Right Side */}
                            <div className="flex items-center space-x-4">
                                {/* Rows per page dropdown */}
                                <div className="flex items-center space-x-2">
                                    <p className="text-sm">Rows per page</p>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="mr-5 flex w-20 items-center justify-between bg-white text-black hover:bg-[#2A2A92] hover:text-white"
                                            >
                                                10 <ChevronsUpDown className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>10</DropdownMenuItem>
                                            <DropdownMenuItem>20</DropdownMenuItem>
                                            <DropdownMenuItem>30</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Page information */}
                                <p className="mr-10 text-sm">Page 1 of 10</p>

                                {/* Pagination buttons */}
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        className="flex items-center justify-center bg-white text-black hover:bg-[#2A2A92] hover:text-white"
                                    >
                                        <ChevronsLeft />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex items-center justify-center bg-white text-black hover:bg-[#2A2A92] hover:text-white"
                                    >
                                        <ChevronLeft />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex items-center justify-center bg-white text-black hover:bg-[#2A2A92] hover:text-white"
                                    >
                                        <ChevronRight />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex items-center justify-center bg-white text-black hover:bg-[#2A2A92] hover:text-white"
                                    >
                                        <ChevronsRight />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </MainLayout>
    );
}
