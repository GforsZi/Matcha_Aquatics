import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Form, router, useForm } from '@inertiajs/react';
import { Loader2, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

interface datas {
    id: number;
}

interface DropdownTableProps {
    data: datas;
    page: string;

    showDetail?: boolean;
    showEdit?: boolean;
    showDelete?: boolean;
}

export default function DropdownTable({
    data,
    page,
    showDetail = false,
    showEdit = false,
    showDelete = false,
}: DropdownTableProps) {
    const { processing } = useForm();
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        setOpen(false);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Opsi</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* DETAIL */}
                {showDetail && (
                    <DropdownMenuItem
                        onClick={() =>
                            router.visit(`/manage/${page}/${data.id}/detail`)
                        }
                    >
                        Detail
                    </DropdownMenuItem>
                )}

                {/* EDIT */}
                {showEdit && (
                    <DropdownMenuItem
                        onClick={() =>
                            router.visit(`/manage/${page}/${data.id}/edit`)
                        }
                    >
                        Ubah
                    </DropdownMenuItem>
                )}

                {/* DELETE */}
                {showDelete && (
                    <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogTrigger className="relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive-foreground data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive-foreground">
                            Hapus
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Yakin ingin menghapus data ini?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Jika Anda menghapus data ini, data akan
                                    dipindahkan ke halaman riwayat dan tidak
                                    dapat digunakan kembali.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <Form
                                action={`/system/${page}/${data.id}/delete`}
                                method="delete"
                                resetOnSuccess
                                options={{
                                    preserveScroll: true,
                                }}
                            >
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={processing}>
                                        Batal
                                    </AlertDialogCancel>
                                    <Button
                                        type="submit"
                                        onClick={handleDelete}
                                        disabled={processing}
                                        className="bg-red-600 text-white hover:bg-red-700"
                                    >
                                        {processing ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Menghapus...
                                            </span>
                                        ) : (
                                            'Hapus'
                                        )}
                                    </Button>
                                </AlertDialogFooter>
                            </Form>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
