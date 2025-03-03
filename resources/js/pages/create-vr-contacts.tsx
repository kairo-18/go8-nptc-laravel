import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';

export default function CreateVrContacts({ companies }) {
    const { data, setData, post, processing, errors } = useForm({
        contacts: [
            {
                vr_company_id: '',
                email: '',
                ContactNumber: '',
                LastName: '',
                FirstName: '',
                MiddleName: '',
                Position: '',
            },
        ],
    });

    const breadcrumbs = [
        {
            title: 'VR Contacts',
            href: '/create-vr-contacts',
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('vr-contacts.store-multiple'), {
            onSuccess: () => {
                setData('contacts', [
                    {
                        vr_company_id: '',
                        email: '',
                        ContactNumber: '',
                        LastName: '',
                        FirstName: '',
                        MiddleName: '',
                        Position: '',
                    },
                ]);
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    const addContact = () => {
        setData('contacts', [
            ...data.contacts,
            {
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
                <h1 className="text-2xl font-semibold">Create Vehicle Rental Contacts</h1>
                <p className="text-gray-500">Manage the contact information of the vehicle rental company.</p>
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
                                                        {company.CompanyName}
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
                                <Button type="submit" disabled={processing} className="bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700">
                                    {processing ? 'Submitting...' : 'Submit'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
    );
    
}
