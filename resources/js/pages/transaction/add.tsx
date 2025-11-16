import ProductSelector from '@/components/product-selector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import UserSearchInput from '@/components/user-search-input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Form, Head, useForm, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tambah Transaksi',
        href: '/manage/transaction',
    },
];
export default function add() {
    const {
        app_provice_name = { app_stg_title: '', app_stg_value: '' },
        app_city_name = { app_stg_title: '', app_stg_value: '' },
        app_city_id = { app_stg_title: '', app_stg_value: '' },
    } = usePage<{
        app_provice_name: {
            app_stg_title: string;
            app_stg_value: string;
        };
        app_city_name: {
            app_stg_title: string;
            app_stg_value: string;
        };
        app_city_id: {
            app_stg_title: string;
            app_stg_value: string;
        };
    }>().props;
    const [buyer, setBuyer] = useState<{
        id: number | null;
        name: string | null;
        provice_name: string;
        city_name: string;
        city_id: string;
        latitude: string;
        longitude: string;
    }>({
        id: null,
        name: null,
        provice_name: '',
        city_name: '',
        city_id: '',
        latitude: '',
        longitude: '',
    });

    const { processing } = useForm();
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string };
    const [paymentMethod, setPaymentMethod] = useState<
        '1' | '2' | '3' | '4' | ''
    >('');

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);
    const { data, setData, post } = useForm({
        trx_name: buyer.name,
        product_id: [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah transaksi" />
            <Toaster position="top-center" richColors closeButton />
            <div className="p-5">
                <Form
                    action={'/system/transaction/add/'}
                    method={'POST'}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Label className="my-1">Akun Pembeli</Label>
                        <UserSearchInput
                            name="trx_buyer_id"
                            value={buyer.name ?? ''}
                            onChange={(
                                id,
                                name,
                                provice_name,
                                city_name,
                                city_id,
                                latitude,
                                longitude,
                            ) => (
                                setBuyer({
                                    id,
                                    name,
                                    provice_name,
                                    city_name,
                                    city_id,
                                    latitude,
                                    longitude,
                                }),
                                setPaymentMethod(''),
                                setData('trx_name', name)
                            )}
                        />
                        {buyer.id && (
                            <p className="text-xs text-gray-500">
                                ID Pembeli:{' '}
                                <span className="font-medium">{buyer.id}</span>
                            </p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="name" className="my-1">
                            Nama Pembeli
                        </Label>
                        <Input
                            value={data.trx_name ?? ''}
                            name="trx_buyer_name"
                            onChange={(e) =>
                                setData('trx_name', e.target.value)
                            }
                            id="name"
                        />
                    </div>
                    <div>
                        <Label className="my-1">Metode Pembayaran</Label>
                        <Select
                            name="trx_payment_method"
                            value={paymentMethod}
                            onValueChange={(value) =>
                                setPaymentMethod(value as '1' | '2' | '3' | '4')
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih metode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Pilih metode</SelectLabel>
                                    <SelectItem value="1">Tunai</SelectItem>
                                    <SelectItem value="2">Non-Tunai</SelectItem>
                                    <SelectItem value="3">
                                        Tunai + Pengiriman
                                    </SelectItem>
                                    <SelectItem value="4">
                                        Non-Tunai + Pengiriman
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {paymentMethod && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Pilih Produk
                            </label>
                            <ProductSelector
                                key={paymentMethod + String(buyer.id)}
                                name="product_id[]"
                                paymentMethod={paymentMethod}
                                Origin_Provice_name={
                                    app_provice_name?.app_stg_value
                                }
                                Origin_City_name={app_city_name?.app_stg_value}
                                Origin_City_id={app_city_id?.app_stg_value}
                                Destination_Provice_name={buyer?.provice_name}
                                Destination_City_name={buyer?.city_name}
                                Destination_City_id={buyer?.city_id}
                            />
                        </div>
                    )}
                    {!paymentMethod && (
                        <p className="text-sm text-amber-600 italic">
                            Silakan pilih metode pembayaran terlebih dahulu
                            untuk melanjutkan.
                        </p>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        disabled={processing}
                    >
                        {processing ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />{' '}
                                Menyimpan...
                            </span>
                        ) : (
                            'Tambah Transaksi'
                        )}
                    </Button>
                </Form>
            </div>
        </AppLayout>
    );
}
