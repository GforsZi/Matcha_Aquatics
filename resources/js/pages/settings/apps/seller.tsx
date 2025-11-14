import { Form, Head, useForm, usePage } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import AppSettingsLayout from '@/layouts/settings/app-layout';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengaturan Penjual',
        href: '/app/setting/seller',
    },
];

export default function seller() {
    const [csName, setCsName] = useState('');
    const [csNomor, setCsNomor] = useState('');
    const { app_cs_name, app_cs_nomor } = usePage<{
        app_cs_name: {
            app_stg_title: string;
            app_stg_value: string;
        };
        app_cs_nomor: {
            app_stg_title: string;
            app_stg_value: string;
        };
    }>().props;
    useEffect(() => {
        if (!app_cs_name || !app_cs_nomor) {
            setCsName('');
            setCsNomor('');
        } else {
            setCsName(app_cs_name.app_stg_value);
            setCsNomor(app_cs_nomor.app_stg_value);
        }
    }, [app_cs_name, app_cs_nomor]);
    const { processing, data, setData } = useForm({
        app_cs_name: csName,
        app_cs_nomor: csNomor,
    });
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string };
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Pusat Bantuan" />
            <Toaster position="top-center" richColors closeButton />

            <AppSettingsLayout>
                <div className="w-full">
                    <HeadingSmall
                        title="Pengaturan Pusat Bantuan"
                        description="Sesuaikan informasi dari Pusat Bantuan pada aplikasi."
                    />
                    <Form action={''} method="post" className="mt-5">
                        <Card>
                            <CardContent className="pb-0">
                                <div className="mb-2">
                                    <Input
                                        placeholder="Nama Pusat Bantuan"
                                        name="app_cs_name"
                                        value={data.app_cs_name}
                                        onChange={(e) =>
                                            setData(
                                                'app_cs_name',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-2">
                                    <Input
                                        placeholder="Nomor Pusat Bantuan"
                                        name="app_cs_nomor"
                                        value={data.app_cs_nomor}
                                        onChange={(e) =>
                                            setData(
                                                'app_cs_nomor',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Button
                            type="submit"
                            className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700"
                            disabled={processing}
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />{' '}
                                    Menyimpan...
                                </span>
                            ) : (
                                'Simpan'
                            )}
                        </Button>
                    </Form>
                </div>
            </AppSettingsLayout>
        </AppLayout>
    );
}
