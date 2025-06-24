import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, CheckCircle, FileText, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';

export default function OperatorManagementFormUpload({ operator, flash }) {
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileError, setFileError] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        signed_management_agreement: null,
    });

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        setFileError('');

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileSelection = (file) => {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            setFileError('Please upload a valid image (JPG, PNG) or PDF file.');
            return;
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            setFileError('File size must be less than 10MB.');
            return;
        }

        setData('signed_management_agreement', file);

        // Create preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setData('signed_management_agreement', null);
        setPreviewUrl(null);
        setFileError('');
    };

    const handleSubmit = () => {
        if (!data.signed_management_agreement || fileError) return;

        post(route('operator.management-form.store', operator.id), {
            forceFormData: true,
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <>
            <Head title="Upload Management Agreement" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Upload Signed Management Agreement</h1>
                        <p className="mt-2 text-gray-600">
                            Please upload the signed and notarized management agreement form for{' '}
                            <span className="font-semibold">
                                {operator.user.first_name} {operator.user.last_name}
                            </span>
                        </p>
                    </div>

                    {/* Flash Messages */}
                    {flash?.success && (
                        <Alert className="mb-6 border-green-200 bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">{flash.success}</AlertDescription>
                        </Alert>
                    )}

                    {flash?.error && (
                        <Alert className="mb-6 border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800">{flash.error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Upload Section */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Upload className="h-5 w-5" />
                                        Upload Document
                                    </CardTitle>
                                    <CardDescription>
                                        Upload the signed and notarized management agreement form. Accepted formats: JPG, PNG, PDF (Max 10MB)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {/* File Upload Area */}
                                        <div
                                            className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors duration-200 ${
                                                dragActive
                                                    ? 'border-blue-400 bg-blue-50'
                                                    : data.signed_management_agreement
                                                      ? 'border-green-400 bg-green-50'
                                                      : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                        >
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png,.pdf"
                                                onChange={handleFileInput}
                                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                                disabled={processing}
                                            />

                                            {!data.signed_management_agreement ? (
                                                <div className="space-y-4">
                                                    <div className="mx-auto h-12 w-12 text-gray-400">
                                                        <Upload className="h-full w-full" />
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-medium text-gray-900">
                                                            Drop your file here, or <span className="text-blue-600">browse</span>
                                                        </p>
                                                        <p className="mt-1 text-sm text-gray-500">JPG, PNG or PDF up to 10MB</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <FileText className="h-8 w-8 text-green-600" />
                                                        <div className="text-left">
                                                            <p className="font-medium text-gray-900">{data.signed_management_agreement.name}</p>
                                                            <p className="text-sm text-gray-500">
                                                                {formatFileSize(data.signed_management_agreement.size)}
                                                            </p>
                                                        </div>
                                                        <Button type="button" variant="outline" size="sm" onClick={removeFile} className="ml-auto">
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    {previewUrl && (
                                                        <div className="mt-4">
                                                            <img src={previewUrl} alt="Preview" className="mx-auto max-h-64 rounded-lg shadow-md" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* File Error */}
                                        {fileError && (
                                            <Alert className="border-red-200 bg-red-50">
                                                <AlertCircle className="h-4 w-4 text-red-600" />
                                                <AlertDescription className="text-red-800">{fileError}</AlertDescription>
                                            </Alert>
                                        )}

                                        {/* Validation Error */}
                                        {errors.signed_management_agreement && (
                                            <Alert className="border-red-200 bg-red-50">
                                                <AlertCircle className="h-4 w-4 text-red-600" />
                                                <AlertDescription className="text-red-800">{errors.signed_management_agreement}</AlertDescription>
                                            </Alert>
                                        )}

                                        {/* Submit Button */}
                                        <div className="flex justify-end">
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={!data.signed_management_agreement || processing || !!fileError}
                                                className="min-w-32"
                                            >
                                                {processing ? (
                                                    <>
                                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    'Upload Document'
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Operator Info Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Operator Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Name</label>
                                        <p className="text-gray-900">
                                            {operator.user.first_name} {operator.user.last_name}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Company</label>
                                        <p className="text-gray-900">{operator.vr_company?.company_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Status</label>
                                        <div className="mt-1">
                                            <Badge variant={operator.signed_management_agreement ? 'success' : 'secondary'}>
                                                {operator.signed_management_agreement ? 'Agreement Uploaded' : 'Pending Upload'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Requirements</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Document must be signed by both parties
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Document must be notarized
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Clear and readable image/scan
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            File size under 10MB
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
