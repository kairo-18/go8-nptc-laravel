'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import axios from 'axios';
import { Download, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TripTicketModal({
    open,
    setOpen,
    selectedTripData,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedTripData: any;
}) {
    const [tripData, setTripData] = useState({
        company: '',
        ticketId: '',
        billingId: '',
        operator: '',
        driver: '',
        unit: '',
        plate: '',
        applicationDate: '',
        totalPassengers: { number: 0, text: '' },
        tripType: '',
        pickup: { dateTime: '', address: '' },
        dropoff: { dateTime: '', address: '' },
        fees: { baseFee: 0, additionalFee: { amount: 0, description: '' }, passengerInsurance: 0, others: 0 },
    });

    const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
    const [TripQr, setTripQr] = useState('');
    const [showQr, setShowQr] = useState(false);

    useEffect(() => {
        if (selectedTripData) {
            const passengerCount = selectedTripData.passengers?.length || 0;
            const numberToWords = (num: number) => {
                const words = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
                return words[num] || num.toString();
            };

            setTripData({
                company: selectedTripData.driver.operator.vr_company.CompanyName,
                ticketId: selectedTripData.id,
                billingId: 'BL-3818',
                operator: selectedTripData.driver.operator.vr_company.CompanyName,
                driver: selectedTripData.driver?.user?.FirstName + ' ' + selectedTripData.driver?.user?.LastName,
                unit: selectedTripData.vehicle?.Model + ' ' + selectedTripData.vehicle?.Brand,
                plate: selectedTripData.vehicle?.PlateNumber,
                applicationDate: new Date(selectedTripData.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }),
                totalPassengers: { number: passengerCount, text: numberToWords(passengerCount) },
                tripType: selectedTripData.tripType,
                pickup: {
                    dateTime: new Date(selectedTripData.pickupDate).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                    }),
                    address: selectedTripData.pickupAddress,
                },
                dropoff: {
                    dateTime: new Date(selectedTripData.dropOffDate).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                    }),
                    address: selectedTripData.dropOffAddress,
                },
                fees: {
                    baseFee: 150.0,
                    additionalFee: { amount: 50.0, description: 'Tourist Trip' },
                    passengerInsurance: 200.0,
                    others: 0.0,
                },
            });

            const fetchQrCode = async () => {
                try {
                    const response = await axios.get(`/generate-qr/${selectedTripData.id}`);
                    setTripQr(response.data.qr_code);
                } catch (error) {
                    console.error('Failed to fetch QR code:', error);
                }
            };

            fetchQrCode();
        }
    }, [selectedTripData]);

    const totalFee =
        (tripData.fees?.baseFee || 0) +
        (tripData.fees?.additionalFee?.amount || 0) +
        (tripData.fees?.passengerInsurance || 0) +
        (tripData.fees?.others || 0);

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="overflow-y-auto max-h-[90vh] rounded-lg border-2 pt-3 sm:max-w-[900px]">
                    {showQr ? (
                        <div className="flex flex-col items-center justify-center gap-6 p-8">
                            <h2 className="text-lg font-bold text-center text-indigo-800">Trip Ticket QR Code</h2>
                            <img src={TripQr} alt="QR Code" className="w-full max-w-[250px]" />
                            <Button className="mt-4" onClick={() => setShowQr(false)}>
                                Back to Trip Info
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-lg bg-white">
                            <div className="p-4 sm:p-6">
                                <h2 className="mb-3 text-xl font-bold text-indigo-800">{tripData.company || ''}</h2>

                                <div className="mb-6 grid grid-cols-1 gap-4 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-3">
                                    {tripData.operator && <Info label="Operator" value={tripData.operator} />}
                                    {tripData.ticketId && <Info label="Ticket ID" value={tripData.ticketId} />}
                                    {tripData.billingId && <Info label="Billing ID" value={tripData.billingId} />}
                                    {tripData.driver && <Info label="Driver" value={tripData.driver} />}
                                    {tripData.unit && <Info label="Unit" value={tripData.unit} />}
                                    {tripData.plate && <Info label="Plate" value={tripData.plate} />}
                                    {tripData.applicationDate && <Info label="Application Date" value={tripData.applicationDate} />}
                                    {tripData.totalPassengers?.number !== 0 && (
                                        <Info
                                            label="Total Passengers"
                                            value={`${tripData.totalPassengers.number} (${tripData.totalPassengers.text})`}
                                        />
                                    )}
                                    {tripData.tripType && <Info label="Trip Type" value={tripData.tripType} />}
                                    {tripData.pickup?.dateTime && <Info label="Pick-up Date and Time" value={tripData.pickup.dateTime} />}
                                    {tripData.dropoff?.dateTime && <Info label="Drop-off Date and Time" value={tripData.dropoff.dateTime} />}
                                    {tripData.pickup?.address && <Info label="Pick-up Address" value={tripData.pickup.address} />}
                                    {tripData.dropoff?.address && <Info label="Drop-off Address" value={tripData.dropoff.address} />}
                                </div>

                                <div className="border-t border-gray-200 pt-4 text-sm text-gray-600">
                                    {tripData.fees?.baseFee > 0 && <Fee label="Base Fee" value={tripData.fees.baseFee} />}
                                    {tripData.fees?.additionalFee?.amount > 0 && (
                                        <Fee
                                            label={`Additional Fee (${tripData.fees.additionalFee.description})`}
                                            value={tripData.fees.additionalFee.amount}
                                        />
                                    )}
                                    {tripData.fees?.passengerInsurance > 0 && (
                                        <Fee label="Passenger Insurance" value={tripData.fees.passengerInsurance} />
                                    )}
                                    {tripData.fees?.others > 0 && <Fee label="Others" value={tripData.fees.others} />}
                                    <p className="mt-2 flex justify-between border-t border-gray-300 pt-2 text-base font-semibold">
                                        <span>Total:</span>
                                        <span className="font-bold text-black">Php {totalFee.toFixed(2)}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
                                <Button className="w-full" onClick={() => setIsPassengerModalOpen(true)}>
                                    <FileText size={16} className="mr-2" /> View passenger manifest
                                </Button>
                                <Button
                                    className="w-full"
                                    onClick={() => window.open(`/trip-ticket/download/${selectedTripData?.id}`, '_blank')}
                                >
                                    <Download size={16} className="mr-2" /> Download Trip Ticket
                                </Button>
                                <Button className="w-full" onClick={() => setShowQr(true)}>
                                    Show QR Code
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Passenger Modal */}
            <Dialog open={isPassengerModalOpen} onOpenChange={setIsPassengerModalOpen}>
                <DialogContent className="overflow-y-auto max-h-[90vh] rounded-lg border-2 p-0 sm:max-w-[900px]">
                    <div className="bg-white">
                        <div className="border-b bg-gray-50 p-4">
                            <h2 className="text-lg font-bold text-indigo-800">Passenger Manifest</h2>
                        </div>
                        <div className="p-4 sm:p-6">
                            {selectedTripData?.passengers?.length > 0 ? (
                                <div className="space-y-4">
                                    {selectedTripData.passengers.map((passenger: any, index: number) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-1 gap-3 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-3"
                                        >
                                            <PassengerInfo label="Contact" value={passenger.ContactNumber} />
                                            <PassengerInfo label="Last Name" value={passenger.LastName} />
                                            <PassengerInfo label="First Name" value={passenger.FirstName} />
                                            <PassengerInfo label="Address" value={passenger.Address} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No passengers found.</p>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

// Reusable UI Components
const Info = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-1">
        <span className="font-semibold text-gray-600">{label}:</span>
        <span className="font-semibold text-black">{value}</span>
    </div>
);

const Fee = ({ label, value }: { label: string; value: number }) => (
    <p className="flex justify-between">
        <span>{label}:</span>
        <span className="font-bold text-black">Php {value.toFixed(2)}</span>
    </p>
);

const PassengerInfo = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-bold">{value}</span>
    </div>
);
