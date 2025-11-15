import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
    product: {
        node: {
            id: string;
            title: string;
            description: string;
            handle: string;
            priceRange: {
                minVariantPrice: {
                    amount: string;
                    currencyCode: string;
                };
            };
            images: {
                edges: Array<{
                    node: {
                        url: string;
                        altText: string | null;
                    };
                }>;
            };
            variants: {
                edges: Array<{
                    node: {
                        id: string;
                        title: string;
                        price: {
                            amount: string;
                            currencyCode: string;
                        };
                        availableForSale: boolean;
                        selectedOptions: Array<{
                            name: string;
                            value: string;
                        }>;
                    };
                }>;
            };
            options: Array<{
                name: string;
                values: string[];
            }>;
        };
    };
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const { node } = product;

    const price = parseFloat(node.priceRange.minVariantPrice.amount);
    const currencyCode = node.priceRange.minVariantPrice.currencyCode;
    const imageUrl = node.images.edges[0]?.node.url || '/placeholder.svg';
    const firstVariant = node.variants.edges[0]?.node;

    const handleAddToCart = () => {
        if (!firstVariant) return;

        const cartItem = {
            product,
            variantId: firstVariant.id,
            variantTitle: firstVariant.title,
            price: firstVariant.price,
            quantity: 1,
            selectedOptions: firstVariant.selectedOptions || [],
        };

        toast.success('Added to cart!', {
            description: `${node.title} has been added to your cart.`,
            position: 'top-center',
        });
    };

    return (
        <Card className="group overflow-hidden transition-all hover:shadow-lg">
            <Link href={`/product/${node.handle}`}>
                <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                        src={imageUrl}
                        alt={node.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    {price > 50 && (
                        <Badge className="bg-sale absolute top-2 left-2 text-white">
                            Sale
                        </Badge>
                    )}
                </div>
            </Link>

            <CardContent className="p-4">
                <Link href={`/product/${node.handle}`}>
                    <h3 className="mb-2 line-clamp-2 font-medium transition-colors group-hover:text-primary">
                        {node.title}
                    </h3>
                </Link>

                <div className="mb-2 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="fill-star text-star h-3 w-3" />
                    ))}
                    <span className="ml-1 text-xs text-muted-foreground">
                        (4.5)
                    </span>
                </div>

                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-primary">
                        {currencyCode} {price.toFixed(2)}
                    </span>
                    {price > 50 && (
                        <span className="text-sm text-muted-foreground line-through">
                            {currencyCode} {(price * 1.2).toFixed(2)}
                        </span>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button onClick={handleAddToCart} className="w-full" size="sm">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
};
