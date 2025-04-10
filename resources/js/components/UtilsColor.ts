// UtilsColors.ts
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
