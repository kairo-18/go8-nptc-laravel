import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { Clipboard, ClipboardCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

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

const TemporaryAccountTabContent = ({ type }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isEmailCopied, setIsEmailCopied] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('pass@123');
    const [email, setEmail] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState({
        username: '',
        FirstName: '',
        LastName: '',
        email: '',
        BirthDate: '',
        ContactNumber: '',
    });
    const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

    const [values, setValues] = useState({
        username: '',
        FirstName: '',
        LastName: '',
        MiddleName: '',
        email: '',
        BirthDate: '',
        ContactNumber: '',
        Type: type,
    });

    const formatLastName = (lastName: string) => {
        return lastName.replace(/\s+/g, '');
    };

    const validationRules = {
        username: {
            minLength: 4,
            maxLength: 20,
            error: 'Username must be 4-20 characters',
            allowedChars: /^[A-Za-z0-9_]*$/,
        },
        FirstName: {
            minLength: 2,
            maxLength: 50,
            error: 'First name must be 2-50 characters',
            allowedChars: /^[A-Za-z\s\-']*$/,
        },
        LastName: {
            minLength: 2,
            maxLength: 50,
            error: 'Last name must be 2-50 characters',
            allowedChars: /^[A-Za-z\s\-']*$/,
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            error: 'Invalid email format',
        },
        BirthDate: {
            validate: (value) => {
                if (!value) return 'Birth date is required';
                const birthDate = new Date(value);
                const minAgeDate = new Date();
                minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);
                return birthDate > minAgeDate ? 'Must be at least 18 years old' : '';
            },
        },
        ContactNumber: {
            pattern: /^(\+?63|0)?\d{10}$/,
            error: 'Contact number must be 11 digits, e.g. 09123456789',
        },
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setValues((prev) => ({ ...prev, [id]: value }));

        if (serverErrors[id]) {
            setServerErrors((prev) => ({ ...prev, [id]: '' }));
        }
    };

    useEffect(() => {
        const validateField = (field, value) => {
            if (!validationRules[field]) return '';

            const rules = validationRules[field];

            if (rules.validate) {
                return rules.validate(value);
            }

            if (!value) return '';

            if (rules.pattern && !rules.pattern.test(value)) {
                return rules.error;
            }

            if (rules.minLength && value.length < rules.minLength) {
                return rules.error;
            }

            return '';
        };

        setValidationErrors((prev) => ({
            ...prev,
            username: validateField('username', values.username),
            FirstName: validateField('FirstName', values.FirstName),
            LastName: validateField('LastName', values.LastName),
            email: validateField('email', values.email),
            BirthDate: validateField('BirthDate', values.BirthDate),
            ContactNumber: validateField('ContactNumber', values.ContactNumber),
        }));
    }, [values]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerErrors({});

        const requiredFields = ['username', 'FirstName', 'LastName', 'email', 'BirthDate', 'ContactNumber'];
        const hasEmptyFields = requiredFields.some((field) => !values[field]);

        if (hasEmptyFields) {
            setValidationErrors((prev) => ({
                ...prev,
                ...Object.fromEntries(requiredFields.map((field) => [field, !values[field] ? 'This field is required' : prev[field]])),
            }));
            return;
        }
        if (Object.values(validationErrors).some((error) => error !== '')) {
            return;
        }

        try {
            const formattedLastName = formatLastName(values.LastName);
            const password = `${formattedLastName}${new Date(values.BirthDate).getFullYear()}`;

            const normalizedContact = values.ContactNumber.startsWith('0')
                ? values.ContactNumber.replace(/^0/, '+63')
                : values.ContactNumber;

            const response = await axios.post(route('temp-registration'), {
                ...values,
                ContactNumber: normalizedContact,
                password: password,
            });

            setGeneratedPassword(password);
            setEmail(values.email);
            setIsDialogOpen(true);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                const errors = error.response.data.errors || {};
                const formattedErrors: Record<string, string> = {};

                Object.keys(errors).forEach((key) => {
                    formattedErrors[key] = errors[key][0];
                });

                setServerErrors(formattedErrors);
            } else {
                console.error('Submission failed', error);
                alert('An error occurred. Please try again.');
            }

            const formattedLastName = formatLastName(values.LastName);
            const password = `${formattedLastName}${new Date(values.BirthDate).getFullYear()}`;
            setGeneratedPassword(password);
            setEmail(values.email);
            setIsDialogOpen(true);
        }
    };

    const getError = (field: string) => {
        return serverErrors[field] || validationErrors[field] || '';
    };

    return (
        <div className="p-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name *</label>
                        <input
                            id="FirstName"
                            type="text"
                            placeholder="Juan"
                            className={`mt-1 block w-full rounded-md border p-2 ${getError('FirstName') ? 'border-red-500' : 'border-gray-300'}`}
                            value={values.FirstName}
                            onChange={handleChange}
                        />
                        {getError('FirstName') && <p className="mt-1 text-sm text-red-500">{getError('FirstName')}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                        <input
                            id="MiddleName"
                            type="text"
                            placeholder="Santos"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            value={values.MiddleName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                        <input
                            id="LastName"
                            type="text"
                            placeholder="Dela Cruz"
                            className={`mt-1 block w-full rounded-md border p-2 ${getError('LastName') ? 'border-red-500' : 'border-gray-300'}`}
                            value={values.LastName}
                            onChange={handleChange}
                        />
                        {getError('LastName') && <p className="mt-1 text-sm text-red-500">{getError('LastName')}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Birth Date *</label>
                        <Input
                            id="BirthDate"
                            type="date"
                            className={`block w-full rounded-md border p-2 ${getError('BirthDate') ? 'border-red-500' : 'border-gray-300'}`}
                            value={values.BirthDate}
                            onChange={handleChange}
                        />
                        {getError('BirthDate') && <p className="mt-1 text-sm text-red-500">{getError('BirthDate')}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email *</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="example@domain.com"
                            className={`mt-1 block w-full rounded-md border p-2 ${getError('email') ? 'border-red-500' : 'border-gray-300'}`}
                            value={values.email}
                            onChange={handleChange}
                        />
                        {getError('email') && <p className="mt-1 text-sm text-red-500">{getError('email')}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Number *</label>
                        <input
                            id="ContactNumber"
                            type="tel"
                            placeholder="09123456789"
                            className={`mt-1 block w-full rounded-md border p-2 ${getError('ContactNumber') ? 'border-red-500' : 'border-gray-300'}`}
                            value={values.ContactNumber}
                            onChange={handleChange}
                        />
                        {getError('ContactNumber') && <p className="mt-1 text-sm text-red-500">{getError('ContactNumber')}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username *</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="username123"
                            className={`mt-1 block w-full rounded-md border p-2 ${getError('username') ? 'border-red-500' : 'border-gray-300'}`}
                            value={values.username}
                            onChange={handleChange}
                        />
                        {getError('username') && <p className="mt-1 text-sm text-red-500">{getError('username')}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Generated Password</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-2"
                        disabled
                        value={
                            values.LastName && values.BirthDate
                                ? `${formatLastName(values.LastName)}${new Date(values.BirthDate).getFullYear()}`
                                : 'Will be generated'
                        }
                    />
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
                            <CopyButton text={email} isCopied={isEmailCopied} setIsCopied={setIsEmailCopied} />
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
                        <Button type="button" onClick={() => setIsDialogOpen(false)} className="!bg-gray-300 !text-gray-800 hover:!bg-gray-400">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TemporaryAccountTabContent;
