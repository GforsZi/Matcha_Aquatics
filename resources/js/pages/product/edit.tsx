import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Form, Head, useForm, usePage } from '@inertiajs/react';
import { IconPlus } from '@tabler/icons-react';
import { ImageIcon, Loader2, Search, X } from 'lucide-react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ubah Produk',
        href: '/manage/product',
    },
];

type CategoryType = {
    cat_id: number;
    cat_name: string;
};

export default function edit() {
    const { assetBaseUrl } = usePage().props;
    const asset = (path: string) => `${assetBaseUrl}${path}`;
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

    const { product } = usePage<{
        product: {
            prd_id: number;
            prd_name: string;
            prd_img_url: string;
            prd_description: string;
            prd_status: string;
            prd_weight: string;
            prd_price: number;
            categories: [{ cat_id: number; cat_name: string }];
        };
    }>().props;
    const { data, setData } = useForm({
        prd_name: product.prd_name,
        prd_description: product.prd_description,
        prd_status: product.prd_status,
        prd_weight: product.prd_weight,
        prd_price: product.prd_price,
    });
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

    const handleRemove = () => {
        setImage(null);
        setPreview(null);
    };

    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<CategoryType[]>([]);
    const [selected, setSelected] = useState<Record<number, CategoryType>>({});
    useEffect(() => {
        if (product?.categories) {
            const initial: Record<number, CategoryType> = {};
            product.categories.forEach((cat) => {
                initial[cat.cat_id] = cat;
            });
            setSelected(initial);
        }
    }, [product]);
    useEffect(() => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        const delayDebounce = setTimeout(() => {
            fetch(
                `/system/categories/search?q=${encodeURIComponent(searchQuery)}`,
            )
                .then((res) => res.json())
                .then((data: CategoryType[]) => setResults(data))
                .catch(() => setResults([]));
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const toggleSelect = (category: CategoryType) => {
        setSelected((prev) => {
            const copy = { ...prev };
            if (copy[category.cat_id]) delete copy[category.cat_id];
            else copy[category.cat_id] = category;
            return copy;
        });
    };

    const removeBadge = (id: number) => {
        setSelected((prev) => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });
    };

    const handleContinue = () => setOpen(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ubah produk" />
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
                        {product.prd_img_url && !preview && (
                            <div className="relative mt-3">
                                <img
                                    src={asset(product?.prd_img_url)}
                                    alt="Preview"
                                    className="h-48 w-full rounded-md border object-cover"
                                />
                            </div>
                        )}

                        {!preview && !product.prd_img_url && (
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
                            action={`/system/product/${product.prd_id}/edit`}
                            method={'POST'}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <input type="hidden" name="_method" value="PUT" />

                            <div>
                                <Label htmlFor="name" className="my-1">
                                    Nama Produk
                                </Label>
                                <Input
                                    id="name"
                                    value={data.prd_name}
                                    onChange={(e) =>
                                        setData('prd_name', e.target.value)
                                    }
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
                                        <InputGroupText>Rp</InputGroupText>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        id="price"
                                        value={data.prd_price}
                                        onChange={(e) =>
                                            setData(
                                                'prd_price',
                                                Number(e.target.value),
                                            )
                                        }
                                        name="prd_price"
                                        type="number"
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
                                <Label className="my-1">Berat (gram)</Label>
                                <Input
                                    type="number"
                                    placeholder="Contoh: 1000"
                                    name="prd_weight"
                                    value={data.prd_weight?.toString() || ''}
                                    onChange={(e) =>
                                        setData('prd_weight', e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <Label htmlFor="description" className="my-1">
                                    Deskripsi
                                </Label>
                                <Textarea
                                    value={
                                        data.prd_description?.toString() || ''
                                    }
                                    onChange={(e) =>
                                        setData(
                                            'prd_description',
                                            e.target.value,
                                        )
                                    }
                                    id="description"
                                    placeholder="Ketik deskripsi produk disini"
                                    name="prd_description"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                {/* Bidang kategori produk */}
                                <div
                                    id="input_category"
                                    className="flex min-h-[100px] w-full flex-wrap gap-2 overflow-y-auto rounded-md border p-2 text-sm"
                                >
                                    {Object.values(selected).length === 0 ? (
                                        <span className="text-sm text-muted-foreground">
                                            Belum ada kategori dipilih.
                                        </span>
                                    ) : (
                                        Object.values(selected).map((cat) => (
                                            <Badge
                                                key={cat.cat_id}
                                                className="flex h-4 items-center gap-1 p-2"
                                            >
                                                {/* hidden input untuk form */}
                                                <input
                                                    type="hidden"
                                                    name="category_id[]"
                                                    value={cat.cat_id}
                                                />
                                                {cat.cat_name}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeBadge(cat.cat_id)
                                                    }
                                                >
                                                    <X size={14} />
                                                </button>
                                            </Badge>
                                        ))
                                    )}
                                </div>

                                {/* Tombol tambah kategori */}
                                <AlertDialog open={open} onOpenChange={setOpen}>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            type="button"
                                        >
                                            <IconPlus />
                                        </Button>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Tambahkan kategori.
                                            </AlertDialogTitle>
                                            <AlertDialogDescription asChild>
                                                <div>
                                                    <p className="mb-3">
                                                        Cari kategori dan tandai
                                                        ceklis untuk memilih.
                                                    </p>

                                                    {/* Input pencarian */}
                                                    <InputGroup className="mb-4 flex items-center gap-2">
                                                        <InputGroupInput
                                                            placeholder="Cari..."
                                                            value={searchQuery}
                                                            onChange={(e) =>
                                                                setSearchQuery(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        <InputGroupAddon>
                                                            <Search />
                                                        </InputGroupAddon>
                                                    </InputGroup>

                                                    {/* Daftar hasil pencarian */}
                                                    <div
                                                        id="result_category"
                                                        className="h-[150px] w-full space-y-2 overflow-y-auto rounded-md border p-2 text-sm"
                                                    >
                                                        {results.length ===
                                                        0 ? (
                                                            <p className="text-sm text-muted-foreground">
                                                                {searchQuery
                                                                    ? 'Tidak ada hasil.'
                                                                    : 'Ketik untuk mencari kategori.'}
                                                            </p>
                                                        ) : (
                                                            results.map(
                                                                (cat) => (
                                                                    <label
                                                                        key={
                                                                            cat.cat_id
                                                                        }
                                                                        className="flex cursor-pointer items-center gap-2"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={
                                                                                !!selected[
                                                                                    cat
                                                                                        .cat_id
                                                                                ]
                                                                            }
                                                                            onChange={() =>
                                                                                toggleSelect(
                                                                                    cat,
                                                                                )
                                                                            }
                                                                        />
                                                                        {
                                                                            cat.cat_name
                                                                        }
                                                                    </label>
                                                                ),
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Batal
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleContinue}
                                            >
                                                Lanjutkan
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <div>
                                <Select
                                    name="prd_status"
                                    defaultValue={product?.prd_status?.toString()}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>
                                                Status produk
                                            </SelectLabel>
                                            <SelectItem value="1">
                                                Aktif
                                            </SelectItem>
                                            <SelectItem value="3">
                                                Diarsipkan
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-emerald-600 text-stone-950 hover:bg-emerald-700"
                                disabled={processing}
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />{' '}
                                        Menyimpan...
                                    </span>
                                ) : (
                                    'Ubah Produk'
                                )}
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
