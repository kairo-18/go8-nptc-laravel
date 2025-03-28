import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

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
        Status: isAdmin ? 'For Payment' : userRole === 'VR Admin' ? 'For NPTC Approval' : userRole === 'Operator' ? 'For VR Approval' : undefined, // Optional default value
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Only include Status in the data if it's an admin or if the field has a value
        const formData = isAdmin ? data : { ...data, Status: undefined };
        post(route('vehicles.store'), {
            data: formData,
            onSuccess: () => {
                alert('Vehicle registered successfully.');
                onNextTab();
            },
        });
    };

    const handleFileRemove = (field) => {
        setData(field, null);
        setFileKeys((prevKeys) => ({ ...prevKeys, [field]: Date.now() }));
    };

    return (
        <div className="mx-auto mt-6 w-full max-w-6xl">
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
                            <Label htmlFor="operator_id">Select Operator</Label>
                            <Select value={data.operator_id} onValueChange={(value) => setData('operator_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an operator" />
                                </SelectTrigger>
                                <SelectContent>
                                    {operators.map((operator) => (
                                        <SelectItem key={operator.id} value={String(operator.id)}>
                                            {operator.user.FirstName + ' ' + operator.user.LastName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.operator_id && <p className="text-sm text-red-500">{errors.operator_id}</p>}
                        </div>

                        {/* Vehicle Details in Two Columns */}
                        <div className="grid grid-cols-2 gap-4">
                            {['PlateNumber', 'Model', 'Brand', 'SeatNumber'].map((field) => (
                                <div key={field}>
                                    <Label htmlFor={field}>{field}</Label>
                                    <Input id={field} value={data[field]} onChange={(e) => setData(field, e.target.value)} />
                                    {errors[field] && <p className="text-sm text-red-500">{errors[field]}</p>}
                                </div>
                            ))}
                        </div>

                        {/* Status - Only show for admins */}
                        {isAdmin && (
                            <div>
                                <Label htmlFor="Status">Status</Label>
                                <Select value={data.Status} onValueChange={(value) => setData('Status', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['Active', 'Inactive', 'Suspended', 'Banned', 'Pending', 'Approved', 'Rejected'].map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.Status && <p className="text-sm text-red-500">{errors.Status}</p>}
                            </div>
                        )}

                        {/* File Uploads in Two Columns */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                'front_image',
                                'back_image',
                                'left_side_image',
                                'right_side_image',
                                'or_image',
                                'cr_image',
                                'id_card_image',
                                'gps_certificate_image',
                                'inspection_certificate_image',
                            ].map((field) => (
                                <div key={field}>
                                    <Label htmlFor={field}>{field.replace('_', ' ').toUpperCase()}</Label>
                                    <Input
                                        key={fileKeys[field]}
                                        id={field}
                                        type="file"
                                        onChange={(e) => setData(field, e.target.files?.[0] || null)}
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
                                                x
                                            </button>
                                        </div>
                                    )}
                                    {errors[field] && <p className="text-sm text-red-500">{errors[field]}</p>}
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                Submit
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
