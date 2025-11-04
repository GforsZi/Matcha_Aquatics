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
        title: 'Detail Kategori',
        href: '/manage/category',
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
    const { category } = usePage<{
        category: {
            cat_id: number;
            cat_name: string;
            cat_slug: string;
            cat_created_at: Date;
            cat_updated_at: Date;
            cat_deleted_at: Date;
            created_by: { name: string };
            updated_by: { name: string };
            deleted_by: { name: string };
        };
    }>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail kategori" />
            <div className="mx-5 mt-5">
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
                            <TableCell>{category.cat_id}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableCell>{category.cat_name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableCell>{category.cat_slug}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Diubah pada</TableHead>
                            <TableCell>
                                {formatDate(category.cat_created_at)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Diubah pada</TableHead>
                            <TableCell>
                                {formatDate(category.cat_updated_at)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Dihapus pada</TableHead>
                            <TableCell>
                                {formatDate(category.cat_deleted_at)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Dibuat oleh</TableHead>
                            <TableCell>
                                {category.created_by?.name || 'Matcha sistem'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Diubah oleh</TableHead>
                            <TableCell>
                                {category.updated_by?.name || '-'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Dihapus oleh</TableHead>
                            <TableCell>
                                {category.deleted_by?.name || '-'}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
