import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import MainLayout from '@/pages/mainLayout';
import { Head } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { router } from '@inertiajs/react';

// Modal Component for Preview
function Modal({ isOpen, onClose, file }) {
  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 50 }}>
      <div className="bg-white p-4 rounded-lg max-w-lg relative z-60">
        <Button onClick={onClose} className="absolute top-2 right-2 p-2" variant="outline">✕</Button>
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
  collection_name: string;
  mime_type: string;
  url: string;
}

interface Operator {
  id: number;
  FirstName: string;
  LastName: string;
}

interface Driver {
  id: number;
  FirstName: string;
  LastName: string;
  LicenseNumber: string;
  Status: string;
}

interface Vehicle {
  id: number;
  PlateNumber: string;
  Model: string;
  Brand: string;
  SeatNumber: number;
  Status: string;
  operator?: Operator;
  driver?: Driver;
  media_files: MediaFile[];
}

interface VehiclesProps {
  vehicles: Vehicle[];
}

export default function Vehicles({ vehicles }: VehiclesProps) {
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Vehicle | null>(null);
  

  const handlePreview = (file: MediaFile) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const startEditing = (vehicle: Vehicle) => {
    setFormData({ ...vehicle });
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleFileChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const file = e.target.files[0];
        setSelectedFile((prev) => ({ ...prev, [field]: file }));
    }
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData) {
      console.error('No vehicle data available');
      return;
    }
  
    try {
      // Update vehicle data
      await router.patch(`/vehicles/${formData.id}`, {
        PlateNumber: formData.PlateNumber,
        Model: formData.Model,
        Brand: formData.Brand,
        SeatNumber: formData.SeatNumber,
        Status: formData.Status,
      });
  
      console.log('Vehicle details updated successfully');
  
      // Handle file uploads
      const uploadData = new FormData();
      const fileFields = [
        'front_image', 
        'back_image', 
        'left_side_image', 
        'right_side_image', 
        'or_image', 
        'cr_image', 
        'id_card_image', 
        'gps_certificate_image', 
        'inspection_certificate_image'
      ];
      let hasFiles = false;
  
      fileFields.forEach((field) => {
        const file = selectedFile?.[field];
        if (file) {
          uploadData.append(field, file);
          hasFiles = true;
        }
      });
  
      if (hasFiles) {
        await router.post(route('vehicle.upload-files', { vehicle: formData.id }), uploadData);
        console.log('Files uploaded successfully');
      }
  
      setIsEditing(false);
      setSelectedFile(null);
      alert('Updated Successfully!');
      window.location.href;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <MainLayout breadcrumbs={[{ title: 'Vehicles', href: '/vehicles' }]}>
      <Head title="Vehicles" />
      <div className="p-5 flex justify-center">
        <div className="mx-auto mt-6 w-full max-w-6xl">
          {vehicles.length === 0 ? (
            <p className="text-center text-gray-500">No vehicles available.</p>
          ) : (
            vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="shadow-md p-6 mb-6">
              <CardHeader>
  {isEditing ? (
    <div className="space-y-2">
      <Label>Plate Number</Label>
      <Input
        name="PlateNumber"
        value={formData?.PlateNumber ?? vehicle.PlateNumber}
        onChange={handleChange}
        className="text-2xl font-semibold"
      />
      <Label>Model</Label>
      <Input
        name="Model"
        value={formData?.Model ?? vehicle.Model}
        onChange={handleChange}
      />
      <Label>Brand</Label>
      <Input
        name="Brand"
        value={formData?.Brand ?? vehicle.Brand}
        onChange={handleChange}
      />
      <Label>Seat Number</Label>
      <Input
        name="SeatNumber"
        type="number"
        value={formData?.SeatNumber ?? vehicle.SeatNumber}
        onChange={handleChange}
      />
    </div>
  ) : (
    <>
      <CardTitle className="text-2xl font-semibold">
        {vehicle.PlateNumber} - {vehicle.Model}
      </CardTitle>
      <p className="text-gray-500">Brand: {vehicle.Brand} | Seats: {vehicle.SeatNumber}</p>
    </>
  )}
</CardHeader>


                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label>Operator</Label>
                      <Input
                        value={vehicle.operator ? `${vehicle.operator.FirstName} ${vehicle.operator.LastName}` : 'N/A'}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label>Driver</Label>
                      <Input
                        value={vehicle.driver ? `${vehicle.driver.FirstName} ${vehicle.driver.LastName}` : 'N/A'}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label>License Number</Label>
                      <Input value={vehicle.driver?.LicenseNumber ?? 'N/A'} readOnly />
                    </div>
                    <div>
                      <Label>Status</Label>
                      {isEditing ? (
                        <Input name="Status" value={formData?.Status ?? vehicle.Status} onChange={handleChange} />
                      ) : (
                        <p>{vehicle.Status}</p>
                      )}
                    </div>
                    
                  </div>

                  {/* Media Files */}
                  <div className="mt-4">
                    <Label>Media Files</Label>
                    {vehicle.media_files.length > 0 ? (
                      vehicle.media_files.map((file) => (
                        <div key={file.id} className="flex items-center gap-2">
                          <p>{file.name} ({file.collection_name})</p>
                          <Button variant="outline" onClick={() => handlePreview(file)}>Preview</Button>
                        </div>
                      ))
                    ) : (
                      <p>No media files available.</p>
                    )}
                  </div>


                  {isEditing && (
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        'front_image', 
                        'back_image', 
                        'left_side_image', 
                        'right_side_image', 
                        'or_image', 
                        'cr_image', 
                        'id_card_image', 
                        'gps_certificate_image', 
                        'inspection_certificate_image'
                      ].map((field) => {
                        const existingFile = vehicle.media_files.find(file => file.collection_name.toLowerCase() === field.toLowerCase());

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
                  

                  {/* Update / Save Button */}
                  <div className="mt-6">
                    <Button onClick={isEditing ? handleSubmit : () => startEditing(vehicle)}>
                      {isEditing ? 'Save Changes' : 'Update'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Modal for file preview */}
      <Modal isOpen={isModalOpen} onClose={closeModal} file={selectedFile} />
    </MainLayout>
  );
}
