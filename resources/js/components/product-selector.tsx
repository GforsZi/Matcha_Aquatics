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
import ShippingCostCalculator from './shipping-cost-calculator';

type ProductType = {
    prd_id: number;
    prd_name: string;
    prd_price: number;
    prd_img_url?: string | null;
};

interface Props {
    name?: string;
    paymentMethod?: string;
    Origin_Provice_name?: string;
    Origin_City_name?: string;
    Origin_City_id?: string;
    Destination_Provice_name?: string;
    Destination_City_name?: string;
    Destination_City_id?: string;
    Destination_Latitude?: string;
    Destination_Longitude?: string;
}

const ProductSelector: React.FC<Props> = ({
    name = 'product_id[]',
    paymentMethod,
    Origin_Provice_name = '',
    Origin_City_name = '',
    Origin_City_id = '',
    Destination_Provice_name = '',
    Destination_City_name = '',
    Destination_City_id = '',
    Destination_Latitude = '',
    Destination_Longitude = '',
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

    const formatRupiah = (value: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    const [cost, setCost] = useState<{
        code: string;
        name: string;
        cost: number;
        etd: string;
        service: string;
    }>({
        code: '',
        name: '',
        cost: 0,
        etd: '',
        service: '',
    });
    const [costShp, setCostShp] = useState(0);

    const change = useMemo(() => {
        const diff = paidAmount - totalPrice - costShp;
        return diff > 0 ? diff : 0;
    }, [paidAmount, totalPrice]);

    return (
        <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
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
                                    className="h-56 w-full border object-contain"
                                />
                            ) : (
                                <div className="flex h-auto w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                                    Tidak ada gambar
                                </div>
                            )}
                            <CardContent className="flex h-full flex-col justify-end px-3">
                                <hr className="mb-2" />
                                <h3 className="text-sm font-medium">
                                    {prd.prd_name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {formatRupiah(prd.prd_price) + ',-'}
                                </p>
                            </CardContent>
                            <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                onClick={() => removeProduct(prd.prd_id)}
                                className="absolute top-2 right-2 rounded-full"
                            >
                                <X size={14} />
                            </Button>
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

            {paymentMethod == '3' && (
                <ShippingCostCalculator
                    defaultOriginProviceName={Origin_Provice_name}
                    defaultOriginCityName={Origin_City_name}
                    defaultOriginId={Origin_City_id}
                    defaultDestinationProviceName={Destination_Provice_name}
                    defaultDestinationCityName={Destination_City_name}
                    defaultDestinationId={Destination_City_id}
                    onChange={(code, name, cost, etd, service) => (
                        setCost({
                            code,
                            name,
                            cost,
                            etd,
                            service,
                        }),
                        setCostShp(cost)
                    )}
                />
            )}
            {paymentMethod == '4' && (
                <ShippingCostCalculator
                    defaultOriginProviceName={Origin_Provice_name}
                    defaultOriginCityName={Origin_City_name}
                    defaultOriginId={Origin_City_id}
                    defaultDestinationProviceName={Destination_Provice_name}
                    defaultDestinationCityName={Destination_City_name}
                    defaultDestinationId={Destination_City_id}
                    onChange={(code, name, cost, etd, service) => (
                        setCost({
                            code,
                            name,
                            cost,
                            etd,
                            service,
                        }),
                        setCostShp(cost)
                    )}
                />
            )}
            <div className="flex items-center justify-between rounded-md border bg-muted/40 px-4 py-2">
                <span className="text-sm font-medium text-muted-foreground">
                    Total Produk: {Object.values(selected).length}
                </span>
                <span className="text-base font-semibold text-primary">
                    Total: {formatRupiah(totalPrice + costShp) + ',-'}
                </span>
                <Input name="trx_total" value={totalPrice} type="hidden" />
                <Input name="trx_shipping_cost" value={costShp} type="hidden" />
                <Input name="shp_courier" value={cost.code} type="hidden" />
                <Input name="shp_cost" value={cost.cost} type="hidden" />
                <Input name="shp_service" value={cost.service} type="hidden" />
                <Input name="shp_etd" value={cost.etd} type="hidden" />
            </div>

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
            {paymentMethod == '3' && (
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
        </div>
    );
};

export default ProductSelector;
