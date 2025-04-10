import { FileInputWithPreview } from '@/components/file-input-with-preview';
import { showToast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function CreateVehicle({ operators, onNextTab }) {
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.user?.roles?.[0]?.name;
    const isAdmin = ['NPTC Admin', 'NPTC Super Admin'].includes(userRole);

    const { data, setData, post, errors, processing } = useForm({
        operator_id: '',
        driver_id: '',
        PlateNumber: '',
        Model: '',
        Brand: '',
        SeatNumber: '',
        Status: isAdmin ? 'Select Status' : userRole === 'VR Admin' ? 'For NPTC Approval' : userRole === 'Operator' ? 'For VR Approval' : undefined, // Optional default value
        front_image: null,
        back_image: null,
        left_side_image: null,
        right_side_image: null,
        or_image: null,
        cr_image: null,
        id_card_image: null,
        gps_certificate_image: null,
        inspection_certificate_image: null,
    });

    const [fileKeys, setFileKeys] = useState({});
    const [validationErrors, setValidationErrors] = useState({
        operator_id: '',
        PlateNumber: '',
        Model: '',
        Brand: '',
        SeatNumber: '',
        front_image: '',
        back_image: '',
        left_side_image: '',
        right_side_image: '',
        or_image: '',
        cr_image: '',
    });

    // Field validation with input restrictions
    const validationRules = {
        PlateNumber: {
            pattern: /^[A-Za-z]{2,3}\s?\d{3,4}$/,
            error: 'Invalid format (e.g., ABC 1234)',
            maxLength: 8,
            allowedChars: /^[A-Za-z0-9\s]*$/,
            onInput: (e) => {
                // Auto-format plate number (ABC 1234)
                let value = e.target.value.toUpperCase();
                if (value.length > 3 && value[3] !== ' ') {
                    value = value.slice(0, 3) + ' ' + value.slice(3);
                }
                return value.slice(0, 8);
            },
        },
        Model: {
            minLength: 2,
            maxLength: 15,
            error: 'Model must be 2-15 characters',
            allowedChars: /^[A-Za-z0-9\s\-]*$/,
            onInput: (e) => e.target.value.slice(0, 15),
        },
        Brand: {
            minLength: 2,
            maxLength: 15,
            error: 'Brand must be 2-15 characters',
            allowedChars: /^[A-Za-z0-9\s\-]*$/,
            onInput: (e) => e.target.value.slice(0, 15),
        },
        seatNumber: [
            { value: '4', label: '4 seater (Car)' },
            { value: '6', label: '6 seater (SUV)' },
            { value: '8', label: '8 seater (UV)' },
            { value: '10', label: '10 seater (Van)' },
            { value: '12', label: '12 seater (Van)' },
            { value: '51', label: '51 seater (2x2 Bus)' },
            { value: '61', label: '61 seater (3x2 Bus)' },
        ],
    };

    // Handle input with restrictions
    const handleRestrictedInput = (field, e) => {
        const rules = validationRules[field];
        if (!rules) {
            setData(field, e.target.value);
            return;
        }

        let value = e.target.value;

        // Apply character restrictions
        if (rules.allowedChars && !rules.allowedChars.test(value)) {
            value = value
                .split('')
                .filter((char) => rules.allowedChars.test(char))
                .join('');
        }

        // Apply custom input handling
        if (rules.onInput) {
            e.target.value = rules.onInput(e);
            value = e.target.value;
        }

        setData(field, value);
    };

    // Dynamic validation on input change
    useEffect(() => {
        const validateField = (field, value) => {
            if (!value) return '';

            const rules = validationRules[field];
            if (!rules) return '';

            if (field === 'PlateNumber') {
                return !rules.pattern.test(value) ? rules.error : '';
            } else if (field === 'Model' || field === 'Brand') {
                if (value.length < rules.minLength) return rules.error;
                if (value.length > rules.maxLength) return `Maximum ${rules.maxLength} characters`;
                return '';
            }
            return '';
        };

        setValidationErrors((prev) => ({
            ...prev,
            PlateNumber: validateField('PlateNumber', data.PlateNumber),
            Model: validateField('Model', data.Model),
            Brand: validateField('Brand', data.Brand),
            SeatNumber: validateField('SeatNumber', data.SeatNumber),
        }));
    }, [data.PlateNumber, data.Model, data.Brand, data.SeatNumber]);

    // Validate required documents
    const validateDocuments = () => {
        const requiredDocs = [
            'front_image',
            'back_image',
            'left_side_image',
            'right_side_image',
            'or_image',
            'cr_image',
            'id_card_image',
            'gps_certificate_image',
            'inspection_certificate_image',
        ];
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
    }, [
        data.front_image,
        data.back_image,
        data.left_side_image,
        data.right_side_image,
        data.or_image,
        data.cr_image,
        data.id_card_image,
        data.gps_certificate_image,
        data.inspection_certificate_image,
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        validateDocuments();

        const finalErrors = { ...validationErrors };

        if (!data.operator_id) finalErrors.operator_id = 'Please select an operator';

        if (isAdmin && data.Status === 'Select Status') {
            finalErrors.Status = 'Please select a valid status';
        }

        if (isAdmin && !data.Status) {
            finalErrors.Status = 'Please select a status';
        }

        setValidationErrors(finalErrors);

        if (Object.values(finalErrors).some((error) => error !== '')) {
            return;
        }

        const formData = isAdmin ? data : { ...data, Status: undefined };
        post(route('vehicles.store'), {
            data: formData,
            onSuccess: () => {
                showToast('Vehicle registered successfully', {
                    type: 'success',
                    position: 'top-center',
                });
                onNextTab();
            },

            onError: (errors) => {
                const errorMessages = Object.values(errors).flat();
                errorMessages.forEach((error) => {
                    showToast(error, {
                        type: 'error',
                        position: 'top-center',
                    });
                });
            },
        });
    };

    const handleInputChange = (field, value) => {
        setData(field, value);
        if (field === 'operator_id') {
            setValidationErrors((prev) => ({ ...prev, operator_id: '' }));
        }
    };

    return (
        <div className="w-full">
            <h1 className="text-2xl font-semibold">Register Vehicle</h1>
            <p className="text-gray-500">Enter the vehicle's details.</p>

            <Card className="mt-6 shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Operator Selection */}
                        <div>
                            <Label htmlFor="operator_id">Select Operator *</Label>
                            <Select value={data.operator_id} onValueChange={(value) => handleInputChange('operator_id', value)}>
                                <SelectTrigger className={validationErrors.operator_id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select an operator" className="text-gray-500" />
                                </SelectTrigger>
                                <SelectContent>
                                    {operators.map((operator) => (
                                        <SelectItem key={operator.id} value={String(operator.id)}>
                                            {operator.user.FirstName + ' ' + operator.user.LastName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {validationErrors.operator_id && <p className="text-sm text-red-500">{validationErrors.operator_id}</p>}
                        </div>

                        {/* Vehicle Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="PlateNumber">Plate Number *</Label>
                                <Input
                                    id="PlateNumber"
                                    value={data.PlateNumber}
                                    onChange={(e) => handleRestrictedInput('PlateNumber', e)}
                                    className={
                                        validationErrors.PlateNumber ? 'border-red-500 placeholder:text-red-500/70' : 'placeholder:text-gray-500/70'
                                    }
                                    placeholder="ABC 1234"
                                    maxLength={8}
                                />
                                {validationErrors.PlateNumber && <p className="text-sm text-red-500">{validationErrors.PlateNumber}</p>}
                            </div>

                            <div>
                                <Label htmlFor="Model">Model *</Label>
                                <Input
                                    id="Model"
                                    value={data.Model}
                                    onChange={(e) => handleRestrictedInput('Model', e)}
                                    className={validationErrors.Model ? 'border-red-500 placeholder:text-red-500/70' : 'placeholder:text-gray-500/70'}
                                    placeholder="e.g. Civic"
                                    maxLength={25}
                                />
                                {validationErrors.Model && <p className="text-sm text-red-500">{validationErrors.Model}</p>}
                            </div>

                            <div>
                                <Label htmlFor="Brand">Brand *</Label>
                                <Input
                                    id="Brand"
                                    value={data.Brand}
                                    onChange={(e) => handleRestrictedInput('Brand', e)}
                                    className={validationErrors.Brand ? 'border-red-500 placeholder:text-red-500/70' : 'placeholder:text-gray-500/70'}
                                    placeholder="e.g. Honda"
                                    maxLength={50}
                                />
                                {validationErrors.Brand && <p className="text-sm text-red-500">{validationErrors.Brand}</p>}
                            </div>

                            <div>
                                <Label htmlFor="SeatNumber">Seat Capacity *</Label>
                                <Select value={data.SeatNumber} onValueChange={(value) => handleInputChange('SeatNumber', value)}>
                                    <SelectTrigger className={validationErrors.SeatNumber ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select Seat Capacity" className="text-gray-500" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {validationRules.seatNumber.map((number) => (
                                            <SelectItem key={number.value} value={number.value}>
                                                {number.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {validationErrors.SeatNumber && <p className="text-sm text-red-500">{validationErrors.SeatNumber}</p>}
                            </div>
                        </div>

                        {/* Status - Only show for admins */}
                        {isAdmin && (
                            <div>
                                <Label htmlFor="Status">Status *</Label>
                                <Select value={data.Status} onValueChange={(value) => handleInputChange('Status', value)}>
                                    <SelectTrigger className={validationErrors.Status ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Select Status" disabled>
                                            Select Status
                                        </SelectItem>
                                        {['Active', 'Inactive', 'Suspended', 'Banned', 'Pending', 'Approved', 'Rejected'].map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {validationErrors.Status && <p className="text-sm text-red-500">{validationErrors.Status}</p>}
                            </div>
                        )}

                        {/* File Uploads */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { field: 'front_image', label: 'Front View *' },
                                { field: 'back_image', label: 'Rear View *' },
                                { field: 'left_side_image', label: 'Left Side View *' },
                                { field: 'right_side_image', label: 'Right Side View *' },
                                { field: 'or_image', label: 'Official Receipt (OR) *' },
                                { field: 'cr_image', label: 'Certificate of Registration (CR) *' },
                                { field: 'id_card_image', label: "Driver's ID" },
                                { field: 'gps_certificate_image', label: 'GPS Certificate' },
                                { field: 'inspection_certificate_image', label: 'Inspection Certificate' },
                            ].map(({ field, label }) => (
                                <FileInputWithPreview
                                    key={field}
                                    field={field}
                                    label={label}
                                    value={data[field]}
                                    onChange={(file) => setData(field, file)}
                                    error={validationErrors[field]}
                                />
                            ))}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing || Object.values(validationErrors).some((error) => error !== '')}>
                                {processing ? 'Processing...' : 'Submit'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
