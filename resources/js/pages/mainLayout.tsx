import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Import shadcn Alert components
import { Button } from '@/components/ui/button'; // Optional: For a close button
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react'; // Import useState

interface MainLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function MainLayout({ children, breadcrumbs }: MainLayoutProps) {
    const defaultBreadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Home',
            href: '/',
        },
    ];

    // State to control the alert visibility and message
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [company, setCompany] = useState('');

    useEffect(() => {
        // Initialize Echo and listen to the private channel
        window.Echo.private('new-vr-company').listen('RegisteredVrCompany', (event) => {
            console.log('New VR Company Event Received:', event);

            // Set the alert message and show the alert
            setAlertMessage(`${event.vrCompany.Status === 'Pending' ? 'New VR Company Application: ' : 'New VR Company Registered: '}`);
            setShowAlert(true);
            setCompany(event.vrCompany.CompanyName);

            // Optionally, hide the alert after a few seconds
            setTimeout(() => {
                setShowAlert(false);
            }, 5000); // Hide after 5 seconds
        });

        // Cleanup the Echo listener when the component unmounts
        return () => {
            window.Echo.leave('new-vr-company');
        };
    }, []);

    const finalBreadcrumbs = breadcrumbs?.length ? breadcrumbs : defaultBreadcrumbs;

    return (
        <AppLayout breadcrumbs={finalBreadcrumbs}>
            <Head title="Dashboard" />
            <div className="bg-card flex h-full flex-1 flex-col gap-4 rounded-b-xl p-4">
                {/* Render the shadcn Alert component if showAlert is true */}
                {showAlert && (
                    <Alert className="fixed top-15 right-4 w-[350px] text-white">
                        <AlertTitle className="font-bold text-white">{alertMessage}</AlertTitle>
                        <AlertDescription className="text-white">{company}</AlertDescription>
                        {/* Optional: Add a close button */}
                        <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => setShowAlert(false)}>
                            &times;
                        </Button>
                    </Alert>
                )}
                {children}
            </div>
        </AppLayout>
    );
}
