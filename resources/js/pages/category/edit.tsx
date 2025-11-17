import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Form, Head, useForm, usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ubah Kategori',
        href: '/manage/user',
    },
];
export default function edit() {
    const { category } = usePage<{
        category: {
            cat_id: number;
            cat_name: string;
        };
        role: [string];
    }>().props;
    const { data, setData } = useForm({
        cat_name: category.cat_name,
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
        e.preventDefault();
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ubah kategori" />
            <div className="m-4">
                <Toaster position="top-center" richColors closeButton />

                <Form
                    action={`/system/category/${category.cat_id}/edit`}
                    method={'POST'}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <input type="hidden" name="_method" value="PUT" />
                    <div>
                        <Label htmlFor="name" className="my-1">
                            Nama Kategori
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            name="cat_name"
                            value={data.cat_name}
                            onChange={(e) =>
                                setData('cat_name', e.target.value)
                            }
                            placeholder="nama kategori"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-emerald-600 text-stone-950 hover:bg-emerald-700"
                    >
                        Ubah Kategori
                    </Button>
                </Form>
            </div>
        </AppLayout>
    );
}
