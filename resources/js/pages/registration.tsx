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
    const [adminData, setAdminData] = useState(null);
    const [contactsData, setContactsData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

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
                    />
                )}
                {activeTab === 'owner' && (
                    <CreateVrAdmin
                        companies={companies}
                        onNextTab={goToNextTab}
                        setAdminData={setAdminData}
                        adminData={adminData}
                        isEditing={false}
                    />
                )}
                {activeTab === 'contacts' && (
                    <CreateVrContacts
                        companies={companies}
                        onNextTab={goToNextTab}
                        setContactsData={setContactsData}
                        contactsData={contactsData}
                        isEditing={false}
                    />
                )}
                {activeTab === 'summary' && (
                    <Summary
                        companies={companies}
                        companyData={companyData}
                        adminData={adminData}
                        contactsData={contactsData}
                        setIsEditing={setIsEditing}
                    />
                )}

                {/* Navigation Buttons */}
                <div className="mt-4 flex justify-between">
                    <button
                        onClick={goToPreviousTab}
                        disabled={activeTab === 'company'}
                        className={`px-4 py-2 rounded ${activeTab === 'company' ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={goToNextTab}
                        disabled={activeTab === 'summary'}
                        className={`px-4 py-2 rounded ${activeTab === 'summary' ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </MainLayout>
    );
}
