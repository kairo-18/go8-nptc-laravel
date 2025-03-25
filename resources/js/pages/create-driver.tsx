import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainLayout from './mainLayout';
import axios from 'axios';

export default function CreateDriver({ companies,latestVehicle,operator,company, onNextTab }) {
    useEffect(() => {
        if (operator?.id) {
          setData('operator_id', operator.id);
        }
      }, [operator]);
    const { data, setData, post, progress, reset } = useForm({
        username: '',
        email: '',
        FirstName: '',
        MiddleName:'',
        LastName: '',
        Address: '',
        BirthDate: '',
        ContactNumber: '',
        password: '',
        vehicle_id: latestVehicle?.id || '',
        operator_id: operator?.id || '',
        vr_company_id: company?.id || '',
        LicenseNumber: '',
        License: null,
        Photo: null,
        NBI_clearance: null,
        Police_clearance: null,
        BIR_clearance: null,
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [operators, setOperators] = useState([]);
    const [fileKeys, setFileKeys] = useState({});

    const handleSubmit = async (e: React.FormEvent, createAnother = false) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        try {
            await axios.post(route('driver.store'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Driver registered successfully!');
            setProcessing(false);

            if (createAnother) {
                reset(); // Reset form for another entry
            } else {
                window.location.href = '/vr-owner'; // Redirect after creation
            }
        } catch (error) {
            console.error("Error submitting form:", error.response?.data);
            setErrors(error.response?.data || {});
            setProcessing(false);
        }
    };

    const handleFileRemove = (field) => {
        setData(field, null);
        setFileKeys((prevKeys) => ({ ...prevKeys, [field]: Date.now() }));
    };

    return (
            <div className="mx-auto mt-6 w-full max-w-6xl">
                <h1 className="text-2xl font-semibold">Register Driver</h1>
                <p className="text-gray-500">Enter the driver's details.</p>

                <Card className="mt-6 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg">Driver Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                           {/* Plate Number */}

                            <div>
                            <Label>Vehicle Plate Number</Label>
                            {!latestVehicle?.PlateNumber && <p className="text-red-500 mb-1">Create Vehicle First</p>}
                            <Input
                                value={latestVehicle?.PlateNumber || ''}
                                readOnly
                                className={!latestVehicle?.PlateNumber ? 'border-red-500' : ''}
                            />
                            </div>

                            {/* Operator Name */}
                            <div>
                            <Label>Operator Name</Label>
                            {!operator?.user?.FirstName && <p className="text-red-500 mb-1">Create Operator First</p>}
                            <Input
                                value={`${operator?.user?.FirstName || ''} ${operator?.user?.LastName || ''}`}
                                readOnly
                                className={!operator?.user?.FirstName ? 'border-red-500' : ''}
                            />
                            </div>

                            {/* Company Name */}
                            <div>
                            <Label>Company Name</Label>
                            {!company?.CompanyName && <p className="text-red-500 mb-1">Create Company First</p>}
                            <Input
                                value={company?.CompanyName || ''}
                                readOnly
                                className={!company?.CompanyName ? 'border-red-500' : ''}
                            />
                            </div>
                            {/* Username & Email */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" value={data.username} onChange={(e) => setData('username', e.target.value)} />
                                    {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>
                            </div>

                            {/* First & Last Name */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="FirstName">First Name</Label>
                                    <Input id="FirstName" value={data.FirstName} onChange={(e) => setData('FirstName', e.target.value)} />
                                    {errors.FirstName && <p className="text-sm text-red-500">{errors.FirstName}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="FirstName">Middle Name</Label>
                                    <Input id="FirstName" value={data.MiddleName} onChange={(e) => setData('MiddleName', e.target.value)} />
                                    {errors.MiddleName && <p className="text-sm text-red-500">{errors.MiddleName}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="LastName">Last Name</Label>
                                    <Input id="LastName" value={data.LastName} onChange={(e) => setData('LastName', e.target.value)} />
                                    {errors.LastName && <p className="text-sm text-red-500">{errors.LastName}</p>}
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <Label htmlFor="Address">Address</Label>
                                <Input id="Address" value={data.Address} onChange={(e) => setData('Address', e.target.value)} />
                                {errors.Address && <p className="text-sm text-red-500">{errors.Address}</p>}
                            </div>

                            {/* Birth Date & Contact Number */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="BirthDate">Birth Date</Label>
                                    <Input id="BirthDate" type="date" value={data.BirthDate} onChange={(e) => setData('BirthDate', e.target.value)} />
                                    {errors.BirthDate && <p className="text-sm text-red-500">{errors.BirthDate}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="ContactNumber">Contact Number</Label>
                                    <Input id="ContactNumber" value={data.ContactNumber} onChange={(e) => setData('ContactNumber', e.target.value)} />
                                    {errors.ContactNumber && <p className="text-sm text-red-500">{errors.ContactNumber}</p>}
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>
                            {/* License Number */}
                            <div>
                                <Label htmlFor="LicenseNumber">License Number</Label>
                                <Input id="LicenseNumber" value={data.LicenseNumber} onChange={(e) => setData('LicenseNumber', e.target.value)} />
                                {errors.LicenseNumber && <p className="text-sm text-red-500">{errors.LicenseNumber}</p>}
                            </div>

                            {/* File Uploads */}
                            <div className="grid grid-cols-2 gap-4"> {['License', 'Photo', 'NBI_clearance', 'Police_clearance', 'BIR_clearance'].map((field) => (
                                <div key={field}>
                                    <Label htmlFor={field}>{field.replace('_', ' ')}</Label>
                                    <Input key={fileKeys[field]} id={field} type="file" onChange={(e) => setData(field, e.target.files?.[0] || null)} />
                                    {data[field] && (
                                        <div className="mt-1 flex items-center justify-between gap-2">
                                            <p className="text-sm text-gray-500">{data[field].name}</p>
                                            <button type="button" onClick={() => handleFileRemove(field)} className="text-red-500 hover:text-red-700" aria-label={`Remove ${field}`}>
                                                x
                                            </button>
                                        </div>
                                    )}
                                    {errors[field] && <p className="text-sm text-red-500">{errors[field]}</p>}
                                </div>
                                ))}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>Create and Proceed</Button>
                                <Button type="button" variant="outline" disabled={processing} onClick={(e) => handleSubmit(e, true)}>Create and Create Another</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
    );
}
