import { Card, CardContent } from '@/components/ui/card';
import { Link, usePage } from '@inertiajs/react';
import { ImageIcon } from 'lucide-react';

export interface DBProduct {
    prd_id: number;
    prd_name: string;
    prd_slug: string;
    prd_img_url: string | null;
    prd_price: number;
    prd_status: '1' | '2' | '3' | '4';
}

export function ProductCard({ product }: { product: DBProduct }) {
    const { assetBaseUrl } = usePage().props;
    const asset = (path: string) => `${assetBaseUrl}${path}`;
    const price = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(product.prd_price);

    return (
        <Card className="group relative overflow-hidden border shadow-sm">
            <Link href={`/product/${product.prd_slug}`} className="block">
                {product.prd_img_url && (
                    <img
                        src={asset(product.prd_img_url)}
                        alt={product.prd_name}
                        className="h-56 w-full border object-contain"
                    />
                )}
                {!product.prd_img_url && (
                    <div className="flex h-56 w-full shrink-0 flex-col items-center justify-center overflow-hidden rounded-md border-2 border-dashed object-contain text-muted-foreground shadow-md">
                        <ImageIcon className="mb-2 h-10 w-10" />
                        <span className="text-sm">Belum ada gambar</span>
                    </div>
                )}

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
