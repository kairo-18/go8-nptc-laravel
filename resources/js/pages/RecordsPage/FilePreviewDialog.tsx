import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function FilePreviewDialog({ openPreview, setOpenPreview, selectedPreview }) {
    return (
        <Dialog open={openPreview} onOpenChange={setOpenPreview}>
            <DialogContent className="max-h-[90vh] !w-full !max-w-4xl overflow-y-auto bg-white sm:max-w-6xl">
                <DialogHeader>
                    <DialogTitle>Preview: {selectedPreview?.name}</DialogTitle>
                </DialogHeader>
                {selectedPreview && (
                    <div className="mt-6 rounded-md border p-4">
                        <h3 className="text-lg font-semibold">Preview: {selectedPreview.name}</h3>
                        <div className="mt-3 max-h-[70vh] overflow-auto">
                            {selectedPreview.mime_type.startsWith('image/') ? (
                                <img
                                    src={route('preview-media', { mediaId: selectedPreview.id })}
                                    alt="Preview"
                                    className="h-auto max-h-[600px] w-full rounded-md object-contain"
                                />
                            ) : selectedPreview.mime_type === 'application/pdf' ? (
                                <iframe
                                    src={route('preview-media', { mediaId: selectedPreview.id })}
                                    className="h-[550px] w-full overflow-auto"
                                ></iframe>
                            ) : (
                                <p className="text-sm text-gray-500">Preview not available for this file type.</p>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}