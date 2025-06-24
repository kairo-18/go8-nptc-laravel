import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import NptcAdminRegister from '@/layouts/NptcAdminRegister';
import MainLayout from '@/pages/mainLayout';
import { type SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface User {
    id: number;
    FirstName: string;
    LastName: string;
    username: string;
    email: string;
    ContactNumber: string;
    NPTC_ID?: string;
    BirthDate?: string;
}

interface NptcAdminsProps {
    users: User[];
}

export default function NptcAdmins({ users }: NptcAdminsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const { delete: destroy } = useForm();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { auth } = usePage<SharedData>().props;

    const handleRowClick = (user: User) => {
        setSelectedUser(user);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleCreateNewAdmin = () => {
        setSelectedUser(null);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const breadcrumbs = [
        {
            title: 'NPTC Admins',
            href: '/nptc-admins',
        },
    ];

    const confirmDelete = (user: User) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (userToDelete) {
            destroy(route('delete-nptc-admin', { id: userToDelete.id }), {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setUserToDelete(null);
                },
            });
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: 'beforeChildren',
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
            },
        },
    };

    const tableRowVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.3,
            },
        }),
    };

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-5 p-2">
                {auth.roles[0].name === 'NPTC Super Admin' && (
                    <motion.div variants={itemVariants}>
                        <Button
                            className="w-[200px] transition-colors duration-300 hover:bg-white hover:text-black"
                            onClick={handleCreateNewAdmin}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            asChild
                        >
                            <motion.div>Create NPTC Admin</motion.div>
                        </Button>
                    </motion.div>
                )}

                <NptcAdminRegister
                    isOpen={isModalOpen}
                    user={selectedUser}
                    isEditing={isEditing}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedUser(null);
                        setIsEditing(false);
                    }}
                />

                <motion.div className="overflow-hidden rounded-lg border shadow-md" variants={itemVariants}>
                    <Table className="w-full">
                        <TableHeader className="bg-[#252583] text-white">
                            <TableRow>
                                <TableHead className="w-[100px] text-white">ID</TableHead>
                                <TableHead className="text-white">First Name</TableHead>
                                <TableHead className="text-white">Last Name</TableHead>
                                <TableHead className="text-white">Username</TableHead>
                                <TableHead className="text-white">Email</TableHead>
                                <TableHead className="text-white">Contact Number</TableHead>
                                <TableHead className="text-white">Birth Date</TableHead>
                                {auth.roles[0].name === 'NPTC Super Admin' && <TableHead className="text-white">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence>
                                {users.map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        custom={index}
                                        initial="hidden"
                                        animate="visible"
                                        variants={tableRowVariants}
                                        whileHover={{ backgroundColor: 'rgba(37, 37, 131, 0.05)' }}
                                        className="border-b transition-colors hover:bg-gray-50"
                                    >
                                        <TableCell className="font-medium">{user.NPTC_ID}</TableCell>
                                        <TableCell>{user.FirstName}</TableCell>
                                        <TableCell>{user.LastName}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.ContactNumber}</TableCell>
                                        <TableCell>{user.BirthDate}</TableCell>

                                        {auth.roles[0].name === 'NPTC Super Admin' && (
                                            <TableCell className="flex space-x-2">
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        size="sm"
                                                        className="transition-colors hover:text-black"
                                                        variant="destructive"
                                                        onClick={() => confirmDelete(user)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </motion.div>
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        size="sm"
                                                        className="transition-colors hover:bg-white hover:text-black"
                                                        onClick={() => handleRowClick(user)}
                                                    >
                                                        Edit
                                                    </Button>
                                                </motion.div>
                                            </TableCell>
                                        )}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </motion.div>

                <AnimatePresence>
                    {isDeleteModalOpen && (
                        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            >
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Confirm Deletion</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to delete {userToDelete?.FirstName} {userToDelete?.LastName}? This action cannot be
                                            undone.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="mt-4 gap-2">
                                        <Button
                                            variant="outline"
                                            className="border-[#252583] text-white transition-colors hover:bg-[#252583]/10 hover:text-[#252583]"
                                            onClick={() => setIsDeleteModalOpen(false)}
                                            asChild
                                        >
                                            <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }}>
                                                Cancel
                                            </motion.span>
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="bg-red-600 text-white transition-colors hover:bg-red-700"
                                            onClick={handleDelete}
                                            asChild
                                        >
                                            <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }}>
                                                Delete
                                            </motion.span>
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </motion.div>
                        </Dialog>
                    )}
                </AnimatePresence>
            </motion.div>
        </MainLayout>
    );
}
