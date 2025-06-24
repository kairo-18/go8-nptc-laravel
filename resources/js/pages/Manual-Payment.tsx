    import { useState } from 'react';
    import MainLayout from './mainLayout';
    import { Input } from '@/components/ui/input';
    import { Label } from '@radix-ui/react-dropdown-menu';
    import { useForm } from '@inertiajs/react';
    import { Select } from '@radix-ui/react-select';
    import { SelectTrigger } from '@radix-ui/react-select';
    import { SelectContent, SelectItem } from '@/components/ui/select';
    import { showToast, Id } from '@/components/toast';
    import { toast } from 'react-toastify';

    const modePayments = ['G-cash', 'Maya', 'Bank Transfer'];

    export default function ManualPayment({ operatorId, totalAmount }) {
        const { data, setData, post, processing } = useForm({
            operator_id: operatorId,
            AccountName: '',
            ModePayment: '',
            Receipt: null,
            ReferenceNumber: '',
            AccountNumber: '',
            Notes: '',
            Amount: totalAmount.toString(),
        });

        const handleFileChange = (e) => {
            setData('Receipt', e.target.files[0]);
        };

     const handleSubmit = (e) => {
            e.preventDefault();
            let loadingToastId: Id | null = null;

            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });

            loadingToastId = showToast('Submitting payment...', {
                type: 'loading',
                isLoading: true,
                position: 'top-center',
                autoClose: false
            });

            post(route('manual-payments.store'), {
                data: formData,
                preserveScroll: true,
                onSuccess: () => {
                    if (loadingToastId) {
                        toast.dismiss(loadingToastId);
                    }
                    showToast('Payment submitted successfully!', {
                        type: 'success',
                        position: 'top-center'
                    });
                    // Reset form
                    setData({
                        operator_id: operatorId,
                        AccountName: '',
                        ModePayment: '',
                        Receipt: null,
                        ReferenceNumber: '',
                        AccountNumber: '',
                        Notes: '',
                        Amount: totalAmount.toString(),
                    });
                },
                onError: (errors) => {
                    if (loadingToastId) {
                        toast.dismiss(loadingToastId);
                    }
                    showToast('Failed to submit payment', {
                        type: 'error',
                        position: 'top-center'
                    });
                }
            });
        };

        return (
            <MainLayout>
                <form onSubmit={handleSubmit} className="flex flex-col gap-10 rounded border p-4 shadow-lg">
                    <div className="w-full">
                        <h1 className="flex items-center text-2xl font-bold">Manual Direct Payment</h1>
                    </div>

                    <div className="grid w-full grid-cols-3 rounded-lg border border-gray-200 p-7">
                        <div className="flex flex-col">
                            <div className="font-semibold">Operator ID:</div>
                            <div>{operatorId}</div>
                        </div>

                        <div className="flex flex-col">
                            <div className="font-semibold">Total Amount: ₱</div>
                            <div>{totalAmount.toLocaleString()}</div>
                        </div>

                        <div className="flex flex-col">
                            <div className="font-semibold">Requesting documents for</div>
                            <div>No data found</div>
                        </div>
                    </div>

                    <div className="flex w-full flex-col gap-5 rounded-lg border border-gray-200 p-5">
                        <div className="gap-0">
                            <h1 className="flex items-center text-xl font-bold">Transaction information</h1>
                            <h2 className="text-md flex items-center font-normal">Details of Vehicle Rental Company</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <Label className="text-md flex items-center font-medium">Mode of Payment</Label>
                                <Select value={data.ModePayment} onValueChange={(value) => setData('ModePayment', value)}>
                                    <SelectTrigger className="text-md flex w-full justify-start rounded border p-1.5 font-medium text-gray-400">
                                        {data.ModePayment || 'Select a payment mode'}
                                    </SelectTrigger>
                                    <SelectContent>
                                        {modePayments.map((mode) => (
                                            <SelectItem key={mode} value={mode}>
                                                {mode}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-md flex items-center font-medium">Receipt/Screenshot</Label>
                                <Input
                                    id="Receipt"
                                    type="file"
                                    placeholder="Select File"
                                    onChange={handleFileChange}
                                    className="text-md flex items-center font-medium text-gray-400"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-md flex items-center font-medium">Account Name</Label>
                                <Input
                                    value={data.AccountName}
                                    onChange={(e) => setData('AccountName', e.target.value)}
                                    placeholder="Select File"
                                    className="placeholder:text-md placeholder:flex placeholder:items-center placeholder:font-medium placeholder:text-gray-400"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-md flex items-center font-medium">Account Number</Label>
                                <Input
                                    value={data.AccountNumber}
                                    onChange={(e) => setData('AccountNumber', e.target.value)}
                                    placeholder="Select File"
                                    className="placeholder:text-md placeholder:flex placeholder:items-center placeholder:font-medium placeholder:text-gray-400"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-md flex items-center font-medium">Reference Number</Label>
                                <Input
                                    value={data.ReferenceNumber}
                                    onChange={(e) => setData('ReferenceNumber', e.target.value)}
                                    placeholder="Select File"
                                    className="placeholder:text-md placeholder:flex placeholder:items-center placeholder:font-medium placeholder:text-gray-400"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-md flex items-center font-medium">Notes</Label>
                                <Input
                                    value={data.Notes}
                                    onChange={(e) => setData('Notes', e.target.value)}
                                    placeholder="Select File"
                                    className="placeholder:text-md placeholder:flex placeholder:items-center placeholder:font-medium placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button 
                                type="submit" 
                                className="rounded bg-blue-500 px-4 py-2 text-white" 
                                disabled={processing}
                            >
                                {processing ? 'Submitting...' : 'Submit Payment'}
                            </button>
                        </div>
                    </div>
                </form>
            </MainLayout>
        );
    }