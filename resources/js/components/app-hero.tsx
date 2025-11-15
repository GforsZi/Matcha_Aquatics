import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export const AppHero = () => {
    return (
        <section className="relative flex w-full justify-center overflow-hidden py-16 md:py-24">
            <div className="container">
                <div className="flex flex-col items-center space-y-8 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        <Sparkles className="h-4 w-4" />
                        <span>Grand Opening Sale - Up to 50% Off!</span>
                    </div>

                    <div className="max-w-3xl space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                            Shop Your Favorite Products
                            <span className="mt-2 block text-primary">
                                At Amazing Prices
                            </span>
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                            Discover incredible deals on top brands. Fast
                            shipping, easy returns, and 24/7 customer support.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button size="lg" className="text-base">
                            Shop Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="text-base"
                        >
                            View Deals
                        </Button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="bg-success h-2 w-2 rounded-full"></div>
                            <span>Free Shipping Over $50</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="bg-success h-2 w-2 rounded-full"></div>
                            <span>Easy 30-Day Returns</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="bg-success h-2 w-2 rounded-full"></div>
                            <span>Secure Checkout</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-30 blur-3xl">
                    <div className="aspect-square w-[40rem] rounded-full bg-gradient-to-tr from-primary to-secondary"></div>
                </div>
            </div>
        </section>
    );
};
