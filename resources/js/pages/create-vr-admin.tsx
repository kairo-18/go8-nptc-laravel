import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface CreateVrAdminProps {
    companies: { id: number; BusinessPermitNumber: string }[];
    onNextTab: () => void;
    isTitleDisabled: boolean;
    isButtonDisabled: boolean;
    setAdminData: (data: any) => void;
    adminData: any;
    isEditing: boolean;
    onSubmitRef?: (submitFn: () => void) => void;
}

export default function CreateVrAdmin({ companies, onNextTab, isTitleDisabled, isButtonDisabled, setAdminData, adminData, isEditing, onSubmitRef }: CreateVrAdminProps) {
    const { data, setData, post, patch } = useForm({
        vr_company_id: adminData?.vr_company_id || '',
        username: adminData?.username || '',
        email: adminData?.email || '',
        FirstName: adminData?.FirstName || '',
        LastName: adminData?.LastName || '',
        Address: adminData?.Address || '',
        BirthDate: adminData?.BirthDate || '',
        ContactNumber: adminData?.ContactNumber || '',
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (isEditing && adminData) {
            setData({
                ...data,
                ...adminData, // Populate the form with existing admin data
            });
        }
    }, [isEditing, adminData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        if (isEditing) {
            // Log the data being sent in the request
            console.log('Submitting Admin data:', data);

            patch(route('vr-admins.update', adminData.id), {
                onSuccess: () => {
                    console.log('Update Success:', data);
                    setAdminData([]);
                    setProcessing(false);
                },
                onError: (errors) => {
                    console.log('Update Failed:', errors);
                    setErrors(errors);
                    setProcessing(false);
                },
            });
        } else {
            post(route('vr-admins.store'), {
                onSuccess: () => {
                    setAdminData(data);
                    onNextTab();
                    console.log(data);
                },
                onError: (errors) => {
                    setErrors(errors);
                    setProcessing(false);
                },
            });
        }
    };

    // Notify parent when form data changes
    useEffect(() => {
        if (setAdminData) {
            setAdminData(data);
        }
    }, [data]);

    useEffect(() => {
        if (onSubmitRef) {
            onSubmitRef(() => handleSubmit({ preventDefault: () => { } } as React.FormEvent));
        }
    }, [handleSubmit]);

    return (
        <div className="mx-auto mt-6 w-full max-w-6xl">
            {isTitleDisabled === false ? (
                <>
                    <h1 className="text-2xl font-semibold">Create Vehicle Rental Admin</h1>
                    <p className="text-gray-500">Assign an admin to a vehicle rental company.</p>
                </>
            ) : null}
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
                                                {company.BusinessPermitNumber}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.vr_company_id && <p className="text-sm text-red-500">{errors.vr_company_id}</p>}
                            </div>
                            <div>
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" value={data.username} onChange={(e) => setData('username', e.target.value)} />
                                {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                            </div>
                        </div>

                        {/* First Name & Last Name */}
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

                        {/* Email & Contact Number */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>
                            <div>
                                <Label htmlFor="ContactNumber">Contact Number</Label>
                                <Input id="ContactNumber" value={data.ContactNumber} onChange={(e) => setData('ContactNumber', e.target.value)} />
                                {errors.ContactNumber && <p className="text-sm text-red-500">{errors.ContactNumber}</p>}
                            </div>
                        </div>

                        {/* Address & Birth Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="Address">Address</Label>
                                <Input id="Address" value={data.Address} onChange={(e) => setData('Address', e.target.value)} />
                                {errors.Address && <p className="text-sm text-red-500">{errors.Address}</p>}
                            </div>
                            <div>
                                <Label htmlFor="BirthDate">Birth Date</Label>
                                <Input id="BirthDate" type="date" value={data.BirthDate} onChange={(e) => setData('BirthDate', e.target.value)} />
                                {errors.BirthDate && <p className="text-sm text-red-500">{errors.BirthDate}</p>}
                            </div>
                        </div>

                        {isButtonDisabled === false ? (
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing} className="bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700">
                                    {processing ? 'Submitting...' : 'Submit'}
                                </Button>
                            </div>
                        ) : null}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
