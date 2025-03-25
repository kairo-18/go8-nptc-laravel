import { useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MainLayout from './mainLayout';

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

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    
        post(route("operators.store"), {
            onSuccess: () => {
                alert('Operator created successfully!');
                reset();

            const fileInputs = document.querySelectorAll<HTMLInputElement>('input[type="file"]');
            fileInputs.forEach(input => input.value = '');
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
                                <div>
                                    <Label htmlFor="photo">1x1 Photo</Label>
                                    <Input
                                        id="photo"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('photo', e.target.files[0])}
                                    />
                                    {errors.photo && <p className="text-sm text-red-500">{errors.photo}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="valid_id_front">Valid ID (Front)</Label>
                                    <Input
                                        id="valid_id_front"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('valid_id_front', e.target.files[0])}
                                    />
                                    {errors.valid_id_front && <p className="text-sm text-red-500">{errors.valid_id_front}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="valid_id_back">Valid ID (Back)</Label>
                                    <Input
                                        id="valid_id_back"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('valid_id_back', e.target.files[0])}
                                    />
                                    {errors.valid_id_back && <p className="text-sm text-red-500">{errors.valid_id_back}</p>}
                                </div>
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
