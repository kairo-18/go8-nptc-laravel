import { useState } from 'react';
import CreateVrAdmin from './create-vr-admin';
import CreateVrCompany from './create-vr-company';
import CreateVrContacts from './create-vr-contacts';
import MainLayout from './mainLayout';
import Summary from './summary';

export default function Registration({ companies }: { companies: { id: number; BusinessPermitNumber: string }[] }) {
    const tabs = ['company', 'owner', 'contacts', 'summary'];
    const [activeTab, setActiveTab] = useState('company');
    const [companyData, setCompanyData] = useState<any>({});
    const [adminData, setAdminData] = useState({});
    const [contactsData, setContactsData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tabSwitch, setTabSwitch] = useState('');

    const goToNextTab = () => {
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1]);
        }
    };

    const goToPreviousTab = () => {
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1]);
        }
    };

    const handleTabSwitch = (tabSwitch: any) => {
        if (tabSwitch === 'next') {
            goToNextTab();
        } else if (tabSwitch === 'previous') {
            goToPreviousTab();
        } else {
            alert('Error switching tabs');
        }
    };

    return (
        <MainLayout breadcrumbs={[{ title: 'Registration', href: '/registration' }]}>
            <div className="mx-auto mt-6 w-full max-w-6xl">
                {/* Tabs Navigation */}
                <div className="flex space-x-2 text-gray-500">
                    {tabs.map((tab, index) => (
                        <span key={tab} className="flex items-center">
                            <button
                                onClick={() => setActiveTab(tab)}
                                className={`text-sm font-medium ${activeTab === tab ? 'font-semibold text-black' : 'hover:text-black'}`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                            {index < tabs.length - 1 && <span className="mx-1">/</span>}
                        </span>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'company' && (
                    <CreateVrCompany
                        companies={companies}
                        onNextTab={goToNextTab}
                        setCompanyData={setCompanyData}
                        companyData={companyData}
                        isEditing={false}
                        isButtonDisabled={false}
                        handleTabSwitch={handleTabSwitch}
                    />
                )}
                {activeTab === 'owner' && (
                    <CreateVrAdmin
                        companies={companies}
                        onNextTab={goToNextTab}
                        setAdminData={setAdminData}
                        adminData={adminData}
                        companyData={companyData}
                        isEditing={false}
                        isButtonDisabled={false}
                        handleTabSwitch={handleTabSwitch}
                    />
                )}
                {activeTab === 'contacts' && (
                    <CreateVrContacts
                        companies={companies}
                        onNextTab={goToNextTab}
                        setContactsData={setContactsData}
                        contactsData={contactsData}
                        companyData={companyData}
                        isButtonDisabled={false}
                        isEditing={false}
                        handleTabSwitch={handleTabSwitch}
                    />
                )}
                {activeTab === 'summary' && (
                    <Summary
                        companies={companies}
                        companyData={companyData}
                        adminData={adminData}
                        contactsData={contactsData}
                        setIsEditing={setIsEditing}
                        handleTabSwitch={handleTabSwitch}
                    />
                )}
            </div>
        </MainLayout>
    );
}
