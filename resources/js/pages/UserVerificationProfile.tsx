import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import NPTCLogo from '../../../public/assets/NPTCLogo.png';

function Info({ label, value }) {
    return (
        <div className="space-y-1">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-base font-medium text-gray-900">{value}</p>
        </div>
    );
}

export default function UserVerificationProfile({ user, media_files, company, status }) {
    const [showLicenseModal, setShowLicenseModal] = useState(false);
    const [showCertificateModal, setShowCertificateModal] = useState(false);

    const driver = user?.driver;
    const vehicle = driver?.vehicle?.[0]; // vehicle is an array
    const licenseMedia = media_files?.find((m) => m.collection_name === 'license');
    const certificateMedia = media_files?.find((m) => m.collection_name === 'nbi_clearance');
    const photoMedia = media_files?.find((m) => m.collection_name === 'photo');

    return (
        <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="p-4 md:p-10">
                {/* Header Section */}
                <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex items-center gap-4">
                        <div className="text-center md:text-left">
                            <img src={NPTCLogo} alt="NPTC Logo" className="mx-auto h-20 w-50" />
                            <h1 className="text-2xl font-bold md:text-3xl">National Public Transport Coalition</h1>
                            <p className="text-lg md:text-xl">Verification Portal</p>
                        </div>
                    </div>
                </div>

                {/* Driver Badge */}
                <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-[#2a2a92] px-8 py-2 text-xl text-white">Driver</div>
                </div>

                {/* Approved Status */}
                <p className="mb-6 text-center md:text-left">Approved and verified on April 2, 2025</p>

                {/* Main Info Section */}
                <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="flex flex-col items-center">
                        <img
                            src={photoMedia?.url ?? '/placeholder.svg?height=300&width=300'}
                            alt="Driver Photo"
                            className="mb-4 aspect-[3/4] w-full max-w-[250px] rounded-md object-cover"
                        />
                        <p className="text-xl font-semibold">{driver?.NPTC_ID || 'DR-0000'}</p>
                        <div className="mt-4 w-full space-y-2">
                            <Button className="w-full bg-[#2a2a92] hover:bg-[#2a2a92]/90" onClick={() => setShowLicenseModal(true)}>
                                View License
                            </Button>
                            {/*
                                <Button className="w-full bg-[#2a2a92] hover:bg-[#2a2a92]/90" onClick={() => setShowCertificateModal(true)}>
                                    View NPTC Certificate
                                </Button>
                            */}
                        </div>
                    </div>

                    <div className="space-y-6 md:col-span-2">
                        <div className="flex justify-center md:justify-start">
                            <div className="rounded-full bg-[#00ba22] px-6 py-2 text-lg text-white">{status}</div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Info label="Parent VR Company" value={company} />
                            <Info label="Surname" value={user?.LastName} />
                            <Info label="First Name" value={user?.FirstName} />
                            <Info label="Middle Name" value={user?.MiddleName} />
                            <Info label="Birth Date" value={user?.BirthDate} />
                            <Info label="Vehicle Assignment" value={vehicle?.Model} />
                            <Info label="Plate" value={vehicle?.PlateNumber} />
                            <div className="md:col-span-2">
                                <Info label="Address" value={user?.Address} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* License Modal */}
            <Dialog open={showLicenseModal} onOpenChange={setShowLicenseModal}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Driver License</DialogTitle>
                        <DialogDescription>Preview of uploaded license document</DialogDescription>
                    </DialogHeader>
                    <div className="w-full">
                        <img src={licenseMedia?.url} alt="Driver License" className="w-full rounded-md object-contain" />
                    </div>
                </DialogContent>
            </Dialog>

            {/*
                <Dialog open={showCertificateModal} onOpenChange={setShowCertificateModal}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>NPTC Certificate</DialogTitle>
                            <DialogDescription>This will show the NPTC certificate when available</DialogDescription>
                        </DialogHeader>
                        <div className="w-full">
                            <img src="/placeholder-certificate.jpg" alt="NPTC Certificate" className="w-full rounded-md object-contain" />
                        </div>
                    </DialogContent>
                </Dialog>
            */}
        </div>
    );
}
