import { DataTable } from '@/components/data-table';
import DropdownTable from '@/components/dropdown-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { formatDate } from '@/utils/date';
import { Head, Link, usePage } from '@inertiajs/react';
import { IconPlus } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kelola Transaksi',
        href: '/manage/transaction',
    },
];

interface transaction {
    id: number;
    trx_buyer_name: string;
    trx_status: '1' | '2' | '3' | '4';
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
        accessorKey: 'trx_buyer_name',
        header: 'Nama',
    },
    {
        accessorKey: 'trx_payment_method',
        header: () => <div className="text-left">Metode pembayaran</div>,
        cell: ({ row }) => {
            const status = row.getValue('trx_payment_method') as string;

            let label = '';
            let color = '';

            switch (status) {
                case '1':
                    label = 'Tunai';
                    color = 'text-green-500';
                    break;
                case '2':
                    label = 'Non-tunai';
                    color = 'text-sky-600';
                    break;
                case '3':
            }

            return <div className={`font-medium ${color}`}>{label}</div>;
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
                    label = 'Menunggu pembayaran';
                    color = 'text-yellow-600';
                    break;
                case '2':
                    label = 'Pembayaran berhasil';
                    color = 'text-blue-600';
                    break;
                case '3':
                    label = 'Menunggu pengiriman';
                    color = 'text-yellow-600';
                    break;
                case '4':
                    label = 'Pengiriman berhasil';
                    color = 'text-blue-600';
                    break;
                case '5':
                    label = 'Transaksi selesai';
                    color = 'text-green-600';
                    break;
                case '6':
                    label = 'Transaksi gagal';
                    color = 'text-red-600';
                    break;
            }

            return <div className={`font-medium ${color}`}>{label}</div>;
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
                    <DropdownTable
                        data={transaction}
                        page={'transaction'}
                        showDetail
                        showDelete
                    />
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
                        className="bg-emerald-600 text-stone-950 hover:bg-emerald-700"
                    >
                        <Link href={'/manage/transaction/add'}>
                            <IconPlus />
                            <span>Tambah transaksi </span>
                        </Link>
                    </Button>
                </div>
                <Toaster position="top-center" richColors closeButton />
                <DataTable
                    search={{
                        header: 'nama peminjam',
                        value: 'trx_buyer_name',
                    }}
                    columns={columns}
                    data={formattedData}
                    link={transactions.links}
                />
            </div>
        </AppLayout>
    );
}
