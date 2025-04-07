import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { getBackgroundColorForRole } from '@/components/UtilsColor';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';
import { UnreadCountProvider } from '../pages/UnreadCountContext';

interface MainLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function MainLayout({ children, breadcrumbs }: MainLayoutProps) {
    const { props } = usePage();
    const userRole = props.auth.user?.roles?.[0]?.name;
    const layoutBgColor = getBackgroundColorForRole(userRole);
    const auth = props.auth;

    const defaultBreadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Home',
            href: '/',
        },
    ];

    // State for alert visibility
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [senderName, setSenderName] = useState('');
    const [subject, setSubject] = useState('');

    useEffect(() => {
        if (!auth?.user?.id) return;

        const channel = window.Echo.private(`user.${auth.user.id}`);

        // Listen for new messages in existing threads
        channel.listen('MailReceive', (event) => {
            console.log('New Mail Event Received:', event);

            // Determine if the current user is the receiver
            const isCurrentUserReceiver = auth.user.id === event.receiver.id;

            // Only show alert if current user is the receiver
            if (!isCurrentUserReceiver) return;

            const senderFullName = `${event.sender.FirstName} ${event.sender.LastName}`.trim();

            setAlertMessage('New message received from:');
            setSenderName(senderFullName);
            setSubject(event.last_mail?.subject || 'No subject');
            setShowAlert(true);

            setTimeout(() => setShowAlert(false), 5000);
        });

        // Listen for new thread creation
        channel.listen('NewThreadCreated', (event) => {
            console.log('New Thread Event Received:', event);

            // Determine if the current user is the receiver
            const isCurrentUserReceiver = auth.user.id === event.thread.receiver.id;

            // Only show alert if current user is the receiver
            if (!isCurrentUserReceiver) return;

            const senderFullName = `${event.thread.sender.FirstName} ${event.thread.sender.LastName}`.trim();

            setAlertMessage('New message thread from:');
            setSenderName(senderFullName);
            setSubject(event.thread.mails[0]?.subject || 'No subject');
            setShowAlert(true);

            setTimeout(() => setShowAlert(false), 5000);
        });

        // Cleanup Echo listeners when component unmounts
        return () => {
            channel.stopListening('MailReceive');
            channel.stopListening('NewThreadCreated');
            window.Echo.leave(`user.${auth.user.id}`);
        };
    }, [auth?.user?.id]);

    // Use default breadcrumbs if none provided
    const finalBreadcrumbs = breadcrumbs?.length ? breadcrumbs : defaultBreadcrumbs;

    return (
        <div className={`min-h-screen ${layoutBgColor}`}>
            <UnreadCountProvider>
                <AppLayout breadcrumbs={finalBreadcrumbs}>
                    <Head title="Dashboard" />
                    <div className="bg-card flex h-full flex-1 flex-col gap-4 rounded-b-xl p-4">
                        {showAlert && (
                            <Alert className="fixed top-4 right-4 w-[380px] text-white">
                                <AlertTitle className="font-bold text-white">{alertMessage}</AlertTitle>
                                <AlertDescription className="text-white">
                                    <div className="font-semibold">{senderName}</div>
                                    <div className="text-sm opacity-80">Subject: {subject}</div>
                                </AlertDescription>
                                <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => setShowAlert(false)}>
                                    &times;
                                </Button>
                            </Alert>
                        )}
                        {children}
                    </div>
                </AppLayout>
            </UnreadCountProvider>
            
        </div>
    );
}
