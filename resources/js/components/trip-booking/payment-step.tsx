'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BookingFormData } from '@/lib/types';
import axios from 'axios';
import { Loader2 } from 'lucide-react'; // Import a loading spinner icon
import { useEffect, useState } from 'react';
import PaymentSuccessModal from './payment-success-modal';

interface PaymentStepProps {
    formData: BookingFormData;
    updateFormData: (step: string, data: any) => void;
    onNext: () => void;
    onPrevious: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
}

export function PaymentStep({ formData, onPrevious, updateFormData }: PaymentStepProps) {
    const { baseFee, additionalFee, passengerInsurance, others } = formData.payment;
    const total = baseFee + additionalFee + passengerInsurance + others;
    const [linkId, setLinkId] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatCurrency = (amount: number) => {
        return `Php ${amount.toFixed(2)}`;
    };

    const handleProceedToPayment = async () => {
        setIsLoading(true); // Start loading
        try {
            const response = await axios.post('/api/generate-payment-link', {
                amount: 15000, // Amount in cents (150 PHP)
                description: 'NPTC Trip Ticket Payment',
            });

            if (response.data && response.data.data) {
                const paymentUrl = response.data.data.attributes.checkout_url;
                setLinkId(response.data.data.id);

                window.open(paymentUrl, '_blank');
            } else {
                console.error('Payment link creation failed:', response.data);
                alert('Failed to generate payment link. Please try again.');
                setIsLoading(false); // Stop loading on error
            }
        } catch (error) {
            console.error('Error creating payment link:', error);
            alert('An error occurred while processing the payment.');
            setIsLoading(false); // Stop loading on error
        }
    };

    useEffect(() => {
        if (!linkId) return;

        const interval = setInterval(async () => {
            try {
                const response = await axios.get(`/api/check-payment-status/${linkId}`);

                if (response.data?.data?.attributes?.status === 'paid') {
                    clearInterval(interval);
                    setIsLoading(false); // Stop loading when payment is successful
                    handleSubmitBooking();
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
                setIsLoading(false); // Stop loading on error
            }
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [linkId]);

    const onSubmitPassengers = async () => {
        try {
            const response = await axios.post('/api/add-passengers', formData);
            console.log(response.data);
            setPaymentSuccess(true);
            setIsModalOpen(true);
        } catch (e) {
            console.log(e);
        }
    };

    const handleSubmitBooking = async () => {
        try {
            const response = await axios.post('/api/create-booking', formData);

            // Update the tripId in the formData
            updateFormData('tripId', response.data.trip.id);

            console.log('Booking created:', response.data);
        } catch (error) {
            console.error('Booking submission failed:', error);
        }
    };

    // Use useEffect to trigger onSubmitPassengers when tripId is updated
    useEffect(() => {
        if (formData.tripId) {
            onSubmitPassengers();
        }
    }, [formData.tripId]); // Run this effect whenever tripId changes

    return (
        <div className="relative flex flex-col items-center">
            {/* Full-screen overlay with loading spinner */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-lg">
                        <Loader2 className="h-8 w-8 animate-spin" /> {/* Loading spinner */}
                        <p className="mt-2">Processing payment...</p>
                    </div>
                </div>
            )}

            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle>Payment</CardTitle>
                    <div className="text-muted-foreground mt-2 flex items-center justify-center text-sm">
                        <span>General</span>
                        <span className="mx-2">{'>'}</span>
                        <span>Passengers</span>
                        <span className="mx-2">{'>'}</span>
                        <span className="text-primary font-medium">Payment</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <h2 className="mb-4 text-xl font-semibold">Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Base Fee</span>
                            <span>{formatCurrency(baseFee)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Additional Fee (Tourist Trip)</span>
                            <span>{formatCurrency(additionalFee)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Passenger Insurance</span>
                            <span>{formatCurrency(passengerInsurance)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Others</span>
                            <span>{formatCurrency(others)}</span>
                        </div>
                        <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-6 flex w-full max-w-md justify-end gap-2">
                <Button className="bg-white" variant="outline" onClick={onPrevious} disabled={isLoading}>
                    Previous
                </Button>
                <Button onClick={handleProceedToPayment} disabled={isLoading}>
                    Proceed to Payment
                </Button>
            </div>

            <PaymentSuccessModal
                isOpen={isModalOpen}
                onClose={() => {
                    window.location.href = '/dashboard';
                }}
                amount={total}
                title="Payment Successful!"
                description="Thank you for your purchase. Your transaction has been completed successfully."
            />
        </div>
    );
}
