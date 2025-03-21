'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Download, FileText, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TripTicketModal({ open, setOpen, selectedTripData }) {
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

    const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false); // State for passenger manifest modal

    useEffect(() => {
        if (selectedTripData) {
            const passengerCount = selectedTripData.passengers?.length || 0;

            // Function to convert numbers to words (supports up to 10 for simplicity)
            const numberToWords = (num) => {
                const words = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
                return words[num] || num.toString(); // Fallback for larger numbers
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
        }
    }, [selectedTripData]);

    const totalFee =
        (tripData.fees?.baseFee || 0) +
        (tripData.fees?.additionalFee?.amount || 0) +
        (tripData.fees?.passengerInsurance || 0) +
        (tripData.fees?.others || 0);

    return (
        <>
            {/* Trip Ticket Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="overflow-hidden rounded-lg border-2 border-indigo-100 p-0 sm:max-w-[700px]">
                    <div className="overflow-hidden rounded-lg bg-white">
                        {/* Action Buttons */}
                        <div className="grid grid-cols-3 gap-3 bg-gray-50 p-4">
                            <Button
                                className="flex items-center justify-center gap-2 rounded-md bg-indigo-800 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                onClick={() => setIsPassengerModalOpen(true)} // Open passenger manifest modal
                            >
                                <FileText size={16} /> View passenger manifest
                            </Button>
                            <Button className="flex items-center justify-center gap-2 rounded-md bg-indigo-800 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                                <Download size={16} /> Download Trip Ticket
                            </Button>
                            <Button
                                className="flex items-center justify-center gap-2 rounded-md bg-indigo-800 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                onClick={() => setOpen(false)}
                            >
                                <X size={16} /> Close
                            </Button>
                        </div>

                        {/* Ticket Content */}
                        <div className="p-6">
                            <h2 className="text-lg font-bold text-indigo-800">{tripData.company || ''}</h2>

                            <div className="mb-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
                                {tripData.operator && (
                                    <p>
                                        <span className="font-semibold text-black">Operator:</span> {tripData.operator}
                                    </p>
                                )}
                                {tripData.ticketId && (
                                    <p>
                                        <span className="font-semibold text-black">Ticket ID:</span> {tripData.ticketId}
                                    </p>
                                )}
                                {tripData.billingId && (
                                    <p>
                                        <span className="font-semibold text-black">Billing ID:</span> {tripData.billingId}
                                    </p>
                                )}
                            </div>

                            {/* Trip Details */}
                            <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                                {tripData.driver && (
                                    <p>
                                        <span className="font-semibold text-black">Driver:</span> {tripData.driver}
                                    </p>
                                )}
                                {tripData.unit && (
                                    <p>
                                        <span className="font-semibold text-black">Unit:</span> {tripData.unit}
                                    </p>
                                )}
                                {tripData.plate && (
                                    <p>
                                        <span className="font-semibold text-black">Plate:</span> {tripData.plate}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                                {tripData.applicationDate && (
                                    <p>
                                        <span className="font-semibold text-black">Application Date:</span> {tripData.applicationDate}
                                    </p>
                                )}
                                {tripData.totalPassengers?.number && (
                                    <p>
                                        <span className="font-semibold text-black">Total Passengers:</span> {tripData.totalPassengers.number} (
                                        {tripData.totalPassengers.text})
                                    </p>
                                )}
                            </div>

                            <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                                {tripData.tripType && (
                                    <p>
                                        <span className="font-semibold text-black">Trip Type:</span> {tripData.tripType}
                                    </p>
                                )}
                                {tripData.pickup?.dateTime && (
                                    <p>
                                        <span className="font-semibold text-black">Pick-up Date and Time:</span> {tripData.pickup.dateTime}
                                    </p>
                                )}
                                {tripData.dropoff?.dateTime && (
                                    <p>
                                        <span className="font-semibold text-black">Drop-off Date and Time:</span> {tripData.dropoff.dateTime}
                                    </p>
                                )}
                            </div>

                            <div className="mb-8 grid grid-cols-2 gap-4 text-sm text-gray-600">
                                {tripData.pickup?.address && (
                                    <p>
                                        <span className="font-semibold text-black">Pick-up Address:</span> {tripData.pickup.address}
                                    </p>
                                )}
                                {tripData.dropoff?.address && (
                                    <p>
                                        <span className="font-semibold text-black">Drop-off Address:</span> {tripData.dropoff.address}
                                    </p>
                                )}
                            </div>

                            {/* Fee Breakdown */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-end">
                                    <div className="w-full max-w-xs text-sm text-gray-600">
                                        {tripData.fees?.baseFee && (
                                            <p className="flex justify-between">
                                                <span className="font-semibold">Base Fee:</span> Php {tripData.fees.baseFee.toFixed(2)}
                                            </p>
                                        )}
                                        {tripData.fees?.additionalFee?.amount && (
                                            <p className="flex justify-between">
                                                <span className="font-semibold">Additional Fee ({tripData.fees.additionalFee.description}):</span> Php{' '}
                                                {tripData.fees.additionalFee.amount.toFixed(2)}
                                            </p>
                                        )}
                                        {tripData.fees?.passengerInsurance && (
                                            <p className="flex justify-between">
                                                <span className="font-semibold">Passenger Insurance:</span> Php{' '}
                                                {tripData.fees.passengerInsurance.toFixed(2)}
                                            </p>
                                        )}
                                        {tripData.fees?.others && (
                                            <p className="flex justify-between">
                                                <span className="font-semibold">Others:</span> Php {tripData.fees.others.toFixed(2)}
                                            </p>
                                        )}
                                        <p className="mt-2 flex justify-between border-t border-gray-300 pt-2 text-base font-bold text-black">
                                            <span>Total:</span> Php {totalFee.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Passenger Manifest Modal */}
            <Dialog open={isPassengerModalOpen} onOpenChange={setIsPassengerModalOpen}>
                <DialogContent className="overflow-hidden rounded-lg border-2 border-indigo-100 p-0 sm:max-w-[700px]">
                    <div className="overflow-hidden rounded-lg bg-white">
                        {/* Modal Header */}
                        <div className="border-b bg-gray-50 p-4">
                            <h2 className="text-lg font-bold text-indigo-800">Passenger Manifest</h2>
                        </div>

                        {/* Passenger List */}
                        <div className="p-6">
                            {selectedTripData?.passengers?.length > 0 ? (
                                <div className="space-y-4">
                                    {selectedTripData.passengers.map((passenger, index) => (
                                        <div key={index} className="rounded-lg border p-4">
                                            <p className="font-semibold">
                                                {passenger.FirstName} {passenger.LastName}
                                            </p>
                                            <p>Contact Number: {passenger.ContactNumber}</p>
                                            <p>Address: {passenger.Address}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No passengers found.</p>
                            )}
                        </div>

                        {/* Close Button */}
                        <div className="border-t bg-gray-50 p-4">
                            <Button
                                className="flex items-center justify-center gap-2 rounded-md bg-indigo-800 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                onClick={() => setIsPassengerModalOpen(false)}
                            >
                                <X size={16} /> Close
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
