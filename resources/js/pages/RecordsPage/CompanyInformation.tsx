import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CompanyInformation({ companyData, handleChange, handleFileUpload, handlePreview, handleDeleteFile, handleSubmit }) {
    const documentTypes = [
        { label: 'DTI or SEC Permit', key: 'dti_permit', key2: 'DTI_Permit' },
        { label: 'BIR 2303', key: 'bir_2303', key2: 'BIR_2303' },
        { label: 'Business Permit', key: 'business_permit', key2: 'BusinessPermit' },
        { label: 'Brand Logo', key: 'brand_logo', key2: 'BrandLogo' },
        { label: 'Sales Invoice', key: 'sales_invoice', key2: 'SalesInvoice' },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Edit Company Details</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="CompanyName">Company Name</Label>
                            <Input id="CompanyName" name="CompanyName" value={companyData?.CompanyName || ''} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="BusinessPermitNumber">Business Permit Number</Label>
                            <Input
                                id="BusinessPermitNumber"
                                name="BusinessPermitNumber"
                                value={companyData?.BusinessPermitNumber || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="mt-6 space-y-4">
                        <h3 className="text-md font-medium">Company Documents</h3>
                        {documentTypes.map(({ label, key, key2 }) => (
                            <div key={key} className="space-y-2">
                                <Label htmlFor={key}>{label}</Label>
                                <div className="flex items-center gap-2">
                                    <Input type="file" id={key} onChange={(e) => handleFileUpload(e, key2)} />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handlePreview(key)}
                                        className="min-w-20 cursor-pointer text-white"
                                    >
                                        Preview
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleDeleteFile(key)}
                                        className="min-w-20 cursor-pointer text-white"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button type="submit" className="mt-6" onClick={handleSubmit}>
                        Update Company
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
