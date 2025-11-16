import { ProductCard } from '@/components/product-card';
import UserLayout from '@/layouts/user-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pencarian',
        href: '/search',
    },
];

interface DBProduct {
    prd_id: number;
    prd_name: string;
    prd_slug: string;
    prd_img_url: string | null;
    prd_price: number;
    prd_status: '1' | '2' | '3' | '4';
}

export default function Search() {
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string };

    const url = new URL(window.location.href);
    const s = url.searchParams.get('s') ?? '';
    const cat = url.searchParams.get('category') ?? '';
    const { cat_products } = usePage<{
        cat_products: {
            prd_id: number;
            prd_name: string;
            prd_slug: string;
            prd_img_url: string;
            prd_status: '1' | '2' | '3' | '4';
            prd_price: number;
        }[];
    }>().props;

    const [products, setProducts] = useState<DBProduct[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (s.trim() === '') {
            setProducts([]);
            return;
        }

        setLoading(true);

        fetch(`/system/product/search?q=${encodeURIComponent(s)}`)
            .then((res) => res.json())
            .then((data: DBProduct[]) => {
                setProducts(data);
            })
            .finally(() => setLoading(false));
    }, [s]);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <UserLayout breadcrumbs={breadcrumbs}>
            <Head title="Pencarian" />
            <Toaster position="top-center" richColors closeButton />

            <div className="@container/main mx-5 flex flex-1 flex-col gap-4">
                {loading && <p className="text-sm text-gray-500">Memuat...</p>}

                {!loading && s && cat && products.length === 0 && (
                    <p className="text-sm text-gray-600">
                        Produk tidak ditemukan.
                    </p>
                )}

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {products.map((p) => (
                        <ProductCard key={p.prd_id} product={p} />
                    ))}
                    {cat_products.map((p) => (
                        <ProductCard key={p.prd_id} product={p} />
                    ))}
                </div>
            </div>
        </UserLayout>
    );
}
