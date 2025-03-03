import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import CreateVrCompany from "./create-vr-company";
import CreateVrAdmin from "./create-vr-admin";
import CreateVrContacts from "./create-vr-contacts";

export default function Registration({ companies }: { companies: { id: number; BusinessPermitNumber: string }[] }) {
    const [activeTab, setActiveTab] = useState("owner");

    const goToNextTab = () => {
        if (activeTab === "company") setActiveTab("owner");
        else if (activeTab === "owner") setActiveTab("contacts");
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Registration", href: "/registration" }]}>
            <div className="mx-auto mt-6 w-full max-w-6xl">
                {/* Tabs Navigation in the format "Owner Info / Company / Contacts" */}
                <div className="flex space-x-2 text-gray-500">
                    {[
                        { key: "company", label: "Company" },
                        { key: "owner", label: "Owner Info" },
                        { key: "contacts", label: "Contacts" },
                    ].map((tab, index) => (
                        <span key={tab.key} className="flex items-center">
                            <button
                                onClick={() => setActiveTab(tab.key)}
                                className={`text-sm font-medium ${
                                    activeTab === tab.key ? "text-black font-semibold" : "hover:text-black"
                                }`}
                            >
                                {tab.label}
                            </button>
                            {index < 2 && <span className="mx-1">/</span>}
                        </span>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === "company" && <CreateVrCompany onNextTab={goToNextTab} />}
                {activeTab === "owner" && <CreateVrAdmin companies={companies}  onNextTab={goToNextTab} />}
                {activeTab === "contacts" && <CreateVrContacts companies={companies}/>}
            </div>
        </AppLayout>
    );
}
