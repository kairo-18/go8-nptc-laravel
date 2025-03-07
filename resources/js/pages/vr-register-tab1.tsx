import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import axios from 'axios';
import { Clipboard, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';

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

const TemporaryAccountTabContent = () => {
    const [isCopied, setIsCopied] = useState(false);
    const [isAppIdCopied, setIsAppIdCopied] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('pass@123');
    const [email, setEmail] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Manage form state with useState
    const [values, setValues] = useState({
        username: '',
        FirstName: '',
        LastName: '',
        email: '',
        ContactNumber: '12345789',
        Address: 'hotdog',
        BirthDate: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id;
        const value = e.target.value;
        setValues((prevValues) => ({
            ...prevValues,
            [key]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setGeneratedPassword(values.LastName + new Date(values.BirthDate).getFullYear());
        setEmail(values.email);
        setIsDialogOpen(true);

        try {
            await axios.post(route('temp-registration'), values);
            setIsDialogOpen(true);
        } catch (error) {
            console.error('Submission failed', error);
        }
    };

    return (
        <div className="p-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            id="LastName"
                            type="text"
                            placeholder="Enter last name"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            value={values.LastName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            id="FirstName"
                            type="text"
                            placeholder="Enter first name"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            value={values.FirstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                        <input
                            id="MiddleName"
                            type="text"
                            placeholder="Enter middle name"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            value={values.MiddleName}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">BirthDate</label>
                        <div className="mt-1 grid grid-cols-3 gap-2">
                            <input
                                id="BirthDate"
                                type="text"
                                placeholder="MM"
                                className="block w-full rounded-md border border-gray-300 p-2"
                                value={values.BirthDate}
                                onChange={handleChange}
                            />
                            <input
                                id="BirthDate"
                                type="text"
                                placeholder="DD"
                                className="block w-full rounded-md border border-gray-300 p-2"
                                value={values.BirthDate}
                                onChange={handleChange}
                            />
                            <input
                                id="BirthDate"
                                type="text"
                                placeholder="YYYY"
                                className="block w-full rounded-md border border-gray-300 p-2"
                                value={values.BirthDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter email"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            value={values.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter username"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            value={values.username}
                            onChange={handleChange}
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

                <Button type="submit" className="float-right mt-20 mb-5 bg-[#2A2A92] text-white hover:bg-[#5454A7] hover:text-white">
                    Generate Temporary Account
                </Button>
            </form>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Creation Successful</DialogTitle>
                        <DialogDescription>Share this link to proceed to registration.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2 py-4">
                        <div className="flex items-center justify-between rounded border border-gray-300 p-2">
                            <p>
                                <span className="ml-2 text-gray-500">Email</span>
                                <span className="text-black"> {email}</span>
                            </p>
                            <CopyButton text={email} isCopied={isAppIdCopied} setIsCopied={setIsAppIdCopied} />
                        </div>
                        <div className="flex items-center justify-between rounded border border-gray-300 p-2">
                            <div className="flex-1">
                                <span className="text-gray-500">Password: </span>
                                <span className="text-black">{generatedPassword}</span>
                            </div>
                            <CopyButton text={generatedPassword} isCopied={isCopied} setIsCopied={setIsCopied} />
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
