import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react'; // This is used to get the current user info from Inertia

// Define the context and provider
const UnreadCountContext = createContext({
    totalUnreadCount: 0,
    setTotalUnreadCount: (count: number) => {},
});

export const UnreadCountProvider: React.FC = ({ children }) => {
    const [totalUnreadCount, setTotalUnreadCount] = useState<number>(0);
    const [threads, setThreads] = useState<any[]>([]); // To hold the threads data
    const auth = usePage().props.auth; // Get the current authenticated user

    // Fetch mail threads for the current user
    useEffect(() => {
        const fetchMailThreads = async () => {
            try {
                const response = await axios.get('mails/threads');
                setThreads(response.data.threads); // Set the threads data
            } catch (error) {
                console.error('Error fetching mail threads:', error);
            }
        };

        fetchMailThreads();
    }, [auth.user.id]); // Fetch threads when the user ID changes (when user is authenticated)

    // Track changes in threads and update unread count
    useEffect(() => {
        const calculateUnreadCount = () => {
            
            const unreadCount = threads.reduce(
                (count, thread) => {
                    // Only count mails where the receiver_id matches the current user's ID
                    if (thread.receiver.id === auth.user.id) {
                        return count + thread.mails.filter((mail) => !mail.is_read).length;
                    }
                    return count;
                },
                0 // Initialize the unread count to 0
            );
            setTotalUnreadCount(unreadCount); // Update the unread count
        };

        calculateUnreadCount(); // Re-calculate unread count whenever threads change
    }, [threads, auth.user.id]); // Depend on threads and user ID

    return (
        <UnreadCountContext.Provider value={{ totalUnreadCount, setTotalUnreadCount }}>
            {children}
        </UnreadCountContext.Provider>
    );
};

// Custom hook to access the context
export const useUnreadCount = () => useContext(UnreadCountContext);
