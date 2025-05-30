import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import NptcAdminRegister from '@/layouts/NptcAdminRegister';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '@/pages/mainLayout';

interface User {
    id: number;
    FirstName: string;
    LastName: string;
    username: string;
    email: string;
    ContactNumber: string;
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
        setIsEditing(true); // Indicate it's an edit
        setIsModalOpen(true);
    };

    const handleCreateNewAdmin = () => {
        setSelectedUser(null); // No user is selected
        setIsEditing(false); // Indicate it's a new creation
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

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <div className='p-10 space-y-5'>
                {auth.roles[0].name === "NPTC Super Admin" &&
                    <Button className=" w-[200px] hover:bg-white hover:text-black" onClick={() => setIsModalOpen(true)}>
                        Create NPTC Admin
                    </Button>
                }
                <NptcAdminRegister
                    isOpen={isModalOpen}
                    user={selectedUser}
                    isEditing={isEditing}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedUser(null); // Reset user selection
                        setIsEditing(false); // Ensure editing state is reset
                    }}
                />
                <div className="">
                    <Table className='rounded-lg border'>
                        <TableCaption>A list of NPTC Admins.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>First Name</TableHead>
                                <TableHead>Last Name</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Contact Number</TableHead>
                                <TableHead>Birth Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.NPTC_ID}</TableCell>
                                    <TableCell>{user.FirstName}</TableCell>
                                    <TableCell>{user.LastName}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.ContactNumber}</TableCell>
                                    <TableCell>{user.BirthDate}</TableCell>

                                    {auth.roles[0].name === "NPTC Super Admin" &&
                                        (
                                    <>
                                        <TableCell>
                                            <Button size="sm" className="hover:text-black" variant="destructive" onClick={() => confirmDelete(user)}>
                                                Delete
                                            </Button>
                                            <Button size="sm" className="ml-2 hover:bg-white hover:text-black" onClick={() => handleRowClick(user)}>
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </>
                                        )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {userToDelete?.FirstName} {userToDelete?.LastName}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}
