import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Square } from 'lucide-react';

export default function VrAdmin({ users }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout>
            <Head title="Records" />
            <div className="p-6 space-y-4">
                <div>
                    <h1 className="text-2xl font-bold">Records</h1>
                    <p className="text-sm text-gray-500">List of Records</p>
                </div>

                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Vehicle Rental Companies</h2>
                    <Input
                        type="text"
                        placeholder="Search"
                        className="w-64"
                    />
                </div>
                
                <div className="border rounded-lg shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                <TableHead className="w-10"></TableHead>
                                <TableHead>Company Name</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead className="text-right w-10"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Square size={16} className="text-gray-500" />
                                    </TableCell>
                                    <TableCell>{user.company_name || 'No Company'}</TableCell>
                                    <TableCell>{user.FirstName} {user.LastName}</TableCell>
                                    <TableCell className="text-right">
                                        <MoreHorizontal className="text-gray-500 cursor-pointer" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
