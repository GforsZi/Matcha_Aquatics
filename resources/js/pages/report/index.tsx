// resources/js/Pages/report/index.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';

// shadcn components (pastikan tersedia)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/utils/date';

export default function ReportIndex() {
    const { props } = usePage();
    const flash = (props as any).flash as { success?: string; error?: string };
    const reports = (props as any).reports || [];

    const [from, setFrom] = useState<string>('');
    const [to, setTo] = useState<string>('');

    React.useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const exportUrl = () => {
        const f = from || '';
        const t = to || '';
        return `/system/report/export?from=${encodeURIComponent(f)}&to=${encodeURIComponent(t)}`;
    };

    return (
        <>
            <Head title="Kelola Laporan" />
            <AppLayout
                breadcrumbs={[
                    { title: 'Kelola Laporan', href: '/manage/report' },
                ]}
            >
                <Toaster position="top-center" richColors closeButton />

                <div className="m-5 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Buat Laporan Transaksi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
                                <div>
                                    <Label>Periode dari</Label>
                                    <Input
                                        type="date"
                                        value={from}
                                        onChange={(e) =>
                                            setFrom(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Periode sampai</Label>
                                    <Input
                                        type="date"
                                        value={to}
                                        onChange={(e) => setTo(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        className="bg-emerald-600 text-stone-950 hover:bg-emerald-700"
                                        onClick={() => {
                                            if (!from || !to) {
                                                toast.error(
                                                    'Silakan isi periode from dan to.',
                                                );

                                                return;
                                            }
                                            window.open(exportUrl());
                                        }}
                                    >
                                        Export
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Riwayat Ekspor</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Periode</TableHead>
                                        <TableHead>Total Penjualan</TableHead>
                                        <TableHead>Product Terjual</TableHead>
                                        <TableHead>Dibuat Pada</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reports.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5}>
                                                Belum ada laporan yang dibuat.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {reports.map((r: any) => (
                                        <TableRow key={r.rpt_id}>
                                            <TableCell>
                                                {r.rpt_period_from} →{' '}
                                                {r.rpt_period_to}
                                            </TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat(
                                                    'id-ID',
                                                    {
                                                        style: 'currency',
                                                        currency: 'IDR',
                                                        minimumFractionDigits: 0,
                                                    },
                                                ).format(r.rpt_total_sales) +
                                                    ',-'}
                                            </TableCell>
                                            <TableCell>
                                                {r.rpt_total_items_sold}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(r.rpt_created_at)}
                                            </TableCell>
                                            <TableCell>
                                                <a
                                                    href={`/media/${r.rpt_exel_url}`}
                                                    rel="noreferrer"
                                                    className="inline-block"
                                                >
                                                    <Button
                                                        size="sm"
                                                        className="bg-emerald-600 text-stone-950 hover:bg-emerald-700"
                                                    >
                                                        Unduh
                                                    </Button>
                                                </a>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
