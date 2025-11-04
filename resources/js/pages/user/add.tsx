import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Form, Head, useForm, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tambah Pengguna (Penjual)',
        href: '/manage/user/add',
    },
];
export default function add() {
    const { processing } = useForm();
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
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah pengguna" />
            <div className="m-4">
                <Toaster position="top-center" richColors closeButton />

                <Form
                    action={'/system/user/add'}
                    method={'POST'}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <Label htmlFor="name" className="my-1">
                            Nama Lengkap
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="nama pengguna"
                        />
                    </div>

                    <div>
                        <Label htmlFor="email" className="my-1">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="nama@contoh.com"
                        />
                    </div>

                    <div>
                        <Label htmlFor="password" className="my-1">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Minimal 8 karakter"
                        />
                    </div>

                    <div>
                        <Label htmlFor="password_confirmation" className="my-1">
                            Konfirmasi Password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        disabled={processing}
                    >
                        {processing ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />{' '}
                                Menyimpan...
                            </span>
                        ) : (
                            'Tambah Akun'
                        )}
                    </Button>
                </Form>
            </div>
        </AppLayout>
    );
}
