import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function SectionCards({
    total_product = 0,
    total_customer = 0,
}: {
    total_product?: number;
    total_customer?: number;
}) {
    return (
        <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">
            <Card className="card-gradient card-gradient @container/card">
                <CardHeader>
                    <CardDescription>Total Pendapatan</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        $1,250.00
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Hasil pendapatan yang terdata pada bulan ini.
                    </div>
                </CardFooter>
            </Card>
            <Card className="card-gradient @container/card">
                <CardHeader>
                    <CardDescription>Total Produk</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {total_product}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Total data produk yang aktif atau diarsipkan hingga saat
                        ini.
                    </div>
                </CardFooter>
            </Card>
            <Card className="card-gradient @container/card">
                <CardHeader>
                    <CardDescription>Jumlah Pelanggan</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {total_customer}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Total jumlah akun pelanggan yang tercatat hingga saat
                        ini.
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
