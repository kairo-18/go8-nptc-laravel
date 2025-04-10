'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PaymentFailModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number | string;
    title: string;
    description: string;
    currency?: string;
}

export default function PaymentFailModal({ isOpen, onClose, amount, title, description, currency = 'Php' }: PaymentFailModalProps) {
    const [showIcon, setShowIcon] = useState(false);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowIcon(true);

            const timer = setTimeout(() => {
                setShowContent(true);
            }, 200);

            return () => clearTimeout(timer);
        } else {
            setShowIcon(false);
            setShowContent(false);
        }
    }, [isOpen]);

    const formattedAmount =
        typeof amount === 'number' ? amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : amount;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <div className="flex flex-col items-center justify-center py-6">
                    <div className="relative mb-6 flex items-center justify-center">
                        <div
                            className={cn(
                                'flex h-24 w-24 items-center justify-center rounded-full bg-red-100 transition-all duration-500 ease-out',
                                showIcon ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
                            )}
                        >
                            <XCircle
                                className={cn(
                                    'h-12 w-12 text-red-600 transition-all duration-500 ease-out',
                                    showIcon ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                                )}
                                strokeWidth={3}
                            />
                        </div>
                    </div>

                    <div
                        className={cn(
                            'space-y-4 text-center transition-all duration-500 ease-out',
                            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                        )}
                    >
                        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>

                        <div className="text-3xl font-bold text-red-600">
                            {currency}
                            {formattedAmount}
                        </div>

                        <p className="text-muted-foreground">{description}</p>

                        <Button onClick={onClose} className="mt-4 w-full" variant="destructive">
                            Try Again
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
