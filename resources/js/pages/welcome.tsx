import AppLogo from '@/components/app-logo';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { login } from '@/routes';
import { Head, Link, usePage } from '@inertiajs/react';
import { MessageCircleQuestion, Shield, Truck } from 'lucide-react';

export default function Welcome() {
    const { assetBaseUrl } = usePage().props;
    const asset = (path: string) => `${assetBaseUrl}${path}`;
    const { auth } = usePage().props as any;
    const roles: string[] = auth?.user?.role ?? [];

    const isSeller = roles.includes('seller');
    const urlHome = isSeller ? '/dashboard' : '/home';

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
                                        href={urlHome}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Masuk
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                        >
                                            Masuk
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
                                    Ikan cupang <span>berkualitas tinggi</span>
                                </h2>
                                <p className="text-shadow text-lg">
                                    Dengan kesederhanaan dan harmoni yang tidak
                                    bisa dinikmati semua orang.
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
                                    Biaya Terjangkau
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
                                    Mendukung QRIS
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
                                Berbagai Kategori Cupang
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Jelajahi dan temukan cupang yang cocok untukmu.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <Card className="group cursor-pointer border-2 transition-shadow hover:border-emerald-500 hover:shadow-lg">
                                <CardHeader>
                                    <img
                                        src={asset('/cupang-1.jpg')}
                                        className="mb-4 h-48 w-full rounded-lg bg-secondary object-cover"
                                        alt="cupang 1"
                                    />
                                    <CardTitle className="transition-colors group-hover:text-emerald-800">
                                        Cupang Hias
                                    </CardTitle>
                                    <CardDescription>
                                        Cupang yang cocok dijadikan pajangan
                                        atau koleksi.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <Card className="group cursor-pointer border-2 transition-shadow hover:border-emerald-500 hover:shadow-lg">
                                <CardHeader>
                                    <img
                                        src={asset('/cupang-2.jpg')}
                                        className="mb-4 h-48 w-full rounded-lg bg-secondary object-cover"
                                        alt="cupang 2"
                                    />
                                    <CardTitle className="transition-colors group-hover:text-emerald-800">
                                        Cupang Aduan
                                    </CardTitle>
                                    <CardDescription>
                                        Cupang yang agresif, dengan kemampuan
                                        bertarung.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <Card className="group cursor-pointer border-2 transition-shadow hover:border-emerald-500 hover:shadow-lg">
                                <CardHeader>
                                    <img
                                        src={asset('/cupang-3.jpg')}
                                        className="mb-4 h-48 w-full rounded-lg bg-secondary object-cover"
                                        alt="cupang 3"
                                    />
                                    <CardTitle className="transition-colors group-hover:text-emerald-800">
                                        Cupang Ternak
                                    </CardTitle>
                                    <CardDescription>
                                        Indukan cupang yang sudah dipilih untuk
                                        diternakan.
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
                            Bergabung Dengan Komunitas
                        </h2>
                        <p className="mb-8 text-lg opacity-90">
                            Bergabung untuk mendapatkan berbagai keuntungan dan
                            informasi terbaru.
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-border py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                            <div>
                                <h3 className="mb-4 text-lg font-bold text-foreground">
                                    Matcha Aquatics
                                </h3>
                                <p className="text-muted-foreground">
                                    Kesederhanaan dan harmoni yang tidak bisa
                                    dinikmati semua orang.
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold text-foreground">
                                    Belanja
                                </h4>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-primary"
                                        >
                                            Cupang Hias
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-primary"
                                        >
                                            Cupang Aduan
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-primary"
                                        >
                                            Cupang Ternak
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold text-foreground">
                                    Dukung / Bantuan
                                </h4>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-primary"
                                        >
                                            Hubungi Kami
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-primary"
                                        >
                                            Info Produk
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-primary"
                                        >
                                            Info Transaksi
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold text-foreground">
                                    Ikuti Kami
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
                                            TikTok
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 border-t border-border pt-8 text-center text-muted-foreground">
                            <p>&copy; 2025 Matcha Aquatics.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
