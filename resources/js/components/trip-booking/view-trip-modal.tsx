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

    const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false); // State for passenger manifest modal
    const [TripQr, setTripQr] = useState([]);

    useEffect(() => {
        if (selectedTripData) {
            const passengerCount = selectedTripData.passengers?.length || 0;

            // Function to convert numbers to words (supports up to 10 for simplicity)
            const numberToWords = (num: number) => {
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

            console.log('hotdog');
            const fetchQrCode = async () => {
                try {
                    const response = await axios.get(`/api/generate-qr/${selectedTripData.id}`);
                    console.log(response.data); // Handle your QR code here
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
            {/* Trip Ticket Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="overflow-hidden rounded-lg border-2 pt-3 sm:max-w-[900px]">
                    <div className="overflow-hidden rounded-lg bg-white">
                        {/* Ticket Content */}
                        <div className="p-6">
                            <h2 className="mb-3 text-xl font-bold text-indigo-800">{tripData.company || ''}</h2>

                            {/* Adjust grid layout to horizontal view with two columns */}
                            <div className="mb-6 grid grid-cols-1 gap-4 text-sm text-gray-600 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {tripData.operator && (
                                    <p className="flex flex-col gap-1">
                                        <span className="font-semibold text-gray-600">Operator:</span>
                                        <span className="font-semibold text-black">{tripData.operator}</span>
                                    </p>
                                )}
                                {tripData.ticketId && (
                                    <p className="flex flex-col gap-1">
                                        <span className="font-semibold text-gray-600">Ticket ID:</span>
                                        <span className="font-semibold text-black">{tripData.ticketId}</span>
                                    </p>
                                )}
                                {tripData.billingId && (
                                    <p className="flex flex-col gap-1">
                                        <span className="font-semibold text-gray-600">Billing ID:</span>
                                        <span className="font-semibold text-black">{tripData.billingId}</span>
                                    </p>
                                )}
                                {tripData.driver && (
                                    <p className="flex flex-col gap-1">
                                        <span className="font-semibold text-gray-600">Driver:</span>
                                        <span className="font-semibold text-black">{tripData.driver}</span>
                                    </p>
                                )}
                                {tripData.unit && (
                                    <p className="flex flex-col gap-1">
                                        <span className="font-semibold text-gray-600">Unit:</span>
                                        <span className="font-semibold text-black">{tripData.unit}</span>
                                    </p>
                                )}
                                {tripData.plate && (
                                    <p className="flex flex-col gap-1">
                                        <span className="font-semibold text-gray-600">Plate:</span>
                                        <span className="font-semibold text-black">{tripData.plate}</span>
                                    </p>
                                )}
                                {tripData.applicationDate && (
                                    <p className="flex flex-col gap-1">
                                        <span className="font-semibold text-gray-600">Application Date:</span>
                                        <span className="font-semibold text-black">{tripData.applicationDate}</span>
                                    </p>
                                )}
                                {tripData.totalPassengers?.number && (
                                    <p className="flex flex-col gap-1">
                                        <span className="font-semibold text-gray-600">Total Passengers:</span>
                                        <span className="font-semibold text-black">
                                            {tripData.totalPassengers.number} ({tripData.totalPassengers.text})
                                        </span>
                                    </p>
                                )}
                                {tripData.tripType && (
                                    <p className="flex flex-col gap-1">
                                        <span className="font-semibold text-gray-600">Trip Type:</span>
                                        <span className="font-semibold text-black">{tripData.tripType}</span>
                                    </p>
                                )}
                                {tripData.pickup?.dateTime && (
                                    <p className="flex flex-col gap-1">
                                        <span className="font-semibold text-gray-600">Pick-up Date and Time:</span>
                                        <span className="font-semibold text-black">{tripData.pickup.dateTime}</span>
                                    </p>
                                )}
                                {tripData.dropoff?.dateTime && (
                                    <p className="flex flex-col gap-1">
                                        <span className="font-semibold text-gray-600">Drop-off Date and Time:</span>
                                        <span className="font-semibold text-black">{tripData.dropoff.dateTime}</span>
                                    </p>
                                )}
                                {tripData.pickup?.address && (
                                    <p className="flex flex-col gap-1">
                                        <span className="font-semibold text-gray-600">Pick-up Address:</span>
                                        <span className="font-semibold text-black">{tripData.pickup.address}</span>
                                    </p>
                                )}
                                {tripData.dropoff?.address && (
                                    <p className="flex flex-col gap-1">
                                        <span className="font-semibold text-gray-600">Drop-off Address:</span>
                                        <span className="font-semibold text-black">{tripData.dropoff.address}</span>
                                    </p>
                                )}
                            </div>

                            {/* Fee Breakdown */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between">
                                    <div className="w-full text-sm text-gray-600">
                                        {tripData.fees?.baseFee && (
                                            <p className="flex justify-between">
                                                <span className="font-semibold text-gray-600">Base Fee:</span>
                                                <span className="font-bold text-black">Php {tripData.fees.baseFee.toFixed(2)}</span>
                                            </p>
                                        )}
                                        {tripData.fees?.additionalFee?.amount && (
                                            <p className="flex justify-between">
                                                <span className="font-semibold text-gray-600">
                                                    Additional Fee ({tripData.fees.additionalFee.description}):
                                                </span>
                                                <span className="font-bold text-black">Php {tripData.fees.additionalFee.amount.toFixed(2)}</span>
                                            </p>
                                        )}
                                        {tripData.fees?.passengerInsurance && (
                                            <p className="flex justify-between">
                                                <span className="font-semibold text-gray-600">Passenger Insurance:</span>
                                                <span className="font-bold text-black">Php {tripData.fees.passengerInsurance.toFixed(2)}</span>
                                            </p>
                                        )}
                                        {tripData.fees?.others && (
                                            <p className="flex justify-between">
                                                <span className="font-semibold text-gray-600">Others:</span>
                                                <span className="font-bold text-black">Php {tripData.fees.others.toFixed(2)}</span>
                                            </p>
                                        )}
                                        <p className="mt-2 flex justify-between border-t border-gray-300 pt-2 text-base">
                                            <span className="text-lg font-semibold text-gray-600">Total:</span>
                                            <span className="text-lg font-bold text-black">Php {totalFee.toFixed(2)}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 gap-3 p-4">
                            <Button
                                className="flex items-center justify-center gap-2 rounded-md bg-indigo-800 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                onClick={() => setIsPassengerModalOpen(true)}
                            >
                                <FileText size={16} /> View passenger manifest
                            </Button>
                            <Button
                                className="flex items-center justify-center gap-2 rounded-md bg-indigo-800 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                onClick={() => window.open(`/trip-ticket/download/${selectedTripData?.id}`, '_blank')}
                            >
                                <Download size={16} /> Download Trip Ticket
                            </Button>
                            <img src={TripQr} alt="QR" className="mx-auto w-full max-w-[200px]" />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Passenger Manifest Modal */}
            <Dialog open={isPassengerModalOpen} onOpenChange={setIsPassengerModalOpen}>
                <DialogContent className="overflow-hidden rounded-lg border-2 border-indigo-100 p-0 sm:max-w-[900px]">
                    <div className="overflow-hidden rounded-lg bg-white">
                        {/* Modal Header */}
                        <div className="border-b bg-gray-50 p-4">
                            <h2 className="text-lg font-bold text-indigo-800">Passenger Manifest</h2>
                        </div>

                        {/* Passenger List */}
                        <div className="p-6">
                            {selectedTripData?.passengers?.length > 0 ? (
                                <div className="space-y-4">
                                    {selectedTripData.passengers.map((passenger: any, index: number) => (
                                        <div key={index} className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2 lg:grid-cols-3">
                                            <div className="flex flex-col gap-1">
                                                <div className="text-gray-600">Contact</div>
                                                <div className="font-bold">{passenger.ContactNumber}</div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="text-gray-600">Last Name</div>
                                                <div className="font-bold">{passenger.LastName}</div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="text-gray-600">First Name</div>
                                                <div className="font-bold">{passenger.FirstName}</div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="text-gray-600">Address</div>
                                                <div className="font-bold">{passenger.Address}</div>
                                            </div>
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
