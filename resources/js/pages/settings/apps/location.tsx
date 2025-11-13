import { Form, Head, useForm, usePage } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import MapInput from '@/components/map-input';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import AppSettingsLayout from '@/layouts/settings/app-layout';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengaturan Lokasi',
        href: '/app/setting/location',
    },
];

export default function Appearance() {
    const { app_latitude, app_longitude, app_name } = usePage<{
        app_latitude: {
            app_stg_title: string;
            app_stg_value: string;
        };
        app_longitude: {
            app_stg_title: string;
            app_stg_value: string;
        };
        app_name: {
            app_stg_title: string;
            app_stg_value: string;
        };
    }>().props;
    const { processing } = useForm();
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
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />
            <Toaster position="top-center" richColors closeButton />

            <AppSettingsLayout>
                <div className="w-full">
                    <HeadingSmall
                        title="Pengaturan Lokasi"
                        description="Sesuaikan lokasi dari toko milikmu pada aplikasi."
                    />
                    <Form
                        action={'/app/setting/location'}
                        method="post"
                        className="mt-5"
                    >
                        <MapInput
                            Name={app_name?.app_stg_value || ''}
                            Latitude={app_latitude?.app_stg_value}
                            Longitude={app_longitude?.app_stg_value}
                        />
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
