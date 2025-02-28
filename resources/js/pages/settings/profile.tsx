import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        FirstName: auth.user.FirstName,
        LastName: auth.user.LastName,
        username: auth.user.username,
        Address: auth.user.Address,
        BirthDate: auth.user.BirthDate,
        ContactNumber: auth.user.ContactNumber,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <h1>{auth.user.role}</h1>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name, email address, phone number, and address" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="FirstName">First Name</Label>
                            <Input
                                id="FirstName"
                                className="mt-1 block w-full"
                                value={data.FirstName}
                                onChange={(e) => setData('FirstName', e.target.value)}
                                required
                                autoComplete="given-name"
                                placeholder="First Name"
                            />
                            <InputError className="mt-2" message={errors.FirstName} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="LastName">Last Name</Label>
                            <Input
                                id="LastName"
                                className="mt-1 block w-full"
                                value={data.LastName}
                                onChange={(e) => setData('LastName', e.target.value)}
                                required
                                autoComplete="family-name"
                                placeholder="Last Name"
                            />
                            <InputError className="mt-2" message={errors.LastName} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                className="mt-1 block w-full"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Username"
                            />
                            <InputError className="mt-2" message={errors.username} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="Address">Address</Label>
                            <Input
                                id="Address"
                                className="mt-1 block w-full"
                                value={data.Address}
                                onChange={(e) => setData('Address', e.target.value)}
                                required
                                autoComplete="street-address"
                                placeholder="Address"
                            />
                            <InputError className="mt-2" message={errors.Address} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="BirthDate">BirthDate</Label>
                            <Input
                                id="BirthDate"
                                type="date"
                                className="mt-1 block w-full"
                                value={data.BirthDate}
                                onChange={(e) => setData('BirthDate', e.target.value)}
                                required
                                autoComplete="bday"
                            />
                            <InputError className="mt-2" message={errors.Birthdate} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="ContactNumber">Contact Number</Label>
                            <Input
                                id="ContactNumber"
                                className="mt-1 block w-full"
                                value={data.ContactNumber}
                                onChange={(e) => setData('ContactNumber', e.target.value)}
                                required
                                autoComplete="tel"
                                placeholder="Contact Number"
                            />
                            <InputError className="mt-2" message={errors.ContactNumber} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="Email address"
                            />
                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Input
                                id="role"
                                className="mt-1 block w-full"
                                value={auth.role}
                                disabled
                            />
                            <InputError className="mt-2" message={errors.role} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="text-muted-foreground -mt-4 text-sm">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
