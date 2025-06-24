import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LogOut, Settings } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    // Animation variants
    const menuItemVariants = {
        hidden: { opacity: 0, y: -5 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 20,
            },
        },
    };

    const hoverVariants = {
        hover: {
            scale: 1.02,
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            transition: {
                duration: 0.15,
                ease: 'easeOut',
            },
        },
        tap: {
            scale: 0.98,
        },
    };

    const logoutHoverVariants = {
        hover: {
            scale: 1.02,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            transition: {
                duration: 0.15,
                ease: 'easeOut',
            },
        },
        tap: {
            scale: 0.98,
        },
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={menuItemVariants}
                    className="flex items-center gap-2 px-2 py-3 text-left text-sm"
                >
                    <UserInfo user={user} showEmail={true} />
                </motion.div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="mx-2 bg-gray-200/30" />

            <DropdownMenuGroup>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={menuItemVariants}
                    whileHover="hover"
                    whileTap="tap"
                    variants={hoverVariants}
                    className="mx-1 my-1 rounded-lg"
                >
                    <DropdownMenuItem asChild className="focus:bg-transparent">
                        <Link
                            className="flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors duration-150 hover:bg-gray-100"
                            href={route('profile.edit')}
                            as="button"
                            prefetch
                            onClick={cleanup}
                        >
                            <motion.span className="mr-3" whileHover={{ scale: 1.2 }} transition={{ type: 'spring', stiffness: 500 }}>
                                <Settings className="h-4 w-4" />
                            </motion.span>
                            <motion.span whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 500 }}>
                                Settings
                            </motion.span>
                        </Link>
                    </DropdownMenuItem>
                </motion.div>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="mx-2 bg-gray-200/30" />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={menuItemVariants}
                whileHover="hover"
                whileTap="tap"
                variants={logoutHoverVariants}
                className="mx-1 my-1 rounded-lg"
            >
                <DropdownMenuItem asChild className="focus:bg-transparent">
                    <Link
                        className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-red-600 transition-colors duration-150 hover:bg-red-50"
                        method="post"
                        href={route('logout')}
                        as="button"
                        onClick={cleanup}
                    >
                        <motion.span className="mr-3" whileHover={{ scale: 1.2 }} transition={{ type: 'spring', stiffness: 500 }}>
                            <LogOut className="h-4 w-4" />
                        </motion.span>
                        <motion.span whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 500 }}>
                            Log out
                        </motion.span>
                    </Link>
                </DropdownMenuItem>
            </motion.div>
        </>
    );
}
