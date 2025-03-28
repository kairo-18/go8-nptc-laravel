import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, InputWithRemoveButton } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react'; // Import the X icon

interface CreateVrCompanyProps {
    companies: { id: number; BusinessPermitNumber: string }[];
    onNextTab: () => void;
    isTitleDisabled: boolean;
    isButtonDisabled: boolean;
    setCompanyData: (data: any) => void;
    companyData: any;
    isEditing: boolean;
    onSubmitRef?: (submitFn: () => void) => void;
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

    const handlePrevious = () => {
        setData(companyData); // Restore previous data
    };
    

    useEffect(() => {
        if (isEditing && companyData) {
            setData((prevData) => ({
                ...prevData,
                ...companyData,
            }));
        }
    }, [isEditing, companyData]);

    useEffect(() => {
        if (isEditing && companyData) {
            setData((prevData) => ({
                ...data,
                ...prevData,
                oldCompanyName: companyData.CompanyName,
                CompanyName: companyData.CompanyName,
                BusinessPermitNumber: companyData.BusinessPermitNumber,
            }));
        }
    }, [isEditing, companyData]);

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
            if (isEditing) {
                if (hasFiles) {
                    console.log(data);
                    await post(route('vr-company.upload-files', { id: companyData.id }), {
                        data: fileData,
                        onSuccess: () => console.log('Files uploaded successfully'),
                        onError: (errors) => {
                            console.error('Upload failed:', errors);
                            setErrors(errors);
                            setProcessing(false);
                        },
                    });
                }
    
                const updatedData = {
                    oldCompanyName: companyData.CompanyName,
                    CompanyName: data.CompanyName,
                    BusinessPermitNumber: data.BusinessPermitNumber,
                };
    
                console.log(updatedData);
    
                await patch(route('vr-company.update', { id: companyData.id }), {
                    data: updatedData,
                    onSuccess: () => {
                        setCompanyData(updatedData); // Retain updated data
                        setProcessing(false);
                    },
                    onError: (errors) => {
                        setErrors(errors);
                        setProcessing(false);
                    },
                });
            } else {
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
            }
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

    const [fileKeys, setFileKeys] = useState({
        BusinessPermit: Date.now(),
        BIR_2303: Date.now(),
        DTI_Permit: Date.now(),
        BrandLogo: Date.now(),
        SalesInvoice: Date.now(),
    });

    const handleFileRemove = (field: string) => {
        setData(field, null);

        // Force re-render by updating the key
        setFileKeys((prevKeys) => ({
            ...prevKeys,
            [field]: Date.now(),
        }));
    };

    useEffect(() => {
        if (onSubmitRef) {
            onSubmitRef(handleSubmitCallback);
        }
    }, [handleSubmitCallback]);

    // Helper function to render file input with remove button
    const renderFileInput = (field: string, label: string) => (
        <div>
            <Label htmlFor={field}>{label}</Label>
            <Input
                key={fileKeys[field]} // Force re-render when key changes
                id={field}
                type="file"
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
                            {renderFileInput('BusinessPermit', 'Business Permit')}
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
                            {renderFileInput('BIR_2303', 'BIR 2303')}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {renderFileInput('DTI_Permit', 'DTI Permit')}
                            {renderFileInput('BrandLogo', 'Brand Logo')}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {renderFileInput('SalesInvoice', 'Sales Invoice')}
                        </div>

                        <div className='flex justify-between'>
                            <Button onClick={handlePrevious} className="bg-gray-500 text-white">
                                Submit
                            </Button>
                            {isButtonDisabled === false ? (
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing} className="bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700">
                                        {processing ? 'Submitting...' : 'Submit'}
                                    </Button>
                                </div>
                            ) : null}
                        </div>
                    </form>
                    {progress && <p className="text-sm text-gray-500">Uploading: {progress.percentage}%</p>}
                </CardContent>
            </Card>
        </div>
    );
}
