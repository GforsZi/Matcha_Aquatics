import { ProductCard } from '@/components/product-card';
import UserLayout from '@/layouts/user-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/home',
    },
];

export default function index() {
    const { app_banner } = usePage<{
        app_banner: {
            app_stg_value: string;
        };
    }>().props;
    const { products } = usePage<{
        products: {
            prd_id: number;
            prd_name: string;
            prd_slug: string;
            prd_img_url: string;
            prd_status: '1' | '2' | '3' | '4';
            prd_price: number;
        }[];
    }>().props;

    const { assetBaseUrl } = usePage().props;
    const asset = (path: string) => `${assetBaseUrl}${path}`;
    const [banner, setBanner] = useState('');
    useEffect(() => {
        if (!app_banner) {
            setBanner('');
        } else {
            setBanner(app_banner.app_stg_value);
        }
    }, [app_banner]);
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
    return (
        <UserLayout breadcrumbs={breadcrumbs}>
            <Head title="Beranda" />
            <Toaster position="top-center" richColors closeButton />
            {banner && (
                <div className="relative mx-5 md:mx-16">
                    <img
                        src={asset(banner)}
                        alt="Preview"
                        className="h-auto w-full rounded-lg border"
                    />
                </div>
            )}
            {!banner && (
                <div className="flex h-48 w-full flex-col items-center justify-center rounded-md border-2 border-dashed text-muted-foreground">
                    <ImageIcon className="mb-2 h-10 w-10" />
                    <span className="text-sm">Belum ada gambar</span>
                </div>
            )}
            <hr />
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="mx-5 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {products.map((p) => (
                        <ProductCard key={p.prd_id} product={p} />
                    ))}
                </div>
            </div>
        </UserLayout>
    );
}
