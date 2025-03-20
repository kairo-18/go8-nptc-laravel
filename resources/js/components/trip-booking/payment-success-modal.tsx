'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PaymentSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number | string;
    title: string;
    description: string;
    currency?: string;
}

export default function PaymentSuccessModal({ isOpen, onClose, amount, title, description, currency = '$' }: PaymentSuccessModalProps) {
    const [showCheckmark, setShowCheckmark] = useState(false);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Sequence the animations
            setShowCheckmark(true);

            const timer = setTimeout(() => {
                setShowContent(true);
            }, 200);

            return () => clearTimeout(timer);
        } else {
            setShowCheckmark(false);
            setShowContent(false);
        }
    }, [isOpen]);

    // Format amount if it's a number
    const formattedAmount =
        typeof amount === 'number' ? amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : amount;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <div className="flex flex-col items-center justify-center py-6">
                    {/* Animated checkmark container */}
                    <div className="relative mb-6 flex items-center justify-center">
                        <div
                            className={cn(
                                'flex h-24 w-24 items-center justify-center rounded-full bg-green-100 transition-all duration-500 ease-out',
                                showCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
                            )}
                        >
                            <Check
                                className={cn(
                                    'h-12 w-12 text-green-600 transition-all duration-500 ease-out',
                                    showCheckmark ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                                )}
                                strokeWidth={3}
                            />
                        </div>
                    </div>

                    {/* Content with fade-in animation */}
                    <div
                        className={cn(
                            'space-y-4 text-center transition-all duration-500 ease-out',
                            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                        )}
                    >
                        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>

                        <div className="text-3xl font-bold text-green-600">
                            {currency}
                            {formattedAmount}
                        </div>

                        <p className="text-muted-foreground">{description}</p>

                        <Button onClick={onClose} className="mt-4 w-full">
                            Continue
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
