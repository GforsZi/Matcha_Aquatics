import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Form, Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ubah Pengguna',
        href: '/manage/user',
    },
];

export default function edit() {
    const { assetBaseUrl } = usePage().props;
    const asset = (path: string) => `${assetBaseUrl}${path}`;
    const { user, role } = usePage<{
        user: {
            usr_id: number;
            name: string;
            email: string;
        };
        role: [string];
    }>().props;
    const { data, setData } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: role[0],
    });
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
        router.reload();
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Pengguna" />
            <div className="m-4">
                <Toaster position="top-center" richColors closeButton />

                <Form
                    action={`/user/${user.usr_id}/edit`}
                    method={'PUT'}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            name="name"
                            placeholder="Masukkan nama pengguna"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            name="email"
                            placeholder="nama@contoh.com"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            name="password"
                            placeholder="Minimal 8 karakter"
                        />
                    </div>

                    <div>
                        <Label htmlFor="password_confirmation">
                            Konfirmasi Password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            name="password_confirmation"
                        />
                    </div>
                    <div>
                        <Label htmlFor="role">Peran</Label>
                        <Select
                            value={data.role}
                            name="role"
                            onValueChange={(value) => setData('role', value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih peran pengguna" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="seller">Penjual</SelectItem>
                                <SelectItem value="buyer">Pembeli</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                        Ubah Akun
                    </Button>
                </Form>
            </div>
        </AppLayout>
    );
}
