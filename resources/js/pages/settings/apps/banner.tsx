import { Form, Head, useForm, usePage } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import AppSettingsLayout from '@/layouts/settings/app-layout';
import { ImageIcon, Loader2, X } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengaturan Sepanduk',
        href: '/app/setting/banner',
    },
];

export default function banner() {
    const { app_banner = { app_stg_title: '', app_stg_value: '' } } = usePage<{
        app_banner: {
            app_stg_title: string;
            app_stg_value: string;
        };
    }>().props;
    const { assetBaseUrl } = usePage().props;
    const asset = (path: string) => `${assetBaseUrl}${path}`;

    const { processing, data, setData } = useForm({
        app_banner: '',
        banner: null as File | null,
    });
    useEffect(() => {
        if (!app_banner) {
            setData({ app_banner: '' });
        } else {
            setData({
                app_banner: app_banner.app_stg_value,
            });
        }
    }, [app_banner]);

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
    const [preview, setPreview] = useState<string | null>(null);
    const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('banner', file);

        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };
    const handleRemove = () => {
        setPreview(null);
    };
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
                    <Form
                        action={'/app/setting/banner'}
                        method="post"
                        className="mt-5"
                    >
                        <Card>
                            <CardContent className="pb-0">
                                <div className="space-y-1">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        name="image"
                                        onChange={handleBannerChange}
                                    />
                                </div>

                                {preview && (
                                    <div className="relative mt-4">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="h-auto w-full rounded-lg border"
                                            style={{ maxWidth: '100%' }}
                                        />
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="destructive"
                                            className="absolute top-2 right-2 rounded-full"
                                            onClick={handleRemove}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                                {data.app_banner && !preview && (
                                    <div className="relative mt-3">
                                        <img
                                            src={asset(data?.app_banner)}
                                            alt="Preview"
                                            className="h-auto w-full rounded-lg border"
                                        />
                                    </div>
                                )}
                                {!preview && !data.app_banner && (
                                    <div className="mt-4 flex h-48 w-full flex-col items-center justify-center rounded-md border-2 border-dashed text-muted-foreground">
                                        <ImageIcon className="mb-2 h-10 w-10" />
                                        <span className="text-sm">
                                            Belum ada gambar dipilih
                                        </span>
                                    </div>
                                )}
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
