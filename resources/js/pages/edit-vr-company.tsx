import { showToast } from '@/components/toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import CompanyInformation from '../pages/RecordsPage/CompanyInformation';
import ContactInformation from '../pages/RecordsPage/ContactInformation';
import FilePreviewDialog from '../pages/RecordsPage/FilePreviewDialog';
import OwnerInformation from '../pages/RecordsPage/OwnerInformation';
import MainLayout from './mainLayout';

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
            if (response.status === 200) showToast('Company information updated successfully', { type: 'success', position: 'top-center' });
        } catch (error) {
            console.error('Error updating company:', error);
            showToast('Failed to update company information.', { type: 'error', position: 'top-center' });
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
            if (response.status === 200) showToast('Admin information updated successfully', { type: 'success', position: 'top-center' });
        } catch (error) {
            console.error('Error updating admin:', error);
            showToast('Failed to update admin information.', { type: 'error', position: 'top-center' });
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
            if (response.status === 200) showToast('Contacts updated successfully', { type: 'success', position: 'top-center' });
        } catch (error) {
            console.error('Error updating contacts:', error);
            showToast('Failed to update contacts.', { type: 'error', position: 'top-center' });
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
                showToast('File uploaded successfully', { type: 'success', position: 'top-center' });
                setTimeout(() => {
                    window.location.href = window.location.href; // This reloads the current page
                }, 500);
            }
            setSelectedPreview(file);
        } catch (error) {
            console.error('Error uploading file:', error);
            showToast('Failed to upload file.', { type: 'error', position: 'top-center' });
        }
    };

    const handleDeleteFile = async (mediaName) => {
        const file = companyMediaState.find((media) => media.collection_name === mediaName);

        if (!file) {
            showToast('File not found!', { type: 'error', position: 'top-center' });
            return;
        }

        await router.delete(`/vr-company/delete-media/${file.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                alert('File deleted successfully');
            },
            onError: () => {
                alert('Failed to delete file.');
            },
        });
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
                        handleDeleteFile={handleDeleteFile}
                        handleSubmit={handleSubmit}
                    />
                    <OwnerInformation
                        adminData={adminData}
                        companyData={companyData}
                        handleAdminChange={handleAdminChange}
                        handleAdminUpdate={handleAdminUpdate}
                        companies={companies}
                    />
                    <ContactInformation
                        contactsData={contactsData}
                        companydata={companyData}
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
