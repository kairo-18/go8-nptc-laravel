import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import MainLayout from '@/pages/mainLayout';
import { Head } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { router } from '@inertiajs/react';

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
    const [formData, setFormData] = useState<Driver | null>(null);


    
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
      
        if (!formData) {
          console.error('No driver data available');
          return;
        }
      
        try {
          await router.patch(`/drivers/${formData.id}`, {
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
          });
      
          console.log('Driver details updated successfully');
      
          const uploadData = new FormData();
          const fileFields = ['License', 'Photo', 'NBI_clearance', 'Police_clearance', 'BIR_clearance'];
          let hasFiles = false;
      
          fileFields.forEach((field) => {
            const file = selectedFile?.[field];
            if (file) {
              uploadData.append(field, file);
              hasFiles = true;
            }
          });
      
          if (hasFiles) {
            await router.post(route('driver.upload-files', { driver: formData.id }), uploadData);
            console.log('Files uploaded successfully');
          }
      
          setIsEditing(false);
          setSelectedFile(null);
        } catch (error) {
          console.error('Error:', error);
        }
      };
      
      
      
    
    const handleFileChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setSelectedFile((prev) => ({ ...prev, [field]: file }));
        }
    };

    const startEditing = (driver: Driver) => {
        setFormData({...driver});
        setIsEditing(true);
      };

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
    };
          
    return (
        <MainLayout breadcrumbs={[{ title: 'Drivers', href: '/drivers' }]} >
            <Head title="Drivers" />
            <div className="p-5 flex justify-center">
            <div className="mx-auto mt-6 w-full max-w-6xl">
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
                                    <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>First Name</Label>
                                        <Input
                                        name="FirstName"
                                        value={isEditing ? formData?.FirstName ?? driver.FirstName : driver.FirstName}
                                        onChange={handleChange}
                                        readOnly={!isEditing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Last Name</Label>
                                        <Input
                                        name="LastName"
                                        value={isEditing ? formData?.LastName ?? driver.LastName : driver.LastName}
                                        onChange={handleChange}
                                        readOnly={!isEditing}
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label>Username</Label>
                                        <Input
                                        name="username"
                                        value={isEditing ? formData?.username ?? driver.username : driver.username}
                                        onChange={handleChange}
                                        readOnly={!isEditing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input
                                        name="email"
                                        value={isEditing ? formData?.email ?? driver.email : driver.email}
                                        onChange={handleChange}
                                        readOnly={!isEditing}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Contact Number</Label>
                                        <Input
                                        name="ContactNumber"
                                        value={isEditing ? formData?.ContactNumber ?? driver.ContactNumber : driver.ContactNumber}
                                        onChange={handleChange}
                                        readOnly={!isEditing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Birth Date</Label>
                                        <Input
                                        name="BirthDate"
                                        type="date"
                                        value={isEditing ? formData?.BirthDate ?? driver.BirthDate : driver.BirthDate}
                                        onChange={handleChange}
                                        readOnly={!isEditing}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Address</Label>
                                        <Input
                                        name="Address"
                                        value={isEditing ? formData?.Address ?? driver.Address : driver.Address}
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
                                            className="border p-2 rounded"
                                        >
                                            {['Active', 'Inactive', 'Suspended', 'Banned', 'Pending', 'Approved', 'Rejected', 'For Payment'].map((status) => (
                                            <option key={status} value={status}>{status}</option>
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
                                        value={isEditing ? formData?.password ?? driver.password : driver.password}
                                        onChange={handleChange}
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
                                        <Button onClick={(e) => {
                                        if (isEditing) {
                                            handleSubmit(e, driver);
                                        } else {
                                            startEditing(driver);
                                        }
                                        }}>
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
