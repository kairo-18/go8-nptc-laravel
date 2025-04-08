import { showToast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { router, usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import CreateVrAdmin from './create-vr-admin';
import CreateVrCompany from './create-vr-company';
import CreateVrContacts from './create-vr-contacts';

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

    // Use state for current form data
    const [currentCompanyData, setCurrentCompanyData] = useState(companyData);
    const [currentAdminData, setCurrentAdminData] = useState(adminData);
    const [currentContactsData, setCurrentContactsData] = useState(contactsData);

    // Refs to store the initial data and submit functions
    const initialCompanyData = useRef(companyData);
    const initialAdminData = useRef(adminData);
    const initialContactsData = useRef(contactsData);
    const companySubmitRef = useRef<() => void>();
    const adminSubmitRef = useRef<() => void>();
    const contactsSubmitRef = useRef<() => void>();

    const { props } = usePage<{ auth: { user?: { id: number; roles?: { name: string }[] }; vr_company_id?: number } }>();
    const userRole = props.auth.user?.roles?.[0]?.name;

    // Track changes in the form data
    useEffect(() => {
        const companyChanged = JSON.stringify(currentCompanyData) !== JSON.stringify(initialCompanyData.current);
        const adminChanged = JSON.stringify(currentAdminData) !== JSON.stringify(initialAdminData.current);
        const contactsChanged = JSON.stringify(currentContactsData) !== JSON.stringify(initialContactsData.current);

        setHasChanges(companyChanged || adminChanged || contactsChanged);
    }, [currentCompanyData, currentAdminData, currentContactsData]);

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        try {
            if (
                currentCompanyData &&
                Object.keys(currentCompanyData).length > 0 &&
                Object.values(currentCompanyData).some((value) => value !== null && value !== '') &&
                companySubmitRef.current
            ) {
                await new Promise(async (resolve) => {
                    await companySubmitRef.current();
                    resolve(null);
                });
            }

            if (
                currentAdminData &&
                Object.keys(currentAdminData).length > 0 &&
                Object.values(currentAdminData).some((value) => value !== null && value !== '') &&
                adminSubmitRef.current
            ) {
                await new Promise((resolve) =>
                    setTimeout(async () => {
                        await adminSubmitRef.current();
                        resolve(null);
                    }, 750),
                );
            }

            if (
                currentContactsData &&
                Object.keys(currentContactsData).length > 0 &&
                currentContactsData?.contacts?.some((contact) => Object.values(contact).some((value) => value !== null && value !== '')) &&
                contactsSubmitRef.current
            ) {
                await new Promise((resolve) =>
                    setTimeout(async () => {
                        await contactsSubmitRef.current();
                        resolve(null);
                    }, 750),
                );
            }
            showToast('Changes saved successfully!', {
                type: 'success',
                position: 'top-center',
                autoClose: 3000,
            });

            // Reset initial data to reflect the updated state
            initialCompanyData.current = currentCompanyData;
            initialAdminData.current = currentAdminData;
            initialContactsData.current = currentContactsData;

            setHasChanges(false);
            setProcessing(false);

            // Navigate to home/mails once setProcessing is done
            setTimeout(async () => {
                if (userRole === 'Temp User') {
                    await router.post(route('logout'));
                } else {
                    window.location.href = '/dashboard';
                }
            }, 1000);
        } catch (error) {
            console.error('Error saving changes:', error);
            setProcessing(false);
            showToast('Error saving changes. Please try again.', {
                type: 'error',
                position: 'top-center',
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="mt-5 w-full">
            <Card className="gap-0 p-5">
                <h1 className="text-lg font-semibold">Vehicle Rental Company Summary</h1>
                <p className="text-gray-500">Contains all details of the Vehicle Rental Company.</p>
                {currentCompanyData && Object.values(currentCompanyData).some((value) => value !== null && value !== '') && (
                    <CreateVrCompany
                        companies={companies}
                        setCompanyData={setCurrentCompanyData}
                        onNextTab={() => {}}
                        isTitleDisabled={isTitleDisabled}
                        isButtonDisabled={true}
                        companyData={currentCompanyData}
                        isEditing={true}
                        onSubmitRef={(submitFn) => {
                            companySubmitRef.current = submitFn;
                        }}
                    />
                )}
                {currentAdminData && Object.values(currentAdminData).some((value) => value !== null && value !== '') && (
                    <CreateVrAdmin
                        companies={companies}
                        setAdminData={setCurrentAdminData}
                        onNextTab={() => {}}
                        isTitleDisabled={isTitleDisabled}
                        isButtonDisabled={true}
                        adminData={currentAdminData}
                        companyData={currentCompanyData}
                        isEditing={true}
                        onSubmitRef={(submitFn) => {
                            adminSubmitRef.current = submitFn;
                        }}
                    />
                )}
                {currentContactsData &&
                    currentContactsData?.contacts?.some((contact) => Object.values(contact).some((value) => value !== null && value !== '')) && (
                        <CreateVrContacts
                            companies={companies}
                            setContactsData={setCurrentContactsData}
                            onNextTab={() => {}}
                            isTitleDisabled={isTitleDisabled}
                            isButtonDisabled={true}
                            contactsData={currentContactsData}
                            companyData={currentCompanyData}
                            isEditing={true}
                            onSubmitRef={(submitFn) => {
                                contactsSubmitRef.current = submitFn;
                            }}
                        />
                    )}
                {!Object.values(currentCompanyData).some((value) => value !== null && value !== '') &&
                    !Object.values(currentAdminData).some((value) => value !== null && value !== '') &&
                    !currentContactsData?.contacts?.some((contact) => Object.values(contact).some((value) => value !== null && value !== '')) && (
                        <div className="mt-6 text-center text-lg font-semibold text-gray-500">No Changes Found</div>
                    )}
                <div className="sticky bottom-5 ml-auto w-fit rounded-xl border border-gray-200 bg-white shadow-xl">
                    <div className="flex justify-end gap-2 p-4">
                        <Button onClick={() => handleTabSwitch('previous')} className="rounded bg-black px-4 py-2 text-white hover:bg-gray-500">
                            Previous
                        </Button>
                        <Button type="submit" onClick={handleSaveChanges} className="bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700">
                            {processing ? 'Submitting...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
