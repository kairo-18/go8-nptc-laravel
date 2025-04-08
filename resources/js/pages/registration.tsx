import { useState } from 'react';
import CreateVrAdmin from './create-vr-admin';
import CreateVrCompany from './create-vr-company';
import CreateVrContacts from './create-vr-contacts';
import MainLayout from './mainLayout';
import Summary from './summary';

// ProgressMarker component
const ProgressMarker = ({
    steps,
    currentStep,
    setCurrentStep,
}: {
    steps: { id: string; label: string }[];
    currentStep: string;
    setCurrentStep: (step: string) => void;
}) => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);

    return (
        <div className="mb-8 flex items-center space-x-6">
            {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = index < currentIndex;
                const isClickable = index <= currentIndex || isCompleted;

                return (
                    <button
                        key={step.id}
                        onClick={() => isClickable && setCurrentStep(step.id)}
                        className={`flex items-center space-x-2 ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                        {/* Number circle */}
                        <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-sm ${isActive ? 'bg-blue-800 font-bold text-white' : ''} ${isCompleted ? 'bg-blue-800 text-white' : ''} ${!isActive && !isCompleted ? 'border border-gray-300 text-gray-400' : ''} `}
                        >
                            {index + 1}
                        </span>
                        {/* Label */}
                        <span
                            className={`text-3xl ${isActive ? 'font-semibold !text-blue-800' : ''} ${isCompleted ? 'text-blue-800' : 'text-gray-500'} `}
                        >
                            {step.label}
                        </span>
                        {/* Separator (except for last item) */}
                        {index < steps.length - 1 && <div className="mx-2 h-0.5 w-10 self-center bg-gray-300" />}
                    </button>
                );
            })}
        </div>
    );
};

export default function Registration({ companies }: { companies: { id: number; BusinessPermitNumber: string }[] }) {
    const steps = [
        { id: 'company', label: 'Company' },
        { id: 'owner', label: 'Owner' },
        { id: 'contacts', label: 'Contacts' },
        { id: 'summary', label: 'Summary' },
    ];
    const [activeTab, setActiveTab] = useState('company');
    const [companyData, setCompanyData] = useState<any>({});
    const [adminData, setAdminData] = useState({});
    const [contactsData, setContactsData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const goToNextTab = () => {
        const currentIndex = steps.findIndex((step) => step.id === activeTab);
        if (currentIndex < steps.length - 1) {
            setActiveTab(steps[currentIndex + 1].id);
        }
    };

    const goToPreviousTab = () => {
        const currentIndex = steps.findIndex((step) => step.id === activeTab);
        if (currentIndex > 0) {
            setActiveTab(steps[currentIndex - 1].id);
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
            <div className="w-full p-10">
                {/* Progress Marker */}
                <ProgressMarker steps={steps} currentStep={activeTab} setCurrentStep={setActiveTab} />

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
