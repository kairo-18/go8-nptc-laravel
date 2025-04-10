import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface SetStatusProps {
    type: 'company' | 'operator' | 'driver' | 'vehicle';
    selectedData: any | null;
    selectedStatus: string;
    setSelectedStatus: (status: string) => void;
    openStatusModal: boolean;
    setStatusData: (company: any) => void;
    setOpenStatusModal: (open: boolean) => void;
    handleSubmit: () => void;
}

export default function SetStatus({ type, selectedStatus, setSelectedStatus, selectedData, openStatusModal, setOpenStatusModal, handleSubmit }: SetStatusProps) {

    const statuses = [];

    if (type === 'company') {
        statuses.push('Active', 'Inactive', 'Suspended', 'Banned', 'Pending', 'Approved', 'Rejected', 'For Payment');
    } else if (type === 'operator') {
        statuses.push('Active', 'Inactive', 'Suspended', 'Banned', 'Pending', 'Approved', 'Rejected', 'For Payment', 'For NPTC Approval', 'For VR Approval');
    } else if (type === 'driver') {
        statuses.push('Active', 'Inactive', 'Suspended', 'Banned', 'Pending', 'Approved', 'Rejected', 'For Payment', 'For NPTC Approval', 'For VR Approval');
    } else if (type === 'vehicle') {
        statuses.push('Active', 'Inactive', 'Suspended', 'Banned', 'Pending', 'Approved', 'Rejected', 'For Payment', 'For NPTC Approval', 'For VR Approval');
    }

    useEffect(() => {
        if (selectedData) {
            setSelectedStatus(selectedData.status);
        }
    }, [selectedData]);

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
    };

    return (
        <Dialog open={openStatusModal} onOpenChange={setOpenStatusModal}>
            <DialogContent className="!w-full !max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>Change Status</DialogTitle>
                </DialogHeader>

                <div className="p-2">
                    {selectedData ? (
                        <Card>
                            <CardContent className="space-y-6">
                                <h2 className="text-sm">Change the status of this row.</h2>

                                <Select value={selectedStatus} onValueChange={handleStatusChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <div className="flex justify-end space-x-3">
                                    <Button variant="outline" className='bg-white-500' onClick={() => setOpenStatusModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSubmit} disabled={!selectedStatus}>Save</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <p className="text-gray-500">No company selected.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
