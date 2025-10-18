import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ubah Pengguna',
        href: '/manage/user',
    },
];
export default function edit() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ubah Pengguna" />
        </AppLayout>
    );
}
