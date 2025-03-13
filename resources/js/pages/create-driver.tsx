import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from './mainLayout';
import axios from 'axios';

export default function CreateDriver({ companies }) {
    const { data, setData, post, progress } = useForm({
        username: '',
        email: '',
        FirstName: '',
        LastName: '',
        Address: '',
        BirthDate: '',
        ContactNumber: '',
        password: '',
        operator_id: '',
        vr_company_id: '',
        vehicle_id: '',
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
    
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });
    
        try {
            const response = await axios.post(route('driver.store'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            console.log("Success:", response.data);
            setProcessing(false);
        } catch (error) {
            console.error("Error submitting form:", error.response?.data);
            setErrors(error.response?.data || {});
            setProcessing(false);
        }
    };
    

    // Fetch related operators when VR Company changes
    const handleCompanyChange = async (companyId: string) => {
        setData("vr_company_id", companyId);
        setData("operator_id", ""); // Reset operator selection

        try {
            const response = await axios.get(`/operators/${companyId}`);
            setOperators(response.data); // Update state with fetched operators
        } catch (error) {
            console.error("Error fetching operators:", error);
            setOperators([]); // Reset if there's an error
        }
    };

    return (
        <MainLayout breadcrumbs={[{ title: 'Driver Registration', href: '/create-driver' }]}>
            <div className="mx-auto mt-6 w-full max-w-6xl">
                <h1 className="text-2xl font-semibold">Register Driver</h1>
                <p className="text-gray-500">Enter the driver's details.</p>

                <Card className="mt-6 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg">Driver Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
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

                            {/* Operator & VR Company */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="operator_id">Select Operator</Label>
                                    <Select value={String(data.operator_id)} onValueChange={(value) => setData("operator_id", value)} disabled={!operators.length}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={operators.length ? "Select an operator" : "No operators available"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {operators.map((operator) => (
                                                <SelectItem key={operator.id} value={String(operator.id)}>
                                                    {operator.user?.FirstName +" " +operator.user?.LastName || `Operator ${operator.id}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="vr_company_id">Select VR Company</Label>
                                    <Select value={String(data.vr_company_id)} onValueChange={handleCompanyChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companies.map((company) => (
                                                <SelectItem key={company.id} value={String(company.id)}>
                                                    {company.CompanyName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.vr_company_id && <p className="text-sm text-red-500">{errors.vr_company_id}</p>}
                                </div>
                            </div>

                            {/* License Number */}
                            <div>
                                <Label htmlFor="LicenseNumber">License Number</Label>
                                <Input id="LicenseNumber" value={data.LicenseNumber} onChange={(e) => setData('LicenseNumber', e.target.value)} />
                                {errors.LicenseNumber && <p className="text-sm text-red-500">{errors.LicenseNumber}</p>}
                            </div>

                            {/* File Uploads */}
                            <div className="grid grid-cols-2 gap-4">
                                {['License', 'Photo', 'NBI_clearance', 'Police_clearance', 'BIR_clearance'].map((field) => (
                                    <div key={field}>
                                        <Label htmlFor={field}>{field.replace('_', ' ')}</Label>
                                        <Input id={field} type="file" onChange={(e) => setData(field, e.target.files?.[0] || null)} />
                                        {errors[field] && <p className="text-sm text-red-500">{errors[field]}</p>}
                                    </div>
                                ))}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>Submit</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
