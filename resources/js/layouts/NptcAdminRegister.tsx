import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegisterForm {
    FirstName: string;
    LastName: string;
    username: string;
    Address: string;
    Birthdate: string;
    ContactNumber: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface UpdateForm {
    id: number | string;
    FirstName: string;
    LastName: string;
    username: string;
    Address: string;
    ContactNumber: string;
    email: string;
}

interface NptcAdminRegisterProps {
    isOpen: boolean;
    onClose: () => void;
    isEditing?: boolean;
    user?: RegisterForm;
}

export default function NptcAdminRegister({ isOpen, onClose, isEditing, user }: NptcAdminRegisterProps) {
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        id: '',
        FirstName: '',
        LastName: '',
        username: '',
        Address: '',
        BirthDate: '',
        ContactNumber: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (isEditing && user) {
            setData({
                id: user.id || '',
                FirstName: user.FirstName || '',
                LastName: user.LastName || '',
                username: user.username || '',
                Address: user.Address || '',
                BirthDate: user.BirthDate || '',
                ContactNumber: user.ContactNumber || '',
                email: user.email || '',
                password: undefined,
                password_confirmation: undefined,
            });
        } else {
            reset();
        }
    }, [user, isEditing]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const updatedData = { ...data };

        // Remove password fields if they are empty
        if (!updatedData.password) delete updatedData.password;
        if (!updatedData.password_confirmation) delete updatedData.password_confirmation;

        if (isEditing) {
            patch(route('update-nptc-admin'), {
                data: updatedData, // Send filtered data
                preserveScroll: true,
            });
        } else {
            post(route('create-nptc-admin'), {
                onFinish: () => reset('password', 'password_confirmation'),
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Update NPTC Admin' : 'Create NPTC Admin'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update the details below to edit the NPTC Admin.' : 'Enter the details below to create a new NPTC Admin.'}
                    </DialogDescription>
                </DialogHeader>
                <form className="flex h-[70vh] flex-col gap-6 overflow-y-scroll" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="FirstName">First Name</Label>
                            <Input
                                id="FirstName"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="given-name"
                                value={data.FirstName}
                                onChange={(e) => setData('FirstName', e.target.value)}
                                disabled={processing}
                                placeholder="First Name"
                            />
                            <InputError message={errors.FirstName} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="LastName">Last Name</Label>
                            <Input
                                id="LastName"
                                type="text"
                                required
                                tabIndex={2}
                                autoComplete="family-name"
                                value={data.LastName}
                                onChange={(e) => setData('LastName', e.target.value)}
                                disabled={processing}
                                placeholder="Last Name"
                            />
                            <InputError message={errors.LastName} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                required
                                tabIndex={3}
                                autoComplete="username"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                disabled={processing}
                                placeholder="Username"
                            />
                            <InputError message={errors.username} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="Address">Address</Label>
                            <Input
                                id="Address"
                                type="text"
                                required
                                tabIndex={4}
                                autoComplete="street-address"
                                value={data.Address}
                                onChange={(e) => setData('Address', e.target.value)}
                                disabled={processing}
                                placeholder="Address"
                            />
                            <InputError message={errors.Address} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="ContactNumber">Contact Number</Label>
                            <Input
                                id="ContactNumber"
                                type="tel"
                                required
                                tabIndex={5}
                                autoComplete="tel"
                                value={data.ContactNumber}
                                onChange={(e) => setData('ContactNumber', e.target.value)}
                                disabled={processing}
                                placeholder="Contact Number"
                            />
                            <InputError message={errors.ContactNumber} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={6}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="Birthdate">Birthdate</Label>
                            <Input
                                id="Birthdate"
                                type="date"
                                required={!isEditing}
                                tabIndex={7}
                                autoComplete="bday"
                                value={data.Birthdate}
                                onChange={(e) => setData('BirthDate', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.Birthdate} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                tabIndex={8}
                                autoComplete={isEditing ? 'new-password' : 'current-password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder={isEditing ? 'Leave blank to keep current password' : 'Password'}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                tabIndex={9}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Confirm password"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <DialogFooter>
                            <Button type="submit" className="mt-2 w-full" tabIndex={10} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {isEditing ? 'Update account' : 'Create account'}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
