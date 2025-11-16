import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

export interface DBProduct {
    prd_id: number;
    prd_name: string;
    prd_slug: string;
    prd_img_url: string | null;
    prd_price: number;
    prd_status: '1' | '2' | '3' | '4';
}

export function ProductCard({ product }: { product: DBProduct }) {
    const imageUrl = product.prd_img_url ?? '/placeholder.svg';
    const price = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(product.prd_price);

    return (
        <Card className="group relative overflow-hidden border shadow-sm">
            <Link href={`/product/${product.prd_slug}`} className="block">
                <img
                    src={imageUrl}
                    alt={product.prd_name}
                    className="h-56 w-full border object-contain"
                />

                <CardContent className="mt-5">
                    <h3 className="line-clamp-2 text-sm font-semibold">
                        {product.prd_name}
                    </h3>

                    <p className="mt-1 text-sm font-bold text-emerald-600">
                        {price + ',-'}
                    </p>
                </CardContent>
            </Link>
        </Card>
    );
}
