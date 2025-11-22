import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { ImageIcon } from 'lucide-react';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Detail Produk',
        href: '/manage/category',
    },
];

export default function index() {
    const { assetBaseUrl } = usePage().props;
    const asset = (path: string) => `${assetBaseUrl}${path}`;
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
    const { product } = usePage<{
        product: {
            prd_id: number;
            prd_name: string;
            prd_slug: string;
            prd_img_url: string;
            prd_description: string;
            prd_status: string;
            prd_price: number;
            prd_weight: number;
            prd_selled_at: Date;
            prd_created_at: Date;
            prd_updated_at: Date;
            prd_deleted_at: Date;
            categories: { cat_id: number; cat_name: string };
            created_by: { name: string };
            updated_by: { name: string };
            deleted_by: { name: string };
        };
    }>().props;
    const price = Number(product.prd_price);

    const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);

    const status = product.prd_status;

    let label = '';
    let color = '';

    switch (status) {
        case '1':
            label = 'Aktif';
            color = 'text-green-500';
            break;
        case '2':
            label = 'Terjual';
            color = 'text-yellow-600';
            break;
        case '3':
            label = 'Diarsipkan';
            color = 'text-gray-600';
            break;
        case '4':
            label = 'Diorder';
            color = 'text-amber-600';
            break;
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail produk" />
            <Toaster position="top-center" richColors closeButton />
            <div className="mx-5 mt-5">
                <div className="flex flex-col md:flex-row">
                    <div className="flex w-full justify-center p-4 md:w-1/3">
                        {product.prd_img_url && (
                            <img
                                src={asset(product.prd_img_url)}
                                alt={product.prd_name}
                                className="h-96 w-full shrink-0 overflow-hidden border object-contain p-4 shadow-md"
                            />
                        )}
                        {!product.prd_img_url && (
                            <div className="flex h-96 w-full shrink-0 flex-col items-center justify-center overflow-hidden rounded-md border-2 border-dashed object-contain p-4 text-muted-foreground shadow-md md:mx-16">
                                <ImageIcon className="mb-2 h-10 w-10" />
                                <span className="text-sm">
                                    Belum ada gambar dipilih
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="mb-4 w-full md:w-2/3">
                        <Card>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Keterangan</TableHead>
                                            <TableHead>Isi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableCell>
                                                {product.prd_id}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Nama</TableHead>
                                            <TableCell>
                                                {product.prd_name}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Slug</TableHead>
                                            <TableCell>
                                                {product.prd_slug}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Harga</TableHead>
                                            <TableCell>
                                                {formatted + ',-'}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Berat</TableHead>
                                            <TableCell>
                                                {product.prd_weight + ' gram'}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Status</TableHead>
                                            <TableCell className={color}>
                                                {label}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Dijual pada</TableHead>
                                            <TableCell>
                                                {formatDate(
                                                    product.prd_selled_at,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Diubah pada</TableHead>
                                            <TableCell>
                                                {formatDate(
                                                    product.prd_created_at,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Diubah pada</TableHead>
                                            <TableCell>
                                                {formatDate(
                                                    product.prd_updated_at,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Dihapus pada</TableHead>
                                            <TableCell>
                                                {formatDate(
                                                    product.prd_deleted_at,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Dibuat oleh</TableHead>
                                            <TableCell>
                                                {product.created_by?.name ||
                                                    'Matcha sistem'}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Diubah oleh</TableHead>
                                            <TableCell>
                                                {product.updated_by?.name ||
                                                    '-'}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Dihapus oleh</TableHead>
                                            <TableCell>
                                                {product.deleted_by?.name ||
                                                    '-'}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Card className="mb-5 min-h-80 border p-2">
                    <CardHeader className="my-1 mt-2 ml-2 font-medium">
                        Deskripsi
                    </CardHeader>
                    <CardContent className="p-2 wrap-break-word whitespace-pre-line">
                        {product.prd_description}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
