import AppLogo from '@/components/app-logo';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { MessageCircleQuestion, Shield, Truck } from 'lucide-react';

export default function Welcome() {
    const { assetBaseUrl } = usePage().props;
    const asset = (path: string) => `${assetBaseUrl}${path}`;
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="border-b border-border">
                    <div className="container mx-auto flex items-center justify-between px-4 py-4">
                        <Link
                            href={'/'}
                            prefetch
                            className="flex items-center space-x-2"
                        >
                            <AppLogo />
                        </Link>
                        <nav className="hidden items-center gap-6 md:flex"></nav>
                        <div className="flex items-center gap-4">
                            <nav className="flex items-center justify-end gap-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                        >
                                            Log in
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative h-[600px] overflow-hidden">
                    <img
                        src={asset('cupang-matcha.jpg')}
                        alt="Hero"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-100/10 via-neutral-100/5 to-transparent">
                        <div className="container mx-auto flex h-full items-center px-4">
                            <div className="max-w-xl space-y-6">
                                <h2 className="text-5xl leading-tight font-bold md:text-6xl">
                                    Discover Your{' '}
                                    <span className="text-emerald-700">
                                        Perfect Betta
                                    </span>
                                </h2>
                                <p className="text-shadow text-lg">
                                    Temukan ikan cupang berkualitas tinggi yang
                                    dipilih secara khusus. Keindahan warna dan
                                    karakter terbaik untuk menambah koleksi
                                    maupun memperindah ruang Anda.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-secondary/30 py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-700/10">
                                    <Truck className="h-8 w-8 text-emerald-700" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground">
                                    Mendukung pengiriman
                                </h3>
                                <p className="text-muted-foreground">
                                    Dengan biaya terjangkau
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-700/10">
                                    <Shield className="h-8 w-8 text-emerald-700" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground">
                                    Pembayaran Terjaga
                                </h3>
                                <p className="text-muted-foreground">
                                    Mendukung Qris
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-700/10">
                                    <MessageCircleQuestion className="h-8 w-8 text-emerald-700" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground">
                                    Pusat Bantuan
                                </h3>
                                <p className="text-muted-foreground">
                                    Selalu Siap Membantu
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Categories */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-4xl font-bold text-foreground">
                                Shop by Category
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Explore our curated collections
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <Card className="group cursor-pointer border-2 transition-shadow hover:border-emerald-500 hover:shadow-lg">
                                <CardHeader>
                                    <div className="mb-4 h-48 w-full rounded-lg bg-secondary"></div>
                                    <CardTitle className="transition-colors group-hover:text-emerald-800">
                                        New Arrivals
                                    </CardTitle>
                                    <CardDescription>
                                        Discover the latest trends
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <Card className="group cursor-pointer border-2 transition-shadow hover:border-emerald-500 hover:shadow-lg">
                                <CardHeader>
                                    <div className="mb-4 h-48 w-full rounded-lg bg-secondary"></div>
                                    <CardTitle className="transition-colors group-hover:text-emerald-800">
                                        Best Sellers
                                    </CardTitle>
                                    <CardDescription>
                                        Customer favorites
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <Card className="group cursor-pointer border-2 transition-shadow hover:border-emerald-500 hover:shadow-lg">
                                <CardHeader>
                                    <div className="mb-4 h-48 w-full rounded-lg bg-secondary"></div>
                                    <CardTitle className="transition-colors group-hover:text-emerald-800">
                                        Limited Edition
                                    </CardTitle>
                                    <CardDescription>
                                        Exclusive items
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-emerald-600 py-20 text-primary-foreground">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="mb-4 text-4xl font-bold">
                            Join Our Community
                        </h2>
                        <p className="mb-8 text-lg opacity-90">
                            Subscribe to get special offers and updates
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-border py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                            <div>
                                <h3 className="mb-4 text-lg font-bold text-foreground">
                                    EmeraldShop
                                </h3>
                                <p className="text-muted-foreground">
                                    Your destination for premium lifestyle
                                    products.
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold text-foreground">
                                    Shop
                                </h4>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-primary"
                                        >
                                            New Arrivals
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-primary"
                                        >
                                            Best Sellers
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-primary"
                                        >
                                            Collections
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold text-foreground">
                                    Support
                                </h4>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-primary"
                                        >
                                            Contact Us
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-primary"
                                        >
                                            Shipping Info
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-primary"
                                        >
                                            Returns
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold text-foreground">
                                    Follow Us
                                </h4>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-primary"
                                        >
                                            Instagram
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-primary"
                                        >
                                            Facebook
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-primary"
                                        >
                                            Twitter
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 border-t border-border pt-8 text-center text-muted-foreground">
                            <p>&copy; 2025 EmeraldShop. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
