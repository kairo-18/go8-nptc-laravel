import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { MoreHorizontal, Square } from 'lucide-react';
import { useState } from 'react';
import MainLayout from './mainLayout';

export default function VrAdmin({ companies }) {
    const { auth } = usePage<SharedData>().props;
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [open, setOpen] = useState(false);

    // Function to handle row click
    const handleRowClick = (company) => {
        setSelectedCompany(company);
        setOpen(true);
    };

    // Function to handle media download
    const handleDownload = (mediaId) => {
        window.location.href = route('download-media', { mediaId });
    };
    const [selectedPreview, setSelectedPreview] = useState(null);

    const handlePreview = (file) => {
        setSelectedPreview(file);
    };

    const breadcrumbs = [
        {
            title: 'Records',
            href: '/vr-owner',
        },
    ];

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="VR Companies" />
            <div className="space-y-4 p-6">
                <div>
                    <h1 className="text-2xl font-bold">VR Companies</h1>
                    <p className="text-sm text-gray-500">List of all registered vehicle rental companies.</p>
                </div>

                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Companies</h2>
                    <Input type="text" placeholder="Search" className="w-64" />
                </div>

                <div className="rounded-lg border shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                <TableHead className="w-10"></TableHead>
                                <TableHead>Company Name</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead className="w-10 text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {companies.map((company) => (
                                <TableRow key={company.id} onClick={() => handleRowClick(company)} className="cursor-pointer hover:bg-gray-100">
                                    <TableCell>
                                        <Square size={16} className="text-gray-500" />
                                    </TableCell>
                                    <TableCell>{company.CompanyName || 'No Company'}</TableCell>
                                    <TableCell>
                                        {company.owner?.user.FirstName} {company.owner?.user.LastName}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <MoreHorizontal className="cursor-pointer text-gray-500" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Dialog for Company Files */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="!w-full !max-w-4xl bg-white sm:max-w-6xl">
                    <DialogHeader>
                        <DialogTitle className="">Company Files</DialogTitle>
                    </DialogHeader>

                    <div className="max-h-[80vh] overflow-y-auto p-6">
                        {selectedCompany ? (
                            <Card className="p-6">
                                <CardContent className="space-y-6">
                                    <h2 className="text-xl font-semibold">{selectedCompany.CompanyName}</h2>
                                    <p className="text-sm text-gray-500">Files related to this company.</p>

                                    <div className="space-y-3">
                                        {selectedCompany.media?.length > 0 ? (
                                            selectedCompany.media.map((file) => (
                                                <div key={file.id} className="flex items-center justify-between rounded border p-3">
                                                    <span className="max-w-[60%] truncate">{file.name}</span>
                                                    <div className="flex space-x-3">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-white"
                                                            onClick={() => handlePreview(file)}
                                                        >
                                                            Preview
                                                        </Button>

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-white"
                                                            onClick={() => handleDownload(file.id)}
                                                        >
                                                            Download
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No files available.</p>
                                        )}
                                    </div>

                                    {selectedPreview && (
                                        <div className="mt-6 rounded-md border p-4">
                                            <h3 className="text-lg font-semibold">Preview: {selectedPreview.name}</h3>

                                            {selectedPreview.mime_type.startsWith('image/') ? (
                                                <img
                                                    src={route('preview-media', { mediaId: selectedPreview.id })}
                                                    alt="Preview"
                                                    className="mt-3 h-auto w-full rounded-md"
                                                />
                                            ) : selectedPreview.mime_type === 'application/pdf' ? (
                                                <iframe
                                                    src={route('preview-media', { mediaId: selectedPreview.id })}
                                                    className="mt-3 h-[550px] w-full"
                                                ></iframe>
                                            ) : (
                                                <p className="mt-3 text-sm text-gray-500">Preview not available for this file type.</p>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <p className="text-gray-500">No company selected.</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}
