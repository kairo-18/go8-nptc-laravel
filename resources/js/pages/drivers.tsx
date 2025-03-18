import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import MainLayout from '@/pages/mainLayout';
import { Head } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

// Modal Component (smaller version)
function Modal({ isOpen, onClose, file }: { isOpen: boolean; onClose: () => void; file: MediaFile | null }) {
    if (!isOpen || !file) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 50 }}>
            <div className="bg-white p-4 rounded-lg max-w-lg relative z-60">
                <Button onClick={onClose} className="absolute top-2 right-2 p-2" variant="outline">
                    ✕
                </Button>
                {file.mime_type.startsWith('image') ? (
                    <img src={file.url} alt={file.name} className="w-64 h-auto object-contain" />
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
    const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [passwordVisible, setPasswordVisible] = useState(false);

    
    const handlePreview = (file: MediaFile) => {
        setSelectedFile(file);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // Handle form submission when saving changes
        const driverData = {
            username: driver.username,
            email: driver.email,
            ContactNumber: driver.ContactNumber,
            BirthDate: driver.BirthDate,
            Address: driver.Address,
            Status: driver.Status,
            vrCompanyId: driver.vrCompany.id,
            operatorId: driver.operator.id
        };
    
        try {
            // Update driver data (text fields)
            const response = await fetch(`/driver/${driver.id}`, {
                method: 'PATCH', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(driverData),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update driver data');
            }
    
            // Handle file uploads (media files) with POST if needed
            const formData = new FormData();
            const fileFields = ['License', 'Photo', 'NBI_clearance', 'Police_clearance', 'BIR_clearance'];
    
            fileFields.forEach((field) => {
                const file = selectedFile[field];
                if (file) {
                    formData.append(field, file);
                }
            });
    
            if (formData.has('License') || formData.has('Photo') || formData.has('NBI_clearance') || formData.has('Police_clearance') || formData.has('BIR_clearance')) {
                const fileResponse = await fetch('/updateDriverMedia', {
                    method: 'POST',
                    body: formData,
                });
    
                if (!fileResponse.ok) {
                    throw new Error('Failed to update driver media');
                }
            }
    
            // If everything is successful, close the modal and reset the form
            setIsEditing(false);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error:', error);
            // Handle the error, e.g., show an error message
        }
    };
    
    const handleFileChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setSelectedFile((prev) => ({ ...prev, [field]: file }));
        }
    };
    
    return (
        <MainLayout breadcrumbs={[{ title: 'Drivers', href: '/drivers' }]} >
            <Head title="Drivers" />
            <div className="p-5 flex justify-center">
                <div className="w-full max-w-3xl">
                    {drivers.length === 0 ? (
                        <p className="text-center text-gray-500">No drivers available.</p>
                    ) : (
                        drivers.map((driver) => {
                            const profilePhoto = driver.media_files.find(file => file.collection_name === 'photo');
                            return (
                                <Card key={driver.id} className="shadow-md p-6 mb-6">
                                    <CardHeader>
                                        <div className="flex items-center space-x-6">
                                            {/* Profile Image */}
                                            {profilePhoto ? (
                                                <img 
                                                    src={profilePhoto.url} 
                                                    alt="Profile" 
                                                    className="w-24 h-24 rounded-full object-cover border border-gray-300"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 flex items-center justify-center bg-gray-300 text-white font-bold rounded-full text-3xl">
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
                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="space-y-2">
                                            <div className="space-y-2">
                                                <Label>Company Name</Label>
                                                <Input value={driver.vrCompany.CompanyName} readOnly={!isEditing} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Operator Name</Label>
                                                <Input value={`${driver.operator.FirstName} ${driver.operator.LastName}`} readOnly={!isEditing} />
                                            </div>

                                                <Label>Username</Label>
                                                <Input value={driver.username} readOnly={!isEditing} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <Input value={driver.email} readOnly={!isEditing} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Contact Number</Label>
                                                <Input value={driver.ContactNumber} readOnly={!isEditing} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Birth Date</Label>
                                                <Input value={driver.BirthDate} readOnly={!isEditing} type="date" />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Address</Label>
                                                <Input value={driver.Address} readOnly={!isEditing} />
                                            </div>

                                           
                                            <div className="space-y-2">
                                                <Label>Status</Label>
                                                <Input value={driver.Status} readOnly={!isEditing} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Password</Label>
                                                <Input
                                                    value={driver.password} 
                                                    type={passwordVisible ? 'text' : 'password'}
                                                    readOnly={!isEditing}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setPasswordVisible((prev) => !prev)}
                                                >
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
                                                        <Button type="button" variant="outline" onClick={() => handlePreview(file)}>
                                                            Preview
                                                        </Button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">No media files available.</p>
                                            )}

                                            {/* File Upload - Always visible when editing */}
                                            {isEditing && (
                                            <div className="grid grid-cols-2 gap-4">
                                                {['License', 'Photo', 'NBI_clearance', 'Police_clearance', 'BIR_clearance'].map((field) => {
                                                    const existingFile = driver.media_files.find(file => file.collection_name.toLowerCase() === field.toLowerCase());

                                                    return (
                                                        <div key={field}>
                                                            <Label htmlFor={field}>{field.replace('_', ' ')}</Label>
                                                            <Input
                                                                id={field}
                                                                type="file"
                                                                onChange={(e) => handleFileChange(field, e)} 
                                                            />
                                                            {existingFile && !isEditing && (
                                                                <div className="mt-2 text-gray-500">
                                                                    <p>Current file: {existingFile.name}</p>
                                                                    <Button type="button" variant="outline" onClick={() => handlePreview(existingFile)}>
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
                                        <Button 
                                            onClick={() => {
                                                if (isEditing) {
                                                    handleSubmit(); // Trigger form submission when in Save Changes mode
                                                } else {
                                                    setIsEditing(true); // Otherwise, switch to edit mode
                                                }
                                            }} 
                                        >
                                            {isEditing ? "Save Changes" : "Update"}
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
            <Modal isOpen={isModalOpen} onClose={closeModal} file={selectedFile} />
        </MainLayout>
    );
}
