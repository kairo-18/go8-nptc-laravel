import { FileInputWithPreview } from '@/components/file-input-with-preview';
import { Id, showToast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import MainLayout from './mainLayout';

export default function CreateOperator({ companies }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        vr_company_id: '',
        username: '',
        FirstName: '',
        LastName: '',
        email: '',
        ContactNumber: '',
        Address: '',
        BirthDate: '',
        password: '',
        Status: 'For Payment',
        photo: null,
        valid_id_front: null,
        valid_id_back: null,
    });
    const { flash } = usePage().props;

    const [fileKeys, setFileKeys] = useState({
        photo: Date.now(),
        valid_id_front: Date.now(),
        valid_id_back: Date.now(),
    });

    const [validationErrors, setValidationErrors] = useState({
        vr_company_id: '',
        username: '',
        FirstName: '',
        LastName: '',
        email: '',
        ContactNumber: '',
        Address: '',
        BirthDate: '',
        password: '',
        photo: '',
        valid_id_front: '',
        valid_id_back: '',
    });

    const validationRules = {
        username: {
            minLength: 4,
            maxLength: 20,
            error: 'Username must be 4-20 characters',
            allowedChars: /^[A-Za-z0-9_]*$/,
            onInput: (e) => e.target.value.slice(0, 20),
        },
        FirstName: {
            minLength: 2,
            maxLength: 50,
            error: 'First name must be 2-50 characters',
            allowedChars: /^[A-Za-z\s\-']*$/,
            onInput: (e) => e.target.value.slice(0, 50),
        },
        LastName: {
            minLength: 2,
            maxLength: 50,
            error: 'Last name must be 2-50 characters',
            allowedChars: /^[A-Za-z\s\-']*$/,
            onInput: (e) => e.target.value.slice(0, 50),
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            error: 'Invalid email format',
        },
        ContactNumber: {
            pattern: /^[0-9]{11}$/,
            error: 'Must be 11 digits (e.g., 09123456789)',
            maxLength: 11,
            allowedChars: /^[0-9]*$/,
            onInput: (e) => e.target.value.slice(0, 11),
        },
        password: {
            minLength: 8,
            error: 'Password must be at least 8 characters',
        },
        BirthDate: {
            validate: (value) => {
                if (!value) return '';
                const birthDate = new Date(value);
                const minAgeDate = new Date();
                minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);
                return birthDate > minAgeDate ? 'Operator must be at least 18 years old' : '';
            },
        },
    };

    const handleRestrictedInput = (field, e) => {
        const rules = validationRules[field];
        if (!rules) {
            setData(field, e.target.value);
            return;
        }
        let value = e.target.value;

        if (rules.allowedChars && !rules.allowedChars.test(value)) {
            value = value
                .split('')
                .filter((char) => rules.allowedChars.test(char))
                .join('');
        }
        if (rules.onInput) {
            e.target.value = rules.onInput(e);
            value = e.target.value;
        }
        setData(field, value);
    };

    useEffect(() => {
        const validateField = (field, value) => {
            if (!validationRules[field]) return '';

            const rules = validationRules[field];

            if (field === 'BirthDate' && rules.validate) {
                return rules.validate(value);
            }

            if (!value && field !== 'BirthDate') return '';

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
            username: validateField('username', data.username),
            FirstName: validateField('FirstName', data.FirstName),
            LastName: validateField('LastName', data.LastName),
            email: validateField('email', data.email),
            ContactNumber: validateField('ContactNumber', data.ContactNumber),
            password: validateField('password', data.password),
            BirthDate: validateField('BirthDate', data.BirthDate),
        }));
    }, [data.username, data.FirstName, data.LastName, data.email, data.ContactNumber, data.password, data.BirthDate]);

    const validateDocuments = () => {
        const requiredDocs = ['photo', 'valid_id_front', 'valid_id_back'];
        const docErrors = { ...validationErrors };
        requiredDocs.forEach((doc) => {
            if (!data[doc]) {
                docErrors[doc] = 'This document is required';
            } else if (data[doc] instanceof File) {
                const validTypes = ['image/jpeg', 'image/png'];
                if (!validTypes.includes(data[doc].type)) {
                    docErrors[doc] = 'Only JPG or PNG files allowed';
                } else if (data[doc].size > 2 * 1024 * 1024) {
                    docErrors[doc] = 'File size must be less than 2MB';
                } else {
                    docErrors[doc] = '';
                }
            } else {
                docErrors[doc] = '';
            }
        });
        setValidationErrors(docErrors);
    };

    useEffect(() => {
        validateDocuments();
    }, [data.photo, data.valid_id_front, data.valid_id_back]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        validateDocuments();

        const finalErrors = { ...validationErrors };
        if (!data.vr_company_id) {
            finalErrors.vr_company_id = 'Please select a company';
        }
        if (!data.Address) {
            finalErrors.Address = 'Address is required';
        }
        setValidationErrors(finalErrors);
        if (Object.values(finalErrors).some((error) => error !== '')) {
            return;
        }
        let loadingToastId: Id | null = null;
        try {
            loadingToastId = showToast('Creating operator...', {
                type: 'loading',
                isLoading: true,
                position: 'top-center',
                autoClose: false,
            });
            post(route('operators.store'), {
                onSuccess: () => {
                    if (loadingToastId) {
                        toast.dismiss(loadingToastId);
                    }
                    showToast('Operator created successfully!', {
                        type: 'success',
                        position: 'top-center',
                    });
                    reset();

                    const fileInputs = document.querySelectorAll<HTMLInputElement>('input[type="file"]');
                    fileInputs.forEach((input) => (input.value = ''));
                    setFileKeys({
                        photo: Date.now(),
                        valid_id_front: Date.now(),
                        valid_id_back: Date.now(),
                    });
                },
                onError: (errors) => {
                    if (loadingToastId) {
                        toast.dismiss(loadingToastId);
                    }
                    const errorMessages = Object.values(errors).flat();
                    showToast(errorMessages.join(', ') || 'Error creating operator', {
                        type: 'error',
                        position: 'top-center',
                    });
                },
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            if (loadingToastId) {
                toast.dismiss(loadingToastId);
            }
            showToast('An unexpected error occurred. Please try again.', {
                type: 'error',
                position: 'top-center',
            });
        }
    };

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                when: 'beforeChildren',
                staggerChildren: 0.1,
            },
        },
        exit: { opacity: 0, y: -20 },
    };

    const cardItemVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
    };

    return (
        <MainLayout breadcrumbs={[{ title: 'Operator Registration', href: '/create-operator' }]}>
            <motion.div initial="initial" animate="animate" variants={pageVariants} className="w-full p-2">
                <motion.div variants={cardItemVariants}>
                    <h1 className="text-2xl font-semibold">Create Operator</h1>
                    <p className="text-gray-500">Create an operator that is under a VR Company.</p>
                </motion.div>

                {flash?.success && (
                    <motion.div variants={cardItemVariants} className="mb-4 rounded-lg bg-green-100 p-3 text-green-700">
                        {flash.success}
                    </motion.div>
                )}

                <motion.div variants={cardItemVariants}>
                    <Card className="mt-6 shadow-md">
                        <motion.div variants={cardItemVariants}>
                            <CardHeader>
                                <CardTitle className="text-lg">Owner Information</CardTitle>
                                <p className="text-sm text-gray-500">Details of the Company Owner</p>
                            </CardHeader>
                        </motion.div>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* VR Company & Username */}
                                <motion.div variants={cardItemVariants} className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="vr_company_id">Select VR Company *</Label>
                                        <Select value={String(data.vr_company_id)} onValueChange={(value) => setData('vr_company_id', value)}>
                                            <SelectTrigger className={validationErrors.vr_company_id ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select a company" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Select a company" disabled>
                                                    Select a company
                                                </SelectItem>
                                                {companies.map((company) => (
                                                    <SelectItem key={company.id} value={String(company.id)}>
                                                        {company.CompanyName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {validationErrors.vr_company_id && <p className="text-sm text-red-500">{validationErrors.vr_company_id}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="username">Username *</Label>
                                        <Input
                                            id="username"
                                            value={data.username}
                                            onChange={(e) => handleRestrictedInput('username', e)}
                                            className={
                                                validationErrors.username
                                                    ? 'border-red-500 placeholder:text-red-500/70'
                                                    : 'placeholder:text-gray-500/70'
                                            }
                                            placeholder="4-20 characters, letters, numbers, underscores"
                                        />
                                        {validationErrors.username && <p className="text-sm text-red-500">{validationErrors.username}</p>}
                                    </div>
                                </motion.div>

                                {/* First Name & Last Name */}
                                <motion.div variants={cardItemVariants} className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="FirstName">First Name *</Label>
                                        <Input
                                            id="FirstName"
                                            value={data.FirstName}
                                            onChange={(e) => handleRestrictedInput('FirstName', e)}
                                            className={
                                                validationErrors.FirstName
                                                    ? 'border-red-500 placeholder:text-red-500/70'
                                                    : 'placeholder:text-gray-500/70'
                                            }
                                            placeholder="2-50 characters"
                                        />
                                        {validationErrors.FirstName && <p className="text-sm text-red-500">{validationErrors.FirstName}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="LastName">Last Name *</Label>
                                        <Input
                                            id="LastName"
                                            value={data.LastName}
                                            onChange={(e) => handleRestrictedInput('LastName', e)}
                                            className={
                                                validationErrors.LastName
                                                    ? 'border-red-500 placeholder:text-red-500/70'
                                                    : 'placeholder:text-gray-500/70'
                                            }
                                            placeholder="2-50 characters"
                                        />
                                        {validationErrors.LastName && <p className="text-sm text-red-500">{validationErrors.LastName}</p>}
                                    </div>
                                </motion.div>

                                {/* Email & Contact Number */}
                                <motion.div variants={cardItemVariants} className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={
                                                validationErrors.email ? 'border-red-500 placeholder:text-red-500/70' : 'placeholder:text-gray-500/70'
                                            }
                                            placeholder="example@domain.com"
                                        />
                                        {validationErrors.email && <p className="text-sm text-red-500">{validationErrors.email}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="ContactNumber">Contact Number *</Label>
                                        <Input
                                            id="ContactNumber"
                                            value={data.ContactNumber}
                                            onChange={(e) => handleRestrictedInput('ContactNumber', e)}
                                            className={
                                                validationErrors.ContactNumber
                                                    ? 'border-red-500 placeholder:text-red-500/70'
                                                    : 'placeholder:text-gray-500/70'
                                            }
                                            placeholder="09XXXXXXXXX"
                                            pattern="[0-9]{11}"
                                            maxLength={11}
                                        />
                                        {validationErrors.ContactNumber && <p className="text-sm text-red-500">{validationErrors.ContactNumber}</p>}
                                    </div>
                                </motion.div>

                                {/* Address & Birth Date */}
                                <motion.div variants={cardItemVariants} className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="Address">Address *</Label>
                                        <Input
                                            id="Address"
                                            value={data.Address}
                                            onChange={(e) => setData('Address', e.target.value)}
                                            className={
                                                validationErrors.Address
                                                    ? 'border-red-500 placeholder:text-red-500/70'
                                                    : 'placeholder:text-gray-500/70'
                                            }
                                            placeholder="House No., Street, Subdivision/Village, Barangay, City, Province, ZIP Code"
                                        />
                                        {validationErrors.Address && <p className="text-sm text-red-500">{validationErrors.Address}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="BirthDate">Birth Date *</Label>
                                        <Input
                                            id="BirthDate"
                                            type="date"
                                            value={data.BirthDate}
                                            onChange={(e) => setData('BirthDate', e.target.value)}
                                            className={
                                                validationErrors.BirthDate
                                                    ? 'border-red-500 placeholder:text-red-500/70'
                                                    : 'placeholder:text-gray-500/70'
                                            }
                                        />
                                        {validationErrors.BirthDate && <p className="text-sm text-red-500">{validationErrors.BirthDate}</p>}
                                    </div>
                                </motion.div>

                                {/* Password */}
                                <motion.div variants={cardItemVariants}>
                                    <Label htmlFor="password">Password *</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={
                                            validationErrors.password ? 'border-red-500 placeholder:text-red-500/70' : 'placeholder:text-gray-500/70'
                                        }
                                        placeholder="At least 8 characters"
                                    />
                                    {validationErrors.password && <p className="text-sm text-red-500">{validationErrors.password}</p>}
                                </motion.div>

                                <motion.div variants={cardItemVariants} className="grid grid-cols-3 gap-4">
                                    <FileInputWithPreview
                                        field="photo"
                                        label="1x1 Photo *"
                                        value={data.photo}
                                        onChange={(file) => setData('photo', file)}
                                        error={validationErrors.photo}
                                        accept="image/*"
                                    />
                                    <FileInputWithPreview
                                        field="valid_id_front"
                                        label="Valid ID (Front) *"
                                        value={data.valid_id_front}
                                        onChange={(file) => setData('valid_id_front', file)}
                                        error={validationErrors.valid_id_front}
                                        accept="image/*"
                                    />
                                    <FileInputWithPreview
                                        field="valid_id_back"
                                        label="Valid ID (Back) *"
                                        value={data.valid_id_back}
                                        onChange={(file) => setData('valid_id_back', file)}
                                        error={validationErrors.valid_id_back}
                                        accept="image/*"
                                    />
                                </motion.div>

                                {/* Submit Button */}
                                <motion.div variants={cardItemVariants} className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={processing || Object.values(validationErrors).some((error) => error !== '')}
                                        className="bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
                                    >
                                        {processing ? 'Submitting...' : 'Submit'}
                                    </Button>
                                </motion.div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </MainLayout>
    );
}
