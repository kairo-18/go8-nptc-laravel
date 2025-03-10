import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';

interface CreateVrCompanyProps {
    companies: { id: number; BusinessPermitNumber: string }[];
    onNextTab: () => void;
    isTitleDisabled: boolean;
    isButtonDisabled: boolean;
    setCompanyData: (data: any) => void;
    companyData: any;
    isEditing: boolean;
    onSubmitRef?: (submitFn: () => void) => void; // Add this prop
}

export default function CreateVrCompany({
    companies,
    onNextTab,
    isTitleDisabled,
    isButtonDisabled,
    setCompanyData,
    companyData,
    isEditing,
    onSubmitRef,
}: CreateVrCompanyProps) {
    const { data, setData, post, put, patch, progress, transform } = useForm({
        oldCompanyName: '',
        CompanyName: '',
        BusinessPermit: null,
        BusinessPermitNumber: '',
        BIR_2303: null,
        DTI_Permit: null,
        BrandLogo: null,
        SalesInvoice: null,
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (isEditing && companyData) {
            setData((prevData) => ({
                ...data,
                ...prevData,
                oldCompanyName: companyData.CompanyName, // Ensure this holds the old company name
                CompanyName: companyData.CompanyName,
                BusinessPermitNumber: companyData.BusinessPermitNumber,
            }));
        }
    }, [isEditing, companyData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        // Separate file data from text fields
        const fileFields = ['BusinessPermit', 'BIR_2303', 'DTI_Permit', 'BrandLogo', 'SalesInvoice'];
        const fileData = new FormData();
        let hasFiles = false;

        fileFields.forEach((field) => {
            if (data[field]) {
                fileData.append(field, data[field]);
                hasFiles = true;
            }
        });

        try {
            if (isEditing) {
                // Step 1: Upload files first if any exist
                if (hasFiles) {
                    await post(route('vr-company.upload-files', { id: companyData.id }), {
                        data: fileData,
                        onSuccess: () => console.log('Files uploaded successfully'),
                        onError: (errors) => {
                            setErrors(errors);
                            setProcessing(false);
                        },
                    });
                }

                // Step 2: Patch request for company updates
                const updatedData = {
                    oldCompanyName: companyData.CompanyName,
                    CompanyName: data.CompanyName,
                    BusinessPermitNumber: data.BusinessPermitNumber,
                };

                console.log(updatedData);

                await patch(route('vr-company.update', updatedData), {
                    onSuccess: () => {
                        setCompanyData([]);
                        setProcessing(false);
                    },
                    onError: (errors) => {
                        setErrors(errors);
                        setProcessing(false);
                    },
                });
            } else {
                // Normal create request for new entries
                await post(route('vr-company.store'), {
                    data,
                    onSuccess: () => {
                        setProcessing(false);
                        setCompanyData(data);
                        onNextTab();
                    },
                    onError: (errors) => {
                        setErrors(errors);
                        setProcessing(false);
                    },
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setProcessing(false);
        }
    };

    // Notify parent when form data changes
    useEffect(() => {
        if (setCompanyData) {
            setCompanyData(data);
        }
    }, [data]);

    // Memoized submit function
    const handleSubmitCallback = useCallback(() => {
        handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }, [handleSubmit]);

    useEffect(() => {
        if (onSubmitRef) {
            onSubmitRef(handleSubmitCallback);
        }
    }, [handleSubmitCallback]);

    return (
        <div className="mx-auto mt-6 w-full max-w-6xl">
            {isTitleDisabled == false ? (
                <>
                    <h1 className="text-2xl font-semibold">Create Vehicle Rental Company</h1>
                    <p className="text-gray-500">Manage the account settings of the owner and company information.</p>
                </>
            ) : null}
            <Card className="mt-6 shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">Company Information</CardTitle>
                    <p className="text-sm text-gray-500">Details of the Vehicle Rental Company</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="BusinessPermit">Business Permit</Label>
                                <Input id="BusinessPermit" type="file" onChange={(e) => setData('BusinessPermit', e.target.files[0])} />
                                {data.BusinessPermit && <p className="text-sm text-gray-500">{data.BusinessPermit.name}</p>}
                                {errors.BusinessPermit && <p className="text-sm text-red-500">{errors.BusinessPermit}</p>}
                            </div>
                            <div>
                                <Label htmlFor="CompanyName">Company Name</Label>
                                <Input
                                    id="CompanyName"
                                    value={data.CompanyName}
                                    onChange={(e) => {
                                        setData({ ...data, CompanyName: e.target.value });
                                    }}
                                />
                                {errors.CompanyName && <p className="text-sm text-red-500">{errors.CompanyName}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
                                {data.BIR_2303 && <p className="text-sm text-gray-500">{data.BIR_2303.name}</p>}
                                {errors.BIR_2303 && <p className="text-sm text-red-500">{errors.BIR_2303}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="DTI_Permit">DTI Permit</Label>
                                <Input id="DTI_Permit" type="file" onChange={(e) => setData('DTI_Permit', e.target.files[0])} />
                                {data.DTI_Permit && <p className="text-sm text-gray-500">{data.DTI_Permit.name}</p>}
                                {errors.DTI_Permit && <p className="text-sm text-red-500">{errors.DTI_Permit}</p>}
                            </div>
                            <div>
                                <Label htmlFor="BrandLogo">Brand Logo</Label>
                                <Input id="BrandLogo" type="file" onChange={(e) => setData('BrandLogo', e.target.files[0])} />
                                {data.BrandLogo && <p className="text-sm text-gray-500">{data.BrandLogo.name}</p>}
                                {errors.BrandLogo && <p className="text-sm text-red-500">{errors.BrandLogo}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="SalesInvoice">Sales Invoice</Label>
                                <Input id="SalesInvoice" type="file" onChange={(e) => setData('SalesInvoice', e.target.files[0])} />
                                {data.SalesInvoice && <p className="text-sm text-gray-500">{data.SalesInvoice.name}</p>}
                                {errors.SalesInvoice && <p className="text-sm text-red-500">{errors.SalesInvoice}</p>}
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
                    {progress && <p className="text-sm text-gray-500">Uploading: {progress.percentage}%</p>}
                </CardContent>
            </Card>
        </div>
    );
}
