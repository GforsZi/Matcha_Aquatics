import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

import DropdownTable from '@/components/dropdown-table';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/date';
import { IconPlus } from '@tabler/icons-react';
import { ArrowUpDown } from 'lucide-react';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kelola Pengguna',
        href: '/manage/user',
    },
];

interface user {
    id: number;
    name: string;
    email: string;
    usr_created_at: Date;
}

export const columns: ColumnDef<user>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    ID
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="ml-3 lowercase">{row.getValue('id')}</div>
        ),
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
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Tanggal
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue('usr_created_at')}</div>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const user = row.original;

            return (
                <>
                    <DropdownTable
                        data={user}
                        page={'user'}
                        showDetail
                        showEdit
                        showDelete
                    />
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
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);
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
                <Toaster position="top-center" richColors closeButton />
                <DataTable
                    search={{ header: 'email pengguna', value: 'email' }}
                    columns={columns}
                    data={formattedData}
                    link={users.links}
                />
            </div>
        </AppLayout>
    );
}
