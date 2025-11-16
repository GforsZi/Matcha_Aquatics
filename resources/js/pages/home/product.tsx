import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Detail Produk',
        href: '/product',
    },
];

export default function Product() {
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
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Detail Produk" />
                <Toaster position="top-center" richColors closeButton />
            </AppLayout>
        </>
    );
}
