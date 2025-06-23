import { showToast, Id } from '@/components/toast';
import {toast} from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '@/pages/mainLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Modal Component (smaller version)
function Modal({ isOpen, onClose, file }: { isOpen: boolean; onClose: () => void; file: MediaFile | null }) {
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

interface MediaFile {
    id: number;
    name: string;
    mime_type: string;
    url: string;
    collection_name: string;
}

interface Driver {
    id: number;
    FirstName: string;
    LastName: string;
    username: string;
    email: string;
    BirthDate: string;
    Address: string;
    ContactNumber: string;
    LicenseNumber: string | null;
    Status: string;
    operator: { id: number; FirstName: string; LastName: string };
    vrCompany: { id: number; CompanyName: string };
    media_files: MediaFile[];
}

interface DriversProps {
    drivers: Driver[];
    totalPages: number;
}

export default function Drivers({ drivers, totalPages }: DriversProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<Record<string, File | null>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formData, setFormData] = useState<Driver | null>(null);
    const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);

    const handlePreview = (file: MediaFile) => {
        setPreviewFile(file);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setPreviewFile(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData) {
            console.error('No driver data available');
            return;
        }

        let loadingToastId: Id | null = null;
        try {
            // Show loading toast
            loadingToastId = showToast('Updating driver...', {
                type: 'loading',
                isLoading: true,
                position: 'top-center',
                autoClose: false
            });

            await router.patch(
                `/drivers/${formData.id}`,
                {
                    FirstName: formData.FirstName,
                    LastName: formData.LastName,
                    username: formData.username,
                    email: formData.email,
                    ContactNumber: formData.ContactNumber,
                    BirthDate: formData.BirthDate,
                    Address: formData.Address,
                    Status: formData.Status,
                    vrCompanyId: formData.vrCompany.id,
                    operatorId: formData.operator.id,
                },
                {
                    onSuccess: () => {
                        if (loadingToastId) {
                            toast.dismiss(loadingToastId);
                        }
                        showToast('Driver updated successfully', { type: 'success', position: 'top-center' });

                        const uploadData = new FormData();
                        const fileFields = ['License', 'Photo', 'NBI_clearance', 'Police_clearance', 'BIR_clearance'];
                        let hasFiles = false;

                        fileFields.forEach((field) => {
                            const file = selectedFile[field];
                            if (file) {
                                uploadData.append(field, file);
                                hasFiles = true;
                            }
                        });

                        if (hasFiles) {
                            // Show new loading toast for file upload
                            const fileUploadToastId = showToast('Uploading files...', {
                                type: 'loading',
                                isLoading: true,
                                position: 'top-center',
                                autoClose: false
                            });

                            router.post(route('driver.upload-files', { driver: formData.id }), uploadData, {
                                onSuccess: () => {
                                    toast.dismiss(fileUploadToastId);
                                    showToast('Files uploaded successfully', { 
                                        type: 'success', 
                                        position: 'top-center' 
                                    });
                                    router.reload({ only: ['drivers'] });
                                },
                                onError: (errors) => {
                                    toast.dismiss(fileUploadToastId);
                                    console.error('File upload error:', errors);
                                    showToast('Error uploading files', { 
                                        type: 'error', 
                                        position: 'top-center' 
                                    });
                                },
                            });
                        } else {
                            router.reload({ only: ['drivers'] });
                        }

                        setIsEditing(false);
                        setSelectedFile({});
                    },
                    onError: (errors) => {
                        if (loadingToastId) {
                            toast.dismiss(loadingToastId);
                        }
                        console.error('Update error:', errors);
                        showToast('Error updating driver', { 
                            type: 'error', 
                            position: 'top-center' 
                        });
                    },
                },
            );
        } catch (error) {
            console.error('Error:', error);
            if (loadingToastId) {
                toast.dismiss(loadingToastId);
            }
            showToast('An unexpected error occurred', { 
                type: 'error', 
                position: 'top-center' 
            });
        }
    };

    const handleFileChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile((prev) => ({ ...prev, [field]: file }));
        }
    };

    useEffect(() => {
        // Clear input field when a file is removed
        if (selectedFile) {
            Object.keys(selectedFile).forEach((field) => {
                const inputElement = document.getElementById(field) as HTMLInputElement;
                if (inputElement && !selectedFile[field]) {
                    inputElement.value = '';
                }
            });
        }
    }, [selectedFile]);

    const handleFileRemove = (field: string) => {
        setSelectedFile((prev) => ({ ...prev, [field]: null }));
    };

    const startEditing = (driver: Driver) => {
        setFormData({ ...driver });
        setIsEditing(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
    };

   const handleDeleteFile = async (driverId: number, fileId: number) => {
        let loadingToastId: Id | null = null;
        try {
            loadingToastId = showToast('Deleting file...', {
                type: 'loading',
                isLoading: true,
                position: 'top-center',
                autoClose: false
            });

            await router.delete(
                route('drivers.delete-media', {
                    driver: driverId,
                }),
                {
                    data: { media_id: fileId },
                },
            );

            if (loadingToastId) {
                toast.dismiss(loadingToastId);
            }
            showToast('File deleted successfully', { 
                type: 'success', 
                position: 'top-center' 
            });
        } catch (error) {
            console.error('Error deleting file:', error);
            if (loadingToastId) {
                toast.dismiss(loadingToastId);
            }
            showToast('Error deleting file', { 
                type: 'error', 
                position: 'top-center' 
            });
        }
    };

    return (
        <MainLayout breadcrumbs={[{ title: 'Drivers', href: '/drivers' }]}>
            <Head title="Drivers" />
            <div className="flex justify-center p-10">
                <div className="w-full">
                    {drivers.length === 0 ? (
                        <p className="text-center text-gray-500">No drivers available.</p>
                    ) : (
                        drivers.map((driver) => {
                            const profilePhoto = driver.media_files.find((file) => file.collection_name.toLowerCase() === 'photo');
                            return (
                                <Card key={driver.id} className="mb-6 p-6 shadow-md">
                                    <CardHeader>
                                        <div className="flex items-center space-x-6">
                                            {/* Profile Image */}
                                            {profilePhoto ? (
                                                <img
                                                    src={profilePhoto.url}
                                                    alt="Profile"
                                                    className="h-24 w-24 rounded-full border border-gray-300 object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-300 text-3xl font-bold text-white">
                                                    {driver.FirstName.charAt(0)}
                                                </div>
                                            )}

                                            {/* Driver's Name & Company */}
                                            <div>
                                                <CardTitle className="text-2xl font-semibold">
                                                    {driver.FirstName} {driver.LastName}
                                                </CardTitle>
                                                <p className="text-gray-500">{driver.vrCompany.CompanyName}</p>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>First Name</Label>
                                                <Input
                                                    name="FirstName"
                                                    value={isEditing ? (formData?.FirstName ?? driver.FirstName) : driver.FirstName}
                                                    onChange={handleChange}
                                                    readOnly={!isEditing}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Last Name</Label>
                                                <Input
                                                    name="LastName"
                                                    value={isEditing ? (formData?.LastName ?? driver.LastName) : driver.LastName}
                                                    onChange={handleChange}
                                                    readOnly={!isEditing}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Username</Label>
                                                <Input
                                                    name="username"
                                                    value={isEditing ? (formData?.username ?? driver.username) : driver.username}
                                                    onChange={handleChange}
                                                    readOnly={!isEditing}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <Input
                                                    name="email"
                                                    value={isEditing ? (formData?.email ?? driver.email) : driver.email}
                                                    onChange={handleChange}
                                                    readOnly={!isEditing}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Contact Number</Label>
                                                <Input
                                                    name="ContactNumber"
                                                    value={isEditing ? (formData?.ContactNumber ?? driver.ContactNumber) : driver.ContactNumber}
                                                    onChange={handleChange}
                                                    readOnly={!isEditing}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Birth Date</Label>
                                                <Input
                                                    name="BirthDate"
                                                    type="date"
                                                    value={isEditing ? (formData?.BirthDate ?? driver.BirthDate) : driver.BirthDate}
                                                    onChange={handleChange}
                                                    readOnly={!isEditing}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Address</Label>
                                                <Input
                                                    name="Address"
                                                    value={isEditing ? (formData?.Address ?? driver.Address) : driver.Address}
                                                    onChange={handleChange}
                                                    readOnly={!isEditing}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Status</Label>
                                                {isEditing ? (
                                                    <select
                                                        name="Status"
                                                        value={formData?.Status ?? driver.Status}
                                                        onChange={handleChange}
                                                        className="rounded border p-2"
                                                    >
                                                        {[
                                                            'Active',
                                                            'Inactive',
                                                            'Suspended',
                                                            'Banned',
                                                            'Pending',
                                                            'Approved',
                                                            'Rejected',
                                                            'For Payment',
                                                        ].map((status) => (
                                                            <option key={status} value={status}>
                                                                {status}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <Input value={driver.Status} readOnly />
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Password</Label>
                                                <Input
                                                    name="password"
                                                    type={passwordVisible ? 'text' : 'password'}
                                                    value={isEditing ? (formData?.password ?? driver.password) : driver.password}
                                                    onChange={handleChange}
                                                    readOnly={!isEditing}
                                                />
                                                <Button type="button" variant="outline" onClick={() => setPasswordVisible((prev) => !prev)}>
                                                    {passwordVisible ? 'Hide Password' : 'See Password'}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Media Files Section */}
                                        <div className="mt-6 space-y-4">
                                            <h3 className="text-md font-medium">Media Files</h3>
                                            {driver.media_files.length > 0 ? (
                                                driver.media_files.map((file) => (
                                                    <div key={file.id} className="flex items-center gap-2">
                                                        <Label>{file.collection_name}</Label>
                                                        <Input value={file.name} readOnly />
                                                        <Button
                                                            type="button"
                                                            className="text-white"
                                                            variant="outline"
                                                            onClick={() => handlePreview(file)}
                                                        >
                                                            Preview
                                                        </Button>
                                                        {isEditing && (
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                className="bg-black text-white"
                                                                onClick={() => handleDeleteFile(driver.id, file.id)}
                                                            >
                                                                Remove
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">No media files available.</p>
                                            )}

                                            {/* File Upload - Always visible when editing */}
                                            {isEditing && (
                                                <div className="grid grid-cols-2 gap-4">
                                                    {['License', 'Photo', 'NBI_clearance', 'Police_clearance', 'BIR_clearance'].map((field) => {
                                                        const existingFile = driver.media_files.find(
                                                            (file) => file.collection_name.toLowerCase() === field.toLowerCase(),
                                                        );

                                                        return (
                                                            <div key={field}>
                                                                <Label htmlFor={field}>{field.replace('_', ' ')}</Label>
                                                                <Input id={field} type="file" onChange={(e) => handleFileChange(field, e)} />
                                                                {selectedFile && selectedFile[field] && (
                                                                    <div className="mt-1 flex items-center justify-between gap-2">
                                                                        <p className="text-sm text-gray-500">{selectedFile[field]?.name}</p>
                                                                        <button
                                                                            type="button"
                                                                            className="text-red-500 hover:text-red-700"
                                                                            aria-label={`Remove ${field}`}
                                                                            onClick={() => handleFileRemove(field)}
                                                                        >
                                                                            ×
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                {existingFile && !isEditing && (
                                                                    <div className="mt-2 text-gray-500">
                                                                        <p>Current file: {existingFile.name}</p>
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            onClick={() => handlePreview(existingFile)}
                                                                        >
                                                                            Preview
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {/* Update Button */}
                                        <div className="mt-6 flex justify-end space-x-4">
                                            <Button onClick={isEditing ? handleSubmit : () => startEditing(driver)}>
                                                {isEditing ? 'Save Changes' : 'Update'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Modal for file preview */}
            <Modal isOpen={isModalOpen} onClose={closeModal} file={previewFile} />
        </MainLayout>
    );
}
