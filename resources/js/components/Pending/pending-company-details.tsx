import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

export default function PendingCompanyDetails({ item }) {
    const [previewFile, setPreviewFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false); // Rejection modal state
    const [rejectionNote, setRejectionNote] = useState(''); // Rejection note state
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
                    type: 'vr_company', // Send the entity type as 'company'
                    note: rejectionNote, // Send the rejection note
                    user_id: item?.id,
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
            alert('Error rejecting company. Please try again.'); // Show error message
        } finally {
            setIsLoading(false); // Set loading to false after API call completes
        }
    };

    const handleApproval = async () => {
        try {
            setIsLoading(true);

            const response = await fetch('/api/approve-with-docu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: item?.id, // Send item ID
                    type: 'vr_company', // Send the entity type as 'vehicle'
                    user_id: item?.id,
                }),
            });

            // Handle successful
            const data = await response.json();
            if (data.message === 'Entity approved and note created successfully') {
                alert('Approval successful! Official documents will be sent to the mail of the driver.');
                location.reload();
            }
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
                <div className="flex items-center space-x-4">
                    <img
                        src={item?.logoUrl || '/placeholder.png'}
                        alt="Company Logo"
                        className="h-16 w-16 rounded-full border border-gray-300 object-cover"
                    />
                    <h1 className="text-2xl font-bold text-gray-800">{item?.CompanyName || 'Company Name'}</h1>
                </div>
                <div className="space-x-3">
                    <Button
                        className="bg-red-500 text-white hover:bg-red-600"
                        onClick={() => setIsRejectionModalOpen(true)} // Open rejection modal
                    >
                        Reject and add notes
                    </Button>
                    <Button className="bg-green-500 text-white hover:bg-green-600" onClick={() => handleApproval()}>
                        Approve and prompt for payment
                    </Button>
                </div>
            </div>
            <Separator />

            {/* Owner Information */}
            <Card className="border-gray-300">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-700">Owner Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    {[
                        ['Company Name', item?.CompanyName],
                        ['Email', item?.owner_details?.Email],
                        ['Last Name', item?.owner_details?.LastName],
                        ['First Name', item?.owner_details?.FirstName],
                        ['Middle Name', item?.owner_details?.MiddleName],
                        ['BirthDate', item?.owner_details?.BirthDate],
                        ['Contact Number', item?.owner_details?.ContactNumber],
                        ['Address', item?.owner_details?.Address],
                    ].map(([label, value], index) => (
                        <div key={index}>
                            <Label className="text-sm text-gray-600">{label}</Label>
                            <Input className="bg-gray-100 text-gray-800" value={value || '-'} readOnly />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Company Information */}
            <Card className="border-gray-300">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-700">Company Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    {item?.media_files?.map((file, index) => (
                        <div key={index} className="flex items-center justify-between rounded-lg border bg-gray-50 p-3">
                            <Label>{file.collection_name}</Label>
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-500 text-blue-600"
                                onClick={() => {
                                    setPreviewFile(file);
                                    setIsModalOpen(true);
                                }}
                            >
                                Preview
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-gray-300">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-700">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    {[
                        ['Company Name', item?.CompanyName],
                        ['Email', item?.contact_details?.email],
                        ['Last Name', item?.contact_details?.LastName],
                        ['First Name', item?.contact_details?.FirstName],
                        ['Middle Name', item?.contact_details?.MiddleName],
                        ['Position', item?.contact_details?.Position],
                        ['Contact Number', item?.contact_details?.ContactNumber],
                    ].map(([label, value], index) => (
                        <div key={index}>
                            <Label className="text-sm text-gray-600">{label}</Label>
                            <Input className="bg-gray-100 text-gray-800" value={value || '-'} readOnly />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* File Preview Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} file={previewFile} />

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
        </div>
    );
}

// Modal Component (smaller version)
function Modal({ isOpen, onClose, file }) {
    if (!isOpen || !file) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 50 }}>
            <div className="relative z-60 max-w-lg rounded-lg bg-white p-4">
                <Button onClick={onClose} className="absolute top-2 right-2 p-2" variant="outline">
                    ✕
                </Button>
                {file.mime_type.startsWith('image') ? (
                    <img src={file.url} alt={file.name} className="h-auto w-64 object-contain" />
                ) : (
                    <div className="text-center">Preview for non-image file: {file.name}</div>
                )}
            </div>
        </div>
    );
}
