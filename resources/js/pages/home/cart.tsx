import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import UserLayout from '@/layouts/user-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Select, SelectValue } from '@radix-ui/react-select';
import { ImageIcon, Package2, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/home',
    },
];

export interface Product {
    prd_id: number;
    prd_name: string;
    prd_slug: string;
    prd_img_url: string;
    prd_description: string;
    prd_price: number;
    prd_status: string;
    prd_selled_at: string | null;
    prd_created_at: string;
    prd_updated_at: string;
    prd_created_by: number;
    prd_deleted_by: number | null;
    prd_updated_by: number;
    prd_deleted_at: string | null;
    prd_sys_note: string | null;
}
export interface CartItem {
    crt_id: number;
    crt_user_id: number;
    crt_product_id: number;
    crt_created_at: string;
    crt_updated_at: string;
    crt_created_by: number;
    crt_deleted_by: number | null;
    crt_updated_by: number;
    crt_deleted_at: string | null;
    crt_sys_note: string | null;
    product: Product;
}

const couriers = [
    { code: 'jne', name: 'JNE' },
    { code: 'pos', name: 'POS' },
    { code: 'tiki', name: 'TIKI' },
];

const Cart = () => {
    const { carts } = usePage<{
        carts: CartItem[];
    }>().props;
    const { assetBaseUrl } = usePage().props;
    const asset = (path: string) => `${assetBaseUrl}${path}`;
    const [loadingAdd, setLoadingAdd] = useState(false);

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
    const isLoading: boolean = false;

    function getStatusText(status: string): string {
        switch (status) {
            case '1':
                return 'Tersedia';
            case '2':
                return 'Terjual';
            case '3':
                return 'Tidak Tersedia';
            case '4':
                return 'Dalam Orderan';
            default:
                return 'Tidak Diketahui';
        }
    }

    function getStatusColor(status: string): string {
        switch (status) {
            case '1':
                return 'text-green-500'; // tersedia
            case '2':
                return 'text-yellow-600'; // terjual
            case '3':
                return 'text-gray-600'; // dalam orderan
            case '4':
                return 'text-amber-600'; // tidak tersedia
            default:
                return 'text-gray-500';
        }
    }
    const calculateSubtotal = (carts: CartItem[]): number => {
        return carts.reduce((total, item) => {
            return total + Number(item.product.prd_price);
        }, 0);
    };
    const subtotal = calculateSubtotal(carts);

    const handleDeleteCart = async (productId: number) => {
        setLoadingAdd(true);

        try {
            router.post(
                '/system/cart/delete',
                {
                    _method: 'DELETE',
                    product_id: productId,
                },
                {
                    onFinish: () => setLoadingAdd(false),
                },
            );
        } catch (error) {
            console.error(error);
            setLoadingAdd(false);
            toast.error('Terjadi kesalahan');
        }
    };

    const [selectedCourier, setSelectedCourier] = useState('jne');

    return (
        <UserLayout breadcrumbs={breadcrumbs}>
            <Head title="Beranda" />
            <Toaster position="top-center" richColors closeButton />
            <main className="min-h-screen bg-background py-8">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="mb-8 flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Keranjang Belanja
                            </h1>
                            <p className="text-muted-foreground"></p>
                        </div>
                    </div>

                    {carts.length === 0 ? (
                        <Card className="py-12">
                            <CardContent className="flex flex-col items-center justify-center text-center">
                                <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" />
                                <h2 className="mb-2 text-2xl font-semibold">
                                    Keranjang masih kosong
                                </h2>
                                <p className="mb-6 text-muted-foreground">
                                    Tambahkan produk ke keranjang untuk memesan!
                                </p>
                                <Link href="/home" className="mt-2 block">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Lanjut Berbelanja
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {/* Product List Card */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>List Produk</CardTitle>
                                    <CardDescription>
                                        Lakukan pengecekkan sebelum melakukan
                                        pemesanan.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {carts.map((item) => (
                                        <div
                                            key={item.product.prd_id}
                                            className="flex gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50"
                                        >
                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-secondary/20">
                                                {item.product.prd_img_url && (
                                                    <img
                                                        src={asset(
                                                            item.product
                                                                .prd_img_url,
                                                        )}
                                                        alt={
                                                            item.product
                                                                .prd_slug
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                )}
                                                {!item.product.prd_img_url && (
                                                    <div className="flex h-full w-full shrink-0 flex-col items-center justify-center overflow-hidden rounded-md border-2 border-dashed object-contain text-muted-foreground shadow-md">
                                                        <ImageIcon className="mb-2 h-10 w-10" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    href={`/product/${item.product.prd_slug}`}
                                                    className="mb-1 text-lg font-semibold"
                                                >
                                                    {item.product.prd_name}
                                                </Link>
                                                <p className="mb-2 text-sm text-muted-foreground"></p>
                                                <p
                                                    className={`text-sm ${getStatusColor(item.product.prd_status)}`}
                                                >
                                                    {getStatusText(
                                                        item.product.prd_status,
                                                    )}
                                                </p>
                                            </div>

                                            <div className="flex flex-shrink-0 flex-col items-end justify-between gap-2">
                                                <Button
                                                    onClick={() =>
                                                        handleDeleteCart(
                                                            item.product.prd_id,
                                                        )
                                                    }
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>

                                                <div className="flex items-center gap-2">
                                                    <span className="w-36 text-right font-medium">
                                                        {new Intl.NumberFormat(
                                                            'id-ID',
                                                            {
                                                                style: 'currency',
                                                                currency: 'IDR',
                                                                minimumFractionDigits: 0,
                                                            },
                                                        ).format(
                                                            item.product
                                                                .prd_price,
                                                        ) + ',-'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Checkout Summary Card */}
                            <div>
                                <Card className="sticky top-8 h-fit lg:col-span-1">
                                    <CardHeader>
                                        <CardTitle>Ringkasan Pesanan</CardTitle>
                                        <CardDescription>
                                            Cek Total Pemesanan
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Subtotal
                                                </span>
                                                <span className="font-medium">
                                                    {new Intl.NumberFormat(
                                                        'id-ID',
                                                        {
                                                            style: 'currency',
                                                            currency: 'IDR',
                                                            minimumFractionDigits: 0,
                                                        },
                                                    ).format(subtotal) + ',-'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Pengiriman
                                                </span>
                                                <span className="font-medium"></span>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4">
                                            <div className="mb-6 flex items-center justify-between">
                                                <span className="text-lg font-semibold">
                                                    Total
                                                </span>
                                                <span className="text-2xl font-bold"></span>
                                            </div>
                                            <Dialog>
                                                <form>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full bg-emerald-600 text-stone-950 hover:bg-emerald-700 hover:text-stone-950"
                                                        >
                                                            <Package2 className="mr-2 h-4 w-4" />
                                                            Mulai Pemesanan
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px]">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Kurir Pengiriman
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Pilih kurir dan
                                                                paket pengiriman
                                                                untuk paket
                                                                pesananmu.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid gap-4">
                                                            <div className="grid gap-3">
                                                                <Label>
                                                                    Kurir
                                                                </Label>
                                                                <Select
                                                                    onValueChange={(
                                                                        value,
                                                                    ) =>
                                                                        setSelectedCourier(
                                                                            value,
                                                                        )
                                                                    }
                                                                    value={
                                                                        selectedCourier
                                                                    }
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Pilih kurir" />
                                                                    </SelectTrigger>

                                                                    <SelectContent>
                                                                        {couriers.map(
                                                                            (
                                                                                c,
                                                                            ) => (
                                                                                <SelectItem
                                                                                    key={
                                                                                        c.code
                                                                                    }
                                                                                    value={
                                                                                        c.code
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        c.name
                                                                                    }
                                                                                </SelectItem>
                                                                            ),
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <hr />
                                                        </div>
                                                        <DialogFooter>
                                                            <Button
                                                                type="submit"
                                                                className="w-full bg-emerald-600 text-stone-950 hover:bg-emerald-700 hover:text-stone-950"
                                                            >
                                                                Hitung Ongkir
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </form>
                                            </Dialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </UserLayout>
    );
};

export default Cart;
