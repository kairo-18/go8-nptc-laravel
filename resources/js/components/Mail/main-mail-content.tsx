import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { FileText, Paperclip } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function MainMailContent({ selectedThread, auth }) {
    const [newMail, setNewMail] = useState({ subject: '', content: '' });
    const [attachments, setAttachments] = useState([]); // State for file attachments
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress

    const handleSend = async () => {
        if (!selectedThread) return;

        setLoading(true);
        setUploadProgress(0); // Reset progress

        const recipientEmail = selectedThread.sender.id === auth.user.id ? selectedThread.receiver.email : selectedThread.sender.email;
        const originalSubject = selectedThread.mails[0]?.subject || 'No Subject';

        const formData = new FormData();
        formData.append('email', recipientEmail);
        formData.append('subject', originalSubject);
        formData.append('content', newMail.content.trim() !== '' ? newMail.content : 'No Content');
        attachments.forEach((file) => formData.append('attachments[]', file));

        try {
            const response = await axios.post('mails/new-mail', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted); // Update progress
                },
            });

            console.log('Mail sent:', response.data.mail);
            setNewMail({ subject: '', content: '' });
            setAttachments([]);
            setUploadProgress(0);
            setTimeout(() => setLoading(false), 1000);
        } catch (error) {
            console.error('Error sending mail:', error);
            setUploadProgress(0);
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setAttachments(files);
        setUploadProgress(0); // Reset progress
    };

    const handleRemoveFile = (index) => {
        setAttachments((prevAttachments) => prevAttachments.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedThread?.mails]);

    return (
        <DialogContent className="!m-0 !p-0 sm:max-w-[1200px]">
            <DialogTitle className="rounded-t-lg border-b border-gray-500 bg-gray-200 !px-5 !py-4 text-lg font-semibold md:text-xl lg:text-2xl">
                {selectedThread.mails[0]?.subject || 'No Subject'}
            </DialogTitle>
            {selectedThread ? (
                <div className="!mt-0 flex h-[70vh] flex-col !pt-0">
                    <div className="!scrollbar-thin !scrollbar-thumb-gray-300 !scrollbar-track-gray-100 !overflow-y-scroll bg-white">
                        {selectedThread.mails.map((mail) => {
                            const sender = mail.sender_id === selectedThread.sender.id ? selectedThread.sender : selectedThread.receiver;
                            return (
                                <Card key={mail.id} className="!rounded-none !border-0 !border-y border-gray-200 bg-white !px-0 py-6 !shadow-none">
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <Avatar className="h-10 w-10 bg-black">
                                                    <AvatarFallback className="text-lg">
                                                        {sender.FirstName[0]}
                                                        {sender.LastName[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="text-base font-semibold text-gray-900 md:text-lg">
                                                        {sender.FirstName} {sender.LastName}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">{sender.email}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 italic">{new Date(mail.created_at).toLocaleString()}</p>
                                        </div>
                                        <div className="mt-4 py-3">
                                            <p className="text-base font-medium text-gray-800 md:text-lg">{mail.subject}</p>
                                            <p className="mt-2 text-sm text-gray-700 md:text-base">{mail.content}</p>

                                            {/* Display attachments */}
                                            {mail.media && mail.media.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="text-sm font-semibold text-gray-900">Attachments</h4>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {mail.media.map((media) => {
                                                            // Check if the media is a PDF
                                                            const isPDF = media.mime_type === 'application/pdf' || media.file_name?.endsWith('.pdf');

                                                            return (
                                                                <div key={media.id} className="relative">
                                                                    {isPDF ? (
                                                                        <a
                                                                            href={route('preview-media', media.id)}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex h-24 w-24 flex-col items-center justify-center rounded-lg border border-gray-300 p-2 transition-colors hover:bg-gray-50"
                                                                        >
                                                                            <FileText className="h-10 w-10 text-red-500" />
                                                                            <span className="mt-1 w-full truncate text-center text-xs">
                                                                                {media.file_name || 'document.pdf'}
                                                                            </span>
                                                                        </a>
                                                                    ) : (
                                                                        <img
                                                                            src={route('preview-media', media.id)}
                                                                            alt="Attachment"
                                                                            className="h-24 w-24 rounded-lg object-cover"
                                                                        />
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="rounded-b-lg border-t bg-white p-5">
                        <Textarea
                            value={newMail.content}
                            onChange={(e) => setNewMail({ ...newMail, content: e.target.value })}
                            placeholder="Reply to this thread..."
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-base shadow-sm focus:ring focus:ring-blue-300 md:text-lg"
                        />

                        {attachments.length > 0 && (
                            <div className="mt-3 w-full">
                                {attachments.map((file, index) => (
                                    <div key={index} className="mb-2 flex items-center justify-between">
                                        <div className="flex w-full items-center gap-2">
                                            <span className="max-w-[70%] truncate text-sm text-gray-700">{file.name}</span>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFile(index)}
                                            className="ml-2 text-sm font-medium text-red-500 hover:text-red-700"
                                        >
                                            ✖
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="jusitfy mt-3 flex items-center">
                            <Button
                                onClick={handleSend}
                                disabled={loading}
                                className={`rounded-full px-6 py-3 text-sm font-medium text-white transition md:text-lg ${loading ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 focus:ring focus:ring-blue-300'}`}
                            >
                                {loading ? 'Sending...' : 'Send'}
                            </Button>

                            {/* File input for attachments */}
                            <div className="flex items-center px-5">
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
                        </div>
                    </div>
                </div>
            ) : (
                <p className="mt-4 text-lg text-gray-500">Select a thread to view the conversation.</p>
            )}
        </DialogContent>
    );
}
