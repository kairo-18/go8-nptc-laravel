import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface CreateVrContactsProps {
    companies: { id: number; BusinessPermitNumber: string }[];
    onNextTab: () => void;
    isTitleDisabled: boolean;
    isButtonDisabled: boolean;
    setContactsData: (data: any) => void;
    contactsData: any;
    isEditing: boolean;
    onSubmitRef?: (submitFn: () => void) => void;
}

export default function CreateVrContacts({ companies, onNextTab, isTitleDisabled, isButtonDisabled, setContactsData, contactsData, isEditing, onSubmitRef}: CreateVrContactsProps) {
    const { data, setData, post, patch } = useForm({
        contacts: contactsData?.contacts.map(contact => ({
            id: contact.id || null, // Include the `id` field for existing contacts
            vr_company_id: contact.vr_company_id || '',
            email: contact.email || '',
            ContactNumber: contact.ContactNumber || '',
            LastName: contact.LastName || '',
            FirstName: contact.FirstName || '',
            MiddleName: contact.MiddleName || '',
            Position: contact.Position || '',
        })) || [{
            id: null, // Default `id` for new contacts
            vr_company_id: '',
            email: '',
            ContactNumber: '',
            LastName: '',
            FirstName: '',
            MiddleName: '',
            Position: '',
        }],
    });


    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (isEditing && contactsData) {
            setData({
                contacts: contactsData.contacts, // Populate the form with existing contacts data
            });
        }
    }, [isEditing, contactsData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        if (isEditing) {
            patch(route('vr-contacts.update-multiple'), {
                contacts: data.contacts, // Send the `contacts` array directly
                onSuccess: () => {
                    setContactsData(data);
                    onNextTab();
                },
                onError: (errors) => {
                    setErrors(errors);
                    setProcessing(false);
                },
            });
        } else {
            post(route('vr-contacts.store-multiple'), {
                contacts: data.contacts, // Send the `contacts` array directly
                onSuccess: () => {
                    setContactsData(data);
                    onNextTab();
                },
                onError: (errors) => {
                    setErrors(errors);
                    setProcessing(false);
                },
            });
        }
    };

    // Notify parent when form data changes
    useEffect(() => {
        if (setContactsData) {
            setContactsData(data);
        }
    }, [data, setContactsData]);

    useEffect(() => {
        if (onSubmitRef) {
            onSubmitRef(() => handleSubmit({ preventDefault: () => {} } as React.FormEvent));
        }
    }, [handleSubmit]);

    const addContact = () => {
        setData('contacts', [
            ...data.contacts,
            {
                id: null, // Ensure `id` is included for new contacts
                vr_company_id: '',
                email: '',
                ContactNumber: '',
                LastName: '',
                FirstName: '',
                MiddleName: '',
                Position: '',
            },
        ]);
    };

    const updateContact = (index, field, value) => {
        const newContacts = [...data.contacts];
        newContacts[index][field] = value;
        setData('contacts', newContacts);
    };

    return (
        <div className="mx-auto mt-6 w-full max-w-6xl">
            {isTitleDisabled === false ? (
                <>
                    <h1 className="text-2xl font-semibold">Create Vehicle Rental Contacts</h1>
                    <p className="text-gray-500">Manage the contact information of the vehicle rental company.</p>
                </>
            ) : null}
            <Card className="mt-6 shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                    <p className="text-sm text-gray-500">Details of the Vehicle Rental Contacts</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {data.contacts.map((contact, index) => (
                            <div key={index} className="space-y-4 border-b pb-4">
                                <div>
                                    <Label htmlFor={`vr_company_id_${index}`}>Select VR Company</Label>
                                    <Select
                                        value={String(contact.vr_company_id)}
                                        onValueChange={(value) => updateContact(index, 'vr_company_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companies.map((company) => (
                                                <SelectItem key={company.id} value={String(company.id)}>
                                                    {company.BusinessPermitNumber}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors[`contacts.${index}.vr_company_id`] && (
                                        <p className="text-sm text-red-500">{errors[`contacts.${index}.vr_company_id`]}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor={`email_${index}`}>Email</Label>
                                        <Input
                                            id={`email_${index}`}
                                            type="email"
                                            value={contact.email}
                                            onChange={(e) => updateContact(index, 'email', e.target.value)}
                                        />
                                        {errors[`contacts.${index}.email`] && (
                                            <p className="text-sm text-red-500">{errors[`contacts.${index}.email`]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor={`ContactNumber_${index}`}>Contact Number</Label>
                                        <Input
                                            id={`ContactNumber_${index}`}
                                            value={contact.ContactNumber}
                                            onChange={(e) => updateContact(index, 'ContactNumber', e.target.value)}
                                        />
                                        {errors[`contacts.${index}.ContactNumber`] && (
                                            <p className="text-sm text-red-500">{errors[`contacts.${index}.ContactNumber`]}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor={`LastName_${index}`}>Last Name</Label>
                                        <Input
                                            id={`LastName_${index}`}
                                            value={contact.LastName}
                                            onChange={(e) => updateContact(index, 'LastName', e.target.value)}
                                        />
                                        {errors[`contacts.${index}.LastName`] && (
                                            <p className="text-sm text-red-500">{errors[`contacts.${index}.LastName`]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor={`FirstName_${index}`}>First Name</Label>
                                        <Input
                                            id={`FirstName_${index}`}
                                            value={contact.FirstName}
                                            onChange={(e) => updateContact(index, 'FirstName', e.target.value)}
                                        />
                                        {errors[`contacts.${index}.FirstName`] && (
                                            <p className="text-sm text-red-500">{errors[`contacts.${index}.FirstName`]}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor={`MiddleName_${index}`}>Middle Name</Label>
                                        <Input
                                            id={`MiddleName_${index}`}
                                            value={contact.MiddleName}
                                            onChange={(e) => updateContact(index, 'MiddleName', e.target.value)}
                                        />
                                        {errors[`contacts.${index}.MiddleName`] && (
                                            <p className="text-sm text-red-500">{errors[`contacts.${index}.MiddleName`]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor={`Position_${index}`}>Position</Label>
                                        <Input
                                            id={`Position_${index}`}
                                            value={contact.Position}
                                            onChange={(e) => updateContact(index, 'Position', e.target.value)}
                                        />
                                        {errors[`contacts.${index}.Position`] && (
                                            <p className="text-sm text-red-500">{errors[`contacts.${index}.Position`]}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-between">
                            <Button type="button" onClick={addContact} className="bg-green-600 px-6 py-2 text-white hover:bg-green-700">
                                Add Another Contact
                            </Button>
                            {isButtonDisabled === false ? (
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing} className="bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700">
                                        {processing ? 'Submitting...' : 'Submit'}
                                    </Button>
                                </div>
                            ) : null}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
