import { SidebarProvider } from '@/components/ui/sidebar';
import { getSidebarState, setSidebarState } from '@/utils/sidebarSync';
import { useEffect, useState } from 'react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(getSidebarState());

    // Saat state berubah → simpan ke localStorage
    useEffect(() => {
        setSidebarState(isSidebarOpen);
    }, [isSidebarOpen]);

    // Dengarkan event dari komponen lain → update langsung tanpa reload
    useEffect(() => {
        const syncSidebar = () => {
            setIsSidebarOpen(getSidebarState());
        };

        window.addEventListener('sidebar-toggle', syncSidebar);
        return () => window.removeEventListener('sidebar-toggle', syncSidebar);
    }, []);

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">{children}</div>
        );
    }

    return (
        <SidebarProvider defaultOpen={isSidebarOpen}>
            {children}
        </SidebarProvider>
    );
}
