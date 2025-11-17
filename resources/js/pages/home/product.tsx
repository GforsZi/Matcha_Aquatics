// resources/js/Pages/home/product.tsx
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { toast, Toaster } from 'sonner';

// shadcn components (pastikan tersedia di project)
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Detail Produk',
        href: '/product',
    },
];

type Category = {
    cat_id: number;
    cat_name: string;
    cat_slug: string;
};

type ProductType = {
    prd_id: number;
    prd_name: string;
    prd_slug: string;
    prd_img_url?: string | null;
    prd_description?: string | null;
    prd_price: number;
    prd_status?: string;
    prd_selled_at?: Date;
    categories?: Category[];
};

export default function Product() {
    const { props } = usePage();
    const { assetBaseUrl } = usePage().props;
    const asset = (path: string) => `${assetBaseUrl}${path}`;
    const flash = (props as any).flash as { success?: string; error?: string };

    // product datang dari controller: compact('product')
    const product = useMemo<ProductType>(
        () => (props as any).product as ProductType,
        [props],
    );

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    // state
    const [qty, setQty] = useState<number>(1);
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingBuy, setLoadingBuy] = useState(false);

    const imageUrl = product?.prd_img_url || '/images/placeholder-product.png';

    function formatCurrency(value: number) {
        // IDR formatting
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);
    }

    const subtotal = useMemo(
        () => (product ? product.prd_price * Math.max(1, qty) : 0),
        [product, qty],
    );

    // handlers
    const handleAddToCart = async () => {
        if (!product) return;
        setLoadingAdd(true);
        try {
            router.post(
                '/cart',
                { product_id: product.prd_id, qty },
                {
                    onSuccess: () =>
                        toast.success('Produk ditambahkan ke keranjang'),
                    onError: (err: any) => {
                        console.error(err);
                        toast.error('Gagal menambahkan ke keranjang');
                    },
                    onFinish: () => setLoadingAdd(false),
                },
            );
        } catch (e) {
            setLoadingAdd(false);
            toast.error('Terjadi kesalahan');
        }
    };

    const handleBuyNow = async () => {
        if (!product) return;
        setLoadingBuy(true);
        try {
            // design sederhana: kirim data dan redirect ke checkout
            router.post(
                '/checkout',
                { items: [{ product_id: product.prd_id, qty }] },
                {
                    onError: (err: any) => {
                        console.error(err);
                        toast.error('Gagal memproses pembelian');
                    },
                    onFinish: () => setLoadingBuy(false),
                },
            );
        } catch (e) {
            setLoadingBuy(false);
            toast.error('Terjadi kesalahan');
        }
    };

    if (!product) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Detail Produk" />
                <div className="py-20">
                    <div className="container mx-auto text-center text-sm text-muted-foreground">
                        Produk tidak ditemukan.
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={product.prd_name || 'Detail Produk'} />
                <Toaster position="top-center" richColors closeButton />

                <div className="container mx-auto py-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                        {/* LEFT - Image */}
                        <div className="md:col-span-4">
                            <Card className="shadow-sm">
                                <CardContent className="p-4">
                                    <div className="relative w-full">
                                        <img
                                            src={asset(imageUrl)}
                                            alt={product.prd_name}
                                            className="h-[430px] w-full rounded-lg object-contain"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* CENTER - Details */}
                        <div className="md:col-span-5">
                            <div className="mx-5 space-y-4">
                                <h1 className="text-2xl leading-tight font-semibold md:text-3xl">
                                    {product.prd_name}
                                </h1>

                                <div className="flex items-center gap-2">
                                    {product.categories &&
                                    product.categories.length > 0 ? (
                                        product.categories.map((cat) => (
                                            <Link
                                                href={`/search?category=${cat.cat_slug}`}
                                                key={cat.cat_id}
                                            >
                                                <Badge
                                                    key={cat.cat_id}
                                                    variant="secondary"
                                                    className="capitalize"
                                                >
                                                    {cat.cat_name}
                                                </Badge>
                                            </Link>
                                        ))
                                    ) : (
                                        <Badge variant="outline">
                                            Uncategorized
                                        </Badge>
                                    )}
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm text-muted-foreground">
                                            Status
                                        </h4>
                                        <p className="mt-1 text-sm">
                                            {product.prd_status === '1'
                                                ? 'Tersedia'
                                                : product.prd_status === '2'
                                                  ? 'Habis'
                                                  : 'Tidak diketahui'}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm text-muted-foreground">
                                            Terjual
                                        </h4>
                                        <p className="mt-1 text-sm">
                                            {product.prd_selled_at
                                                ? new Date(
                                                      product.prd_selled_at as any,
                                                  ).toLocaleDateString()
                                                : '-'}
                                        </p>
                                    </div>
                                </div>

                                <Separator />
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Deskripsi
                                    </h3>
                                    <p className="mt-2 text-base whitespace-pre-line">
                                        {product.prd_description ||
                                            'Tidak ada deskripsi untuk produk ini.'}
                                    </p>
                                </div>

                                <Separator />
                            </div>
                        </div>

                        {/* RIGHT - Price Card / Actions */}
                        <div className="md:col-span-3">
                            <Card className="sticky top-20">
                                <CardHeader className="p-4">
                                    <CardTitle className="text-lg">
                                        Ringkasan Harga
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        Cek kembali sebelum checkout
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-3 p-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Harga
                                        </span>
                                        <span className="font-medium">
                                            {formatCurrency(product.prd_price)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Jumlah
                                        </span>
                                        <span className="font-medium">
                                            {qty}
                                        </span>
                                    </div>

                                    <Separator />

                                    <div className="flex items-baseline justify-between">
                                        <div>
                                            <div className="text-sm text-muted-foreground">
                                                Total
                                            </div>
                                            <div className="text-2xl font-bold">
                                                {formatCurrency(subtotal)}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex flex-col gap-3 p-4">
                                    <Button
                                        onClick={handleAddToCart}
                                        disabled={loadingAdd}
                                        className="w-full bg-emerald-600 text-stone-950 hover:bg-emerald-700"
                                    >
                                        {loadingAdd
                                            ? 'Memproses...'
                                            : 'Masukkan Keranjang'}
                                    </Button>

                                    <Button
                                        variant="default"
                                        onClick={handleBuyNow}
                                        disabled={loadingBuy}
                                        className="w-full bg-emerald-600 text-stone-950 hover:bg-emerald-700"
                                    >
                                        {loadingBuy
                                            ? 'Mengarahkan...'
                                            : 'Beli Sekarang'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
