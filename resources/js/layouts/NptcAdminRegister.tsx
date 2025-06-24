import { useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegisterForm {
    id?: number | string;
    FirstName: string;
    LastName: string;
    username: string;
    Address: string;
    BirthDate: string;
    ContactNumber: string;
    email: string;
    password?: string;
    password_confirmation?: string;
}

interface NptcAdminRegisterProps {
    isOpen: boolean;
    onClose: () => void;
    isEditing?: boolean;
    user?: RegisterForm;
}

export default function NptcAdminRegister({ isOpen, onClose, isEditing, user }: NptcAdminRegisterProps) {
    const { data, setData, post, patch, processing, errors, reset } = useForm<RegisterForm>({
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
                password: '',
                password_confirmation: '',
            });
        } else {
            reset();
        }
    }, [user, isEditing]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const formData = { ...data };
        if (!formData.password) delete formData.password;
        if (!formData.password_confirmation) delete formData.password_confirmation;

        if (isEditing) {
            patch(route('update-nptc-admin'), {
                data: formData,
                preserveScroll: true,
            });
        } else {
            post(route('create-nptc-admin'), {
                onFinish: () => reset('password', 'password_confirmation'),
            });
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={onClose}>
                    {/* Add preventAutoFocus prop to DialogContent */}
                    <DialogContent className="max-w-2xl" onInteractOutside={(e) => e.preventDefault()}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-[#252583]">
                                    {isEditing ? 'Update NPTC Admin' : 'Create NPTC Admin'}
                                </DialogTitle>
                                <DialogDescription className="text-gray-600">
                                    {isEditing ? 'Update the admin details below' : 'Fill in the details to create a new admin'}
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={submit}>
                                <div className="grid max-h-[70vh] grid-cols-1 gap-4 overflow-y-auto p-1 md:grid-cols-2">
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="FirstName">First Name</Label>
                                        <Input
                                            id="FirstName"
                                            value={data.FirstName}
                                            onChange={(e) => setData('FirstName', e.target.value)}
                                            disabled={processing}
                                            placeholder="First Name"
                                            className="focus:ring-2 focus:ring-[#252583]"
                                            autoFocus={false} // Explicitly disable auto-focus
                                        />
                                        <InputError message={errors.FirstName} />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15 }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="LastName">Last Name</Label>
                                        <Input
                                            id="LastName"
                                            value={data.LastName}
                                            onChange={(e) => setData('LastName', e.target.value)}
                                            disabled={processing}
                                            placeholder="Last Name"
                                            className="focus:ring-2 focus:ring-[#252583]"
                                        />
                                        <InputError message={errors.LastName} />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            value={data.username}
                                            onChange={(e) => setData('username', e.target.value)}
                                            disabled={processing}
                                            placeholder="Username"
                                            className="focus:ring-2 focus:ring-[#252583]"
                                        />
                                        <InputError message={errors.username} />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.25 }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            disabled={processing}
                                            placeholder="email@example.com"
                                            className="focus:ring-2 focus:ring-[#252583]"
                                        />
                                        <InputError message={errors.email} />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="ContactNumber">Contact Number</Label>
                                        <Input
                                            id="ContactNumber"
                                            type="tel"
                                            value={data.ContactNumber}
                                            onChange={(e) => setData('ContactNumber', e.target.value)}
                                            disabled={processing}
                                            placeholder="Contact Number"
                                            className="focus:ring-2 focus:ring-[#252583]"
                                        />
                                        <InputError message={errors.ContactNumber} />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.35 }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="BirthDate">Birthdate</Label>
                                        <Input
                                            id="BirthDate"
                                            type="date"
                                            value={data.BirthDate}
                                            onChange={(e) => setData('BirthDate', e.target.value)}
                                            disabled={processing}
                                            className="focus:ring-2 focus:ring-[#252583]"
                                        />
                                        <InputError message={errors.BirthDate} />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="Address">Address</Label>
                                        <Input
                                            id="Address"
                                            value={data.Address}
                                            onChange={(e) => setData('Address', e.target.value)}
                                            disabled={processing}
                                            placeholder="Address"
                                            className="focus:ring-2 focus:ring-[#252583]"
                                        />
                                        <InputError message={errors.Address} />
                                    </motion.div>

                                    {!isEditing && (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.45 }}
                                                className="space-y-2"
                                            >
                                                <Label htmlFor="password">Password</Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="Password"
                                                    className="focus:ring-2 focus:ring-[#252583]"
                                                />
                                                <InputError message={errors.password} />
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 }}
                                                className="space-y-2"
                                            >
                                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="Confirm Password"
                                                    className="focus:ring-2 focus:ring-[#252583]"
                                                />
                                                <InputError message={errors.password_confirmation} />
                                            </motion.div>
                                        </>
                                    )}
                                </div>

                                <DialogFooter className="mt-6">
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                                        <Button type="submit" className="w-full bg-[#252583] text-white hover:bg-[#3a3a9e]" disabled={processing}>
                                            {processing ? (
                                                <span className="flex items-center gap-2">
                                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                                    Processing...
                                                </span>
                                            ) : isEditing ? (
                                                'Update Admin'
                                            ) : (
                                                'Create Admin'
                                            )}
                                        </Button>
                                    </motion.div>
                                </DialogFooter>
                            </form>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
}
