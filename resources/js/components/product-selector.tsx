import {
    AlertDialog,
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
import { ImageIcon, Plus, Search, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import ShippingCostCalculator from './shipping-cost-calculator';
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';

type ProductType = {
    prd_id: number;
    prd_name: string;
    prd_price: number;
    prd_weight: number;
    prd_img_url?: string | null;
};

interface Props {
    name?: string;
    paymentMethod?: string;
    Origin_Provice_name?: string;
    Origin_City_name?: string;
    Origin_City_id?: string;
    Origin_Latitude?: string;
    Origin_Longitude?: string;
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
    Origin_Latitude = '',
    Origin_Longitude = '',
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

    const totalWeight = useMemo(() => {
        return Object.values(selected).reduce(
            (sum, p) => sum + p.prd_weight,
            0,
        );
    }, [selected]);

    const formatRupiah = (value: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    // --- SHIPPING STATE ---
    const [cost, setCost] = useState({
        code: '',
        name: '',
        cost: 0,
        etd: '',
        service: '',
    });

    const [costShp, setCostShp] = useState(0);

    // --- RESET SHIPPING ---
    const clearShipping = () => {
        setCost({
            code: '',
            name: '',
            cost: 0,
            etd: '',
            service: '',
        });
        setCostShp(0);
    };

    const change = useMemo(() => {
        const diff = paidAmount - totalPrice - costShp;
        return diff > 0 ? diff : 0;
    }, [paidAmount, totalPrice, costShp]);

    return (
        <div className="flex flex-col gap-4">
            {/* PRODUK YANG DIPILIH */}
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
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
                                <div className="flex h-32 w-full flex-col items-center justify-center rounded-md border-2 border-dashed text-muted-foreground shadow-md">
                                    <ImageIcon className="mb-2 h-10 w-10" />
                                    <span className="text-sm">
                                        Belum ada gambar
                                    </span>
                                </div>
                            )}

                            <CardContent className="flex flex-col justify-end px-3">
                                <h3 className="text-sm font-medium">
                                    {prd.prd_name}
                                </h3>
                                <p className="mt-1 text-sm font-bold text-emerald-600">
                                    {formatRupiah(prd.prd_price) + ',-'}
                                </p>
                                <h3 className="mt-1 text-sm font-medium">
                                    {prd.prd_weight + ' gram'}
                                </h3>
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

            {/* MODAL PILIH PRODUK */}
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

                                <InputGroup className="mb-4 flex items-center gap-2">
                                    <InputGroupInput
                                        placeholder="Ketik nama produk..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="flex-1"
                                    />
                                    <InputGroupAddon>
                                        <Search />
                                    </InputGroupAddon>
                                </InputGroup>

                                <div className="grid h-[255px] grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2 md:grid-cols-3">
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
                                                        <div className="flex h-32 w-full flex-col items-center justify-center rounded-md border-2 border-dashed text-muted-foreground shadow-md">
                                                            <ImageIcon className="mb-2 h-10 w-10" />
                                                            <span className="text-sm">
                                                                Belum ada gambar
                                                            </span>
                                                        </div>
                                                    )}

                                                    <CardContent className="px-3">
                                                        <h3 className="truncate text-sm font-medium">
                                                            {prd.prd_name}
                                                        </h3>
                                                        <p className="text-xs text-emerald-600">
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
                                                                className="w-4 accent-primary"
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
                        <AlertDialogCancel>Tutup</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* PEMBAYARAN BIASA */}
            {paymentMethod == '1' && (
                <div className="mt-3">
                    <label className="text-sm font-medium">Pembayaran</label>
                    <Input
                        type="number"
                        name="trx_payment"
                        value={paidAmount == 0 ? '' : paidAmount}
                        onChange={(e) =>
                            setPaidAmount(Number(e.target.value) || 0)
                        }
                        placeholder="Masukkan jumlah uang dibayar"
                        className="mt-1"
                    />
                </div>
            )}

            {/* --- SHIPPING CALCULATOR --- */}
            {(paymentMethod == '3' || paymentMethod == '4') && (
                <ShippingCostCalculator
                    key={totalWeight}
                    defaultOriginProviceName={Origin_Provice_name}
                    defaultOriginCityName={Origin_City_name}
                    defaultOriginId={Origin_City_id}
                    defaultDestinationProviceName={Destination_Provice_name}
                    defaultDestinationCityName={Destination_City_name}
                    defaultDestinationId={Destination_City_id}
                    defaultOriginLatitude={Origin_Latitude}
                    defaultOriginLongitude={Origin_Longitude}
                    defaultDestinationLatitude={Destination_Latitude}
                    defaultDestinationLongitude={Destination_Longitude}
                    defaultweight={totalWeight}
                    onChange={(code, name, costVal, etd, service) => {
                        setCost({
                            code,
                            name,
                            cost: costVal,
                            etd,
                            service,
                        });
                        setCostShp(costVal);
                    }}
                />
            )}

            {/* --- SHIPPING SUMMARY CARD (BARU) --- */}
            {cost.code && (
                <Card className="relative mt-2 border p-4 shadow-sm">
                    <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={clearShipping}
                        className="absolute top-2 right-2 rounded-full"
                    >
                        <X size={14} />
                    </Button>

                    <CardContent className="mt-2 flex flex-col gap-1">
                        <h3 className="text-sm font-semibold">
                            Paket Pengiriman Dipilih
                        </h3>
                        <div className="text-sm text-muted-foreground">
                            <p>
                                <span className="font-medium">Kurir:</span>{' '}
                                {cost.code} – {cost.name}
                            </p>
                            <p>
                                <span className="font-medium">Layanan:</span>{' '}
                                {cost.service}
                            </p>
                            <p>
                                <span className="font-medium">Estimasi:</span>{' '}
                                {cost.etd} hari
                            </p>
                            <p>
                                <span className="font-medium">Harga:</span>{' '}
                                {formatRupiah(cost.cost) + ',-'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* SUMMARY TOTAL */}
            <div className="flex items-center justify-between rounded-md border bg-muted/40 px-4 py-2">
                <span className="text-sm font-medium text-muted-foreground">
                    Total Produk: {Object.values(selected).length}
                </span>

                <span className="text-base font-semibold text-primary">
                    Total: {formatRupiah(totalPrice + costShp) + ',-'}
                </span>

                {/* Hidden Inputs */}
                <Input name="trx_subtotal" value={totalPrice} type="hidden" />
                <Input name="trx_shipping_cost" value={costShp} type="hidden" />
                <Input name="shp_courier" value={cost.code} type="hidden" />
                <Input name="shp_cost" value={cost.cost} type="hidden" />
                <Input name="shp_service" value={cost.service} type="hidden" />
                <Input name="shp_etd" value={cost.etd} type="hidden" />
            </div>

            {/* KEMBALIAN */}
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

            {/* PEMBAYARAN UNTUK PENGIRIMAN */}
            {paymentMethod == '3' && (
                <div className="mt-3">
                    <label className="text-sm font-medium">Pembayaran</label>
                    <Input
                        type="number"
                        name="trx_payment"
                        value={paidAmount == 0 ? '' : paidAmount}
                        onChange={(e) =>
                            setPaidAmount(Number(e.target.value || 0))
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
