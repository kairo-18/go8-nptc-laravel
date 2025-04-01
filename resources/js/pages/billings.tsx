import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import BillingsTab1 from './billings-tab1';
import BillingsTab2 from './billings-tab2';
import MainLayout from './mainLayout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billings',
        href: '/billings',
    },
];

interface Media {
    id: number;
    original_url: string;
    file_name: string;
    // Add other media properties as needed
}

interface Billing {
    id: number;
    operator_id: number;
    AccountName: string;
    ModePayment: string;
    Receipt: string;
    ReferenceNumber: string;
    AccountNumber: string;
    Notes: string;
    Amount: string;
    operator: {
        id: number;
        vr_company_id: number;
        user_id: number;
        Status: string;
        NPTC_ID: string;
        user: {
            id: number;
            FirstName: string;
            MiddleName: string | null;
            LastName: string;
        };
        vr_company: {
            id: number;
            CompanyName: string;
        };
    };
    media: Media[];
    created_at: string;
}

interface FormattedBillingReceipt {
    id: number;
    company: string;
    driver: string;
    vehicle: string;
    date: string;
    billingsID: string;
    modeOfPayment: string;
    accountName: string;
    accountNumber: string;
    purpose: string;
    time: string;
    referenceNumber: string;
    amount: number;
    requestingDocument: string[];
    notes: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    dueDate: string;
    media: Media[]; // Include media in formatted receipt
    receiptUrl?: string;
    driverIds: string[];
}

export default function Billings({ billings }: { billings: Billing[] }) {
    const [activeTab, setActiveTab] = useState('approvalTab');
    console.log('Billings data:', billings);

    // Format the billing data from the backend to match the expected structure
    const formatBillingData = (billingData: Billing[]): FormattedBillingReceipt[] => {
        return billingData.map((billing) => {
            // Parse the created_at date
            const createdAt = new Date(billing.created_at);

            // Format date as "Month Day, Year"
            const formattedDate = createdAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            // Format time as "3:43 PM"
            const formattedTime = createdAt.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            });

            // Combine date and time
            const fullDateTime = `${formattedDate} ${formattedTime}`;

            // Calculate due date (30 days from creation)
            const dueDate = new Date(createdAt);
            dueDate.setDate(dueDate.getDate() + 30);
            const formattedDueDate = dueDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            console.log(billing);

            return {
                id: billing.id,
                operatorId: billing.operator_id,
                company: billing.operator.vr_company.CompanyName,
                vehicle: billing.vehicles.map((vehicle) => vehicle.NPTC_ID),
                driver: billing.drivers.map((driver) => driver.NPTC_ID),
                date: fullDateTime,
                billingsID: billing.id.toString().padStart(4, '0'),
                modeOfPayment: billing.ModePayment,
                accountName: billing.AccountName,
                accountNumber: billing.AccountNumber,
                purpose: 'Registration',
                time: formattedTime,
                referenceNumber: billing.ReferenceNumber,
                amount: parseFloat(billing.Amount),
                requestingDocument: [billing.operator.NPTC_ID],
                notes: billing.Notes,
                status: billing.operator.Status === 'Approved' ? 'Paid' : 'Unpaid',
                dueDate: formattedDueDate,
                media: billing.media,
                receiptUrl: billing.media[0]?.original_url || billing.Receipt,
                driverIds: billing.drivers.map((driver) => driver.id), // Store driver ids
            };
        });
    };

    const dataReceipts = formatBillingData(billings);

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Billings" />
            <div className="rounded border border-gray-300 bg-white p-4">
                <Tabs defaultValue="approvalTab" className="w-full" onValueChange={(value) => setActiveTab(value)}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold">{activeTab === 'approvalTab' ? 'Approval' : 'Records'}</h1>
                            <p className="text-sm text-gray-600">{activeTab === 'approvalTab' ? 'Approval of Receipts' : 'Records of Receipts'}</p>
                        </div>
                        <TabsList className="bg-[#2A2A92] text-white">
                            <TabsTrigger value="approvalTab" className="px-5">
                                Approval
                            </TabsTrigger>
                            <TabsTrigger value="recordsTab" className="px-5">
                                Records
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="approvalTab">
                        <BillingsTab1 dataReceipts={dataReceipts} />
                    </TabsContent>
                    <TabsContent value="recordsTab">
                        <BillingsTab2 dataReceipts={dataReceipts} />
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
}
