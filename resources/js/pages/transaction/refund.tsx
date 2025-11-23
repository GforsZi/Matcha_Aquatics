import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { toast, Toaster } from 'sonner';

interface RefundPageProps {
    transaction: any;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengembalian Dana',
        href: '/manage/transaction',
    },
];

export default function RefundPage({ transaction }: RefundPageProps) {
    const [amount, setAmount] = useState<number>(transaction.trx_total);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
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

    const handleSubmit = () => {
        setLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);
        try {
            router.post(
                `/system/transactions/${transaction.trx_id}/refund`,
                { amount },
                {
                    onError: (err: any) => {
                        console.error(err);
                        toast.error('Gagal menambahkan ke keranjang');
                    },
                    onSuccess: () =>
                        toast.success('Produk ditambahkan ke keranjang'),
                    onFinish: () => setLoading(false),
                },
            );
        } catch (e) {
            setLoading(false);
            toast.error('Terjadi kesalahan');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengembalian" />
            <Toaster position="top-center" richColors closeButton />

            <div className="flex h-full items-center justify-center px-4">
                <Card className="w-full max-w-md shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            Pengembalian Dana
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>ID Transaksi</Label>
                            <div className="text-sm font-medium">
                                {transaction.trx_invoice}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Total Transaksi</Label>
                            <Badge
                                variant="secondary"
                                className="py-1 text-base"
                            >
                                Rp{' '}
                                {transaction.trx_total.toLocaleString('id-ID')}
                            </Badge>
                        </div>

                        <Separator />

                        {errorMsg && (
                            <Alert variant="destructive">
                                <AlertTitle>Gagal</AlertTitle>
                                <AlertDescription>{errorMsg}</AlertDescription>
                            </Alert>
                        )}

                        {successMsg && (
                            <Alert className="border-green-600">
                                <AlertTitle>Berhasil</AlertTitle>
                                <AlertDescription>
                                    {successMsg}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label>Nominal Dikembalikan</Label>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(Number(e.target.value))
                                }
                                min={1}
                                className="text-right"
                            />
                        </div>

                        <Button
                            disabled={loading}
                            onClick={handleSubmit}
                            className="w-full bg-emerald-600 text-stone-950 hover:bg-emerald-700"
                        >
                            {loading ? 'Memproses...' : 'Kirim Pengembalian'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
