// UtilsColors.ts
export function getBackgroundColorForRole(userRole: string | undefined): string {
    switch (userRole) {
        case 'VR Admin':
            return 'bg-[#A41316]'; // Secondary color for VR Admin
        case 'Operator':
            return 'bg-[#AF921A]'; // Tertiary color for Operator
        case 'Driver':
            return 'bg-[#006D54]'; // New color for Driver
        default:
            return 'bg-[#2A2A92]'; // Primary color for other roles (default)
    }
}
