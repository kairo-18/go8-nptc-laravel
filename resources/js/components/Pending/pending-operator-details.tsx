import { Id, showToast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface PendingOperatorDetailsProps {
    item: {
        FirstName: string;
        LastName: string;
        MiddleName?: string;
        vrCompany: string;
        Birthdate: string;
        ContactNumber: string;
        Email: string;
        ValidID?: string;
        Photo1x1?: string;
        ManagementFormSubmission?: string;
    };
    onClose: () => void;
}

export default function PendingOperatorDetails({ item, role }: PendingOperatorDetailsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [operatorId, setOperatorId] = useState<string>('');
    const [note, setNote] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

    const openPreview = (file: MediaFile) => {
        setPreviewFile(file);
        setIsPreviewModalOpen(true);
    };

    const closePreview = () => {
        setIsPreviewModalOpen(false);
        setPreviewFile(null);
    };

    const openRejectionModal = () => {
        setOperatorId(item?.user?.id || '');
        setIsModalOpen(true);
    };

    const closeRejectionModal = () => {
        setIsModalOpen(false);
    };

    const handleRejection = async (note: string, entityId: string, entityType: string) => {
        let loadingToastId: Id | null = null;
        try {
            setLoading(true);
            // Show loading toast
            loadingToastId = showToast('Processing rejection...', {
                type: 'loading',
                isLoading: true,
                position: 'top-center',
                autoClose: false,
            });

            const response = await fetch('/api/rejection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: item.id,
                    type: entityType,
                    note,
                    user_id: item.user.id,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            // Dismiss loading and show success
            if (loadingToastId) {
                toast.dismiss(loadingToastId);
                showToast('Rejection successful!', {
                    type: 'success',
                    autoClose: 1500,
                    position: 'top-center',
                });
            }

            setTimeout(() => {
                window.location.reload();
            }, 1600);
        } catch (error) {
            console.error('Error submitting rejection:', error);
            if (loadingToastId) {
                toast.dismiss(loadingToastId);
                showToast(error.message || 'Error rejecting operator. Please try again.', {
                    type: 'error',
                    position: 'top-center',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (entityType: string) => {
        let loadingToastId: Id | null = null;
        try {
            setLoading(true);
            // Show loading toast
            loadingToastId = showToast('Processing approval...', {
                type: 'loading',
                isLoading: true,
                position: 'top-center',
                autoClose: false,
            });

            const requestBody = {
                id: item.id,
                type: entityType,
                user_id: item.user.id,
            };

            if (role === 'VR Admin') {
                if (item.Status === 'For Final Submission') {
                    requestBody.status = 'Approved';
                } else {
                    requestBody.status = 'For Payment';
                }
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

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            // Dismiss loading and show success
            if (loadingToastId) {
                toast.dismiss(loadingToastId);
                showToast('Approval successful! Official documents will be sent to the mail of the operator.', {
                    type: 'success',
                    autoClose: 1500,
                    position: 'top-center',
                });
            }

            setTimeout(() => {
                window.location.reload();
            }, 1600);
        } catch (error) {
            console.error('Error submitting approval:', error);
            if (loadingToastId) {
                toast.dismiss(loadingToastId);
                showToast(error.message || 'Error approving operator. Please try again.', {
                    type: 'error',
                    position: 'top-center',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="relative p-6">
                <div className="absolute right-4 flex gap-2">
                    <Button className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700" onClick={openRejectionModal}>
                        Reject and add notes
                    </Button>
                    <Button
                        className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        disabled={role === 'VR Admin' ? false : true}
                        onClick={() => handleApproval('operator')}
                    >
                        {role === 'VR Admin' ? 'Prompt for Payment' : 'Wait for VR Admin Approval'}
                    </Button>
                </div>

                {/* Profile Section */}
                <div className="flex items-center gap-4">
                    <img src="/default-profile.png" alt="Profile" className="h-14 w-14 rounded-full object-cover" />
                    <div>
                        <h2 className="text-xl font-semibold">
                            {item?.user.FirstName} {item?.user.LastName}
                        </h2>
                        <span className="rounded-md border border-gray-500 px-2 py-1 text-sm font-medium">Operator</span>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="mt-4 rounded-md bg-gray-100 p-4">
                    <h3 className="text-lg font-semibold">Summary</h3>
                    <p className="text-gray-600">Review details before submitting</p>

                    <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold">Parent VR Company</label>
                                <input
                                    type="text"
                                    value={item.vr_company.CompanyName}
                                    disabled
                                    className="w-full rounded-md border bg-gray-200 p-2"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold">Valid ID</label>
                                <div className="flex items-center gap-2">
                                    <input type="text" value={item.ValidID || '-'} disabled className="w-full rounded-md border bg-gray-200 p-2" />
                                    <Button variant="outline">Preview</Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-semibold">Birthdate</label>
                                <input type="text" value={item?.user.BirthDate} disabled className="w-full rounded-md border bg-gray-200 p-2" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold">Contact Number</label>
                                <input type="text" value={item?.user.ContactNumber} disabled className="w-full rounded-md border bg-gray-200 p-2" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold">Email</label>
                                <input type="text" value={item?.user.email} disabled className="w-full rounded-md border bg-gray-200 p-2" />
                            </div>
                        </div>

                        <div className="mt-4 space-y-3">
                            {item.media_files && item.media_files.length > 0 ? (
                                item.media_files.map((file, index) => (
                                    <div key={index}>
                                        <label className="text-sm font-semibold capitalize">{file.collection_name.replace(/_/g, ' ')}</label>
                                        <div className="flex items-center gap-2">
                                            <input type="text" value={file.name} disabled className="w-full rounded-md border bg-gray-200 p-2" />
                                            <Button variant="outline" onClick={() => openPreview(file)}>
                                                Preview
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No media files available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Rejection Modal */}
            {isModalOpen && (
                <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center">
                    <div className="w-96 rounded-md bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold text-red-500">Rejection Application?</h2>
                        <textarea
                            className="w-full rounded-md border p-6"
                            placeholder="Enter rejection note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                        <div className="mt-4 flex justify-end gap-4">
                            <Button variant="outline" onClick={closeRejectionModal}>
                                Cancel
                            </Button>
                            <Button className="bg-red-600 text-white" onClick={() => handleRejection(note, operatorId, 'operator')}>
                                Reject and send
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {isPreviewModalOpen && previewFile && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="relative max-w-lg rounded-md bg-white p-4 shadow-lg">
                        <Button onClick={closePreview} className="absolute top-2 right-2" variant="outline">
                            ✕
                        </Button>
                        {previewFile.mime_type.startsWith('image') ? (
                            <img src={previewFile.url} alt={previewFile.name} className="h-auto w-64 object-contain" />
                        ) : (
                            <div className="text-center text-gray-700">
                                <p className="mb-2 font-medium">Cannot preview this file directly.</p>
                                <a href={previewFile.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                    Download/View File
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
