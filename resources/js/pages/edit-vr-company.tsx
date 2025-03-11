import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import axios from 'axios';
import { useEffect, useState } from 'react';
import CreateVrAdmin from './create-vr-admin';
import CreateVrContacts from './create-vr-contacts';
import MainLayout from './mainLayout';

export default function RecordsPage({ companies, companyMedia, company, admin, contacts }) {
    const breadcrumbs = [
        {
            title: 'Company Edit',
            href: `/vr-company/edit/${company?.id}`,
        },
    ];

    const [companyData, setCompanyData] = useState(company || null);
    const [adminData, setAdminData] = useState(admin || null);
    const [contactsData, setContactsData] = useState(contacts || []);
    const [selectedPreview, setSelectedPreview] = useState(null); // State for selected file preview
    const [openPreview, setOpenPreview] = useState(false); // State to control preview dialog
    const [companyMediaState, setCompanyMediaState] = useState(companyMedia || []); // State for company media files

    console.log(companyMedia);

    useEffect(() => {
        setCompanyData(company);
        setAdminData(admin);
        setContactsData(contacts);
        setCompanyMediaState(companyMedia);
    }, [company, admin, contacts, companyMedia]);

    const handlePreview = (mediaName) => {
        const file = companyMediaState.find((media) => media.collection_name === mediaName);
        if (file) {
            setSelectedPreview(file);
            setOpenPreview(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.patch('/vr-company/edit', {
                id: companyData.id,
                CompanyName: companyData.CompanyName,
                BusinessPermitNumber: companyData.BusinessPermitNumber,
            });

            if (response.status === 200) {
                alert('Company information updated successfully!');
            }
        } catch (error) {
            console.error('Error updating company:', error);
            alert('Failed to update company information.');
        }
    };
    const handleAdminUpdate = async () => {
        try {
            const response = await axios.patch('/vr-admins.update', {
                vr_company_id: companyData.id,
                username: adminData.username,
                email: adminData.email,
                FirstName: adminData.FirstName,
                LastName: adminData.LastName,
                Address: adminData.Address,
                BirthDate: adminData.BirthDate,
                ContactNumber: adminData.ContactNumber,
            });

            if (response.status === 200) {
                alert('Admin information updated successfully!');
            }
        } catch (error) {
            console.error('Error updating admin:', error);
            alert('Failed to update admin information.');
        }
    };

    const handleContactsUpdate = async () => {
        try {
            const response = await axios.patch('/vr-contacts.update-multiple', {
                contacts: contactsData.map((contact) => ({
                    id: contact.id,
                    vr_company_id: companyData.id,
                    email: contact.email,
                    ContactNumber: contact.ContactNumber,
                    LastName: contact.LastName,
                    FirstName: contact.FirstName,
                    MiddleName: contact.MiddleName,
                    Position: contact.Position,
                })),
            });

            if (response.status === 200) {
                alert('Contacts updated successfully!');
            }
        } catch (error) {
            console.error('Error updating contacts:', error);
            alert('Failed to update contacts.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompanyData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAdminChange = (e) => {
        const { name, value } = e.target;
        setAdminData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleContactChange = (index, e) => {
        const { name, value } = e.target;
        const updatedContacts = [...contactsData];
        updatedContacts[index] = {
            ...updatedContacts[index],
            [name]: value,
        };
        setContactsData(updatedContacts);
    };

    const handleFileUpload = async (e, fileKey) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('vr_company_id', companyData.id);
        formData.append(fileKey, file);
        formData.append('oldCompanyName', companyData.CompanyName);

        try {
            const response = await axios.post('/vr-company.upload-files', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                alert('File uploaded successfully!');
                // Optionally, you can refetch the media files from the backend here
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file.');
        }
    };

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <div className="border-border mx-auto w-[75vw] rounded-lg border bg-white p-6 shadow-sm">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-semibold">Records</h1>
                        <p className="text-muted-foreground">Summary</p>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-[#2a2a92]">
                                <span className="text-2xl font-bold text-white">{companyData?.CompanyName?.charAt(0) || 'A'}</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-medium">{companyData?.CompanyName || 'Company Name'}</h2>
                                <Badge variant="default" className="bg-[#2a2a92]">
                                    VR
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Company Information Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Company Information</CardTitle>
                            <CardDescription>Edit Company Details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
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
                                    {[
                                        { label: 'DTI or SEC Permit', key: 'dti_permit', key2: 'DTI_Permit' },
                                        { label: 'BIR 2303', key: 'bir_2303', key2: 'BIR_2303' },
                                        { label: 'Business Permit', key: 'business_permit', key2: 'BusinessPermit' },
                                        { label: 'Brand Logo', key: 'brand_logo', key2: 'BrandLogo' },
                                        { label: 'Sales Invoice', key: 'sales_invoice', key2: 'SalesInvoice' },
                                    ].map(({ label, key, key2 }) => (
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
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button type="submit" className="mt-6">
                                    Update Company
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Owner Information Section */}
                    <Card>
                        {adminData ? (
                            <CardHeader>
                                <CardTitle>Owner Information</CardTitle>
                                <CardDescription>Details of the Company Owner</CardDescription>
                            </CardHeader>
                        ) : (
                            ''
                        )}
                        <CardContent>
                            {!adminData ? (
                                <CreateVrAdmin companies={companies} isButtonDisabled={false} isEditing={false} isEditing2={true} />
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                value={adminData?.email || 'No email provided'}
                                                onChange={handleAdminChange}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="last-name">Last Name</Label>
                                            <Input
                                                id="last-name"
                                                name="LastName"
                                                value={adminData?.LastName || 'No last name provided'}
                                                onChange={handleAdminChange}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="first-name">First Name</Label>
                                            <Input
                                                id="first-name"
                                                name="FirstName"
                                                value={adminData?.FirstName || 'No first name provided'}
                                                onChange={handleAdminChange}
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <Label className="mb-2 block">BirthDate</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={
                                                        adminData?.BirthDate
                                                            ? new Date(adminData.BirthDate).toLocaleString('default', { month: 'long' })
                                                            : 'Month'
                                                    }
                                                    readOnly
                                                />
                                                <Input value={adminData?.BirthDate ? new Date(adminData.BirthDate).getDate() : 'Day'} readOnly />
                                                <Input value={adminData?.BirthDate ? new Date(adminData.BirthDate).getFullYear() : 'Year'} readOnly />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="contact-number">Contact Number</Label>
                                            <Input
                                                id="contact-number"
                                                name="ContactNumber"
                                                value={adminData?.ContactNumber || 'No contact number provided'}
                                                onChange={handleAdminChange}
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="address">Address</Label>
                                            <Input
                                                id="address"
                                                name="Address"
                                                value={adminData?.Address || 'No address provided'}
                                                onChange={handleAdminChange}
                                            />
                                        </div>
                                    </div>
                                    <Button onClick={handleAdminUpdate} className="mt-4">
                                        Update Admin
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Contact Information Section */}
                    <Card>
                        {!contactsData.length === 0 ? (
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                                <CardDescription>Details of Organizational hierarchy</CardDescription>
                            </CardHeader>
                        ) : (
                            ''
                        )}
                        <CardContent>
                            {contactsData.length === 0 ? (
                                <CreateVrContacts companies={companies} isButtonDisabled={false} />
                            ) : (
                                <>
                                    {contactsData.map((contact, index) => (
                                        <div key={contact.id || index} className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor={`contact-company-name-${index}`}>Company Name</Label>
                                                <Input
                                                    id={`contact-company-name-${index}`}
                                                    value={contact.vr_company_id || 'No company name provided'}
                                                    readOnly
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`contact-email-${index}`}>Email</Label>
                                                <Input
                                                    id={`contact-email-${index}`}
                                                    name="email"
                                                    value={contact.email || 'No email provided'}
                                                    onChange={(e) => handleContactChange(index, e)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`contact-last-name-${index}`}>Last Name</Label>
                                                <Input
                                                    id={`contact-last-name-${index}`}
                                                    name="LastName"
                                                    value={contact.LastName || 'No last name provided'}
                                                    onChange={(e) => handleContactChange(index, e)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`contact-first-name-${index}`}>First Name</Label>
                                                <Input
                                                    id={`contact-first-name-${index}`}
                                                    name="FirstName"
                                                    value={contact.FirstName || 'No first name provided'}
                                                    onChange={(e) => handleContactChange(index, e)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`contact-middle-name-${index}`}>Middle Name</Label>
                                                <Input
                                                    id={`contact-middle-name-${index}`}
                                                    name="MiddleName"
                                                    value={contact.MiddleName || 'No middle name provided'}
                                                    onChange={(e) => handleContactChange(index, e)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`position-${index}`}>Position</Label>
                                                <Input
                                                    id={`position-${index}`}
                                                    name="Position"
                                                    value={contact.Position || 'No position provided'}
                                                    onChange={(e) => handleContactChange(index, e)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`contact-number-${index}`}>Contact Number</Label>
                                                <Input
                                                    id={`contact-number-${index}`}
                                                    name="ContactNumber"
                                                    value={contact.ContactNumber || 'No contact number provided'}
                                                    onChange={(e) => handleContactChange(index, e)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <Button onClick={handleContactsUpdate} className="mt-4">
                                        Update Contacts
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={openPreview} onOpenChange={setOpenPreview}>
                <DialogContent className="max-h-[90vh] !w-full !max-w-4xl overflow-y-auto bg-white sm:max-w-6xl">
                    <DialogHeader>
                        <DialogTitle>Preview: {selectedPreview?.name}</DialogTitle>
                    </DialogHeader>

                    {selectedPreview && (
                        <div className="mt-6 rounded-md border p-4">
                            <h3 className="text-lg font-semibold">Preview: {selectedPreview.name}</h3>

                            <div className="mt-3 max-h-[70vh] overflow-auto">
                                {selectedPreview.mime_type.startsWith('image/') ? (
                                    <img
                                        src={route('preview-media', { mediaId: selectedPreview.id })}
                                        alt="Preview"
                                        className="h-auto max-h-[600px] w-full rounded-md object-contain"
                                    />
                                ) : selectedPreview.mime_type === 'application/pdf' ? (
                                    <iframe
                                        src={route('preview-media', { mediaId: selectedPreview.id })}
                                        className="h-[550px] w-full overflow-auto"
                                    ></iframe>
                                ) : (
                                    <p className="text-sm text-gray-500">Preview not available for this file type.</p>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}
