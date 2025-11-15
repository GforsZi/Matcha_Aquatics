import HeaderLayout from '@/layouts/app/app-header-layout';
import SidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({
    children,
    breadcrumbs,
    ...props
}: AppLayoutProps) {
    const { auth } = usePage().props as any;

    const roles: string[] = auth?.user?.role ?? [];

    const isSeller = roles.includes('seller');
    const LayoutComponent = isSeller ? SidebarLayout : HeaderLayout;

    return (
        <LayoutComponent breadcrumbs={breadcrumbs} {...props}>
            {children}
        </LayoutComponent>
    );
}
