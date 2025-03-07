import { useState } from 'react';
import CreateVrAdmin from './create-vr-admin';
import CreateVrCompany from './create-vr-company';
import CreateVrContacts from './create-vr-contacts';
import Summary from './summary';
import MainLayout from './mainLayout';

export default function Registration({ companies }: { companies: { id: number; BusinessPermitNumber: string }[] }) {
    const [activeTab, setActiveTab] = useState('company');
    const [companyData, setCompanyData] = useState(null);
    const [adminData, setAdminData] = useState(null);
    const [contactsData, setContactsData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const goToNextTab = () => {
        if (activeTab === 'company') setActiveTab('owner');
        else if (activeTab === 'owner') setActiveTab('contacts');
        else if (activeTab === 'contacts') setActiveTab('summary');
    };

    const checkDisable = () => {
        if (activeTab === 'company' || activeTab === 'owner' || activeTab === 'contacts') return false;
        else if (activeTab === 'summary') return true;
        else return false;
    }

    return (
        <MainLayout breadcrumbs={[{ title: 'Registration', href: '/registration' }]}>
            <h1></h1>
            <div className="mx-auto mt-6 w-full max-w-6xl">
                {/* Tabs Navigation in the format "Company / Owner Info / Contacts / Summary" */}
                <div className="flex space-x-2 text-gray-500">
                    {[
                        { key: 'company', label: 'Company' },
                        { key: 'owner', label: 'Owner Info' },
                        { key: 'contacts', label: 'Contacts' },
                        { key: 'summary', label: 'Summary' },
                    ].map((tab, index, array) => (
                        <span key={tab.key} className="flex items-center">
                            <button
                                onClick={() => setActiveTab(tab.key)}
                                className={`text-sm font-medium ${activeTab === tab.key ? 'font-semibold text-black' : 'hover:text-black'}`}
                            >
                                {tab.label}
                            </button>
                            {index < array.length - 1 && <span className="mx-1">/</span>}
                        </span>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'company' && <CreateVrCompany companies={companies} onNextTab={goToNextTab} isTitleDisabled={checkDisable()} isButtonDisabled={checkDisable()} setCompanyData={setCompanyData} companyData={companyData} isEditing={false} />}
                {activeTab === 'owner' && <CreateVrAdmin companies={companies} onNextTab={goToNextTab} isTitleDisabled={checkDisable()} isButtonDisabled={checkDisable()} setAdminData={setAdminData} adminData={adminData} isEditing={false} />}
                {activeTab === 'contacts' && <CreateVrContacts companies={companies} onNextTab={goToNextTab} isTitleDisabled={checkDisable()} isButtonDisabled={checkDisable()} setContactsData={setContactsData} contactsData={contactsData} isEditing={false} />}
                {activeTab === 'summary' && <Summary companies={companies} companyData={companyData} adminData={adminData} contactsData={contactsData} isTitleDisabled={checkDisable()} isButtonDisabled={checkDisable()} setIsEditing={setIsEditing} />}
            </div>
        </MainLayout>
    );
}
