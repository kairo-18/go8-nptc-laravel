import { useState, useEffect } from 'react';
import axios from 'axios';
import MainLayout from './mainLayout';
import CompanyInformation from '../pages/RecordsPage/CompanyInformation';
import OwnerInformation from '../pages/RecordsPage/OwnerInformation';
import ContactInformation from '../pages/RecordsPage/ContactInformation';
import FilePreviewDialog from '../pages/RecordsPage/FilePreviewDialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function RecordsPage({ companies, companyMedia, company, admin, contacts }) {
    const breadcrumbs = [{ title: 'Company Edit', href: `/vr-company/edit/${company?.id}` }];

    const [companyData, setCompanyData] = useState(company || null);
    const [adminData, setAdminData] = useState(admin || null);
    const [contactsData, setContactsData] = useState(contacts || []);
    const [selectedPreview, setSelectedPreview] = useState(null);
    const [openPreview, setOpenPreview] = useState(false);
    const [companyMediaState, setCompanyMediaState] = useState(companyMedia || []);

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
            if (response.status === 200) alert('Company information updated successfully!');
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
            if (response.status === 200) alert('Admin information updated successfully!');
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
            if (response.status === 200) alert('Contacts updated successfully!');
        } catch (error) {
            console.error('Error updating contacts:', error);
            alert('Failed to update contacts.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompanyData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleAdminChange = (e) => {
        const { name, value } = e.target;
        setAdminData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleContactChange = (index, e) => {
        const { name, value } = e.target;
        const updatedContacts = [...contactsData];
        updatedContacts[index] = { ...updatedContacts[index], [name]: value };
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
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.status === 200) {
                alert('File uploaded successfully!');
                setTimeout(() => {
                    window.location.href = window.location.href; // This reloads the current page
                }, 500);
                }
            setSelectedPreview(file);
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
                    <CompanyInformation
                        companyData={companyData}
                        handleChange={handleChange}
                        handleFileUpload={handleFileUpload}
                        handlePreview={handlePreview}
                    />
                    <OwnerInformation
                        adminData={adminData}
                        handleAdminChange={handleAdminChange}
                        handleAdminUpdate={handleAdminUpdate}
                        companies={companies}
                    />
                    <ContactInformation
                        contactsData={contactsData}
                        handleContactChange={handleContactChange}
                        handleContactsUpdate={handleContactsUpdate}
                        companies={companies}
                    />
                </div>
            </div>
            <FilePreviewDialog openPreview={openPreview} setOpenPreview={setOpenPreview} selectedPreview={selectedPreview} />
        </MainLayout>
    );
}