// Utility functions to get colors based on user roles

// getBackgroundColorForRole for the sidebar background color
export function getBackgroundColorForRole(userRole: string | undefined): string {
    switch (userRole) {
        case 'VR Admin':
            return 'bg-[#252583]';
        case 'Operator':
            return 'bg-[#212174]';
        case 'Driver':
            return 'bg-[#1d1d66]';
        default:
            return 'bg-[#2A2A92]';
    }
}

// getBadgeColorForRole for the badge color in the header
export function getBadgeColorForRole(userRole: string | undefined): string {
    switch (userRole) {
        case 'VR Admin':
            return 'bg-red-600';
        case 'Operator':
            return 'bg-yellow-500';
        case 'Driver':
            return 'bg-green-600';
        case 'Temp User':
            return 'bg-purple-600';
        case 'Temp User Operator':
            return 'bg-blue-600';
        default:
            return 'bg-gray-600';
    }
}
