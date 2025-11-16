import { Sparkles } from 'lucide-react';

export const AppHero = () => {
    return (
        <section className="relative flex w-full justify-center overflow-hidden py-10 md:py-10">
            <div className="container">
                <div className="flex flex-col items-center space-y-8 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        <Sparkles className="h-4 w-4" />
                        <span>Matcha Aquatics</span>
                    </div>
                    <div className="max-w-3xl space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                            Cari Cupang Impianmu
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                            Kesederhanaan dan harmoni yang tidak bisa dinikmati
                            semua orang.
                        </p>
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
