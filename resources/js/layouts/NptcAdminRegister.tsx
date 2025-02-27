import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

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

export default function NptcAdminRegister() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        FirstName: '',
        LastName: '',
        username: '',
        Address: '',
        Birthdate: '',
        ContactNumber: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild className='w-[200px] ml-5 mt-5'>
                <Button className=''><Label>Create NPTC Admin</Label></Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create NPTC Admin</DialogTitle>
                    <DialogDescription>Enter the details below to create a new NPTC Admin.</DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-6 h-[70vh] overflow-y-scroll" onSubmit={submit}>
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
                            <Label htmlFor="Birthdate">Birthdate</Label>
                            <Input
                                id="Birthdate"
                                type="date"
                                required
                                tabIndex={5}
                                autoComplete="bday"
                                value={data.Birthdate}
                                onChange={(e) => setData('Birthdate', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.Birthdate} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="ContactNumber">Contact Number</Label>
                            <Input
                                id="ContactNumber"
                                type="tel"
                                required
                                tabIndex={6}
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
                                tabIndex={7}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={8}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Password"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
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
                                Create account
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
