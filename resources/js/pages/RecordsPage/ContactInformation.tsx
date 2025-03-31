import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CreateVrContacts from '../create-vr-contacts';
import { router } from "@inertiajs/react";
import { useEffect } from 'react';

export default function ContactInformation({ contactsData, handleContactChange, handleContactsUpdate, companies }) {

    if (contactsData.length === 0) return <CreateVrContacts companies={companies} isButtonDisabled={false} isEditing2={true} />;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Details of Organizational hierarchy</CardDescription>
            </CardHeader>
            <CardContent>
                {contactsData.map((contact, index) => (
                    <div key={contact.id || index} className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor={`contact-company-name-${index}`}>Company Name</Label>
                            <Input id={`contact-company-name-${index}`} value={contact.vr_company_id || 'No company name provided'} readOnly />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`contact-email-${index}`}>Email</Label>
                            <Input id={`contact-email-${index}`} name="email" value={contact.email || 'No email provided'} onChange={(e) => handleContactChange(index, e)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`contact-last-name-${index}`}>Last Name</Label>
                            <Input id={`contact-last-name-${index}`} name="LastName" value={contact.LastName || 'No last name provided'} onChange={(e) => handleContactChange(index, e)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`contact-first-name-${index}`}>First Name</Label>
                            <Input id={`contact-first-name-${index}`} name="FirstName" value={contact.FirstName || 'No first name provided'} onChange={(e) => handleContactChange(index, e)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`contact-middle-name-${index}`}>Middle Name</Label>
                            <Input id={`contact-middle-name-${index}`} name="MiddleName" value={contact.MiddleName || 'No middle name provided'} onChange={(e) => handleContactChange(index, e)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`position-${index}`}>Position</Label>
                            <Input id={`position-${index}`} name="Position" value={contact.Position || 'No position provided'} onChange={(e) => handleContactChange(index, e)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`contact-number-${index}`}>Contact Number</Label>
                            <Input id={`contact-number-${index}`} name="ContactNumber" value={contact.ContactNumber || 'No contact number provided'} onChange={(e) => handleContactChange(index, e)} />
                        </div>
                    </div>
                ))}
                <Button onClick={handleContactsUpdate} className="mt-4">
                    Update Contacts
                </Button>
            </CardContent>
        </Card>
    );
}
