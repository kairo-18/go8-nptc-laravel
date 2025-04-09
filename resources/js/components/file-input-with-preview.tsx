import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useState } from 'react';

interface FileInputWithPreviewProps {
    field: string;
    label: string;
    value: File | null;
    onChange: (file: File | null) => void;
    error?: string;
    accept?: string;
}

export function FileInputWithPreview({ field, label, value, onChange, error, accept = 'image/*,.pdf' }: FileInputWithPreviewProps) {
    const [previewImage, setPreviewImage] = useState<{ url: string; alt: string } | null>(null);
    const fileUrl = value ? URL.createObjectURL(value) : null;
    const isImage = value?.type?.startsWith('image/');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onChange(file);
    };

    const handleRemove = () => {
        onChange(null);
        if (fileUrl) {
            URL.revokeObjectURL(fileUrl);
        }
    };

    return (
        <div>
            <Label htmlFor={field}>{label}</Label>
            {!fileUrl ? (
                <Input id={field} type="file" onChange={handleFileChange} accept={accept} className={error ? 'border-red-500' : ''} />
            ) : (
                <div className="mt-2">
                    <div className="relative inline-block">
                        {isImage ? (
                            <img
                                src={fileUrl}
                                alt={`Preview of ${label}`}
                                className="h-20 w-20 cursor-pointer rounded-md object-cover"
                                onClick={() =>
                                    setPreviewImage({
                                        url: fileUrl,
                                        alt: `Preview of ${label}`,
                                    })
                                }
                            />
                        ) : (
                            <div
                                className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-md bg-gray-100"
                                onClick={() => window.open(fileUrl, '_blank')}
                            >
                                <span className="text-sm text-gray-500">View PDF</span>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                            aria-label={`Remove ${label}`}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Image Preview Modal */}
            {previewImage && (
                <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black" onClick={() => setPreviewImage(null)}>
                    <div className="relative max-h-[90vh] max-w-[90vw]">
                        <img
                            src={previewImage.url}
                            alt={previewImage.alt}
                            className="max-h-[80vh] max-w-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            type="button"
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
