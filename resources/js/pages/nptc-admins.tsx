import React from 'react';
import NptcAdminRegister from '@/layouts/NptcAdminRegister';
import AppLayout from '@/layouts/app-layout';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';

interface User {
  id: number;
  FirstName: string;
  LastName: string;
  username: string;
  email: string;
}

interface NptcAdminsProps {
  users: User[];
}

export default function NptcAdmins({ users }: NptcAdminsProps) {
  const breadcrumbs = [
    {
      title: 'NPTC Admins',
      href: '/nptc-admins',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Label className="font-bold text-2xl ml-5 mt-5">NPTC Admin View</Label>
      <NptcAdminRegister />

    <div className='p-5'>
      <Table>
        <TableCaption>A list of NPTC Admins.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact Number</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.FirstName}</TableCell>
              <TableCell>{user.LastName}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.ContactNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </AppLayout>
  );
}
