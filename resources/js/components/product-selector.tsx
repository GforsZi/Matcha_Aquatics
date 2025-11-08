import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { usePage } from '@inertiajs/react';
import { Plus, Search, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

type ProductType = {
    prd_id: number;
    prd_name: string;
    prd_price: number;
    prd_img_url?: string | null;
};

interface Props {
    name?: string;
    paymentMethod?: string;
}

const ProductSelector: React.FC<Props> = ({
    name = 'product_id[]',
    paymentMethod,
}) => {
    const { assetBaseUrl } = usePage().props;
    const asset = (path: string) => `${assetBaseUrl}${path}`;
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<ProductType[]>([]);
    const [selected, setSelected] = useState<Record<number, ProductType>>({});
    const [paidAmount, setPaidAmount] = useState<number>(0);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        const delay = setTimeout(() => {
            fetch(`/system/product/search?q=${encodeURIComponent(searchQuery)}`)
                .then((res) => res.json())
                .then((data: ProductType[]) => setResults(data))
                .catch(() => setResults([]));
        }, 300);

        return () => clearTimeout(delay);
    }, [searchQuery]);

    const toggleSelect = (product: ProductType) => {
        setSelected((prev) => {
            const copy = { ...prev };
            if (copy[product.prd_id]) delete copy[product.prd_id];
            else copy[product.prd_id] = product;
            return copy;
        });
    };

    const removeProduct = (id: number) => {
        setSelected((prev) => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });
    };

    const handleContinue = () => setOpen(false);

    const totalPrice = useMemo(() => {
        return Object.values(selected).reduce(
            (sum, product) => sum + product.prd_price,
            0,
        );
    }, [selected]);

    const change = useMemo(() => {
        const diff = paidAmount - totalPrice;
        return diff > 0 ? diff : 0;
    }, [paidAmount, totalPrice]);

    const formatRupiah = (value: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    return (
        <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {Object.values(selected).length === 0 ? (
                    <div className="flex h-24 items-center justify-center rounded-md border text-sm text-muted-foreground">
                        Belum ada produk dipilih
                    </div>
                ) : (
                    Object.values(selected).map((prd) => (
                        <Card
                            key={prd.prd_id}
                            className="group relative overflow-hidden border shadow-sm"
                        >
                            <input
                                type="hidden"
                                name={name}
                                value={prd.prd_id}
                            />
                            {prd.prd_img_url ? (
                                <img
                                    src={asset(prd.prd_img_url)}
                                    alt={prd.prd_name}
                                    className="h-32 w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-32 w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                                    Tidak ada gambar
                                </div>
                            )}
                            <CardContent className="space-y-1 p-3">
                                <h3 className="text-sm font-medium">
                                    {prd.prd_name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {formatRupiah(prd.prd_price) + ',-'}
                                </p>
                            </CardContent>
                            <button
                                type="button"
                                onClick={() => removeProduct(prd.prd_id)}
                                className="absolute top-2 right-2 rounded-full bg-white/80 p-1 opacity-0 transition group-hover:opacity-100 hover:bg-white"
                            >
                                <X size={14} />
                            </button>
                        </Card>
                    ))
                )}
            </div>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-fit gap-1">
                        <Plus size={16} />
                    </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="max-w-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Pilih Produk</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div>
                                <p className="mb-3 text-sm text-muted-foreground">
                                    Cari produk berdasarkan nama dan centang
                                    untuk memilih.
                                </p>

                                <div className="mb-4 flex items-center gap-2">
                                    <Input
                                        placeholder="Ketik nama produk..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="flex-1"
                                    />
                                    <Search className="text-muted-foreground" />
                                </div>

                                <div className="grid h-[255px] w-full grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2 md:grid-cols-3">
                                    {results.length === 0 ? (
                                        <p className="col-span-full text-center text-sm text-muted-foreground">
                                            {searchQuery
                                                ? 'Tidak ada hasil'
                                                : 'Ketik untuk mencari produk'}
                                        </p>
                                    ) : (
                                        results.map((prd) => {
                                            const isSelected =
                                                !!selected[prd.prd_id];
                                            return (
                                                <Card
                                                    key={prd.prd_id}
                                                    onClick={() =>
                                                        toggleSelect(prd)
                                                    }
                                                    className={`cursor-pointer transition hover:border-primary ${
                                                        isSelected
                                                            ? 'border-primary ring-1 ring-primary'
                                                            : ''
                                                    }`}
                                                >
                                                    {prd.prd_img_url ? (
                                                        <img
                                                            src={asset(
                                                                prd.prd_img_url,
                                                            )}
                                                            alt={prd.prd_name}
                                                            className="h-32 w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-32 w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                                                            Tidak ada gambar
                                                        </div>
                                                    )}
                                                    <CardContent className="px-3">
                                                        <h3 className="truncate text-sm font-medium">
                                                            {prd.prd_name}
                                                        </h3>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatRupiah(
                                                                prd.prd_price,
                                                            ) + ',-'}
                                                        </p>
                                                        <div className="flex justify-end">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    isSelected
                                                                }
                                                                onChange={() =>
                                                                    toggleSelect(
                                                                        prd,
                                                                    )
                                                                }
                                                                className="h-4 w-4 accent-primary"
                                                            />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleContinue}>
                            Tambahkan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex items-center justify-between rounded-md border bg-muted/40 px-4 py-2">
                <span className="text-sm font-medium text-muted-foreground">
                    Total Produk: {Object.values(selected).length}
                </span>
                <span className="text-base font-semibold text-primary">
                    Total: {formatRupiah(totalPrice) + ',-'}
                </span>
                <Input name="trx_total" value={totalPrice} type="hidden" />
            </div>
            {paymentMethod == '1' && (
                <div className="mt-3">
                    <label className="text-sm font-medium">Pembayaran</label>
                    <Input
                        type="number"
                        name="trx_payment"
                        value={paidAmount}
                        onChange={(e) =>
                            setPaidAmount(Number(e.target.value) || 0)
                        }
                        placeholder="Masukkan jumlah uang dibayar"
                        className="mt-1"
                    />
                </div>
            )}

            {paidAmount > 0 && (
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold">Kembalian:</span>
                    <span
                        className={`text-base font-bold ${
                            change > 0 ? 'text-green-600' : 'text-red-500'
                        }`}
                    >
                        {formatRupiah(change) + ',-'}
                    </span>
                    <Input name="trx_change" value={change} type="hidden" />
                </div>
            )}
        </div>
    );
};

export default ProductSelector;
