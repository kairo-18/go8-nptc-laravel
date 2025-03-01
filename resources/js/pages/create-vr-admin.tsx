import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

export default function CreateVrAdmin() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        FirstName: '',
        LastName: '',
        email: '',
        ContactNumber: '',
        Address: '',
        BirthDate: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('vr-admins.store');
    };

    const breadcrumbs = [
        {
            title: 'VR Admins',
            href: '/create-vr-admin',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="max-w-6xl mx-auto mt-6 w-full"> 
                <h1 className="text-2xl font-semibold">Create Vehicle Rental Admin</h1>
                <p className="text-gray-500">Manage the account settings of the owner and company information.</p>
                <Card className="mt-6 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg">Owner Information</CardTitle>
                        <p className="text-sm text-gray-500">Details of the Company Owner</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" value={data.username} onChange={(e) => setData('username', e.target.value)} />
                                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="FirstName">First Name</Label>
                                    <Input id="FirstName" value={data.FirstName} onChange={(e) => setData('FirstName', e.target.value)} />
                                    {errors.FirstName && <p className="text-red-500 text-sm">{errors.FirstName}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="LastName">Last Name</Label>
                                    <Input id="LastName" value={data.LastName} onChange={(e) => setData('LastName', e.target.value)} />
                                    {errors.LastName && <p className="text-red-500 text-sm">{errors.LastName}</p>}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>
                            <div>
                                <Label htmlFor="ContactNumber">Contact Number</Label>
                                <Input id="ContactNumber" value={data.ContactNumber} onChange={(e) => setData('ContactNumber', e.target.value)} />
                                {errors.ContactNumber && <p className="text-red-500 text-sm">{errors.ContactNumber}</p>}
                            </div>
                            <div>
                                <Label htmlFor="Address">Address</Label>
                                <Input id="Address" value={data.Address} onChange={(e) => setData('Address', e.target.value)} />
                                {errors.Address && <p className="text-red-500 text-sm">{errors.Address}</p>}
                            </div>
                            <div>
                                <Label htmlFor="BirthDate">Birth Date</Label>
                                <Input id="BirthDate" type="date" value={data.BirthDate} onChange={(e) => setData('BirthDate', e.target.value)} />
                                {errors.BirthDate && <p className="text-red-500 text-sm">{errors.BirthDate}</p>}
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing} className="px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700">
                                    {processing ? 'Submitting...' : 'Submit'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
