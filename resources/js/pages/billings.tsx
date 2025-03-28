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

const dataReceipts = [
    {
        id: 1,
        company: 'Go8 Technology',
        driver: 'John Doe',
        vehicle: 'ABC123',
        date: '03-28-2025',
        amount: 1000,
        billingsID: '1234',
        modeOfPayment: 'Cash',
        accountName: 'John Doe',
        accountNumber: '12345678',
        purpose: 'Registration',
        time: '3:43 PM',
        referenceNumber: '123456789012',
        amount: 10000,
        requestingDocument: ['DR-7812', 'DR-1234'],
        notes: 'This is a note for the transaction.',
        status: 'Paid',
        dueDate: '04-28-2025',
    },
    {
        id: 2,
        company: 'Go8 Technology',
        driver: 'Jane Smith',
        vehicle: 'XYZ789',
        date: '03-29-2025',
        amount: 1500,
        billingsID: '5678',
        modeOfPayment: 'Credit Card',
        accountName: 'Jane Smith',
        accountNumber: '87654321',
        purpose: 'Registration',
        time: '3:43 PM',
        referenceNumber: '987654321098',
        amount: 20000,
        requestingDocument: 'DR-1234',
        notes: 'This is a note for the transaction.',
        status: 'Paid',
        dueDate: '04-28-2025',
    },
    {
        id: 3,
        company: 'Quantum Metal Inc.',
        driver: 'Bob Johnson',
        vehicle: 'DEF456',
        date: '03-30-2025',
        amount: 800,
        billingsID: '9012',
        modeOfPayment: 'Debit Card',
        accountName: 'Bob Johnson',
        accountNumber: '23456789',
        purpose: 'Registration',
        time: '3:43 PM',
        referenceNumber: '234567890123',
        amount: 5000,
        requestingDocument: 'DR-3456',
        notes: 'None',
        status: 'Paid',
        dueDate: '04-28-2025',
    },
    {
        id: 4,
        company: 'Quantum Metal Inc.',
        driver: 'Alice Brown',
        vehicle: 'GHI789',
        date: '03-31-2025',
        amount: 1200,
        billingsID: '3456',
        modeOfPayment: 'Bank Transfer - Unionbank',
        accountName: 'John Doe',
        accountNumber: '12345678',
        purpose: 'Registration',
        time: '3:43 PM',
        referenceNumber: '123456789012',
        amount: 10000,
        requestingDocument: ['DR-7812', 'DR-1234'],
        notes: 'This is a note for the transaction.',
        status: 'Unpaid',
        dueDate: '04-28-2025',
    },
    {
        id: 5,
        company: 'Nokarin Travel Agency',
        driver: 'Charlie Davis',
        vehicle: 'JKL012',
        date: '04-01-2025',
        amount: 1800,
        billingsID: '7890',
        modeOfPayment: 'Bank Transfer - BPI',
        accountName: 'Jane Smith',
        accountNumber: '87654321',
        purpose: 'Registration',
        time: '3:43 PM',
        referenceNumber: '987654321098',
        amount: 20000,
        requestingDocument: 'DR-1234',
        notes: 'This is a note for the transaction.',
        status: 'Unpaid',
        dueDate: '04-28-2025',
    },
    {
        id: 6,
        company: 'Nokarin Travel Agency',
        driver: 'Emily Wilson',
        vehicle: 'MNO345',
        date: '04-02-2025',
        amount: 1400,
        billingsID: '1234',
        modeOfPayment: 'Cash',
        accountName: 'Emily Wilson',
        accountNumber: '23456789',
        purpose: 'Registration',
        time: '3:43 PM',
        referenceNumber: '234567890123',
        amount: 5000,
        requestingDocument: 'DR-3456',
        notes: 'None',
        status: 'Unpaid',
        dueDate: '04-28-2025',
    },
];

export default function Billings() {
    const [activeTab, setActiveTab] = useState('approvalTab');
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
