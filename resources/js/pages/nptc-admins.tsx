import React from 'react'
//impoort NptcadminRegister
import NptcAdminRegister from '@/layouts/NptcAdminRegister';
import AppLayout from '@/layouts/app-layout';
import { Label } from '@/components/ui/label';

export default function NptcAdmins() {

    const breadcrumbs = [
        {
            title: "NPTC Admins",
            url: "/nptc-admins"
        }
    ]

  return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Label className='font-bold text-2xl ml-5 mt-5'>NPTC Admin View</Label>
            <NptcAdminRegister />

        </AppLayout>
  )
}

