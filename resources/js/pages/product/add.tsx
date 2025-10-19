import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Form, Head, useForm, usePage } from '@inertiajs/react';
import { ImageIcon, Loader2, X } from 'lucide-react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tambah Produk',
        href: '/manage/product/add',
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

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // Handle ketika user memilih file
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        }
    };

    // Hapus gambar yang dipilih
    const handleRemove = () => {
        setImage(null);
        setPreview(null);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Produk" />
            <div className="m-4">
                <Toaster position="top-center" richColors closeButton />
                <div className="flex flex-col md:flex-row">
                    <div className="flex w-full justify-center p-3 md:w-1/3">
                        {preview && (
                            <div className="relative mt-3">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="h-48 w-full rounded-md border object-cover"
                                />
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="destructive"
                                    className="absolute top-2 right-2 rounded-full"
                                    onClick={handleRemove}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        {!preview && (
                            <div className="flex h-48 w-full flex-col items-center justify-center rounded-md border-2 border-dashed text-muted-foreground">
                                <ImageIcon className="mb-2 h-10 w-10" />
                                <span className="text-sm">
                                    Belum ada gambar dipilih
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="mb-4 w-full md:w-2/3">
                        <Form
                            encType="multipart/form-data"
                            action={'/product/add'}
                            method={'POST'}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div>
                                <Label htmlFor="name" className="my-1">
                                    Nama Produk
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="prd_name"
                                    placeholder="nama produk"
                                />
                            </div>

                            <div>
                                <Label htmlFor="price" className="my-1">
                                    Harga
                                </Label>
                                <InputGroup>
                                    <InputGroupAddon>
                                        <InputGroupText>Rp.</InputGroupText>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        id="price"
                                        name="prd_price"
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>IRD</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="image">Pilih Gambar</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div>
                                <Label htmlFor="description" className="my-1">
                                    Deskripsi
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Ketik deskripsi produk disini."
                                    name="prd_description"
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
                                    'Tambah Produk'
                                )}
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
