import ComposeMail from '@/components/Mail/compose-mail';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import echo from '@/echo'; // Import the Echo instance
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import MainLayout from './mainLayout';

export default function Mails() {
    const [threads, setThreads] = useState([]);
    const [selectedThread, setSelectedThread] = useState(null);
    const messagesEndRef = useRef(null);
    const [newMail, setNewMail] = useState({ email: '', subject: '', content: '' });
    const auth = usePage().props.auth;

    const handleSend = async () => {
        if (!selectedThread) return;

        // Determine the recipient email
        const recipientEmail =
            selectedThread.sender.id === auth.user.id
                ? selectedThread.receiver.email // If logged-in user is the sender, send to receiver
                : selectedThread.sender.email; // Otherwise, send to sender

        try {
            const response = await axios.post('mails/new-mail', {
                email: recipientEmail, // Pass the correct email
                subject: newMail.subject,
                content: newMail.content,
            });

            console.log('Mail sent:', response.data.mail);
        } catch (error) {
            console.error('Error sending mail:', error);
        }
    };

    useEffect(() => {
        console.log(`user.${auth.user.id}`);
        window.Echo.private(`user.${auth.user.id}`).listen('NewThreadCreated', (event) => {
            console.log('New thread received:', event);
            setThreads((prevThreads) => [...prevThreads, event.thread]);
        });

        return () => {
            window.Echo.leave(`user.${auth.user.id}`);
        };
    }, []);

    useEffect(() => {
        axios
            .get('mails/threads')
            .then((response) => {
                setThreads(response.data.threads);
                console.log(response.data.threads);
            })
            .catch((error) => {
                console.error('Error fetching mail threads:', error);
            });
    }, []);

    useEffect(() => {
        // ✅ Listen for real-time updates
        const threadIds = threads.map((thread) => thread.id);
        threadIds.forEach((threadId) => {
            console.log('Trying to listen to ' + 'thread' + threadId);
            window.Echo.private(`thread.${threadId}`).listen('MailReceive', (event) => {
                console.log('New mail received:', event);

                // Update state with the new message
                setThreads((prevThreads) =>
                    prevThreads.map((thread) => (thread.id === event.id ? { ...thread, mails: [...thread.mails, event.last_mail] } : thread)),
                );

                // If currently viewing the thread, update messages
                if (selectedThread?.id === event.id) {
                    setSelectedThread((prevThread) => ({
                        ...prevThread,
                        mails: [...prevThread.mails, event.last_mail],
                    }));
                }
            });
        });

        return () => {
            threadIds.forEach((threadId) => {
                echo.leave(`thread.${threadId}`);
            });
        };
    });

    return (
        <MainLayout>
            <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-2/7 overflow-y-auto border-r p-4">
                    <div className="mb-5 flex w-full justify-between">
                        <h2 className="mb-4 text-lg font-bold">Mails</h2>
                        <ComposeMail />
                    </div>
                    {threads.map((thread) => (
                        <Card
                            key={thread.id}
                            className={`cursor-pointer rounded-lg border border-gray-200 bg-white text-gray-900 shadow-md transition-all ${
                                selectedThread?.id === thread.id ? 'border-blue-500 bg-blue-50' : ''
                            }`}
                            onClick={() => setSelectedThread(thread)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-800">
                                        {thread.mails.length > 0 && thread.mails[thread.mails.length - 1].sender_id === auth.user.id
                                            ? 'To: '
                                            : 'From: '}{' '}
                                        {thread.receiver.FirstName + ' ' + thread.receiver.LastName}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {new Date(thread.mails[thread.mails.length - 1].created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-600">{thread.receiver.email}</p>
                                <p className="mt-2 text-sm font-medium text-gray-700">{thread.mails[thread.mails.length - 1].subject}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {/* Main Content */}
                <div className="flex h-[85vh] w-5/7 flex-col p-4">
                    {selectedThread ? (
                        <>
                            {/* Scrollable Chat History */}
                            <div className="flex-1 space-y-4 overflow-y-auto p-2">
                                {selectedThread.mails.map((mail) => {
                                    const sender = mail.sender_id === selectedThread.sender.id ? selectedThread.sender : selectedThread.receiver;
                                    return (
                                        <Card key={mail.id} className="rounded-lg border border-gray-200 bg-white shadow-sm">
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarFallback>
                                                                {sender.FirstName[0]}
                                                                {sender.LastName[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <h3 className="text-sm font-semibold text-gray-900">
                                                                {sender.FirstName} {sender.LastName}
                                                            </h3>
                                                            <p className="text-xs text-gray-500">{sender.email}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(mail.created_at).toLocaleString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: true,
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="mt-3">
                                                    <p className="text-sm font-medium text-gray-800">{mail.subject}</p>
                                                    <p className="mt-2 text-sm text-gray-700">{mail.content}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                                {/* Auto-scroll to bottom */}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Fixed Input Box */}
                            <div className="sticky bottom-0 left-0 w-full border-t bg-white p-4 pt-4 shadow-md">
                                <Input
                                    type="text"
                                    placeholder="Subject"
                                    value={newMail.subject}
                                    onChange={(e) => setNewMail({ ...newMail, subject: e.target.value })}
                                />
                                <Textarea
                                    value={newMail.content}
                                    onChange={(e) => setNewMail({ ...newMail, content: e.target.value })}
                                    placeholder="Type a email content..."
                                    className="w-full rounded-md border border-gray-300 p-2 focus:ring focus:ring-blue-300"
                                />
                                <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center space-x-2 text-gray-500"></div>
                                    <Button onClick={handleSend} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                                        Send
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="mt-4 text-gray-500">Select a thread to view the conversation.</p>
                    )}
                </div>{' '}
            </div>
        </MainLayout>
    );
}
