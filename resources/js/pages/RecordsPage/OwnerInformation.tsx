import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CreateVrAdmin from '../create-vr-admin';

export default function OwnerInformation({ adminData, handleAdminChange, handleAdminUpdate, companies }) {
    if (!adminData) return <CreateVrAdmin companies={companies} isButtonDisabled={false} isEditing={false} isEditing2={true} />;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Owner Information</CardTitle>
                <CardDescription>Details of the Company Owner</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" value={adminData?.email || 'No email provided'} onChange={handleAdminChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" name="LastName" value={adminData?.LastName || 'No last name provided'} onChange={handleAdminChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" name="FirstName" value={adminData?.FirstName || 'No first name provided'} onChange={handleAdminChange} />
                    </div>
                    <div className="md:col-span-2">
                        <Label className="mb-2 block">BirthDate</Label>
                        <div className="flex gap-2">
                            <Input
                                value={adminData?.BirthDate ? new Date(adminData.BirthDate).toLocaleString('default', { month: 'long' }) : 'Month'}
                                readOnly
                            />
                            <Input value={adminData?.BirthDate ? new Date(adminData.BirthDate).getDate() : 'Day'} readOnly />
                            <Input value={adminData?.BirthDate ? new Date(adminData.BirthDate).getFullYear() : 'Year'} readOnly />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact-number">Contact Number</Label>
                        <Input id="contact-number" name="ContactNumber" value={adminData?.ContactNumber || 'No contact number provided'} onChange={handleAdminChange} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="Address" value={adminData?.Address || 'No address provided'} onChange={handleAdminChange} />
                    </div>
                </div>
                <Button onClick={handleAdminUpdate} className="mt-4">
                    Update Admin
                </Button>
            </CardContent>
        </Card>
    );
}