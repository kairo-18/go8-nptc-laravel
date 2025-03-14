import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import MainLayout from '@/pages/mainLayout';
import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface MediaFile {
    id: number;
    name: string;
    mime_type: string;
    url: string;
}

interface Driver {
    id: number;
    FirstName: string;
    LastName: string;
    username: string;
    email: string;
    ContactNumber: string;
    LicenseNumber: string | null;
    Status: string;
    operator: { id: number; FirstName: string; LastName: string };
    vrCompany: { id: number; CompanyName: string };
    media_files: MediaFile[];
}

interface DriversProps {
    drivers: Driver[];
}

export default function Drivers({ drivers }: DriversProps) {
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const { auth } = usePage<SharedData>().props;
    const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);

    const handleRowClick = (driver: Driver) => {
        setSelectedDriver(driver);
    };

    const closeDialog = () => {
        setSelectedDriver(null);
    };

    const previewMedia = (media: MediaFile) => {
        setSelectedMedia(media);
    };
    
    const handleDownload = (mediaId: number) => {
        window.location.href = route('download-driver-media', { mediaId });
    };

    return (
        <MainLayout breadcrumbs={[{ title: 'Drivers', href: '/drivers' }]}>
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

            {/* Modal for Driver Details */}
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
                            
                            {selectedDriver.media_files.length > 0 && (
    <div>
        <h3 className="font-bold">Media Files</h3>
        <ul className="space-y-2">
            {selectedDriver.media_files.map((file) => (
                <li key={file.id} className="flex items-center space-x-2">
                    <span>{file.name}</span>
                    <Button variant="outline" size="sm" onClick={() => previewMedia(file)}>
                        Preview
                    </Button>
                </li>
            ))}
        </ul>

        {/* Show the media inside the modal */}
        {selectedMedia && (
            <div className="mt-4 p-3 border rounded-lg">
                <h4 className="font-semibold">Preview: {selectedMedia.name}</h4>
                {selectedMedia.mime_type.startsWith('image/') ? (
                    <img src={selectedMedia.url} alt={selectedMedia.name} className="max-w-full h-auto rounded-md" />
                ) : selectedMedia.mime_type === 'application/pdf' ? (
                    <iframe src={selectedMedia.url} className="w-full h-64 border rounded-md"></iframe>
                ) : (
                    <p>Preview not available for this file type.</p>
                )}
            </div>
        )}
    </div>
)}

                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}
