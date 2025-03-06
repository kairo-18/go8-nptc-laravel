import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clipboard, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';

const generatedUsername = 'user123';
const generatedPassword = 'pass@123';
const generatedApplicationId = 'app-456';

const CopyButton = ({ text, isCopied, setIsCopied }: { text: string; isCopied: boolean; setIsCopied: (value: boolean) => void }) => (
    <Button
        className="bg-[#2A2A92] text-white hover:bg-[#5454A7] hover:text-white"
        onClick={() => {
            navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }}
    >
        {isCopied ? <ClipboardCheck /> : <Clipboard />}
    </Button>
);

const TemporaryAccountTabContent = ({ setIsDialogOpen }: { setIsDialogOpen: (value: boolean) => void }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isAppIdCopied, setIsAppIdCopied] = useState(false);

    return (
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

            <Dialog>
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
                        <div className="flex items-center justify-between rounded border border-gray-300 p-2">
                            <div className="flex-1">
                                <p className="ml-2 text-gray-500">Username:</p>
                                <p className="ml-2 text-black">{generatedUsername}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-500">Password:</p>
                                <p className="text-black">{generatedPassword}</p>
                            </div>
                            <CopyButton text={`${generatedUsername}\n${generatedPassword}`} isCopied={isCopied} setIsCopied={setIsCopied} />
                        </div>

                        <div className="flex items-center justify-between rounded border border-gray-300 p-2">
                            <p>
                                <span className="ml-2 text-gray-500">Application ID:</span>
                                <span className="text-black"> {generatedApplicationId}</span>
                            </p>
                            <CopyButton text={generatedApplicationId} isCopied={isAppIdCopied} setIsAppIdCopied={setIsAppIdCopied} />
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
};

export default TemporaryAccountTabContent;
