export function useInitials() {
    const getInitials = (FirstName: string, LastName: string): string => {
        const fullName = FirstName + ' ' + LastName;
        const names = fullName.trim().split(' ');

        if (names.length === 0) return '';
        if (names.length === 1) return names[0].charAt(0).toUpperCase();

        const firstInitial = names[0].charAt(0);
        const lastInitial = names[names.length - 1].charAt(0);

        return `${firstInitial}${lastInitial}`.toUpperCase();
    };

    return getInitials;
}
