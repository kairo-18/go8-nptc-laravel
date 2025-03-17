import { Button } from '@/components/ui/button';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function MainMailContent({ selectedThread, auth }) {
    const [newMail, setNewMail] = useState({ subject: '', content: '' });
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const handleSend = async () => {
        if (!selectedThread) return;

        setLoading(true);
        const recipientEmail = selectedThread.sender.id === auth.user.id ? selectedThread.receiver.email : selectedThread.sender.email;
        const originalSubject = selectedThread.mails[0]?.subject || 'No Subject';

        try {
            await axios.post('mails/new-mail', {
                email: recipientEmail,
                subject: originalSubject,
                content: newMail.content,
                is_read: true,
            });
            console.log('Mail sent:', newMail);
            setNewMail({ subject: '', content: '' });
            setTimeout(() => setLoading(false), 1000);
        } catch (error) {
            console.error('Error sending mail:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedThread?.mails]);

    return (
        <DialogContent className="sm:max-w-[1200px] !m-0 !p-0">
            <DialogTitle className="bg-gray-200 border-b border-gray-500 !px-5 !py-4 text-lg md:text-xl lg:text-2xl font-semibold rounded-t-lg">
                {selectedThread.mails[0]?.subject || 'No Subject'}
            </DialogTitle>
            {selectedThread ? (
                <div className="flex flex-col h-[70vh] !pt-0 !mt-0">
                    <div className="!overflow-y-scroll bg-white !scrollbar-thin !scrollbar-thumb-gray-300 !scrollbar-track-gray-100">
                        {selectedThread.mails.map((mail) => {
                            const sender = mail.sender_id === selectedThread.sender.id ? selectedThread.sender : selectedThread.receiver;
                            return (
                                <Card key={mail.id} className="!shadow-none !rounded-none bg-white py-6 !border-0 border-gray-200 !border-y !px-0">
                                    <CardContent>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-4">
                                                <Avatar className="h-10 w-10 bg-black">
                                                    <AvatarFallback className="text-lg">
                                                        {sender.FirstName[0]}{sender.LastName[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="text-base md:text-lg font-semibold text-gray-900">{sender.FirstName} {sender.LastName}</h3>
                                                    <p className="text-sm text-gray-500">{sender.email}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 italic">{new Date(mail.created_at).toLocaleString()}</p>
                                        </div>
                                        <div className="mt-4 py-3">
                                            <p className="text-base md:text-lg font-medium text-gray-800">{mail.subject}</p>
                                            <p className="mt-2 text-sm md:text-base text-gray-700">{mail.content}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="border-t bg-white p-5 rounded-b-lg">
                        <Textarea
                            value={newMail.content}
                            onChange={(e) => setNewMail({ ...newMail, content: e.target.value })}
                            placeholder="Reply to this thread..."
                            className="w-full rounded-lg border border-gray-300 p-4 focus:ring focus:ring-blue-300 shadow-sm bg-gray-50 text-base md:text-lg"
                        />
                        <div className="mt-3 flex items-center justify-between">
                            <Button
                                onClick={handleSend}
                                disabled={loading}
                                className={`rounded-full px-6 py-3 text-white text-sm md:text-lg font-medium transition
                                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring focus:ring-blue-300'}`}
                            >
                                {loading ? "Sending..." : "Send"}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="mt-4 text-gray-500 text-lg">Select a thread to view the conversation.</p>
            )}
        </DialogContent>
    );
}
