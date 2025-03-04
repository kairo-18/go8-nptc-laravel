import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Clipboard, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import MainLayout from './mainLayout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'VR Registration',
        href: '/vr-registration',
    },
];

export default function VrRegistration() {
    const [activeTab, setActiveTab] = useState('tempoAccountTab');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isAppIdCopied, setIsAppIdCopied] = useState(false);

    const generatedUsername = 'user123';
    const generatedPassword = 'pass@123';
    const generatedApplicationId = 'app-456';

    const TabContent = ({ value, title, description }: { value: string; title: string; description?: string }) => (
        <TabsContent value={value} className="w-full rounded-sm border border-gray-300 p-2">
            <div className="ml-2 flex flex-col items-start py-2">
                <h3 className="scroll-m-20 text-lg font-semibold tracking-tight">{title}</h3>
                {description && <p className="text-sm text-gray-600">{description}</p>}
            </div>
            <Separator className="my-2" />
            {value === 'tempoAccountTab' ? <TemporaryAccountTabContent /> : <ApplicationStatusTabContent />}
        </TabsContent>
    );

    const TemporaryAccountTabContent = () => (
        <div className="p-4">
            <form className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" placeholder="Enter last name" className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" placeholder="Enter first name" className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                        <input type="text" placeholder="Enter middle name" className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">BirthDate</label>
                        <div className="mt-1 grid grid-cols-3 gap-2">
                            <input type="text" placeholder="MM" className="block w-full rounded-md border border-gray-300 p-2" />
                            <input type="text" placeholder="DD" className="block w-full rounded-md border border-gray-300 p-2" />
                            <input type="text" placeholder="YYYY" className="block w-full rounded-md border border-gray-300 p-2" />
                        </div>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" placeholder="Enter email" className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Default Username</label>
                        <input
                            type="text"
                            placeholder="Generate username"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Default Password</label>
                        <input
                            type="text"
                            placeholder="Derived from birthdate"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            disabled
                        />
                    </div>
                </div>
            </form>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(true)}
                        className="float-right mt-20 mb-5 bg-[#2A2A92] text-white hover:bg-[#5454A7] hover:text-white"
                    >
                        Generate Temporary Account
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Creation Successful</DialogTitle>
                        <DialogDescription>Share this link to proceed to registration.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2 py-4">
                        {/* Username and Password Section */}
                        <div className="flex items-center justify-between rounded border border-gray-300 p-2">
                            <div className="flex-1">
                                <p className="ml-2 text-gray-500">Username:</p> {/* Gray text for the label */}
                                <p className="ml-2 text-black">{generatedUsername}</p> {/* Black text for the generated username */}
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-500">Password:</p> {/* Gray text for the label */}
                                <p className="text-black">{generatedPassword}</p> {/* Black text for the generated password */}
                            </div>
                            <Button
                                className="bg-[#2A2A92] text-white hover:bg-[#5454A7] hover:text-white"
                                onClick={() => {
                                    // Copy functionality
                                    navigator.clipboard.writeText(`${generatedUsername}\n${generatedPassword}`);
                                    setIsCopied(true); // Set copied state to true
                                    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
                                }}
                            >
                                {isCopied ? <ClipboardCheck /> : <Clipboard />} {/* Toggle icon */}
                            </Button>
                        </div>

                        {/* Application ID Section */}
                        <div className="flex items-center justify-between rounded border border-gray-300 p-2">
                            <p>
                                <span className="ml-2 text-gray-500">Application ID:</span>
                                <span className="text-black"> {generatedApplicationId}</span>
                            </p>
                            <Button
                                className="bg-[#2A2A92] text-white hover:bg-[#5454A7] hover:text-white"
                                onClick={() => {
                                    // Copy functionality
                                    navigator.clipboard.writeText(generatedApplicationId);
                                    setIsAppIdCopied(true); // Set copied state to true
                                    setTimeout(() => setIsAppIdCopied(false), 2000); // Reset after 2 seconds
                                }}
                            >
                                {isAppIdCopied ? <ClipboardCheck /> : <Clipboard />} {/* Toggle icon */}
                            </Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={() => setIsDialogOpen(false)}
                            className="bg-gray-300 text-gray-800 hover:bg-gray-400 hover:text-gray-900"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );

    const ApplicationStatusTabContent = () => <h1 className="p-2 text-2xl font-bold">Not yet</h1>;

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="VR register" />

            <div className="mx-auto flex w-full flex-col items-end">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex justify-end">
                        <TabsList className="bg-[#2A2A92] text-white">
                            <TabsTrigger value="tempoAccountTab" className="px-10">
                                Temporary Account
                            </TabsTrigger>
                            <TabsTrigger value="appStatsTab" className="px-10">
                                Application Status
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <TabContent value="tempoAccountTab" title="Temporary Account" description="Details of the Company Owner" />
                    <TabContent value="appStatsTab" title="Application Status" description="Check the current status of your application" />
                </Tabs>
            </div>
        </MainLayout>
    );
}
