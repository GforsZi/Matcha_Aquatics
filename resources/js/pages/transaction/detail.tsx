import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { formatDate } from '@/utils/date';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Detail Transaksi',
        href: '/manage/transaction',
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
    const { transaction } = usePage<{
        transaction: {
            trx_id: number;
            trx_invoice: string;
            trx_buyer_name: string;
            trx_total: number;
            trx_subtotal: number;
            trx_discount: number;
            trx_payment: number;
            trx_change: number;
            trx_payment_method: '1' | '2';
            trx_status: '1' | '2' | '3' | '4' | '5' | '6';
            trx_notes: string;
            trx_created_at: Date;
            trx_updated_at: Date;
            trx_deleted_at: Date;
            created_by: { name: string };
            updated_by: { name: string };
            deleted_by: { name: string };
        };
    }>().props;

    const statusPaymentMethod = transaction.trx_payment_method;

    let labelPaymentMethod = '';
    let colorPaymentMethod = '';

    switch (statusPaymentMethod) {
        case '1':
            labelPaymentMethod = 'Tunai';
            colorPaymentMethod = 'text-green-500';
            break;
        case '2':
            labelPaymentMethod = 'Non-tunai';
            colorPaymentMethod = 'text-sky-600';
            break;
    }

    const transactionStatus = transaction.trx_status;

    let labelTransactionStatus = '';
    let colorTransactionStatus = '';

    switch (transactionStatus) {
        case '1':
            labelTransactionStatus = 'Menunggu pembayaran';
            colorTransactionStatus = 'text-yellow-600';
            break;
        case '2':
            labelTransactionStatus = 'Pembayaran berhasil';
            colorTransactionStatus = 'text-blue-600';
            break;
        case '3':
            labelTransactionStatus = 'Menunggu pengiriman';
            colorTransactionStatus = 'text-yellow-600';
            break;
        case '4':
            labelTransactionStatus = 'Pengiriman berhasil';
            colorTransactionStatus = 'text-blue-600';
            break;
        case '5':
            labelTransactionStatus = 'Transaksi selesai';
            colorTransactionStatus = 'text-green-600';
            break;
        case '6':
            labelTransactionStatus = 'Transaksi gagal';
            colorTransactionStatus = 'text-red-600';
            break;
    }

    const formatRupiah = (value: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail kategori" />
            <div className="mx-5 mt-5">
                <Sheet>
                    <SheetTrigger>Open</SheetTrigger>
                    <SheetContent className="sm:w-[540px]">
                        <SheetHeader>
                            <SheetTitle>Are you absolutely sure?</SheetTitle>
                            <SheetDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                            </SheetDescription>
                        </SheetHeader>
                        <Table className="mx-2 border p-4 shadow-md">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Keterangan</TableHead>
                                    <TableHead>Isi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableCell>{transaction.trx_id}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Invoice</TableHead>
                                    <TableCell>
                                        {transaction.trx_invoice}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Total</TableHead>
                                    <TableCell>
                                        {formatRupiah(
                                            transaction.trx_subtotal,
                                        ) + ',-'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>diskon</TableHead>
                                    <TableCell>
                                        {formatRupiah(
                                            transaction.trx_discount,
                                        ) + ',-'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Subtotal</TableHead>
                                    <TableCell>
                                        {formatRupiah(transaction.trx_total) +
                                            ',-'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Bayaran</TableHead>
                                    <TableCell>
                                        {formatRupiah(transaction.trx_payment) +
                                            ',-'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Kembalian</TableHead>
                                    <TableCell>
                                        {formatRupiah(transaction.trx_change) +
                                            ',-'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Metode pembayaran</TableHead>
                                    <TableCell className={colorPaymentMethod}>
                                        {labelPaymentMethod}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Status transaksi</TableHead>
                                    <TableCell
                                        className={colorTransactionStatus}
                                    >
                                        {labelTransactionStatus}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Nama pembeli</TableHead>
                                    <TableCell>
                                        {transaction.trx_buyer_name}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Diubah pada</TableHead>
                                    <TableCell>
                                        {formatDate(transaction.trx_created_at)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Diubah pada</TableHead>
                                    <TableCell>
                                        {formatDate(transaction.trx_updated_at)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Dihapus pada</TableHead>
                                    <TableCell>
                                        {formatDate(transaction.trx_deleted_at)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Dibuat oleh</TableHead>
                                    <TableCell>
                                        {transaction.created_by?.name ||
                                            'Matcha sistem'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Diubah oleh</TableHead>
                                    <TableCell>
                                        {transaction.updated_by?.name || '-'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Dihapus oleh</TableHead>
                                    <TableCell>
                                        {transaction.deleted_by?.name || '-'}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <SheetFooter>
                            <Button type="submit">Save changes</Button>
                            <SheetClose asChild>
                                <Button variant="outline">Close</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
                <Table className="border p-4 shadow-md">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Keterangan</TableHead>
                            <TableHead>Isi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableCell>{transaction.trx_id}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Invoice</TableHead>
                            <TableCell>{transaction.trx_invoice}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Total</TableHead>
                            <TableCell>
                                {formatRupiah(transaction.trx_subtotal) + ',-'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>diskon</TableHead>
                            <TableCell>
                                {formatRupiah(transaction.trx_discount) + ',-'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Subtotal</TableHead>
                            <TableCell>
                                {formatRupiah(transaction.trx_total) + ',-'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Bayaran</TableHead>
                            <TableCell>
                                {formatRupiah(transaction.trx_payment) + ',-'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Kembalian</TableHead>
                            <TableCell>
                                {formatRupiah(transaction.trx_change) + ',-'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Metode pembayaran</TableHead>
                            <TableCell className={colorPaymentMethod}>
                                {labelPaymentMethod}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Status transaksi</TableHead>
                            <TableCell className={colorTransactionStatus}>
                                {labelTransactionStatus}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Nama pembeli</TableHead>
                            <TableCell>{transaction.trx_buyer_name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Diubah pada</TableHead>
                            <TableCell>
                                {formatDate(transaction.trx_created_at)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Diubah pada</TableHead>
                            <TableCell>
                                {formatDate(transaction.trx_updated_at)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Dihapus pada</TableHead>
                            <TableCell>
                                {formatDate(transaction.trx_deleted_at)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Dibuat oleh</TableHead>
                            <TableCell>
                                {transaction.created_by?.name ||
                                    'Matcha sistem'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Diubah oleh</TableHead>
                            <TableCell>
                                {transaction.updated_by?.name || '-'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Dihapus oleh</TableHead>
                            <TableCell>
                                {transaction.deleted_by?.name || '-'}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
