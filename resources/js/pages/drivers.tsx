import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import MainLayout from '@/pages/mainLayout';
import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface Driver {
    id: number;
    FirstName: string;
    LastName: string;
    username: string;
    email: string;
    ContactNumber: string;
    LicenseNumber: string | null;
    Status: string;
    License: string | null;
    Photo: string | null;
    NBI_clearance: string | null;
    Police_clearance: string | null;
    BIR_clearance: string | null;
    operator: { id: number; FirstName: string; LastName: string };
    vrCompany: { id: number; CompanyName: string };
}

interface DriversProps {
    drivers: Driver[];
}

export default function Drivers({ drivers }: DriversProps) {
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const { auth } = usePage<SharedData>().props;

    const handleRowClick = (driver: Driver) => {
        setSelectedDriver(driver);
    };

    const closeDialog = () => {
        setSelectedDriver(null);
    };

    const breadcrumbs = [
        { title: 'Drivers', href: '/drivers' },
    ];

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Drivers" />
            <div className="p-5">
                <Table>
                    <TableCaption>List of all registered drivers.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>First Name</TableHead>
                            <TableHead>Last Name</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Contact Number</TableHead>
                            <TableHead>License Number</TableHead>
                            <TableHead>Operator</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {drivers.map((driver) => (
                            <TableRow key={driver.id}>
                                <TableCell>{driver.id}</TableCell>
                                <TableCell>{driver.FirstName}</TableCell>
                                <TableCell>{driver.LastName}</TableCell>
                                <TableCell>{driver.username}</TableCell>
                                <TableCell>{driver.email}</TableCell>
                                <TableCell>{driver.ContactNumber}</TableCell>
                                <TableCell>{driver.LicenseNumber ?? 'N/A'}</TableCell>
                                <TableCell>{driver.operator?.FirstName} {driver.operator?.LastName ?? 'N/A'}</TableCell>
                                <TableCell>{driver.vrCompany?.CompanyName ?? 'N/A'}</TableCell>
                                <TableCell>{driver.Status}</TableCell>
                                <TableCell>
                                    <Button size="sm" onClick={() => handleRowClick(driver)}>
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!selectedDriver} onOpenChange={closeDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Driver Details</DialogTitle>
                    </DialogHeader>
                    {selectedDriver && (
                        <div className="space-y-2">
                            <p><strong>Name:</strong> {selectedDriver.FirstName} {selectedDriver.LastName}</p>
                            <p><strong>Email:</strong> {selectedDriver.email}</p>
                            <p><strong>Operator:</strong> {selectedDriver.operator?.FirstName} {selectedDriver.operator?.LastName ?? 'N/A'}</p>
                            <p><strong>Company:</strong> {selectedDriver.vrCompany?.CompanyName ?? 'N/A'}</p>
                            <p><strong>Status:</strong> {selectedDriver.Status}</p>
                            <div className="mt-4 space-y-2">
                                <strong>Documents:</strong>
                                <div className="grid grid-cols-2 gap-4">
                                    {selectedDriver.License && <img src={"/storage/11/JUVENILE_TIER_EMBLEM.png"} alt="License" className="w-full h-32 object-cover rounded-lg border" />}
                                    {selectedDriver.Photo && <img src={selectedDriver.Photo} alt="Photo" className="w-full h-32 object-cover rounded-lg border" />}
                                    {selectedDriver.NBI_clearance && <img src={selectedDriver.NBI_clearance} alt="NBI Clearance" className="w-full h-32 object-cover rounded-lg border" />}
                                    {selectedDriver.Police_clearance && <img src={selectedDriver.Police_clearance} alt="Police Clearance" className="w-full h-32 object-cover rounded-lg border" />}
                                    {selectedDriver.BIR_clearance && <img src={selectedDriver.BIR_clearance} alt="BIR Clearance" className="w-full h-32 object-cover rounded-lg border" />}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}
