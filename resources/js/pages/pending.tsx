/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { OperatorDetails } from './pending-operator-details';

interface Owner {
    LastName: string;
    FirstName: string;
    Address: string;
    BirthDate: string;
    ContactNumber: string;
    Email: string;
}

interface VR {
    BusinessPermit: media;
    BusinessPermitNumber: string;
    CompanyName: string;
    BIR_2303: media;
    DTI_Permit: media;
    BrandLogo: media;
    SalesInvoice: media;
    FirstName: string;
    LastName: string;
    Position: string;
    ContactNumber: string;
    Email: string;
}

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
            VR_ID: 1,
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
            VR_ID: 2,
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
            VR_ID: 1,
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
            VR_ID: 1,
            Status: 'Pending',
            vrCompany: 'Alps',
            LastName: 'Kalbo',
            FirstName: 'Allen',
            DateApplied: '2024-04-05',
            Birthdate: '12/30/1984',
            Address: 'BB Fisher Mall Malabon #23 Batumbakal Street',
            ContactNumber: '09163939373',
            Email: 'kalbo@alps.com',
        },
        {
            VR_ID: 1,
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

    const owners: Owner[] = [
        {
            VR_ID: 1,
            LastName: 'Laxamana',
            FirstName: 'Justin',
            Address: 'BB Fisher Mall Malabon #23 Batumbakal Street',
            BirthDate: '12/30/1984',
            ContactNumber: '09163939373',
            Email: 'kalbo@victory.com',
        },
        {
            VR_ID: 2,
            LastName: 'Aquino',
            FirstName: 'Crystal Kate',
            Address: 'BB Fisher Mall Malabon #23 Batumbakal Street',
            BirthDate: '12/30/2002',
            ContactNumber: '09163939373',
            Email: 'aquino@nokarin.com',
        },
    ];

    const vrs: VR[] = [
        {
            VR_ID: 1,
            BusinessPermit:
                'https://64.media.tumblr.com/e60b89b8ea13a3c9f2df6d55bfeeb45e/b56bdb39803ed67d-ea/s1280x1920/bc3701015454c0f774ad07982d1e2c9e77ea9936.png',
            BusinessPermitNumber: '123456789',
            CompanyName: 'Nokarin',
            BIR_2303:
                'https://64.media.tumblr.com/e60b89b8ea13a3c9f2df6d55bfeeb45e/b56bdb39803ed67d-ea/s1280x1920/bc3701015454c0f774ad07982d1e2c9e77ea9936.png',
            DTI_Permit:
                'https://64.media.tumblr.com/e60b89b8ea13a3c9f2df6d55bfeeb45e/b56bdb39803ed67d-ea/s1280x1920/bc3701015454c0f774ad07982d1e2c9e77ea9936.png',
            BrandLogo:
                'https://64.media.tumblr.com/e60b89b8ea13a3c9f2df6d55bfeeb45e/b56bdb39803ed67d-ea/s1280x1920/bc3701015454c0f774ad07982d1e2c9e77ea9936.png',
            SalesInvoice:
                'https://64.media.tumblr.com/e60b89b8ea13a3c9f2df6d55bfeeb45e/b56bdb39803ed67d-ea/s1280x1920/bc3701015454c0f774ad07982d1e2c9e77ea9936.png',
            FirstName: 'Sue',
            LastName: 'Co Young',
            MiddleName: 'B',
            Position: 'CEO',
            ContactNumber: '09163939373',
            Email: 'coyoung@nokarin.com',
        },
        {
            VR_ID: 2,
            BusinessPermit:
                'https://preview.redd.it/no-spoilers-give-me-your-arcane-memes-and-i-shall-giveth-v0-xietz7vij81e1.jpeg?width=640&crop=smart&auto=webp&s=a14e22f16d97fc5426767364b1e64fd44e3065be0',
            BusinessPermitNumber: '123456789',
            CompanyName: 'Alps',
            BIR_2303:
                'https://preview.redd.it/no-spoilers-give-me-your-arcane-memes-and-i-shall-giveth-v0-xietz7vij81e1.jpeg?width=640&crop=smart&auto=webp&s=a14e22f16d97fc5426767364b1e64fd44e3065be',
            DTI_Permit:
                'https://preview.redd.it/no-spoilers-give-me-your-arcane-memes-and-i-shall-giveth-v0-xietz7vij81e1.jpeg?width=640&crop=smart&auto=webp&s=a14e22f16d97fc5426767364b1e64fd44e3065be',
            BrandLogo:
                'https://preview.redd.it/no-spoilers-give-me-your-arcane-memes-and-i-shall-giveth-v0-xietz7vij81e1.jpeg?width=640&crop=smart&auto=webp&s=a14e22f16d97fc5426767364b1e64fd44e3065be',
            SalesInvoice:
                'https://preview.redd.it/no-spoilers-give-me-your-arcane-memes-and-i-shall-giveth-v0-xietz7vij81e1.jpeg?width=640&crop=smart&auto=webp&s=a14e22f16d97fc5426767364b1e64fd44e3065be ',
            FirstName: 'Bob',
            LastName: 'Owako',
            Position: 'CEO',
            ContactNumber: '09163939373',
            Email: 'owako@alps.com',
        },
    ];

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Pending" />

            {selectedOperator ? (
                <OperatorDetails
                    operator={selectedOperator}
                    onBack={() => setSelectedOperator(null)}
                    vr={vrs.find((vr) => vr.CompanyName === selectedOperator.vrCompany) || null}
                    owner={owners.find((owner) => owner.VR_ID === vrs.find((vr) => vr.CompanyName === selectedOperator.vrCompany)?.VR_ID) || null}
                />
            ) : (
                <>
                    <div className="ml-5 flex items-center">
                        <h2 className="text-xl font-semibold">{selectedItemDD1} - (Still not functional)</h2>
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
                                    <DropdownMenuItem onClick={() => setSelectedItemDD1('All')}>All</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedItemDD1('Vehicle Rentals')}>Vehicle Rentals</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedItemDD1('Operators')}>Operators</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedItemDD1('Vehicle')}>Vehicle</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedItemDD1('Drivers')}>Drivers</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="rounded-sm border border-gray-300 p-5">
                        <div className="mb-5 flex items-center space-x-2">
                            <Input placeholder="Filter application" className="w-60" />
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
                                        <DropdownMenuItem onClick={() => setSelectedItemDD2('Hello')}>Hello</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSelectedItemDD2('World')}>World</DropdownMenuItem>
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

                        <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm text-gray-500">0 of 100 row(s) selected.</p>

                            <div className="flex items-center space-x-4">
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

                                <p className="mr-10 text-sm">Page 1 of 10</p>

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
