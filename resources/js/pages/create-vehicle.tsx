import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MainLayout from '@/pages/mainLayout';
import { useForm } from '@inertiajs/react';

export default function CreateVehicle({ operators, onNextTab }) {
    const { data, setData, post, errors, processing } = useForm({
        operator_id: '',
        driver_id: '',
        PlateNumber: '',
        Model: '',
        Brand: '',
        SeatNumber: '',
        Status: '',
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

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('vehicles.store'), {
            onSuccess: () => {
                alert('Vehicle registered successfully.');
                onNextTab();
            }
        });
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

                            {/* Status */}
                            <div>
                                <Label htmlFor="Status">Status</Label>
                                <Select value={data.Status} onValueChange={(value) => setData('Status', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['Active', 'Inactive', 'Suspended', 'Banned', 'Pending', 'Approved', 'Rejected'].map((status) => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.Status && <p className="text-sm text-red-500">{errors.Status}</p>}
                            </div>

                            {/* File Uploads in Two Columns */}
                            <div className="grid grid-cols-2 gap-4">
                                {['front_image', 'back_image', 'left_side_image', 'right_side_image', 'or_image', 'cr_image', 'id_card_image', 'gps_certificate_image', 'inspection_certificate_image'].map((field) => (
                                    <div key={field}>
                                        <Label htmlFor={field}>{field.replace('_', ' ').toUpperCase()}</Label>
                                        <Input id={field} type="file" onChange={(e) => setData(field, e.target.files?.[0] || null)} />
                                        {errors[field] && <p className="text-sm text-red-500">{errors[field]}</p>}
                                    </div>
                                ))}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>Submit</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
    );
}
