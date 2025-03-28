import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

export default function PendingDriverDetails({ item, role }) {
    const [previewFile, setPreviewFile] = useState(null);
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false); // Separate state for rejection modal
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false); // Separate state for preview modal
    const [rejectionNote, setRejectionNote] = useState(''); // State for rejection note
    const [isLoading, setIsLoading] = useState(false); // Loading state for rejection

    // Handle rejection button click
    const handleRejection = async () => {
        try {
            setIsLoading(true); // Set loading to true when making the API call

            const response = await fetch('/api/rejection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: item?.id, // Send item ID
                    type: 'driver', // Send the entity type as 'driver'
                    note: rejectionNote, // Send the rejection note
                    user_id: item?.user.id, // Replace with actual logged-in user ID
                }),
            });

            // Check if response is ok
            if (!response.ok) {
                throw new Error('Error submitting rejection');
            }

            // Handle successful rejection
            const data = await response.json();
            if (data.message === 'Entity rejected and note created successfully') {
                setIsRejectionModalOpen(false); // Close the rejection modal after successful rejection
                alert('Rejection successful!'); // Show success message
                location.reload();
            }
        } catch (error) {
            console.error('Error submitting rejection:', error);
            alert('Error rejecting driver. Please try again.'); // Show error message
        } finally {
            setIsLoading(false); // Set loading to false after API call completes
        }
    };

    const handleApproval = async () => {
        try {
            setIsLoading(true);

            const requestBody = {
                id: item?.id,
                type: 'driver',
                user_id: item?.user.id,
            };

            // Add 'status' only if userRole matches the condition
            if (role === 'VR Admin') {
                requestBody.status = 'For NPTC Approval';
            } else if (role === 'NPTC Admin' || role === 'NPTC Super Admin') {
                requestBody.status = 'For Payment';
            }

            const response = await fetch('/api/approval', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            // Handle successful
            const data = await response.json();
            location.reload();
        } catch (error) {
            console.error('Error submitting rejection:', error);
        } finally {
            setIsLoading(false); // Set loading to false after API call completes
        }
    };

    return (
        <div className="mx-auto max-w-6xl space-y-8 rounded-lg border border-gray-200 bg-white p-8 shadow">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">
                        {item?.user.FirstName} {item?.user.LastName}
                    </h2>
                    <span className="rounded-md border border-gray-500 px-2 py-1 text-sm font-medium">Driver</span>
                </div>

                <div className="space-x-3">
                    <Button
                        className="bg-red-500 text-white hover:bg-red-600"
                        onClick={() => setIsRejectionModalOpen(true)} // Open rejection modal
                    >
                        Reject and add notes
                    </Button>
                    <Button className="bg-green-500 text-white hover:bg-green-600" onClick={() => handleApproval()}>
                        Approve and register
                    </Button>
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
                        ['Status', item?.Status],
                        ['Full Name', `${item?.user.FirstName} ${item?.user.LastName}`],
                        ['Birthday', item?.user.BirthDate],
                        ['Address', item?.user.Address],
                        ['Contact Number', item?.user.ContactNumber],
                        ['Email', item?.user.email],
                        ['License Number', item?.LicenseNumber],
                    ].map(([label, value], index) => (
                        <div key={index}>
                            <Label className="text-sm text-gray-600">{label}</Label>
                            <Input className="bg-gray-100 text-gray-800" value={value || '-'} readOnly />
                        </div>
                    ))}

                    {/* Media Files */}
                    {item?.media_files && item?.media_files.length > 0 ? (
                        item?.media_files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between rounded-lg border bg-gray-50 p-3">
                                <Label>{file.collection_name}</Label>
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-blue-500 text-blue-600"
                                    onClick={() => {
                                        setPreviewFile(file);
                                        setIsPreviewModalOpen(true); // Open preview modal
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

            {/* Rejection Note Modal */}
            {isRejectionModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 50 }}>
                    <div className="relative z-60 max-w-lg rounded-lg bg-white p-6">
                        <Button onClick={() => setIsRejectionModalOpen(false)} className="absolute top-2 right-2 p-2" variant="outline">
                            ✕
                        </Button>
                        <h3 className="text-lg font-semibold">Add Rejection Note</h3>
                        <textarea
                            value={rejectionNote}
                            onChange={(e) => setRejectionNote(e.target.value)}
                            className="mt-4 w-full rounded-md border border-gray-300 p-2"
                            placeholder="Enter rejection note"
                            rows={4}
                        />
                        <div className="mt-4 flex justify-end space-x-4">
                            <Button onClick={() => setIsRejectionModalOpen(false)} variant="outline">
                                Cancel
                            </Button>
                            <Button onClick={handleRejection} className="bg-red-500 text-white" disabled={isLoading || !rejectionNote}>
                                {isLoading ? 'Processing...' : 'Submit Rejection'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

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
