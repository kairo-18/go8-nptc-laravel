import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Operator, Owner, VR } from './Pending';

interface OperatorDetailsProps {
    operator: Operator;
    vr: VR;
    owner: Owner;
    onBack: () => void;
}

export const OperatorDetails = ({ operator, owner, vr, onBack }: OperatorDetailsProps) => {
    const StatusButton = ({ color, text, onClick }: { color: 'red' | 'green'; text: string; onClick?: () => void }) => {
        const colorClasses = {
            red: 'border-red-500 text-red-500 hover:bg-red-50',
            green: 'border-green-500 text-green-500 hover:bg-green-50',
        };
        return (
            <Button className={`rounded-sm border bg-transparent px-4 py-2 text-sm ${colorClasses[color]}`} onClick={onClick}>
                {text}
            </Button>
        );
    };

    const RejectButtonDialog = () => {
        const handleReject = () => {
            console.log('Application rejected');
        };

        return (
            <Dialog>
                <DialogTrigger asChild>
                    <StatusButton color="red" text="Reject and add notes" />
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogTitle className="text-lg text-red-500">Reject application</DialogTitle>
                    <DialogDescription>Are you sure you want to reject this application?</DialogDescription>
                    <Textarea placeholder="Let them know why you rejected their application. Type your message here." rows={4} />
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button
                                variant="secondary"
                                className="border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-600"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleReject} className="bg-red-500 text-white hover:bg-red-600">
                            Reject and send
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    const ApproveButtonDialog = () => {
        const handleApprove = () => {
            console.log('Application approved');
        };

        return (
            <Dialog>
                <DialogTrigger asChild>
                    <StatusButton color="green" text="Approve and prompt for payment" />
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogTitle className="text-lg text-green-500">Approve application</DialogTitle>
                    <DialogDescription>Success! The billing will be automatically sent to the VR’s mail in a few moments.</DialogDescription>

                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button
                                variant="secondary"
                                className="border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-600"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="primary" onClick={handleApprove} className="bg-green-500 text-white hover:bg-green-600">
                            Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    const OwnerInfoSection = ({ owner }: { owner: Owner }) => (
        <div className="mt-5 rounded-sm border border-gray-300 p-2">
            <h3 className="ml-2 text-lg font-semibold">Owner Information</h3>
            <p className="ml-2 text-sm text-gray-500">Details of the Company Owner</p>
            <Separator className="my-2" />

            <div className="m-2">
                <div className="grid grid-cols-2 gap-4">
                    <div className="w-full">
                        <Label>Company Name</Label>
                        <Input disabled className="w-full" placeholder="Nokarin" />
                    </div>
                    <div className="w-full">
                        <Label>Email</Label>
                        <Input disabled className="w-full" type="email" placeholder={owner.Email} />
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                    <div>
                        <Label>Last Name</Label>
                        <Input disabled placeholder={owner.LastName} />
                    </div>
                    <div>
                        <Label>First Name</Label>
                        <Input placeholder={owner.FirstName} disabled />
                    </div>
                    <div>
                        <Label>Middle Name</Label>
                        <Input placeholder={owner.MiddleName} disabled />
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <Label>BirthDate</Label>
                            <Input placeholder="January" disabled />
                        </div>
                        <div>
                            <Label>&nbsp;</Label>
                            <Input placeholder="1" disabled />
                        </div>
                        <div>
                            <Label>&nbsp;</Label>
                            <Input placeholder="1987" disabled />
                        </div>
                    </div>
                    <div>
                        <Label>Contact Number</Label>
                        <Input placeholder={owner.ContactNumber} disabled />
                    </div>
                </div>

                <div className="mt-4">
                    <Label>Address</Label>
                    <Input placeholder={owner.Address} disabled />
                </div>
            </div>
        </div>
    );

    const CompanyInfoSection = ({ vr }: { vr: VR }) => (
        <div className="mt-5 rounded-sm border border-gray-300 p-2">
            <h3 className="ml-2 text-lg font-semibold">Company Information</h3>
            <p className="ml-2 text-sm text-gray-500">Details of Vehicle Rental Company Owner</p>
            <Separator className="my-2" />

            <div className="m-2 mt-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="w-full">
                        <Label>DTI or SEC Permit</Label>
                        <div className="relative w-full">
                            <Input disabled className="w-full pr-16" placeholder={vr.DTI_Permit} />
                            <PreviewButton imageUrl={vr.DTI_Permit} className="absolute top-0 right-0 z-10 bg-white" />
                        </div>
                    </div>
                    <div className="w-full">
                        <Label>BIR 2303</Label>
                        <div className="relative w-full">
                            <Input disabled className="w-full pr-16" placeholder={vr.BIR_2303} />
                            <PreviewButton imageUrl={vr.BIR_2303} />
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="w-full">
                        <Label>Business Permit</Label>
                        <div className="relative w-full">
                            <Input disabled className="w-full pr-16" placeholder={vr.BusinessPermit} />
                            <PreviewButton imageUrl={vr.BusinessPermit} />
                        </div>
                    </div>
                    <div className="w-full">
                        <Label>Brand Logo</Label>
                        <div className="relative w-full">
                            <Input disabled className="w-full pr-16" placeholder={vr.BrandLogo} />
                            <PreviewButton imageUrl={vr.BrandLogo} />
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="w-full">
                        <Label>Business Permit Number</Label>
                        <div className="relative w-full">
                            <Input disabled className="w-full pr-16" placeholder={vr.BusinessPermitNumber} />
                        </div>
                    </div>
                    <div className="w-full">
                        <Label>Samples Sales Invoice</Label>
                        <div className="relative w-full">
                            <Input disabled className="w-full pr-16" placeholder={vr.SalesInvoice} />
                            <PreviewButton imageUrl={vr.SalesInvoice} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const ContactInfoSection = ({ vr }: { vr: VR }) => (
        <div className="mt-5 rounded-sm border border-gray-300 p-2">
            <h3 className="ml-2 text-lg font-semibold">Contact Information</h3>
            <p className="ml-2 text-sm text-gray-500">Details of the Organizational hierarchy</p>
            <Separator className="my-2" />

            <div className="m-2">
                <div className="grid grid-cols-2 gap-4">
                    <div className="w-full">
                        <Label>Company Name</Label>
                        <Input disabled className="w-full" placeholder={vr.CompanyName} />
                    </div>
                    <div className="w-full">
                        <Label>Email</Label>
                        <Input disabled className="w-full" placeholder={vr.Email} />
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                    <div>
                        <Label>Last Name</Label>
                        <Input placeholder={vr.LastName} disabled />
                    </div>
                    <div>
                        <Label>First Name</Label>
                        <Input placeholder={vr.FirstName} disabled />
                    </div>
                    <div>
                        <Label>Middle Name</Label>
                        <Input placeholder={vr.MiddleName} disabled />
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="w-full">
                        <Label>Position</Label>
                        <Input disabled className="w-full" placeholder={vr.Position} />
                    </div>
                    <div className="w-full">
                        <Label>Contact Number</Label>
                        <Input disabled className="w-full" placeholder={vr.ContactNumber} />
                    </div>
                </div>
            </div>
        </div>
    );

    const PreviewButton = ({ imageUrl }: { imageUrl: string }) => {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="absolute top-1/2 right-2 h-7 -translate-y-1/2 border border-blue-500 bg-white px-10 text-sm text-blue-500 hover:bg-blue-50"
                    >
                        Preview
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogTitle className="text-lg font-semibold">Image Preview</DialogTitle>
                    <DialogDescription>Here is the `preview` of the image.</DialogDescription>
                    <div className="mt-2 flex items-center justify-center">
                        <img src={imageUrl} alt="Preview" className="h-auto max-h-[400px] w-auto max-w-[400px] rounded-lg" />
                    </div>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button
                                variant="secondary"
                                className="border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-600"
                            >
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <div className="rounded-sm border border-gray-300 p-5">
            <div>
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Operator Info</h4>
                <p className="text-sm text-gray-600">Details of Operator Info</p>
                <div className="mt-3 flex items-center justify-between space-x-5 rounded-sm border border-gray-300 p-5">
                    <div className="flex space-x-4">
                        <Avatar className="h-25 w-25 rounded-sm border border-gray-300">
                            <AvatarImage
                                src="https://ih1.redbubble.net/image.5497566438.4165/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg"
                                alt="AvatarProfile"
                            />
                            <AvatarFallback className="rounded-lg bg-neutral-200 text-5xl text-black dark:bg-neutral-700 dark:text-white">
                                {operator.FirstName?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col leading-tight">
                            <h2 className="font-bold">
                                {operator.FirstName} {operator.MiddleName ? operator.MiddleName + ' ' : ''}
                                {operator.LastName}
                            </h2>
                            <p className="text-sm text-gray-600">Operator</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RejectButtonDialog />
                        <ApproveButtonDialog />
                    </div>
                </div>

                <OwnerInfoSection owner={owner} />

                <CompanyInfoSection vr={vr} />

                <ContactInfoSection vr={vr} />
            </div>
        </div>
    );
};
