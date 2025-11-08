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
    const [buyer, setBuyer] = useState<{
        id: number | null;
        name: string | null;
    }>({
        id: null,
        name: null,
    });
    const { processing } = useForm();
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string };
    const [paymentMethod, setPaymentMethod] = useState<'1' | '2' | ''>('');

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
                    action={'/system/transaction/add/offline'}
                    method={'POST'}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Label className="my-1">Akun Pembeli</Label>
                        <UserSearchInput
                            name="trx_buyer_id"
                            value={buyer.name ?? ''}
                            onChange={(id, name) => (
                                setBuyer({ id, name }),
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
                                setPaymentMethod(value as '1' | '2')
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
                                name="product_id[]"
                                paymentMethod={paymentMethod}
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
