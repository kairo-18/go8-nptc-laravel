import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { Paperclip } from 'lucide-react';
import { useState } from 'react';

export default function ComposeMail() {
    const [newMail, setNewMail] = useState({ email: '', subject: '', content: '' });
    const [attachments, setAttachments] = useState([]); // State for file attachments
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const sendNewMail = async () => {
        setIsLoading(true);
        setErrors({});

        const formData = new FormData();
        formData.append('email', newMail.email);
        formData.append('subject', newMail.subject);
        formData.append('content', newMail.content.trim() !== '' ? newMail.content : 'No Content');

        // Append each file to the FormData
        attachments.forEach((file) => formData.append('attachments[]', file));

        try {
            await axios.post('mails/new-mail', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setNewMail({ email: '', subject: '', content: '' });
            setAttachments([]);
            setIsLoading(false);
        } catch (error) {
            console.error('Error sending mail:', error);
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors); // Set validation errors
            }
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setAttachments([...attachments, ...Array.from(e.target.files)]);
    };

    const handleRemoveFile = (index) => {
        setAttachments((prevAttachments) => prevAttachments.filter((_, i) => i !== index));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-blue-900 text-white hover:bg-white hover:text-black">
                    Compose Mail
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send New Mail</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                    <div>
                        <Input
                            type="email"
                            placeholder="Receiver Email"
                            value={newMail.email}
                            onChange={(e) => setNewMail({ ...newMail, email: e.target.value })}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email[0]}</p>}
                    </div>
                    <Input
                        type="text"
                        placeholder="Subject"
                        value={newMail.subject}
                        onChange={(e) => setNewMail({ ...newMail, subject: e.target.value })}
                    />
                    <Textarea
                        placeholder="Content"
                        value={newMail.content}
                        onChange={(e) => setNewMail({ ...newMail, content: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-base shadow-sm focus:ring focus:ring-blue-300 md:text-lg"
                    />
                    {/* Attachments Preview */}
                    {attachments.length > 0 && (
                        <div className="mt-3 w-full overflow-auto">
                            {attachments.map((file, index) => (
                                <div key={index} className="mb-2 flex items-center justify-between">
                                    <span className="max-w-[70%] truncate text-sm text-gray-700">{file.name}</span>
                                    <button
                                        onClick={() => handleRemoveFile(index)}
                                        className="ml-2 text-sm font-medium text-black hover:text-red-700"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        onClick={sendNewMail}
                        disabled={isLoading}
                        className={`rounded-full px-6 py-3 text-sm font-medium text-white transition md:text-lg ${isLoading ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 focus:ring focus:ring-blue-300'} `}
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </Button>

                    {/* File input with Paperclip icon */}
                    <div className="flex items-center">
                        <label className="cursor-pointer">
                            <Paperclip className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                            <input
                                type="file"
                                multiple // Allow multiple files
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
