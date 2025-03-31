import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo({ auth }: { auth: { user: { role: string } } }) {
    const { props } = usePage();
       const userRole = props.auth.user?.roles?.[0]?.name;
    
    const roleLabel =
        userRole === "NPTC Super Admin" || userRole === "NPTC Admin"
            ? "NPTC Admin"
            : userRole === "VR Admin"
            ? "VR Admin"
            : userRole === "Operator"
            ? "Operator"
            : userRole === "Driver"
            ? "Driver":"";

    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon className="size-5 fill-current text-white" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">{roleLabel}</span>
            </div>
        </>
    );
}
