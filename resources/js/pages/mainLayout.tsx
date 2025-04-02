import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Import shadcn Alert components
import { Button } from '@/components/ui/button'; // Optional: For a close button
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react'; // Ensure usePage is imported
import { ReactNode, useEffect, useState } from 'react'; // Import useState
import { getBackgroundColorForRole } from '@/components/UtilsColor';

interface MainLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function MainLayout({ children, breadcrumbs }: MainLayoutProps) {
    const { props } = usePage();  // Use usePage() to access page props
    const userRole = props.auth.user?.roles?.[0]?.name;  // Get user role
    const layoutBgColor = getBackgroundColorForRole(userRole);  // Get background color based on role

    const defaultBreadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Home',
            href: '/',
        },
    ];

    // State for alert visibility
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [company, setCompany] = useState('');

    useEffect(() => {
        // Listen to the new VR Company event
        window.Echo.private('new-vr-company').listen('RegisteredVrCompany', (event) => {
            console.log('New VR Company Event Received:', event);

            setAlertMessage(`${event.vrCompany.Status === 'Pending' ? 'New VR Company Application: ' : 'New VR Company Registered: '}`);
            setShowAlert(true);
            setCompany(event.vrCompany.CompanyName);

            // Optionally hide the alert after 5 seconds
            setTimeout(() => {
                setShowAlert(false);
            }, 5000); // Hide alert after 5 seconds
        });

        // Cleanup Echo listener when component unmounts
        return () => {
            window.Echo.leave('new-vr-company');
        };
    }, []);

    // Use default breadcrumbs if none provided
    const finalBreadcrumbs = breadcrumbs?.length ? breadcrumbs : defaultBreadcrumbs;

    return (
        <div className={`min-h-screen ${layoutBgColor}`}>  {/* Ensure layoutBgColor is applied */}
            <AppLayout breadcrumbs={finalBreadcrumbs}>
                <Head title="Dashboard" />
                <div className="bg-card flex h-full flex-1 flex-col gap-4 rounded-b-xl p-4">
                    {/* Render the alert if showAlert is true */}
                    {showAlert && (
                        <Alert className="fixed top-4 right-4 w-[350px] text-white"> {/* Adjusted top position */}
                            <AlertTitle className="font-bold text-white">{alertMessage}</AlertTitle>
                            <AlertDescription className="text-white">{company}</AlertDescription>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="absolute top-2 right-2" 
                                onClick={() => setShowAlert(false)}  // Close the alert
                            >
                                &times;
                            </Button>
                        </Alert>
                    )}
                    {children}
                </div>
            </AppLayout>    
        </div>
    );
}
