import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

export default function PendingDriverDetails({ assignedDriver }) {
    const [previewFile, setPreviewFile] = useState(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

    return (
        <div className="mx-auto max-w-6xl space-y-8 rounded-lg border border-gray-200 bg-white p-8 shadow">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">
                        {assignedDriver?.user.FirstName} {assignedDriver?.user.LastName}
                    </h2>
                    <span className="rounded-md border border-gray-500 px-2 py-1 text-sm font-medium">Driver</span>
                </div>
            </div>
            <Separator />

            {/* Driver Information */}
            <Card className="border-gray-300">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-700">Driver Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    {[
                        ['Status', assignedDriver?.Status],
                        ['Full Name', `${assignedDriver?.user.FirstName} ${assignedDriver?.user.LastName}`],
                        ['Birthday', assignedDriver?.user.BirthDate],
                        ['Address', assignedDriver?.user.Address],
                        ['Contact Number', assignedDriver?.user.ContactNumber],
                        ['Email', assignedDriver?.user.email],
                        ['License Number', assignedDriver?.LicenseNumber],
                    ].map(([label, value], index) => (
                        <div key={index}>
                            <Label className="text-sm text-gray-600">{label}</Label>
                            <Input className="bg-gray-100 text-gray-800" value={value || '-'} readOnly />
                        </div>
                    ))}

                    {/* Media Files */}
                    {assignedDriver?.media_files && assignedDriver?.media_files.length > 0 ? (
                        assignedDriver?.media_files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between rounded-lg border bg-gray-50 p-3">
                                <Label>{file.collection_name}</Label>
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-blue-500 text-blue-600"
                                    onClick={() => {
                                        setPreviewFile(file);
                                        setIsPreviewModalOpen(true);
                                    }}
                                >
                                    Preview
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p>No media files available</p>
                    )}
                </CardContent>
            </Card>

            {/* File Preview Modal */}
            {isPreviewModalOpen && previewFile && (
                <Modal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} file={previewFile} />
            )}
        </div>
    );
}

function Modal({ isOpen, onClose, file }) {
    if (!isOpen || !file) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 50 }}>
            <div className="relative z-60 max-w-lg rounded-lg bg-white p-4">
                <Button onClick={onClose} className="absolute top-2 right-2 p-2" variant="outline">
                    ✕
                </Button>
                {file.mime_type?.startsWith('image') ? (
                    <img src={file.url} alt={file.name} className="h-auto w-64 object-contain" />
                ) : (
                    <div className="text-center">Preview for non-image file: {file.name}</div>
                )}
            </div>
        </div>
    );
}
