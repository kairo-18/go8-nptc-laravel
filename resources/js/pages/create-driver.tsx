import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function CreateDriver({ companies, latestVehicle, operator, company, onNextTab }) {
    useEffect(() => {
        if (operator?.id) {
            setData('operator_id', operator.id);
        }
    }, [operator]);

    const { data, setData, post, processing } = useForm({
        username: '',
        email: '',
        FirstName: '',
        MiddleName: '',
        LastName: '',
        Address: '',
        BirthDate: '',
        ContactNumber: '',
        password: '',
        vehicle_id: latestVehicle?.id || '',
        operator_id: operator?.id || '',
        vr_company_id: company?.id || '',
        LicenseNumber: '',
        License: null,
        Photo: null,
        NBI_clearance: null,
        Police_clearance: null,
        BIR_clearance: null,
    });

    const [fileKeys, setFileKeys] = useState({});
    const [validationErrors, setValidationErrors] = useState({
        username: '',
        email: '',
        FirstName: '',
        LastName: '',
        Address: '',
        BirthDate: '',
        ContactNumber: '',
        password: '',
        LicenseNumber: '',
        License: '',
        Photo: '',
        NBI_clearance: '',
        Police_clearance: '',
        BIR_clearance: '',
    });

    // Field validation rules
    const validationRules = {
        username: {
            minLength: 3,
            maxLength: 20,
            error: 'Username must be 3-20 characters',
            allowedChars: /^[a-zA-Z0-9_]*$/,
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            error: 'Invalid email format',
        },
        FirstName: {
            minLength: 2,
            maxLength: 50,
            error: 'First name must be 2-50 characters',
            allowedChars: /^[a-zA-Z\s]*$/,
        },
        LastName: {
            minLength: 2,
            maxLength: 50,
            error: 'Last name must be 2-50 characters',
            allowedChars: /^[a-zA-Z\s]*$/,
        },
        ContactNumber: {
            pattern: /^[0-9]{11}$/,
            error: 'Must be 11 digits',
            allowedChars: /^[0-9]*$/,
        },
        LicenseNumber: {
            minLength: 11,
            maxLength: 11,
            error: 'License number must be exactly 11 characters',
            allowedChars: /^[a-zA-Z0-9]*$/,
        },
        password: {
            minLength: 8,
            error: 'Password must be at least 8 characters',
        },
    };

    // Handle input with restrictions
    const handleRestrictedInput = (field, e) => {
        const rules = validationRules[field];
        let value = e.target.value;

        if (rules?.allowedChars) {
            value = value
                .split('')
                .filter((char) => rules.allowedChars.test(char))
                .join('');
        }

        if (rules?.maxLength) {
            value = value.slice(0, rules.maxLength);
        }

        setData(field, value);

        // Clear validation error when input changes
        if (validationErrors[field]) {
            setValidationErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    // Dynamic validation on input change
    useEffect(() => {
        const validateField = (field, value) => {
            if (!value) return '';

            const rules = validationRules[field];
            if (!rules) return '';

            if (field === 'email' && !rules.pattern.test(value)) {
                return rules.error;
            }
            if (field === 'ContactNumber' && !rules.pattern.test(value)) {
                return rules.error;
            }
            if (rules.minLength && value.length < rules.minLength) {
                return rules.error;
            }

            if (rules.minLength && value.length < rules.minLength) {
                return `Minimum ${rules.minLength} characters required`;
            }
            if (rules.maxLength && value.length > rules.maxLength) {
                return `Maximum ${rules.maxLength} characters`;
            }
            if (rules.pattern && !rules.pattern.test(value)) {
                return rules.error;
            }

            if (field === 'LicenseNumber') {
                value = value.slice(0, 11); // Ensure max length of 11
                if (value.length > 3) {
                    value = value.slice(0, 3) + '-' + value.slice(3);
                }
            }

            return '';
        };

        setValidationErrors((prev) => ({
            ...prev,
            username: validateField('username', data.username),
            email: validateField('email', data.email),
            FirstName: validateField('FirstName', data.FirstName),
            LastName: validateField('LastName', data.LastName),
            ContactNumber: validateField('ContactNumber', data.ContactNumber),
            LicenseNumber: validateField('LicenseNumber', data.LicenseNumber),
            password: validateField('password', data.password),
        }));
    }, [data.username, data.email, data.FirstName, data.LastName, data.ContactNumber, data.LicenseNumber, data.password]);

    // Validate required documents
    const validateDocuments = () => {
        const requiredDocs = ['License', 'Photo', 'NBI_clearance', 'Police_clearance', 'BIR_clearance'];
        const docErrors = { ...validationErrors };

        requiredDocs.forEach((doc) => {
            if (!data[doc]) {
                docErrors[doc] = 'This document is required';
            } else if (data[doc] instanceof File) {
                const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
                if (!validTypes.includes(data[doc].type)) {
                    docErrors[doc] = 'Only JPG, PNG, or PDF files allowed';
                } else if (data[doc].size > 5 * 1024 * 1024) {
                    docErrors[doc] = 'File size must be less than 5MB';
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
    }, [data.License, data.Photo, data.NBI_clearance, data.Police_clearance, data.BIR_clearance]);

    const handleSubmit = (e, createAnother = false) => {
        e.preventDefault();
        validateDocuments();

        // Check required fields
        const requiredFields = {
            username: 'Username is required',
            email: 'Email is required',
            FirstName: 'First name is required',
            LastName: 'Last name is required',
            Address: 'Address is required',
            BirthDate: 'Birth date is required',
            ContactNumber: 'Contact number is required',
            password: 'Password is required',
            LicenseNumber: 'License number is required',
        };

        const newErrors = { ...validationErrors };
        let hasError = false;

        Object.entries(requiredFields).forEach(([field, message]) => {
            if (!data[field]) {
                newErrors[field] = message;
                hasError = true;
            }
        });

        setValidationErrors(newErrors);

        if (hasError || Object.values(newErrors).some((error) => error !== '')) {
            return;
        }

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        post(route('driver.store'), {
            data: formData,
            onSuccess: () => {
                alert('Driver registered successfully!');
                if (createAnother) {
                    setData({
                        ...data,
                        username: '',
                        email: '',
                        FirstName: '',
                        MiddleName: '',
                        LastName: '',
                        Address: '',
                        BirthDate: '',
                        ContactNumber: '',
                        password: '',
                        LicenseNumber: '',
                        License: null,
                        Photo: null,
                        NBI_clearance: null,
                        Police_clearance: null,
                        BIR_clearance: null,
                    });
                    setFileKeys({});
                } else {
                    onNextTab();
                }
            },
        });
    };

    const handleFileRemove = (field) => {
        setData(field, null);
        setFileKeys((prev) => ({ ...prev, [field]: Date.now() }));
        setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    };

    return (
        <div className=" w-full">
            <h1 className="text-2xl font-semibold">Register Driver</h1>
            <p className="text-gray-500">Enter the driver's details.</p>

            <Card className="mt-6 shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">Driver Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
                        {/* Vehicle Plate Number */}
                        <div>
                            <Label>Vehicle Plate Number</Label>
                            {!latestVehicle?.PlateNumber && <p className="mb-1 text-red-500">Create Vehicle First</p>}
                            <Input
                                value={latestVehicle?.PlateNumber || ''}
                                readOnly
                                className={!latestVehicle?.PlateNumber ? 'border-red-500' : ''}
                            />
                        </div>

                        {/* Operator Name */}
                        <div>
                            <Label>Operator Name</Label>
                            {!operator?.user?.FirstName && <p className="mb-1 text-red-500">Create Operator First</p>}
                            <Input
                                value={`${operator?.user?.FirstName || ''} ${operator?.user?.LastName || ''}`}
                                readOnly
                                className={!operator?.user?.FirstName ? 'border-red-500' : ''}
                            />
                        </div>

                        {/* Company Name */}
                        <div>
                            <Label>Company Name</Label>
                            {!company?.CompanyName && <p className="mb-1 text-red-500">Create Company First</p>}
                            <Input value={company?.CompanyName || ''} readOnly className={!company?.CompanyName ? 'border-red-500' : ''} />
                        </div>

                        {/* Username & Email */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="username">Username *</Label>
                                <Input
                                    id="username"
                                    value={data.username}
                                    onChange={(e) => handleRestrictedInput('username', e)}
                                    className={`${validationErrors.username ? 'border-red-500' : ''} placeholder:text-gray-500`}
                                    placeholder="3-20 characters, letters and numbers only"
                                />
                                {validationErrors.username && <p className="text-sm text-red-500">{validationErrors.username}</p>}
                            </div>
                            <div>
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => handleRestrictedInput('email', e)}
                                    className={`${validationErrors.email ? 'border-red-500' : ''} placeholder:text-gray-500`}
                                    placeholder="example@domain.com"
                                />
                                {validationErrors.email && <p className="text-sm text-red-500">{validationErrors.email}</p>}
                            </div>
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="FirstName">First Name *</Label>
                                <Input
                                    id="FirstName"
                                    value={data.FirstName}
                                    onChange={(e) => handleRestrictedInput('FirstName', e)}
                                    className={`${validationErrors.FirstName ? 'border-red-500' : ''} placeholder:text-gray-500`}
                                    placeholder="Juan"
                                />
                                {validationErrors.FirstName && <p className="text-sm text-red-500">{validationErrors.FirstName}</p>}
                            </div>
                            <div>
                                <Label htmlFor="MiddleName">Middle Name</Label>
                                <Input
                                    id="MiddleName"
                                    value={data.MiddleName}
                                    onChange={(e) => setData('MiddleName', e.target.value)}
                                    placeholder="Santos (Optional)"
                                    className="placeholder:text-gray-500"
                                />
                            </div>
                            <div>
                                <Label htmlFor="LastName">Last Name *</Label>
                                <Input
                                    id="LastName"
                                    value={data.LastName}
                                    onChange={(e) => handleRestrictedInput('LastName', e)}
                                    className={`${validationErrors.LastName ? 'border-red-500' : ''} placeholder:text-gray-500`}
                                    placeholder="Dela Cruz"
                                />
                                {validationErrors.LastName && <p className="text-sm text-red-500">{validationErrors.LastName}</p>}
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <Label htmlFor="Address">Address *</Label>
                            <Input
                                id="Address"
                                value={data.Address}
                                onChange={(e) => setData('Address', e.target.value)}
                                className={`${validationErrors.Address ? 'border-red-500' : ''} placeholder:text-gray-500`}
                                placeholder="House No., Street, Subdivision/Village, Barangay, City, Province, ZIP Code"
                            />
                            {validationErrors.Address && <p className="text-sm text-red-500">{validationErrors.Address}</p>}
                        </div>

                        {/* Birth Date & Contact Number */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="BirthDate">Birth Date *</Label>
                                <Input
                                    id="BirthDate"
                                    type="date"
                                    value={data.BirthDate}
                                    onChange={(e) => setData('BirthDate', e.target.value)}
                                    className={validationErrors.BirthDate ? 'border-red-500' : ''}
                                />
                                {validationErrors.BirthDate && <p className="text-sm text-red-500">{validationErrors.BirthDate}</p>}
                            </div>
                            <div>
                                <Label htmlFor="ContactNumber">Contact Number *</Label>
                                <Input
                                    id="ContactNumber"
                                    value={data.ContactNumber}
                                    onChange={(e) => handleRestrictedInput('ContactNumber', e)}
                                    className={`${validationErrors.ContactNumber ? 'border-red-500' : ''} placeholder:text-gray-500`}
                                    placeholder="11 digits only"
                                    maxLength={11}
                                />
                                {validationErrors.ContactNumber && <p className="text-sm text-red-500">{validationErrors.ContactNumber}</p>}
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <Label htmlFor="password">Password *</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => handleRestrictedInput('password', e)}
                                className={`${validationErrors.password ? 'border-red-500' : ''} placeholder:text-gray-500`}
                                placeholder="Put your password here (at least 8 characters)"
                            />
                            {validationErrors.password && <p className="text-sm text-red-500">{validationErrors.password}</p>}
                        </div>

                        {/* License Number */}
                        <div>
                            <Label htmlFor="LicenseNumber">License Number *</Label>
                            <Input
                                id="LicenseNumber"
                                value={data.LicenseNumber}
                                onChange={(e) => handleRestrictedInput('LicenseNumber', e)}
                                className={`${validationErrors.LicenseNumber ? 'border-red-500' : ''} placeholder:text-gray-500`}
                                placeholder="A00-00-000000 (11 characters)"
                            />
                            {validationErrors.LicenseNumber && <p className="text-sm text-red-500">{validationErrors.LicenseNumber}</p>}
                        </div>

                        {/* File Uploads */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { field: 'License', label: 'License *' },
                                { field: 'Photo', label: 'Photo *' },
                                { field: 'NBI_clearance', label: 'NBI Clearance *' },
                                { field: 'Police_clearance', label: 'Police Clearance *' },
                                { field: 'BIR_clearance', label: 'BIR Clearance *' },
                            ].map(({ field, label }) => (
                                <div key={field}>
                                    <Label htmlFor={field}>{label}</Label>
                                    <Input
                                        key={fileKeys[field]}
                                        id={field}
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            setData(field, file);
                                        }}
                                        accept="image/*,.pdf"
                                        className={validationErrors[field] ? 'border-red-500' : ''}
                                    />
                                    {data[field] && (
                                        <div className="mt-1 flex items-center justify-between gap-2">
                                            <p className="text-sm text-gray-500">{data[field].name}</p>
                                            <button
                                                type="button"
                                                onClick={() => handleFileRemove(field)}
                                                className="text-red-500 hover:text-red-700"
                                                aria-label={`Remove ${field}`}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                    {validationErrors[field] && <p className="text-sm text-red-500">{validationErrors[field]}</p>}
                                </div>
                            ))}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" disabled={processing} onClick={(e) => handleSubmit(e, true)}>
                                Create and Add Another
                            </Button>
                            <Button type="submit" disabled={processing || Object.values(validationErrors).some((error) => error !== '')}>
                                {processing ? 'Processing...' : 'Create and Proceed'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
