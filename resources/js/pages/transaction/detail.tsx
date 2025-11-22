import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { formatDate } from '@/utils/date';
import { ImageIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Detail Transaksi',
        href: '/manage/transaction',
    },
];

// =============================
// Types
// =============================
type Product = {
    prd_id: number;
    prd_name: string;
    prd_price: number;
    prd_img_url: string;
};

type Payment = {
    pay_method: string;
    pay_amount: number;
    pay_status: string;
    pay_qr_url: string | null;
};

type Shipment = {
    shp_origin_city_name: string;
    shp_destination_city_name: string;
    shp_courier: string;
    shp_cost: number;
    shp_weight: number;
};

type Transaction = {
    trx_id: number;
    trx_invoice: string;
    trx_buyer_name: string;
    trx_total: number;
    trx_subtotal: number;
    trx_discount: number;
    trx_payment: number;
    trx_change: number;
    trx_payment_method: string;
    trx_status: string;
    trx_notes: string | null;
    trx_created_at: Date;
    trx_updated_at: Date;
    products: Product[];
    payment: Payment;
    shipment: Shipment;
    created_by: { name: string } | null;
    updated_by: { name: string } | null;
};

export default function DetailTransaction() {
    const { props } = usePage<{
        transaction: Transaction;
        flash: { success?: string; error?: string };
    }>();

    const { transaction, flash } = props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    // =====================
    // Helper Functions
    // =====================

    const formatRupiah = (value: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    const paymentMethodLabel =
        transaction.trx_payment_method === '1'
            ? 'Tunai'
            : transaction.trx_payment_method === '2'
              ? 'Non-tunai'
              : 'QRIS / Midtrans';

    const transactionStatusMap: { [key: string]: string } = {
        '1': 'Menunggu pembayaran',
        '2': 'Pembayaran berhasil',
        '3': 'Menunggu pengiriman',
        '4': 'Pengiriman berhasil',
        '5': 'Transaksi selesai',
        '6': 'Transaksi gagal',
    };

    const transactionStatusColor: { [key: string]: string } = {
        '1': 'text-yellow-700',
        '2': 'text-blue-700',
        '3': 'text-yellow-700',
        '4': 'text-blue-700',
        '5': 'text-green-700',
        '6': 'text-red-700',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Transaksi" />

            <div className="mx-5 mt-5 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Transaksi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
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
                                    <TableHead>Pembeli</TableHead>
                                    <TableCell>
                                        {transaction.trx_buyer_name}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableCell
                                        className={
                                            transactionStatusColor[
                                                transaction.trx_status
                                            ]
                                        }
                                    >
                                        {
                                            transactionStatusMap[
                                                transaction.trx_status
                                            ]
                                        }
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableHead>Metode Pembayaran</TableHead>
                                    <TableCell>{paymentMethodLabel}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableHead>Tanggal Dibuat</TableHead>
                                    <TableCell>
                                        {formatDate(transaction.trx_created_at)}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableHead>Terakhir Diubah</TableHead>
                                    <TableCell>
                                        {formatDate(transaction.trx_updated_at)}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableHead>Dibuat oleh</TableHead>
                                    <TableCell>
                                        {transaction.created_by?.name ??
                                            'System'}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableHead>Diubah oleh</TableHead>
                                    <TableCell>
                                        {transaction.updated_by?.name ?? '-'}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Produk yang Dibeli</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Foto</TableHead>
                                    <TableHead>Nama Produk</TableHead>
                                    <TableHead>Harga</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transaction.products.map((item) => (
                                    <TableRow key={item.prd_id}>
                                        <TableCell>
                                            {item.prd_img_url && (
                                                <img
                                                    src={`/${item.prd_img_url}`}
                                                    className="h-14 w-14 rounded-lg border object-cover"
                                                />
                                            )}
                                            {!item.prd_img_url && (
                                                <div className="flex h-14 w-14 flex-col items-center justify-center rounded-md border-2 border-dashed text-muted-foreground">
                                                    <ImageIcon className="h-10 w-10" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>{item.prd_name}</TableCell>
                                        <TableCell>
                                            {formatRupiah(item.prd_price)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Pembayaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableHead>Dibayar</TableHead>
                                    <TableCell>
                                        {formatRupiah(transaction.trx_payment)}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableHead>Subtotal</TableHead>
                                    <TableCell>
                                        {formatRupiah(transaction.trx_subtotal)}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableHead>Diskon</TableHead>
                                    <TableCell>
                                        {formatRupiah(transaction.trx_discount)}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableHead>Total Akhir</TableHead>
                                    <TableCell>
                                        {formatRupiah(transaction.trx_total)}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableHead>Kembalian</TableHead>
                                    <TableCell>
                                        {formatRupiah(
                                            transaction.trx_change ?? 0,
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        {transaction.payment?.pay_qr_url && (
                            <div className="mt-4">
                                <a
                                    className="text-blue-600 underline"
                                    href={transaction.payment.pay_qr_url}
                                    target="_blank"
                                >
                                    Lihat QR Pembayaran
                                </a>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {transaction?.shipment && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Pengiriman</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableHead>Asal</TableHead>
                                        <TableCell>
                                            {
                                                transaction?.shipment
                                                    ?.shp_origin_city_name
                                            }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Tujuan</TableHead>
                                        <TableCell>
                                            {
                                                transaction?.shipment
                                                    ?.shp_destination_city_name
                                            }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Kurir</TableHead>
                                        <TableCell>
                                            {transaction?.shipment?.shp_courier}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Ongkos Kirim</TableHead>
                                        <TableCell>
                                            {transaction?.shipment?.shp_cost &&
                                                formatRupiah(
                                                    transaction?.shipment
                                                        ?.shp_cost,
                                                )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Berat</TableHead>
                                        <TableCell>
                                            {transaction?.shipment
                                                ?.shp_weight &&
                                                transaction?.shipment
                                                    ?.shp_weight + ' gram'}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
