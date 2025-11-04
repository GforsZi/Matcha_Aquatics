import { DataTable } from '@/components/data-table';
import DropdownTable from '@/components/dropdown-table';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { formatDate } from '@/utils/date';
import { Head, Link, usePage } from '@inertiajs/react';
import { IconPlus } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kelola Transaksi',
        href: '/manage/transaction',
    },
];

interface transaction {
    id: number;
    trx_buyer_id: number;
    trx_payment_status: '1' | '2' | '3' | '4';
    trx_status: '1' | '2' | '3' | '4' | '5' | '6' | '7';
    trx_created_at: Date;
    user: { name: string };
}

export const columns: ColumnDef<transaction>[] = [
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
        accessorFn: (row) => row.user?.name || '-',
        id: 'user_name',
        header: 'Nama',
        cell: ({ getValue }) => (
            <div className="capitalize">{getValue() as string}</div>
        ),
    },
    {
        accessorKey: 'trx_payment_status',
        header: () => <div className="text-left">Status pembayaran</div>,
        cell: ({ row }) => {
            const status = row.getValue('trx_payment_status') as string;

            let label = '';
            let color = '';

            switch (status) {
                case '1':
                    label = 'Menunggu';
                    color = 'text-green-500';
                    break;
                case '2':
                    label = 'Terbayar';
                    color = 'text-yellow-600';
                    break;
                case '3':
                    label = 'Gagal';
                    color = 'text-gray-600';
                    break;
                case '4':
                    label = 'Kedaluwarsa';
                    color = 'text-gray-600';
                    break;
            }

            return (
                <div className={`font-medium capitalize ${color}`}>{label}</div>
            );
        },
    },
    {
        accessorKey: 'trx_status',
        header: () => <div className="text-left">Status transaksi</div>,
        cell: ({ row }) => {
            const status = row.getValue('trx_status') as string;

            let label = '';
            let color = '';

            switch (status) {
                case '1':
                    label = 'Tertunda';
                    color = 'text-green-500';
                    break;
                case '2':
                    label = 'Terbayar';
                    color = 'text-yellow-600';
                    break;
                case '3':
                    label = 'Diproses';
                    color = 'text-gray-600';
                    break;
                case '4':
                    label = 'Dikirim';
                    color = 'text-gray-600';
                    break;
                case '5':
                    label = 'Terkirim';
                    color = 'text-gray-600';
                    break;
                case '6':
                    label = 'Dibatalkan';
                    color = 'text-gray-600';
                    break;
                case '7':
                    label = 'Dikembalikan';
                    color = 'text-gray-600';
                    break;
            }

            return (
                <div className={`font-medium capitalize ${color}`}>{label}</div>
            );
        },
    },
    {
        accessorKey: 'trx_created_at',
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
            <div className="lowercase">{row.getValue('trx_created_at')}</div>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const transaction = row.original;

            return (
                <>
                    <DropdownTable data={transaction} page={'transaction'} />
                </>
            );
        },
    },
];
export default function index() {
    const { transactions } = usePage<{
        transactions: {
            data: transaction[];
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
    const manipulateData = (data: transaction[]) => {
        return data.map((item) => {
            const manipulatedItem: any = { ...item };
            if (item.trx_created_at) {
                manipulatedItem.trx_created_at = formatDate(
                    item.trx_created_at,
                );
            }

            return manipulatedItem;
        });
    };
    const formattedData = manipulateData(transactions.data);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola transaksi" />
            <div className="mx-5 mt-5">
                <div className="mb-5 flex items-center justify-end px-4 lg:px-6">
                    <Button
                        variant={'default'}
                        asChild
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        <Link href={'/manage/transaction/add'}>
                            <IconPlus />
                            <span>Tambah transaksi</span>
                        </Link>
                    </Button>
                </div>
                <Toaster position="top-center" richColors closeButton />
                <DataTable
                    search={{ header: 'nama peminjam', value: 'user_name' }}
                    columns={columns}
                    data={formattedData}
                    link={transactions.links}
                />
            </div>
        </AppLayout>
    );
}
