import ComposeMail from '@/components/Mail/compose-mail';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MainLayout from './mainLayout';
import echo from '@/echo'; // Import the Echo instance
import { usePage } from '@inertiajs/react';
import MainMailContent from '@/components/Mail/main-mail-content'; // Import the modal component
import { Dialog, DialogContent } from '@/components/ui/dialog'; // Import Dialog and DialogContent

export default function Mails() {
    const [selectedThreads, setSelectedThreads] = useState(new Set());
    const [threads, setThreads] = useState([]);
    const [filteredThreads, setFilteredThreads] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('');
    const auth = usePage().props.auth;
    const [selectedThread, setSelectedThread] = useState(null); // Track the selected thread

    const breadcrumbs = [
        {
            title: 'Mails',
            href: '/mails',
        },
    ];

    const handleHeaderCheckboxClick = () => {
        if (selectedThreads.size === filteredThreads.length) {
            // If all are selected, deselect all
            setSelectedThreads(new Set());
        } else {
            // Otherwise, select all
            const allThreadIds = new Set(filteredThreads.map(thread => thread.id));
            setSelectedThreads(allThreadIds);
        }
    };

    const isAllSelected = selectedThreads.size === filteredThreads.length;
    const isIndeterminate = selectedThreads.size > 0 && selectedThreads.size < filteredThreads.length;

    const handleThreadCheckboxClick = (threadId) => {
        const newSelectedThreads = new Set(selectedThreads);
        if (newSelectedThreads.has(threadId)) {
            newSelectedThreads.delete(threadId); // Deselect
        } else {
            newSelectedThreads.add(threadId); // Select
        }
        setSelectedThreads(newSelectedThreads);
    };

    const markThreadAsRead = async (threadId) => {
        try {
            await axios.put(`mails/mark-read/${threadId}`);
            setThreads((prevThreads) =>
                prevThreads.map((thread) =>
                    thread.id === threadId
                        ? {
                              ...thread,
                              mails: thread.mails.map((mail) => ({ ...mail, is_read: true })), // Mark all mails as read
                          }
                        : thread
                )
            );
        } catch (error) {
            console.error('Error marking thread as read:', error);
        }
    };

    const handleRowClick = (thread) => {
        if (!thread.mails.every(mail => mail.is_read)) {
            markThreadAsRead(thread.id); // Mark the thread as read
        }
        setSelectedThread(thread); // Open the modal
    };

    useEffect(() => {
        axios.get('mails/threads').then((response) => {
            setThreads(response.data.threads);
            setFilteredThreads(response.data.threads);
            console.log(response.data.threads);
        })
        .catch((error) => {
            console.error('Error fetching mail threads:', error);
        });
    }, []);

    useEffect(() => {
        let filtered = threads;
        if (searchQuery) {
            filtered = filtered.filter(thread =>
                thread.receiver.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                thread.mails.some(mail => mail.subject.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }
        if (filter === 'Read') {
            filtered = filtered.filter(thread => thread.mails.every(mail => mail.is_read));
        } else if (filter === 'Unread') {
            filtered = filtered.filter(thread => !thread.mails.every(mail => mail.is_read));
        } else if (filter === 'Date (Latest)') {
            filtered = [...filtered].sort((a, b) => new Date(b.mails[b.mails.length - 1].created_at) - new Date(a.mails[a.mails.length - 1].created_at));
        } else if (filter === 'Date (Oldest)') {
            filtered = [...filtered].sort((a, b) => new Date(a.mails[a.mails.length - 1].created_at) - new Date(b.mails[b.mails.length - 1].created_at));
        }
        setFilteredThreads(filtered);
    }, [searchQuery, filter, threads]);

    useEffect(() => {
        console.log(`user.${auth.user.id}`);
        window.Echo.private(`user.${auth.user.id}`).listen('NewThreadCreated', (event) => {
            console.log('New thread received:', event);
            setThreads((prevThreads) => [...prevThreads, event.thread]);
        });

        // Listen for MailMarkedAsRead event
        window.Echo.private(`user.${auth.user.id}`).listen('MailMarkedAsRead', (event) => {
            console.log('Mail marked as read:', event);
            setThreads((prevThreads) =>
                prevThreads.map((thread) =>
                    thread.id === event.threadId
                        ? {
                              ...thread,
                              mails: thread.mails.map((mail) =>
                                  mail.id === event.mailId ? { ...mail, is_read: true } : mail
                              ),
                          }
                        : thread
                )
            );
        });

        return () => {
            window.Echo.leave(`user.${auth.user.id}`);
        };
    }, []);

    useEffect(() => {
        if (threads.length === 0) return;
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
    },[threads]);

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <Input
                        className="w-1/3"
                        placeholder="Search from mails"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className='text-white'>Filter</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {['Read', 'Unread', 'Date (Latest)', 'Date (Oldest)'].map(option => (
                                    <DropdownMenuItem key={option} onClick={() => setFilter(option)}>
                                        {option}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <ComposeMail />
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    ref={(el) => {
                                        if (el) {
                                            el.indeterminate = isIndeterminate;
                                        }
                                    }}
                                    onChange={handleHeaderCheckboxClick}
                                />
                            </TableHead>
                            <TableHead>To/From</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredThreads.map((thread) => (
                            <TableRow
                                key={thread.id}
                                onClick={() => handleRowClick(thread)}
                                className={`cursor-pointer ${
                                    thread.mails.every(mail => mail.is_read) ? 'bg-gray-100' : 'bg-white'
                                } hover:bg-gray-200`}
                            >
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        checked={selectedThreads.has(thread.id)}
                                        onChange={() => handleThreadCheckboxClick(thread.id)}
                                        onClick={(e) => e.stopPropagation()} // Prevent row click event
                                    />
                                </TableCell>
                                <TableCell>{thread.receiver.FirstName} {thread.receiver.LastName}</TableCell>
                                <TableCell className="font-medium">{thread.mails[thread.mails.length - 1]?.subject}</TableCell>
                                <TableCell className={thread.mails.every(mail => mail.is_read) ? 'text-green-600' : 'text-red-600'}>
                                    {thread.mails.every(mail => mail.is_read) ? 'Read' : 'Unread'}
                                </TableCell>
                                <TableCell>
                                    {new Date(thread.mails[thread.mails.length - 1]?.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'short', day: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost">...</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>Pin to top</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Render the Modal */}
                <Dialog open={!!selectedThread} onOpenChange={(open) => !open && setSelectedThread(null)}>
                    {selectedThread && (
                        <MainMailContent
                            selectedThread={selectedThread}
                            auth={auth}
                            onClose={() => setSelectedThread(null)}
                        />
                    )}
                </Dialog>
            </div>
        </MainLayout>
    );
}
