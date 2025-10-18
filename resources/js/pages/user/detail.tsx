import {
    Table,
    TableBody,
    TableCaption,
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
            <Head title="Detail Pengguna" />
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
                        <Table className="border p-4 shadow-md">
                            <TableCaption>
                                Detail data akun pengguna.
                            </TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>{user.usr_id}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Diubah pada</TableCell>
                                    <TableCell>
                                        {formatDate(user.usr_created_at)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Diubah pada</TableCell>
                                    <TableCell>
                                        {formatDate(user.usr_updated_at)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Dihapus pada</TableCell>
                                    <TableCell>
                                        {formatDate(user.usr_deleted_at)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Dibuat oleh</TableCell>
                                    <TableCell>
                                        {user.created_by?.name ||
                                            'Matcha sistem'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Diubah oleh</TableCell>
                                    <TableCell>
                                        {user.updated_by?.name || '-'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Dihapus oleh</TableCell>
                                    <TableCell>
                                        {user.deleted_by?.name || '-'}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
