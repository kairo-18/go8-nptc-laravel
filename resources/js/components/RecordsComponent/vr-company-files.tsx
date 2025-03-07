import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

interface CompanyFilesProps {
    selectedCompany: any | null;
    open: boolean;
    setOpen: (open: boolean) => void;
    companiesWithMedia: { id: number; media: any[] }[];
}

export default function CompanyFiles({ selectedCompany, open, setOpen, companiesWithMedia }: CompanyFilesProps) {
    const [selectedPreview, setSelectedPreview] = useState(null);
    const [companyMedia, setCompanyMedia] = useState<any[]>([]);

    // Find and set media files when selectedCompany changes
    useEffect(() => {
        if (selectedCompany) {
            const companyWithMedia = companiesWithMedia.find((company) => company.id === selectedCompany.id);
            setCompanyMedia(companyWithMedia ? companyWithMedia.media : []);
        }
    }, [selectedCompany, companiesWithMedia]);

    const handlePreview = (file) => {
        setSelectedPreview(file);
    };

    const handleDownload = (mediaId) => {
        window.location.href = route('download-media', { mediaId });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="!w-full !max-w-4xl bg-white sm:max-w-6xl">
                <DialogHeader>
                    <DialogTitle>Company Files</DialogTitle>
                </DialogHeader>

                <div className="max-h-[80vh] overflow-y-auto p-6">
                    {selectedCompany ? (
                        <Card className="p-6">
                            <CardContent className="space-y-6">
                                <h2 className="text-xl font-semibold">{selectedCompany.CompanyName}</h2>
                                <p className="text-sm text-gray-500">Files related to this company.</p>

                                <div className="space-y-3">
                                    {companyMedia.length > 0 ? (
                                        companyMedia.map((file) => (
                                            <div key={file.id} className="flex items-center justify-between rounded border p-3">
                                                <span className="max-w-[60%] truncate">{file.name}</span>
                                                <div className="flex space-x-3">
                                                    <Button variant="outline" size="sm" onClick={() => handlePreview(file)}>
                                                        Preview
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleDownload(file.id)}>
                                                        Download
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No files available.</p>
                                    )}
                                </div>

                                {selectedPreview && (
                                    <div className="mt-6 rounded-md border p-4">
                                        <h3 className="text-lg font-semibold">Preview: {selectedPreview.name}</h3>

                                        {selectedPreview.mime_type.startsWith('image/') ? (
                                            <img
                                                src={route('preview-media', { mediaId: selectedPreview.id })}
                                                alt="Preview"
                                                className="mt-3 h-auto w-full rounded-md"
                                            />
                                        ) : selectedPreview.mime_type === 'application/pdf' ? (
                                            <iframe
                                                src={route('preview-media', { mediaId: selectedPreview.id })}
                                                className="mt-3 h-[550px] w-full"
                                            ></iframe>
                                        ) : (
                                            <p className="mt-3 text-sm text-gray-500">Preview not available for this file type.</p>
                                        )}
                                    </div>
                                )}
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
