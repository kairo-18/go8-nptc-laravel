import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    username: string;
    FirstName: string;
    LastName: string;
    Address: string;
    Birthdate?: string;
    ContactNumber: string;
    email: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Driver {
    id: number;
    user_id: number;
    Status: 'Active' | 'Inactive' | 'Pending';
    License?: string;
    LicenseNumber: string;
    Photo?: string;
    NBI_clearance?: string;
    Police_clearance?: string;
    BIR_clearance?: string;
    [key: string]: unknown; // This allows for additional properties...
}
