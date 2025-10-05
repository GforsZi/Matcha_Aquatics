import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

import DropdownTable from '@/components/dropdown-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kelola pengguna',
        href: '/manage/user',
    },
];

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface user {
    usr_id: number;
    name: string;
    email: string;
}

export const columns: ColumnDef<user>[] = [
    {
        accessorKey: 'usr_id',
        header: () => <div className="text-left">ID</div>,
    },
    {
        accessorKey: 'email',
        header: () => <div className="text-left">Email</div>,
    },
    {
        accessorKey: 'name',
        header: 'name',
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const user = row.original;

            return (
                <>
                    <DropdownTable user={user} page={'user'} />
                </>
            );
        },
    },
];

export default function user() {
    const { users } = usePage<{
        users: {
            data: user[];
            links: { url: string | null; label: string; active: boolean }[];
        };
    }>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola pengguna" />
            <div className="mx-5 mt-5">
                <DataTable
                    columns={columns}
                    data={users.data}
                    link={users.links}
                />
            </div>
        </AppLayout>
    );
}
