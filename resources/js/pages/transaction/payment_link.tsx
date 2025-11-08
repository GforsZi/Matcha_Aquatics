import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Detail Transaksi',
        href: '/manage/transaction',
    },
];

export default function PaymentLink() {
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<'idle' | 'success' | 'failed'>('idle');
    const [message, setMessage] = useState<string>(
        'Membuat link pembayaran...',
    );
    const { transaction } = usePage<{
        transaction: {
            trx_id: number;
            trx_invoice: string;
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
    const csrf =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') || '';

    useEffect(() => {
        const createPayment = async () => {
            try {
                const res = await fetch(
                    `/payment/create/${transaction.trx_id}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': csrf,
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                    },
                );

                const data = await res.json();

                if (data?.response.payment_url) {
                    setStatus('success');
                    setMessage('Link pembayaran berhasil dibuat.');
                    window.open(data.response.payment_url, '_blank');
                } else {
                    setStatus('failed');
                    setMessage('Gagal membuat link pembayaran.');
                    console.error('Midtrans Error:', data);
                }
            } catch (error: any) {
                setStatus('failed');
                setMessage(
                    error?.message ||
                        'Terjadi kesalahan saat membuat payment link.',
                );
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        createPayment();
    }, [transaction.trx_id]);

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Membuat Link Pembayaran" />
                <Toaster position="top-center" richColors closeButton />

                <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                    <Card className="w-full max-w-md shadow-md">
                        <CardHeader>
                            <CardTitle className="text-center text-lg font-semibold">
                                Status Pembayaran
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-col items-center space-y-4 py-6">
                            {loading && (
                                <>
                                    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                                    <p className="text-gray-600">{message}</p>
                                </>
                            )}

                            {!loading && status === 'success' && (
                                <>
                                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                                    <p className="font-medium text-green-700">
                                        {message}
                                    </p>
                                </>
                            )}

                            {!loading && status === 'failed' && (
                                <>
                                    <XCircle className="h-10 w-10 text-red-600" />
                                    <p className="font-medium text-red-600">
                                        {message}
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
