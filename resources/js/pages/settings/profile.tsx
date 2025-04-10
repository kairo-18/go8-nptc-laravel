import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayout from '@/layouts/settings/layout';
import MainLayout from '../mainLayout';

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

    const [qrModalOpen, setQRModalOpen] = useState(false);

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-semibold"></h1>
                    <Button
                        className="bg-primary text-white hover:bg-primary/90"
                        onClick={() => setQRModalOpen(true)}
                    >
                        Show Profile QR Code
                    </Button>
                </div>

                <div className="space-y-6">
                    <HeadingSmall
                        title="Profile information"
                        description="Update your name, email address, phone number, and address"
                    />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
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
                                <InputError className="mt-2" message={errors.BirthDate} />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
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

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="role">Role</Label>
                                <Input id="role" className="mt-1 block w-full" value={auth.roles[0].name} disabled />
                                <InputError className="mt-2" message={errors.role} />
                            </div>
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div className="mt-2 space-y-2">
                                <p className="text-muted-foreground text-sm">
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
                                    <div className="text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button className="!text-white" disabled={processing}>
                                Save
                            </Button>

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

                {/* Delete Account Section */}
                <div className="mt-12 border-t pt-10">
                    <div className="border rounded-xl p-6 bg-destructive/5">
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold text-destructive">Delete Account</h2>
                            <p className="text-sm text-muted-foreground">
                                Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                        </div>
                        <div className="mt-6">
                            <DeleteUser />
                        </div>
                    </div>
                </div>

                {/* QR Code Modal */}
                {qrModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-xl w-[90%] max-w-md space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold">Profile QR Code</h2>
                                <button
                                    onClick={() => setQRModalOpen(false)}
                                    className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
                                >
                                    Close
                                </button>
                            </div>
                            <div className="flex justify-center">
                                <div className="w-40 h-40 bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-500 text-sm">
                                    QR Code Placeholder
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button className="bg-primary text-white hover:bg-primary/90">Download QR Code</Button>
                            </div>
                        </div>
                    </div>
                )}
            </SettingsLayout>
        </MainLayout>
    );
}
