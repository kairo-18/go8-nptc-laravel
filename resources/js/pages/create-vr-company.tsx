import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function CreateVrCompany() {
    const { data, setData, post, progress, transform } = useForm({
        CompanyName: '',
        BusinessPermit: null,
        BusinessPermitNumber: '',
        BIR_2303: null,
        DTI_Permit: null,
        BrandLogo: null,
        SalesInvoice: null,
    });

    const breadcrumbs = [
        {
            title: 'VR Company',
            href: '/create-vr-company-page',
        },
    ];

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    // Transform data to FormData for file uploads
    transform((data) => {
        const formData = new FormData();
        formData.append('BusinessPermitNumber', data.BusinessPermitNumber);
        formData.append('CompanyName', data.CompanyName);
        if (data.BusinessPermit) formData.append('BusinessPermit', data.BusinessPermit);
        if (data.BIR_2303) formData.append('BIR_2303', data.BIR_2303);
        if (data.DTI_Permit) formData.append('DTI_Permit', data.DTI_Permit);
        if (data.BrandLogo) formData.append('BrandLogo', data.BrandLogo);
        if (data.SalesInvoice) formData.append('SalesInvoice', data.SalesInvoice);
        return formData;
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        post(route('vr-company.store'), {
            forceFormData: true, // Important for Inertia to recognize FormData
            onSuccess: () => {
                setProcessing(false);
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto mt-6 w-full max-w-6xl">
                <h1 className="text-2xl font-semibold">Create Vehicle Rental Company</h1>
                <p className="text-gray-500">Manage the account settings of the owner and company information.</p>
                <Card className="mt-6 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg">Company Information</CardTitle>
                        <p className="text-sm text-gray-500">Details of the Vehicle Rental Company</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="BusinessPermit">Business Permit</Label>
                                <Input id="BusinessPermit" type="file" onChange={(e) => setData('BusinessPermit', e.target.files[0])} />
                                {errors.BusinessPermit && <p className="text-sm text-red-500">{errors.BusinessPermit}</p>}
                            </div>
                            <div>
                                <Label htmlFor="CompanyName">Company Name</Label>
                                <Input id="CompanyName" value={data.CompanyName} onChange={(e) => setData('CompanyName', e.target.value)} />
                                {errors.CompanyName && <p className="text-sm text-red-500">{errors.CompanyName}</p>}
                            </div>
                            <div>
                                <Label htmlFor="BusinessPermitNumber">Business Permit Number</Label>
                                <Input
                                    id="BusinessPermitNumber"
                                    type="number"
                                    value={data.BusinessPermitNumber}
                                    onChange={(e) => setData('BusinessPermitNumber', e.target.value)}
                                />
                                {errors.BusinessPermitNumber && <p className="text-sm text-red-500">{errors.BusinessPermitNumber}</p>}
                            </div>
                            <div>
                                <Label htmlFor="BIR_2303">BIR 2303</Label>
                                <Input id="BIR_2303" type="file" onChange={(e) => setData('BIR_2303', e.target.files[0])} />
                                {errors.BIR_2303 && <p className="text-sm text-red-500">{errors.BIR_2303}</p>}
                            </div>
                            <div>
                                <Label htmlFor="DTI_Permit">DTI Permit</Label>
                                <Input id="DTI_Permit" type="file" onChange={(e) => setData('DTI_Permit', e.target.files[0])} />
                                {errors.DTI_Permit && <p className="text-sm text-red-500">{errors.DTI_Permit}</p>}
                            </div>
                            <div>
                                <Label htmlFor="BrandLogo">Brand Logo</Label>
                                <Input id="BrandLogo" type="file" onChange={(e) => setData('BrandLogo', e.target.files[0])} />
                                {errors.BrandLogo && <p className="text-sm text-red-500">{errors.BrandLogo}</p>}
                            </div>
                            <div>
                                <Label htmlFor="SalesInvoice">Sales Invoice</Label>
                                <Input id="SalesInvoice" type="file" onChange={(e) => setData('SalesInvoice', e.target.files[0])} />
                                {errors.SalesInvoice && <p className="text-sm text-red-500">{errors.SalesInvoice}</p>}
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing} className="bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700">
                                    {processing ? 'Submitting...' : 'Submit'}
                                </Button>
                            </div>
                        </form>
                        {progress && <p className="text-sm text-gray-500">Uploading: {progress.percentage}%</p>}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
