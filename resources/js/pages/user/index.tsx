import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

import DropdownTable from '@/components/dropdown-table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/date';
import { IconPlus } from '@tabler/icons-react';
import { CheckCircle, ShieldAlert } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kelola Pengguna',
        href: '/manage/user',
    },
];

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface user {
    id: number;
    name: string;
    email: string;
    usr_created_at: Date;
}

export const columns: ColumnDef<user>[] = [
    {
        accessorKey: 'id',
        header: () => <div className="text-left">ID</div>,
    },
    {
        accessorKey: 'email',
        header: () => <div className="text-left">Email</div>,
    },
    {
        accessorKey: 'name',
        header: 'Nama',
    },
    {
        accessorKey: 'usr_created_at',
        header: 'Tanggal',
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const user = row.original;

            return (
                <>
                    <DropdownTable data={user} page={'user'} />
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
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string };
    const manipulateData = (data: user[]) => {
        return data.map((item) => {
            const manipulatedItem: any = { ...item };
            if (item.usr_created_at) {
                manipulatedItem.usr_created_at = formatDate(
                    item.usr_created_at,
                );
            }

            return manipulatedItem;
        });
    };
    const formattedData = manipulateData(users.data);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola pengguna" />
            <div className="mx-5 mt-5">
                <div className="mb-5 flex items-center justify-end px-4 lg:px-6">
                    <Button
                        variant={'default'}
                        asChild
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        <Link href={'/manage/user/add'}>
                            <IconPlus />
                            <span>Tambah Akun</span>
                        </Link>
                    </Button>
                </div>
                {flash?.success && (
                    <Alert
                        variant="default"
                        className="mb-4 border-green-500 bg-green-300"
                    >
                        <CheckCircle />
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}
                {flash?.error && (
                    <Alert
                        variant="default"
                        className="mb-4 border-red-500 bg-red-300"
                    >
                        <ShieldAlert />
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}
                <DataTable
                    columns={columns}
                    data={formattedData}
                    link={users.links}
                />
            </div>
        </AppLayout>
    );
}
