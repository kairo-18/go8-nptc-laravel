import { useState, useEffect } from 'react';
import axios from 'axios';
import MainLayout from './mainLayout';
import OperatorInformation from './RecordsPage/OperatorInformation';
import FilePreviewDialog from '../pages/RecordsPage/FilePreviewDialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';

export default function EditOperator({ mediaFiles, operator }) {
    const breadcrumbs = [{ title: 'Operator Edit', href: `/operator/edit/${operator?.id}` }];

    const [operatorData, setOperatorData] = useState(operator || {});
    const [selectedPreview, setSelectedPreview] = useState(null);
    const [openPreview, setOpenPreview] = useState(false);
    const [operatorMediaState, setOperatorMediaState] = useState(mediaFiles || []);
    const [files, setFiles] = useState({ photo: null, valid_id_front: null, valid_id_back: null });

    useEffect(() => {
        if (operator) setOperatorData(operator);
        if (mediaFiles) setOperatorMediaState(mediaFiles);
    }, [operator, mediaFiles]);

    const handleOpenPreview = (media) => {
        setSelectedPreview(media);
        setOpenPreview(true);
    };

    const [fileKeys, setFileKeys] = useState({
        photo: Date.now(),
        valid_id_front: Date.now(),
        valid_id_back: Date.now(),
    });

    // Add this file removal handler
    const handleFileRemove = (field: string) => {
        setFiles(prev => ({ ...prev, [field]: null }));
        // Force re-render by updating the key
        setFileKeys(prevKeys => ({
            ...prevKeys,
            [field]: Date.now(),
        }));
    };

    const handleDeleteFile = async (operatorId: number, fileId: number) => {
        try {
            await router.delete(route('delete-operator-media', {
                operator: operatorId,
            }), {
                data: { media_id: fileId }
            });

            alert('File deleted successfully');
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Failed to delete file');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOperatorData((prevState) => ({
            ...prevState,
            user: {
                ...prevState?.user,
                [name]: value,
            },
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        if (selectedFiles.length > 0) {
            setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
        }
    };

    const handleOperatorUpdate = async () => {
        try {
            // 1️⃣ Update Operator Information
            const payload = {
                username: operatorData?.user?.username || "",
                email: operatorData?.user?.email || "",
                FirstName: operatorData?.user?.FirstName || "",
                LastName: operatorData?.user?.LastName || "",
                Address: operatorData?.user?.Address || "",
                BirthDate: operatorData?.user?.BirthDate || "",
                Status: operatorData?.Status || "",
                ContactNumber: operatorData?.user?.ContactNumber || "",
                vr_company_id: operatorData?.vr_company_id || null,
            };

            const response = await axios.patch(`/operator/update/${operatorData.id}`, payload, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status !== 200) {
                throw new Error("Failed to update operator details.");
            }

            // 2️⃣ Upload Files if Selected (only non-null files)
            const formData = new FormData();
            if (files.photo) formData.append("photo", files.photo);
            if (files.valid_id_front) formData.append("valid_id_front", files.valid_id_front);
            if (files.valid_id_back) formData.append("valid_id_back", files.valid_id_back);

            if (formData.entries().next().done === false) { // Check if formData has any entries
                await axios.post(`/operators/${operatorData.id}/upload-files`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            alert("Operator information and files updated successfully!");
            location.reload();
        } catch (error) {
            console.error("Error updating operator:", error);
            alert(`Failed to update operator: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <div className="border-border mx-auto w-[75vw] rounded-lg border bg-white p-6 shadow-sm">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-semibold">Edit Operator</h1>
                        <p className="text-muted-foreground">Modify operator details</p>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-4">
                        <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-[#2a2a92]">
                            <span className="text-2xl font-bold text-white">
                                {operatorData?.user?.FirstName?.charAt(0) || 'O'}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-lg font-medium">
                                {operatorData?.user?.FirstName || ''} {operatorData?.user?.LastName || 'Operator Name'}
                            </h2>
                            <Badge variant="default" className="bg-[#2a2a92]">
                                VR Operator
                            </Badge>
                        </div>
                    </div>

                    <OperatorInformation
                        operator={operatorData}
                        mediaFiles={mediaFiles}
                        handleChange={handleChange}
                        handleFileChange={handleFileChange}
                        handleFileRemove={handleFileRemove}
                        fileKeys={fileKeys}
                        files={files}
                        handleOperatorUpdate={handleOperatorUpdate}
                    />

                    {/* Operator Media Files */}
                    <div className="mt-6">
                        <h2 className="text-lg font-medium">Uploaded Files</h2>
                        <div className="mt-3 space-y-2">
                            {operatorMediaState.map((media) => (
                                <>
                                    <div className='flex items-center justify-between rounded-md border p-3 shadow-sm'>
                                        <div key={media.id} className="">
                                            <Label>{media.collection_name}</Label>
                                            <span className="text-sm font-medium">{media.name}</span>
                                        </div>
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" className='text-white' onClick={() => handleOpenPreview(media)}>Preview</Button>
                                            <Button variant="outline" size="sm" className='text-white' onClick={() => handleDeleteFile(operator.id, media.id)}>Delete</Button>
                                        </div>
                                    </div>
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <FilePreviewDialog openPreview={openPreview} setOpenPreview={setOpenPreview} selectedPreview={selectedPreview} />
        </MainLayout>
    );
}
