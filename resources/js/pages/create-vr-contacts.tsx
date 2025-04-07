import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

interface CreateVrContactsProps {
    companies: { id: number; BusinessPermitNumber: string }[];
    onNextTab: () => void;
    isTitleDisabled: boolean;
    isButtonDisabled: boolean;
    setContactsData: (data: any) => void;
    contactsData: any;
    companyData: any;
    isEditing: boolean;
    isEditing2: boolean;
    onSubmitRef?: (submitFn: () => void) => void;
    handleTabSwitch: (tab: string) => void;
}

export default function CreateVrContacts({
    companies,
    onNextTab,
    isTitleDisabled,
    isButtonDisabled,
    setContactsData,
    contactsData,
    companyData,
    isEditing,
    isEditing2,
    onSubmitRef,
    handleTabSwitch,
}: CreateVrContactsProps) {
    const { data, setData } = useForm({
        contacts: Array.isArray(contactsData?.contacts) ? contactsData.contacts : [
            {
                BusinessPermitNumber: '',
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

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    // useEffect(() => {
    //     if (isEditing && contactsData) {
    //         setData({
    //             contacts: Array.isArray(contactsData.contacts) ? contactsData.contacts : [],
    //         });
    //     }
    // }, [isEditing, contactsData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const url = isEditing ? route('vr-contacts.update-multiple') : route('vr-contacts.store-multiple');
            const method = isEditing ? 'patch' : 'post';

            const response = await axios({
                method,
                url,
                data: { contacts: data.contacts },
            });
            setContactsData({ contacts: response.data.contacts });
            setData({ contacts: response.data.contacts ?? [] });
            console.log(response.data.contacts);
            onNextTab();


        } catch (error) {
            setErrors(error.response?.data?.errors || {});
        } finally {
            setProcessing(false);
        }
    };

    // Notify parent when form data changes
    // useEffect(() => {
    //     if (isEditing && contactsData) {
    //       setData({
    //         contacts: Array.isArray(contactsData.contacts)
    //           ? contactsData.contacts.map(contact => ({
    //               ...contact,
    //               BusinessPermitNumber: companyData?.BusinessPermitNumber || contact.BusinessPermitNumber
    //             }))
    //           : []
    //       });
    //     }
    //   }, [isEditing, contactsData, companyData]);

      // 2. Company data synchronization
      useEffect(() => {
        if (companyData && Object.values(companyData).some(v => v)) {
          const updatedContacts = data.contacts.map(contact => ({
            ...contact,
            BusinessPermitNumber: companyData.BusinessPermitNumber,
            vr_company_id: '' // Clear any manual selection
          }));
          setData('contacts', updatedContacts);
        } else {
          // Clear BusinessPermitNumber but preserve other data
          const updatedContacts = data.contacts.map(contact => ({
            ...contact,
            BusinessPermitNumber: ''
          }));
          setData('contacts', updatedContacts);
        }
      }, [companyData]);

      // 3. Parent data synchronization (you already have this)
     if (!isEditing2){
        useEffect(() => {
            setContactsData(data);
        }, [data]);
    }

    useEffect(() => {
        if (onSubmitRef) {
            onSubmitRef(() => handleSubmit({ preventDefault: () => { } } as React.FormEvent));
        }
    }, [handleSubmit]);

    const addContact = () => {
        setData('contacts', [
            ...data.contacts,
            {
                BusinessPermitNumber: companyData?.BusinessPermitNumber || '',
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
        setData('contacts', data.contacts.map((contact, i) =>
            i === index ? { ...contact, id: contact.id ?? null, [field]: value } : contact
        ));
    };

    return (
        <div className="w-full">
            {!isTitleDisabled === false ? (
                <>
                    <h1 className="text-2xl font-semibold">Create Vehicle Rental Contacts</h1>
                    <p className="text-gray-500">Manage the contact information of the vehicle rental company.</p>
                </>
            ) : null}
            <Card className="mt-6 shadow-md">
                <CardHeader>
                    <div className='flex justify-between'>
                        <div>
                            <CardTitle className="text-lg">Contact Information</CardTitle>
                            <p className="text-sm text-gray-500">Details of the Vehicle Rental Contacts</p>
                        </div>
                        <Button type="button" onClick={addContact} className="bg-green-600 px-6 py-2 text-white hover:bg-green-700">
                            Add Another Contact
                        </Button>
                    </div>

                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {data.contacts.map((contact, index) => (
                            <div key={index} className="space-y-4 border-b pb-4">
                                {companyData && Object.values(companyData).some((value) => value !== null && value !== '') ? (
                                    <>
                                        <Label htmlFor="vr_company_id">Selected VR Company</Label>
                                        <Input
                                        id="BusinessPermitNumber"
                                        value={companyData.BusinessPermitNumber}
                                        readOnly
                                        disabled
                                        className={!companyData.BusinessPermitNumber ? 'border-red-500' : ''}
                                        />
                                    </>
                                    ) : (
                                    <div>
                                        <Label htmlFor={`contacts.${index}.vr_company_id`}>Select VR Company</Label>
                                        <Select
                                        value={String(contact.vr_company_id)}
                                        onValueChange={(value) => {
                                            // Find the selected company
                                            const selectedCompany = companies.find(company => String(company.id) === value);

                                            // Update all contacts with the selected company's data
                                            const updatedContacts = data.contacts.map(contact => ({
                                            ...contact,
                                            vr_company_id: value,
                                            }));

                                            setData('contacts', updatedContacts);
                                        }}
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
                                    )}
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
                        {/* Buttons */}
                        <div className="flex justify-end gap-2">
                            {isEditing2 === true ? (
                                <>
                                    <Button type="submit" disabled={processing} className="bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700">
                                        {processing ? 'Submitting...' : 'Submit'}
                                    </Button>
                                </>
                            )
                            : isButtonDisabled === false ? (
                                <>
                                    <Button
                                        onClick={() => handleTabSwitch('previous')}
                                        className={`px-4 py-2 rounded  'bg-blue-500 text-white hover:bg-blue-700'}`}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        onClick={() => handleTabSwitch('next')}
                                        className={`px-4 py-2 rounded  'bg-blue-500 text-white hover:bg-blue-700'}`}
                                    >
                                        Next
                                    </Button>
                                </>
                            )
                            : null }
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
