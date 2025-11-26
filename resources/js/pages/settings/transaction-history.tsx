import { Head, usePage } from '@inertiajs/react';

import { DataTable } from '@/components/data-table';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { formatDate } from '@/utils/date';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Riwayat Transaksi',
        href: '/settings/transaction_history',
    },
];

interface transaction {
    id: number;
    trx_buyer_name: string;
    trx_status: '1' | '2' | '3' | '4' | '5';
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
        accessorKey: 'trx_invoice',
        header: 'Invoice',
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
                    label = 'Pengajuan pengembalian';
                    color = 'text-yellow-600';
                    break;
                case '4':
                    label = 'Transaksi dibatalkan';
                    color = 'text-red-600';
                    break;
                case '5':
                    label = 'Transaksi selesai';
                    color = 'text-green-600';
                    break;
                case '6':
                    label = 'Transaksi gagal';
                    color = 'text-red-700';
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
];

export default function TransactionHistory() {
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
            <Head title="Riwayat Transaksi" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Pengaturan Tampilan"
                        description="Sesuaikan tampilan aplikasi sesuai."
                    />
                    <Toaster position="top-center" richColors closeButton />
                    <DataTable
                        search={{
                            header: 'kode invoice',
                            value: 'trx_invoice',
                        }}
                        columns={columns}
                        data={formattedData}
                        link={transactions.links}
                    />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
