import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useState } from 'react';

interface ContainerProps {
    openContainerModal: boolean;
    setOpenContainerModal: (open: boolean) => void;
    handleSubmit: () => void;
    containerType : string | null;
    setInputValue: (value: string) => void;
}

export default function Container({ openContainerModal, setOpenContainerModal, handleSubmit, containerType, setInputValue }: ContainerProps) {

    return (
        <Dialog open={openContainerModal} onOpenChange={setOpenContainerModal}>
            <DialogContent className="!w-full !max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>
                        {containerType === 'email'
                            ? 'Send Email'
                            : containerType === 'suspend'
                            ? <span className="text-red-500">Suspend Account</span>
                            : containerType === 'ban'
                            ? <span className="text-red-500">Ban Account</span>
                            : containerType === 'remove'
                            ? <span className="text-red-500">Remove Account</span>
                            : ''}
                    </DialogTitle>
                    <DialogDescription>
                        {containerType === 'ban' || containerType === 'suspend' ? (
                            <p className="text-gray-500">This action limits the account of the user. </p>
                        ) : containerType === 'remove' ? (
                            <p className="text-gray-500">This action removes the account of the user from the database. </p>
                        ) : (
                            <></>
                        )}
                    </DialogDescription>
                </DialogHeader>
                    <Input onChange={(e) => setInputValue(e.target.value)} />
                    <div className="flex justify-end space-x-3 mt-6">
                        <Button variant="outline" className="bg-white" onClick={() => setOpenContainerModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </div>
            </DialogContent>
        </Dialog>
    );
}
