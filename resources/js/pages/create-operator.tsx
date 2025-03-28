import { useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MainLayout from './mainLayout';
import { useState, useCallback, useEffect } from 'react';

export default function CreateOperator({ companies }) {
    // Initialize form state using Inertia.js useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        vr_company_id: '',
        username: '',
        FirstName: '',
        LastName: '',
        email: '',
        ContactNumber: '',
        Address: '',
        BirthDate: '',
        password: '',
        Status: 'For Payment',
        photo: null,
        valid_id_front: null,
        valid_id_back: null,
    });
    const { flash } = usePage().props;

    const [fileKeys, setFileKeys] = useState({
        photo: Date.now(),
        valid_id_front: Date.now(),
        valid_id_back: Date.now(),
    });

    const handleFileRemove = (field: string) => {
        setData(field, null);

        // Force re-render by updating the key
        setFileKeys((prevKeys) => ({
            ...prevKeys,
            [field]: Date.now(),
        }));
    };

    // Helper function to render file input with remove button
    const renderFileInput = (field: string, label: string) => (
        <div>
            <Label htmlFor={field}>{label}</Label>
            <Input
                key={fileKeys[field]} // Force re-render when key changes
                id={field}
                type="file"
                accept="image/*"
                onChange={(e) => setData(field, e.target.files[0])}
            />
            {data[field] && (
                <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="text-sm text-gray-500">{data[field].name}</p>
                    <button
                        type="button"
                        onClick={() => handleFileRemove(field)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Remove ${label}`}
                    >
                        x
                    </button>
                </div>
            )}
            {errors[field] && <p className="text-sm text-red-500">{errors[field]}</p>}
        </div>
    );

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("operators.store"), {
            onSuccess: () => {
                alert('Operator created successfully!');
                reset();

                const fileInputs = document.querySelectorAll<HTMLInputElement>('input[type="file"]');
                fileInputs.forEach(input => input.value = '');

                // Reset file keys to force re-render of file inputs
                setFileKeys({
                    photo: Date.now(),
                    valid_id_front: Date.now(),
                    valid_id_back: Date.now(),
                });
            }
        });
    };

    return (
        <MainLayout breadcrumbs={[{ title: 'Operator Registration', href: '/create-operator' }]}>
            <div className="mx-auto mt-6 w-full max-w-6xl">
                <h1 className="text-2xl font-semibold">Create Operator</h1>
                <p className="text-gray-500">Create an operator that is under a VR Company.</p>

                {flash?.success && (
                    <div className="mb-4 rounded-lg bg-green-100 p-3 text-green-700">
                        {flash.success}
                    </div>
                )}

                <Card className="mt-6 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg">Owner Information</CardTitle>
                        <p className="text-sm text-gray-500">Details of the Company Owner</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* VR Company & Username */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="vr_company_id">Select VR Company</Label>
                                    <Select
                                        value={String(data.vr_company_id)}
                                        onValueChange={(value) => setData('vr_company_id', value)}
                                    >
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
                                    {errors["operator.vr_company_id"] && (
                                        <p className="text-sm text-red-500">{errors["operator.vr_company_id"]}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                    />
                                    {errors["user.username"] && (
                                        <p className="text-sm text-red-500">{errors["user.username"]}</p>
                                    )}
                                </div>
                            </div>

                            {/* First Name & Last Name */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="FirstName">First Name</Label>
                                    <Input
                                        id="FirstName"
                                        value={data.FirstName}
                                        onChange={(e) => setData('FirstName', e.target.value)}
                                    />
                                    {errors["user.FirstName"] && (
                                        <p className="text-sm text-red-500">{errors["user.FirstName"]}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="LastName">Last Name</Label>
                                    <Input
                                        id="LastName"
                                        value={data.LastName}
                                        onChange={(e) => setData('LastName', e.target.value)}
                                    />
                                    {errors["user.LastName"] && (
                                        <p className="text-sm text-red-500">{errors["user.LastName"]}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email & Contact Number */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    {errors["user.email"] && (
                                        <p className="text-sm text-red-500">{errors["user.email"]}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="ContactNumber">Contact Number</Label>
                                    <Input
                                        id="ContactNumber"
                                        value={data.ContactNumber}
                                        onChange={(e) => setData('ContactNumber', e.target.value)}
                                    />
                                    {errors["user.ContactNumber"] && (
                                        <p className="text-sm text-red-500">{errors["user.ContactNumber"]}</p>
                                    )}
                                </div>
                            </div>

                            {/* Address & Birth Date */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="Address">Address</Label>
                                    <Input
                                        id="Address"
                                        value={data.Address}
                                        onChange={(e) => setData('Address', e.target.value)}
                                    />
                                    {errors["user.Address"] && (
                                        <p className="text-sm text-red-500">{errors["user.Address"]}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="BirthDate">Birth Date</Label>
                                    <Input
                                        id="BirthDate"
                                        type="date"
                                        value={data.BirthDate}
                                        onChange={(e) => setData('BirthDate', e.target.value)}
                                    />
                                    {errors["user.BirthDate"] && (
                                        <p className="text-sm text-red-500">{errors["user.BirthDate"]}</p>
                                    )}
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors["user.password"] && (
                                    <p className="text-sm text-red-500">{errors["user.password"]}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {renderFileInput('photo', '1x1 Photo')}
                                {renderFileInput('valid_id_front', 'Valid ID (Front)')}
                                {renderFileInput('valid_id_back', 'Valid ID (Back)')}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing} className="bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700">
                                    {processing ? 'Submitting...' : 'Submit'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
