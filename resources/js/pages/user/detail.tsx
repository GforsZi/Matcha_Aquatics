import { Card, CardContent } from '@/components/ui/card';
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Detail Pengguna',
        href: '/manage/user',
    },
];

export default function detail() {
    const { assetBaseUrl } = usePage().props;
    const asset = (path: string) => `${assetBaseUrl}${path}`;
    const { user } = usePage<{
        user: {
            usr_id: number;
            name: string;
            email: string;
            usr_google_id: string;
            usr_foto_profile: string;
            usr_created_at: Date;
            usr_updated_at: Date;
            usr_deleted_at: Date;
            created_by: { name: string };
            updated_by: { name: string };
            deleted_by: { name: string };
        };
    }>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail pengguna" />
            <div className="mx-5 mt-5">
                <div className="flex flex-col md:flex-row">
                    <div className="flex w-full justify-center p-3 md:w-1/3">
                        <img
                            src={
                                user.usr_foto_profile ||
                                asset('user_placeholder.jpg')
                            }
                            alt={user.name}
                            className="h-64 w-64 shrink-0 overflow-hidden rounded-full border object-cover p-4 shadow-md"
                        />
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
                                            <TableCell>{user.usr_id}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Nama</TableHead>
                                            <TableCell>{user.name}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Email</TableHead>
                                            <TableCell>{user.email}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Diubah pada</TableHead>
                                            <TableCell>
                                                {formatDate(
                                                    user.usr_created_at,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Diubah pada</TableHead>
                                            <TableCell>
                                                {formatDate(
                                                    user.usr_updated_at,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Dihapus pada</TableHead>
                                            <TableCell>
                                                {formatDate(
                                                    user.usr_deleted_at,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Dibuat oleh</TableHead>
                                            <TableCell>
                                                {user.created_by?.name ||
                                                    'Matcha sistem'}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Diubah oleh</TableHead>
                                            <TableCell>
                                                {user.updated_by?.name || '-'}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Dihapus oleh</TableHead>
                                            <TableCell>
                                                {user.deleted_by?.name || '-'}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
