import { useState, useEffect } from 'react';
import axios from 'axios';
import MainLayout from './mainLayout';
import OperatorInformation from './RecordsPage/OperatorInformation';
import FilePreviewDialog from '../pages/RecordsPage/FilePreviewDialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function EditOperator({ operatorMedia, operator }) {
    const breadcrumbs = [{ title: 'Operator Edit', href: `/operator/edit/${operator?.id}` }];

    const [operatorData, setOperatorData] = useState(operator || {});
    const [selectedPreview, setSelectedPreview] = useState(null);
    const [openPreview, setOpenPreview] = useState(false);
    const [operatorMediaState, setOperatorMediaState] = useState(operatorMedia || []);

    useEffect(() => {
        if (operator) setOperatorData(operator);
        if (operatorMedia) setOperatorMediaState(operatorMedia);
    }, [operator, operatorMedia]);


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
    

    const handleOperatorUpdate = async () => {
        try {
            const payload = {
                username: operatorData?.user?.username || "", 
                email: operatorData?.user?.email || "",
                FirstName: operatorData?.user?.FirstName || "",
                LastName: operatorData?.user?.LastName || "",
                Address: operatorData?.user?.Address || "",
                BirthDate: operatorData?.user?.BirthDate || "",
                Status:operatorData?.Status||"",
                ContactNumber: operatorData?.user?.ContactNumber || "",
                vr_company_id: operatorData?.vr_company_id || null,
            };
    
            const response = await axios.patch(`/operator/update/${operatorData.id}`, payload, {
                headers: { "Content-Type": "application/json" },
            });
    
            if (response.status === 200) {
                alert("Operator information updated successfully!");
            }
        } catch (error) {
            console.error("Error updating operator:", error);
            alert(`Failed to update operator information: ${error.response?.data?.message || error.message}`);
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
                        handleChange={handleChange}
                        handleOperatorUpdate={handleOperatorUpdate}
                    />
                </div>
            </div>
            <FilePreviewDialog openPreview={openPreview} setOpenPreview={setOpenPreview} selectedPreview={selectedPreview} />
        </MainLayout>
    );
}
