import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import UserLayout from '@/layouts/user-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { MessageCircleQuestion } from 'lucide-react';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Layanan Pelanggan',
        href: '/search',
    },
];

export default function Search() {
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <UserLayout breadcrumbs={breadcrumbs}>
            <Head title="Layanan Pelanggan" />
            <Toaster position="top-center" richColors closeButton />

            <div className="@container/main mx-5 flex flex-1 flex-col gap-4">
                <Card className="py-12">
                    <CardContent className="flex flex-col items-center justify-center text-center">
                        <MessageCircleQuestion className="mb-4 h-16 w-16 text-muted-foreground" />
                        <h2 className="mb-2 text-2xl font-semibold">
                            Layanan Pelanggan
                        </h2>
                        <p className="mb-6 text-muted-foreground">
                            Tambahkan produk ke keranjang untuk memesan!
                        </p>
                        <Link href="/home" className="mt-2 block">
                            <Button variant="outline" className="w-full">
                                Hunbungi CS
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </UserLayout>
    );
}
