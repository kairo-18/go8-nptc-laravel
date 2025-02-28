import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';

interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="bg-white text-black w-full max-w-full flex h-full max-h-full flex-col items-center justify-center gap-8 p-4 md:p-8 lg:p-12 rounded-r-md border-0 md:border-2 border-gray-300 border-l-0 overflow-hidden">
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
                <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
                    <div className="flex flex-col items-center gap-4 md:gap-6">
                        <Link href={route('home')} className="flex flex-col items-center gap-2 md:gap-4 font-medium">
                            <div className="mb-2 flex items-center justify-center rounded-md">
                                <AppLogoIcon />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 md:space-y-4 text-center">
                            <h1 className="text-2xl md:text-3xl font-extrabold text-[#2A2A92]">{title}</h1>
                            <p className="text-center text-sm md:text-base text-gray-500">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
