import { AppHero } from '@/components/app-hero';
import UserLayout from '@/layouts/user-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/home',
    },
];

export default function index() {
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string };
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);
    return (
        <UserLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <AppHero />
            <Toaster position="top-center" richColors closeButton />
            <div className="@container/main flex flex-1 flex-col gap-2"></div>
        </UserLayout>
    );
}
