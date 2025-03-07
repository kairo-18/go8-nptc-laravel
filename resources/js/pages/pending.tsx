/* eslint-disable @typescript-eslint/no-unused-vars */
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ArrowUpDown, Ellipsis } from 'lucide-react';
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
    const [activeTab, setActiveTab] = useState('vehicleTab');

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

    const vehicles: Vehicles[] = [
        {
            Model: 'HiAce Grandia 2020',
            Brand: 'Toyota',
            PlateNumber: 'ABC-1234',
            Seats: 12,
            OrImage: 'https://ltoportal.net/wp-content/uploads/2024/04/Duplicate-OR-CR.jpg',
            CrImage: 'https://d1hv7ee95zft1i.cloudfront.net/custom/blog-post-photo/gallery/new-lto-certificate-of-registration-604addbf02645.jpg',
            IdCard: 12,
            GpsImage: 'https://shorturl.at/RGaxr',
            InspectionCertification: 'https://ltoportal.ph/wp-content/uploads/2023/04/LTO-MVIR-Report-Form.jpg',
            CarFront:
                'https://d1hv7ee95zft1i.cloudfront.net/custom/blog-post-photo/mobile/gallery/20202-toyota-hiace-gl-grandia-tourer-exterior-front-5e5e1f1a19aad.jpg',
            CarSideLeft: 'https://toyotasantarosa.com.ph/wp-content/uploads/2023/09/IMG_4267.jpg',
            CarSideRight: 'https://images.summitmedia-digital.com/topgear/images/2019/12/27/toyota-hiace-styling-1577454694.jpg',
            CarBack: 'https://images.summitmedia-digital.com/topgear/images/2019/12/27/toyota-hiace-4-1577454701.jpg',
        },
        {
            Model: 'Innova',
            Brand: 'Toyota',
            PlateNumber: 'ABC-1234',
            Seats: 8,
            OrImage: 'https://ltoportal.net/wp-content/uploads/2024/04/Duplicate-OR-CR.jpg',
            CrImage: 'https://d1hv7ee95zft1i.cloudfront.net/custom/blog-post-photo/gallery/new-lto-certificate-of-registration-604addbf02645.jpg',
            IdCard: 8,
            GpsImage: 'https://shorturl.at/RGaxr',
            InspectionCertification: 'https://ltoportal.ph/wp-content/uploads/2023/04/LTO-MVIR-Report-Form.jpg',
            CarFront: 'https://shorturl.at/il6Z5',
            CarSideLeft: 'https://files.prokerala.com/automobile/images/photo/full/toyota-innova-17/toyota-innova-left-view.jpg',
            CarSideRight:
                'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi-Xjwu208Q90uzlaSETz-oyXty0McvH9ohqAUqV6nthqfjg8AWBOBTewjtAPu-2zewN5PYtqYrBDj2OTWuSQnP3mgZuODEpaa7cBm_bBSFWQe9DrSapipDF3wKeA-xOn1knV2R4NKSwqa7/s1600/2012_toyota_innova_04.jpg',
            CarBack: 'https://www.motoroids.com/wp-content/uploads/2015/04/2015-toyota-Innova-rear-20.jpg',
        },
    ];

    const drivers: Driver[] = [
        {
            LastName: 'Cortel',
            FirstName: 'Lance Ruzzell',
            Birthday: '12/25/1999',
            Address: '36 Marcelo H. Del Pilar St, Malabon, 1470 Metro Manila',
            ContactNumber: '09163939373',
            email: 'lance@alps.com',
            LicenseNumber: '1897217292',
            LicenseImg: 'https://img.youtube.com/vi/3PYzRJxMeRc/0.jpg',
            Photo1x1: 'https://m.media-amazon.com/images/I/61eJzhuJS9L._SX300_CR0%2C0%2C300%2C300_.jpg',
            NbiClearance: 'https://nbiclearance.org/wp-content/themes/NBI%20Clearance%20V4/img/NBI%20Clearance.png',
            PoliceClearance: 'https://policeclearanceph.ph/wp-content/uploads/2024/05/police-clearance-sample.webp',
            BirClearance: 'https://policeclearanceph.ph/wp-content/uploads/2024/05/police-clearance-sample.webp',
        },
        {
            LastName: 'Doria',
            FirstName: 'Charles Jefferson',
            Birthday: '10/10/1999',
            Address: '310 MacArthur Hwy, Valenzuela, Metro Manila',
            ContactNumber: '09163937890',
            email: 'charles@nokarin.com',
            LicenseNumber: '1897217292',
            LicenseImg: 'https://i.redd.it/3r1pbj2arasc1.jpeg',
            Photo1x1:
                'https://preview.redd.it/okarun-mclovin-v0-5ffo9ddswqsd1.png?width=612&format=png&auto=webp&s=c4e25858d73fc581ea5d85a00a03eb7c0067ccaf',
            NbiClearance: 'https://nbiclearance.org/wp-content/themes/NBI%20Clearance%20V4/img/NBI%20Clearance.png',
            PoliceClearance: 'https://policeclearanceph.ph/wp-content/uploads/2024/05/police-clearance-sample.webp',
            BirClearance: 'https://policeclearanceph.ph/wp-content/uploads/2024/05/police-clearance-sample.webp',
        },
        {
            LastName: 'Parayno',
            FirstName: 'Alexander III',
            Birthday: '09/11/1945',
            Address: '223 Cordero St, Valenzuela, Metro Manila',
            ContactNumber: '09336539323',
            email: 'parayno@alps.com',
            LicenseNumber: '6727215678',
            LicenseImg: 'https://upload.wikimedia.org/wikipedia/commons/6/62/UMID_EMV_sample.png',
            Photo1x1: 'https://i.pinimg.com/736x/81/1e/cb/811ecb8e1cd31d2d36725bcb6286b0fe.jpg',
            NbiClearance: 'https://nbiclearance.org/wp-content/themes/NBI%20Clearance%20V4/img/NBI%20Clearance.png',
            PoliceClearance: 'https://policeclearanceph.ph/wp-content/uploads/2024/05/police-clearance-sample.webp',
            BirClearance: 'https://policeclearanceph.ph/wp-content/uploads/2024/05/police-clearance-sample.webp',
        },
    ];

    const StatusButton = ({ color, text }: { color: 'red' | 'green'; text: string }) => {
        const colorClasses = {
            red: 'border-red-500 text-red-500 hover:bg-red-50',
            green: 'border-green-500 text-green-500 hover:bg-green-50',
        };
        return <Button className={`rounded-sm border bg-transparent px-4 py-2 text-sm ${colorClasses[color]}`}>{text}</Button>;
    };

    const OperatorInfoSection = ({ operator }: { operator: Operator }) => (
        <div className="mt-5 rounded-sm border border-gray-300 p-2">
            <h3 className="ml-2 text-lg font-semibold">Operator Information</h3>
            <Separator className="my-2" />
            <div className="grid grid-cols-3 gap-5 p-2">
                {Object.entries(operator).map(([key, value], index) => (
                    <div key={key}>
                        <p className="text-sm text-gray-500">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-base text-black">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const VehicleTabContent = () => (
        <div className="mt-4">
            <h4 className="text-lg font-semibold">Vehicles</h4>
            <div className="grid grid-cols-1 gap-4">
                {vehicles.map((vehicle, index) => (
                    <div key={index} className="rounded-sm border border-gray-300 p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Model</p>
                                <p className="text-base text-black">{vehicle.Model}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Brand</p>
                                <p className="text-base text-black">{vehicle.Brand}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Plate Number</p>
                                <p className="text-base text-black">{vehicle.PlateNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Seats</p>
                                <p className="text-base text-black">{vehicle.Seats}</p>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">OR Image</p>
                                <img src={vehicle.OrImage} alt="OR Image" className="h-32 w-auto rounded-sm" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">CR Image</p>
                                <img src={vehicle.CrImage} alt="CR Image" className="h-32 w-auto rounded-sm" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">GPS Image</p>
                                <img src={vehicle.GpsImage} alt="GPS Image" className="h-32 w-auto rounded-sm" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Inspection Certification</p>
                                <img src={vehicle.InspectionCertification} alt="Inspection Certification" className="h-32 w-auto rounded-sm" />
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Car Front</p>
                                <img src={vehicle.CarFront} alt="Car Front" className="h-32 w-auto rounded-sm" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Car Side Left</p>
                                <img src={vehicle.CarSideLeft} alt="Car Side Left" className="h-32 w-auto rounded-sm" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Car Side Right</p>
                                <img src={vehicle.CarSideRight} alt="Car Side Right" className="h-32 w-auto rounded-sm" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Car Back</p>
                                <img src={vehicle.CarBack} alt="Car Back" className="h-32 w-auto rounded-sm" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const DriversTabContent = () => (
        <div className="mt-4">
            <h4 className="text-lg font-semibold">Drivers</h4>
            <div className="grid grid-cols-1 gap-4">
                {drivers.map((driver, index) => (
                    <div key={index} className="rounded-sm border border-gray-300 p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="text-base text-black">{`${driver.FirstName} ${driver.LastName}`}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Contact Number</p>
                                <p className="text-base text-black">{driver.ContactNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-base text-black">{driver.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">License Number</p>
                                <p className="text-base text-black">{driver.LicenseNumber}</p>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">License Image</p>
                                <img src={driver.LicenseImg} alt="License Image" className="h-32 w-auto rounded-sm" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">1x1 Photo</p>
                                <img src={driver.Photo1x1} alt="1x1 Photo" className="h-32 w-auto rounded-sm" />
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">NBI Clearance</p>
                                <img src={driver.NbiClearance} alt="NBI Clearance" className="h-32 w-auto rounded-sm" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Police Clearance</p>
                                <img src={driver.PoliceClearance} alt="Police Clearance" className="h-32 w-auto rounded-sm" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">BIR Clearance</p>
                                <img src={driver.BirClearance} alt="BIR Clearance" className="h-32 w-auto rounded-sm" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const TabContent = ({ value, title, onPrevious, onNext }: { value: string; title: string; onPrevious: () => void; onNext: () => void }) => (
        <TabsContent value={value} className="w-full rounded-sm border border-gray-300 p-2">
            <div className="flex items-center justify-between py-2">
                <h3 className="ml-2 scroll-m-20 text-lg font-semibold tracking-tight">{title}</h3>
                <div className="mr-2 flex items-center space-x-2">
                    <StatusButton color="red" text="Reject and add notes" />
                    <StatusButton color="green" text="Approve and generate documents" />
                </div>
            </div>
            <Separator className="my-2" />

            {value === 'vehicleTab' ? <VehicleTabContent /> : <DriversTabContent />}

            <div className="mt-4 flex justify-end space-x-3">
                <Button variant="outline" onClick={onPrevious} className="bg-[#2A2A92] text-white hover:bg-[#5454A7] hover:text-white">
                    Previous
                </Button>
                <Button variant="outline" onClick={onNext} className="bg-[#2A2A92] text-white hover:bg-[#5454A7] hover:text-white">
                    {value === 'vehicleTab' ? 'Go to Driver' : 'Finish'}
                </Button>
            </div>
        </TabsContent>
    );

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Pending" />
            <div className="rounded-sm border border-gray-300 p-5">
                {selectedOperator ? (
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
                                <StatusButton color="red" text="Reject and add notes" />
                                <StatusButton color="green" text="Approve and generate documents" />
                            </div>
                        </div>
                        <OperatorInfoSection operator={selectedOperator} />
                        <div className="mx-auto mt-5 flex w-full flex-col items-center">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <div className="flex justify-center">
                                    <TabsList className="bg-[#2A2A92] text-white">
                                        <TabsTrigger value="vehicleTab" className="px-20">
                                            Vehicle
                                        </TabsTrigger>
                                        <TabsTrigger value="driversTab" className="px-20">
                                            Drivers
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                                <TabContent
                                    value="vehicleTab"
                                    title="Vehicle/Unit"
                                    onPrevious={() => setSelectedOperator(null)}
                                    onNext={() => setActiveTab('driversTab')}
                                />
                                <TabContent
                                    value="driversTab"
                                    title="Drivers"
                                    onPrevious={() => setActiveTab('vehicleTab')}
                                    onNext={() => setSelectedOperator(null)}
                                />
                            </Tabs>
                        </div>
                    </div>
                ) : (
                    <>
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
                                {operators.map((operator, index) => (
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
                        <div className="mt-5 flex items-center justify-between">
                            <p className="text-sm text-gray-500">Showing 0 of 5 row(s) selected</p>
                            <div className="flex justify-end space-x-3">
                                <Button variant="outline" className="bg-[#2A2A92] text-white hover:bg-[#5454A7] hover:text-white">
                                    Previous
                                </Button>
                                <Button variant="outline" className="bg-[#2A2A92] text-white hover:bg-[#5454A7] hover:text-white">
                                    Next
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </MainLayout>
    );
}
