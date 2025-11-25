import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import UserLayout from '@/layouts/user-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
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
    const {
        app_cs_name = { app_stg_title: '', app_stg_value: '' },
        app_cs_nomor = { app_stg_title: '', app_stg_value: '' },
    } = usePage<{
        app_cs_name: {
            app_stg_title: string;
            app_stg_value: string;
        };
        app_cs_nomor: {
            app_stg_title: string;
            app_stg_value: string;
        };
    }>().props;
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
                        <p>
                            {app_cs_name.app_stg_value +
                                ' | ' +
                                app_cs_nomor.app_stg_value}
                        </p>
                        <a
                            href={`https://wa.me/${app_cs_nomor.app_stg_value}`}
                            className="mt-2 block"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="outline" className="w-full">
                                Hunbungi CS
                            </Button>
                        </a>
                    </CardContent>
                </Card>
            </div>
        </UserLayout>
    );
}
