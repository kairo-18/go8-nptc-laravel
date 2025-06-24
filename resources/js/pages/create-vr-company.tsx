import { FileInputWithPreview } from '@/components/file-input-with-preview';
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
    onSubmitRef?: (submitFn: () => void) => void;
    handleTabSwitch: (tab: string) => void;
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
    handleTabSwitch,
}: CreateVrCompanyProps) {
    const { data, setData, post, put, patch, progress, transform } = useForm({
        oldCompanyName: '',
        CompanyName: companyData?.CompanyName || '',
        BusinessPermit: companyData?.BusinessPermit || null,
        BusinessPermitNumber: companyData?.BusinessPermitNumber || '',
        BIR_2303: companyData?.BIR_2303 || null,
        DTI_Permit: companyData?.DTI_Permit || null,
        BrandLogo: companyData?.BrandLogo || null,
        SalesInvoice: companyData?.SalesInvoice || null,
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        setCompanyData(data); // Store the latest data before submission

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
            await post(route('vr-company.store'), {
                data,
                onSuccess: () => {
                    setCompanyData(data); // Retain data after submission
                    onNextTab(); // Move to next step without losing data
                    setProcessing(false);
                },
                onError: (errors) => {
                    setErrors(errors);
                    setProcessing(false);
                },
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setProcessing(false);
        }
    };

    useEffect(() => {
        if (setCompanyData) {
            setCompanyData(data);
        }
    }, [data]);

    const handleSubmitCallback = useCallback(() => {
        handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }, [handleSubmit]);

    useEffect(() => {
        if (onSubmitRef) {
            onSubmitRef(handleSubmitCallback);
        }
    }, [handleSubmitCallback, onSubmitRef]);

    return (
        <div className="w-full">
            {!isTitleDisabled == false ? (
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
                            <FileInputWithPreview
                                field="BusinessPermit"
                                label="Business Permit"
                                value={data.BusinessPermit}
                                onChange={(file) => setData('BusinessPermit', file)}
                                error={errors.BusinessPermit}
                            />
                            <div>
                                <Label htmlFor="CompanyName">Company Name</Label>
                                <Input id="CompanyName" value={data.CompanyName} onChange={(e) => setData('CompanyName', e.target.value)} />
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
                            <FileInputWithPreview
                                field="BIR_2303"
                                label="BIR 2303"
                                value={data.BIR_2303}
                                onChange={(file) => setData('BIR_2303', file)}
                                error={errors.BIR_2303}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FileInputWithPreview
                                field="DTI_Permit"
                                label="DTI Permit"
                                value={data.DTI_Permit}
                                onChange={(file) => setData('DTI_Permit', file)}
                                error={errors.DTI_Permit}
                            />
                            <FileInputWithPreview
                                field="BrandLogo"
                                label="Brand Logo"
                                value={data.BrandLogo}
                                onChange={(file) => setData('BrandLogo', file)}
                                error={errors.BrandLogo}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FileInputWithPreview
                                field="SalesInvoice"
                                label="Sales Invoice"
                                value={data.SalesInvoice}
                                onChange={(file) => setData('SalesInvoice', file)}
                                error={errors.SalesInvoice}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            {isButtonDisabled === false ? (
                                <>
                                    <Button
                                        onClick={() => handleTabSwitch('next')}
                                        className={`'bg-blue-500 hover:bg-blue-700'} rounded px-4 py-2 text-white`}
                                    >
                                        Next
                                    </Button>
                                </>
                            ) : null}
                        </div>
                    </form>
                    {progress && <p className="text-sm text-gray-500">Uploading: {progress.percentage}%</p>}
                </CardContent>
            </Card>
        </div>
    );
}
