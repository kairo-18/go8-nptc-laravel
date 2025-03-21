'use client';

import type { BookingFormData } from '@/lib/types';
import { useState } from 'react';
import { GeneralStep } from '../components/trip-booking/general-step';
import { PassengersStep } from '../components/trip-booking/passenger-step';
import { PaymentStep } from '../components/trip-booking/payment-step';
import MainLayout from './mainLayout';

export default function TripBookingForm({ companies, operators, vehicles, drivers }) {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [formData, setFormData] = useState<BookingFormData>({
        general: {
            unitId: '',
            driverId: '',
            pickupAddress: '',
            dropoffAddress: '',
            pickupDate: { day: '', month: '', year: '' },
            dropoffDate: { day: '', month: '', year: '' },
            tripType: '',
        },

        tripId: '',
        passengers: [
            {
                LastName: '',
                FirstName: '',
                ContactNumber: '',
                Address: '',
            },
        ],
        payment: {
            baseFee: 150.0,
            additionalFee: 50.0,
            passengerInsurance: 200.0,
            others: 0.0,
        },
    });

    const steps = [
        { name: 'General', component: GeneralStep },
        { name: 'Passengers', component: PassengersStep },
        { name: 'Payment', component: PaymentStep },
    ];

    const handleNext = () => {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const updateFormData = (step: string, data: any) => {
        setFormData((prev) => ({
            ...prev,
            [step]: data,
        }));
    };

    const CurrentStepComponent = steps[currentStep].component;

    return (
        <MainLayout>
            <div className="mx-auto w-full max-w-6xl rounded-lg border p-6">
                <h1 className="mb-2 text-2xl font-bold">Generate Trip Ticket</h1>
                <div className="text-muted-foreground mb-6 flex items-center text-sm">
                    {steps.map((step, index) => (
                        <div key={step.name} className="flex items-center">
                            <span className={currentStep >= index ? 'text-primary font-medium' : ''}>{step.name}</span>
                            {index < steps.length - 1 && <span className="mx-2">{'>'}</span>}
                        </div>
                    ))}
                </div>

                <CurrentStepComponent
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    isFirstStep={currentStep === 0}
                    isLastStep={currentStep === steps.length - 1}
                    companies={companies}
                    operators={operators}
                    vehicles={vehicles}
                    drivers={drivers}
                />
            </div>
        </MainLayout>
    );
}
