import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import UserLayout from '@/layouts/user-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ExternalLink,
    Loader2,
    Minus,
    Plus,
    ShoppingCart,
    Trash2,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/home',
    },
];
const Cart = () => {
    const items: [] = [];
    const isLoading: boolean = false;
    return (
        <UserLayout breadcrumbs={breadcrumbs}>
            <Head title="Beranda" />
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

                    {items.length === 0 ? (
                        <Card className="py-12">
                            <CardContent className="flex flex-col items-center justify-center text-center">
                                <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" />
                                <h2 className="mb-2 text-2xl font-semibold">
                                    Keranjang masih kosong
                                </h2>
                                <p className="mb-6 text-muted-foreground">
                                    Tambahkan produk ke keranjang untuk memulai!
                                </p>
                                <Link href="/home">
                                    <Button>Kembali Berbelanja</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {/* Product List Card */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>Cart Items</CardTitle>
                                    <CardDescription>
                                        Review your selected products
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {items.map((item) => (
                                        <div
                                            key={item}
                                            className="flex gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50"
                                        >
                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-secondary/20">
                                                {item && (
                                                    <img
                                                        src={item}
                                                        alt={item}
                                                        className="h-full w-full object-cover"
                                                    />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h3 className="mb-1 text-lg font-semibold">
                                                    {item}
                                                </h3>
                                                <p className="mb-2 text-sm text-muted-foreground"></p>
                                                <p className="text-lg font-bold"></p>
                                            </div>

                                            <div className="flex flex-shrink-0 flex-col items-end justify-between gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="w-12 text-center font-medium">
                                                        {item}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Checkout Summary Card */}
                            <Card className="sticky top-8 h-fit lg:col-span-1">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                    <CardDescription>
                                        Review your total
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Subtotal ()
                                            </span>
                                            <span className="font-medium">
                                                {items || '$'} {''}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Shipping
                                            </span>
                                            <span className="font-medium">
                                                Calculated at checkout
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="mb-6 flex items-center justify-between">
                                            <span className="text-lg font-semibold">
                                                Total
                                            </span>
                                            <span className="text-2xl font-bold">
                                                {items || '$'} {''}
                                            </span>
                                        </div>

                                        <Button
                                            className="w-full"
                                            size="lg"
                                            disabled={
                                                items.length === 0 || isLoading
                                            }
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Creating Checkout...
                                                </>
                                            ) : (
                                                <>
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    Checkout with Shopify
                                                </>
                                            )}
                                        </Button>

                                        <Link href="/" className="mt-4 block">
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                            >
                                                Continue Shopping
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </main>
        </UserLayout>
    );
};

export default Cart;
