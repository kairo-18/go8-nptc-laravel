import { Button } from '@/components/ui/button';
import React, { useEffect, useRef, useState } from 'react';
import CreateVrAdmin from './create-vr-admin';
import CreateVrCompany from './create-vr-company';
import CreateVrContacts from './create-vr-contacts';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { usePage, router } from '@inertiajs/react';

interface CreateSummaryProps {
    companies: { id: number; BusinessPermitNumber: string }[];
    isTitleDisabled: boolean;
    isButtonDisabled: boolean;
    companyData: any;
    adminData: any;
    contactsData: any;
    setIsEditing: (isEditing: boolean) => void;
    handleTabSwitch: (tab: string) => void;
}

export default function Summary({
    companies,
    isTitleDisabled,
    isButtonDisabled,
    companyData,
    adminData,
    contactsData,
    setIsEditing,
    handleTabSwitch,
}: CreateSummaryProps) {
    const [processing, setProcessing] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const { props } = usePage<{ auth: { user?: { id: number; roles?: { name: string }[] }, vr_company_id?: number } }>();
    const userRole = props.auth.user?.roles?.[0]?.name;

    // Refs to store the initial data for comparison
    const initialCompanyData = useRef(companyData);
    const initialAdminData = useRef(adminData);
    const initialContactsData = useRef(contactsData);

    // Refs to store the current form data from the modals
    const companyFormData = useRef(companyData);
    const adminFormData = useRef(adminData);
    const contactsFormData = useRef(contactsData);

    // Refs to store the handleSubmit functions from the modals
    const companySubmitRef = useRef<() => void>();
    const adminSubmitRef = useRef<() => void>();
    const contactsSubmitRef = useRef<() => void>();

    // Track changes in the modals
    useEffect(() => {
        const companyChanged = JSON.stringify(companyFormData.current) !== JSON.stringify(initialCompanyData.current);
        const adminChanged = JSON.stringify(adminFormData.current) !== JSON.stringify(initialAdminData.current);
        const contactsChanged = JSON.stringify(contactsFormData.current) !== JSON.stringify(initialContactsData.current);

        setHasChanges(companyChanged || adminChanged || contactsChanged);
        console.log(companyChanged || adminChanged || contactsChanged);
    }, [companyData, adminData, contactsData]);

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        try {
            if (companyData &&
                Object.keys(companyData).length > 0 &&
                Object.values(companyData).some(value => value !== null && value !== '') &&
                companySubmitRef.current) {
                await companySubmitRef.current();
            }

            if (adminData &&
                Object.keys(adminData).length > 0 &&
                Object.values(adminData).some(value => value !== null && value !== '') &&
                adminSubmitRef.current) {
                await adminSubmitRef.current();
            }

            if (contactsData &&
                Object.keys(contactsData).length > 0 &&
                contactsData?.contacts?.some(contact =>
                    Object.values(contact).some(value => value !== null && value !== '')
                ) &&
                contactsSubmitRef.current) {
                await contactsSubmitRef.current();
            }

            // Reset initial data to reflect the updated state
            initialCompanyData.current = companyFormData.current;
            initialAdminData.current = adminFormData.current;
            initialContactsData.current = contactsFormData.current;

            setHasChanges(false);
            setProcessing(false);

            // Navigate to home/mails
            if (userRole === "Temp User") {
                router.post(route('logout'));
            } else {
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.error('Error saving changes:', error);
            setProcessing(false);
        }
    };

    return (
        <>
            <div className="mx-auto mt-6 w-full max-w-6xl">
                <h1 className="text-2xl font-semibold">Vehicle Rental Company Summary</h1>
                <p className="text-gray-500">Contains all details of the Vehicle Rental Company.</p>
                {companyData && Object.values(companyData).some(value => value !== null && value !== '') && (
                    <CreateVrCompany
                        companies={companies}
                        setCompanyData={(data) => {
                            companyFormData.current = data; // Update the current company form data
                        }}
                        onNextTab={() => {}}
                        isTitleDisabled={isTitleDisabled}
                        isButtonDisabled={true}
                        companyData={companyData}
                        isEditing={true}
                        onSubmitRef={(submitFn) => {
                            companySubmitRef.current = submitFn; // Store the handleSubmit function
                        }}
                    />
                )}
                {adminData && Object.values(adminData).some(value => value !== null && value !== '') && (
                    <CreateVrAdmin
                        companies={companies}
                        setAdminData={(data) => {
                            adminFormData.current = data; // Update the current admin form data
                        }}
                        onNextTab={() => {}}
                        isTitleDisabled={isTitleDisabled}
                        isButtonDisabled={true}
                        adminData={adminData}
                        companyData={companyData}
                        isEditing={true}
                        onSubmitRef={(submitFn) => {
                            adminSubmitRef.current = submitFn; // Store the handleSubmit function
                        }}
                    />
                )}
                {contactsData && contactsData?.contacts?.some(contact =>
                    Object.values(contact).some(value => value !== null && value !== '')
                ) && (
                    <CreateVrContacts
                        companies={companies}
                        setContactsData={(data) => {
                            contactsFormData.current = data; // Update the current contacts form data
                        }}
                        onNextTab={() => {}}
                        isTitleDisabled={isTitleDisabled}
                        isButtonDisabled={true}
                        contactsData={contactsData}
                        companyData={companyData}
                        isEditing={true}
                        onSubmitRef={(submitFn) => {
                            contactsSubmitRef.current = submitFn; // Store the handleSubmit function
                        }}
                    />
                )}
                {!Object.values(companyData).some(value => value !== null && value !== '') && !Object.values(adminData).some(value => value !== null && value !== '') && !contactsData?.contacts?.some(contact =>
                    Object.values(contact).some(value => value !== null && value !== '')
                ) && (
                    <div className="text-center text-gray-500 text-lg font-semibold mt-6">
                        No Changes Found
                    </div>
                )}
            </div>
            <div className="sticky bottom-5 w-full bg-white shadow-md rounded-xl">
                <div className="mt-6 flex justify-end gap-2 p-4">
                    <Button
                        onClick={() => handleTabSwitch('previous')}
                        className="px-4 py-2 rounded bg-black text-white hover:bg-gray-500"
                    >
                        Previous
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSaveChanges}
                        disabled={processing} // Disable if no changes or processing
                        className="bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
                    >
                        {processing ? 'Submitting...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </>
    );
}
