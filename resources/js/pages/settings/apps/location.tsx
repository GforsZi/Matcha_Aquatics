import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import MapInput from '@/components/map-input';
import AppLayout from '@/layouts/app-layout';
import AppSettingsLayout from '@/layouts/settings/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengaturan Lokasi',
        href: '/app/setting/location',
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <AppSettingsLayout>
                <div className="w-full">
                    <HeadingSmall
                        title="Pengaturan Lokasi"
                        description="Sesuaikan lokasi dari toko milikmu pada aplikasi."
                    />
                    <div className="mt-5">
                        <MapInput />
                    </div>
                </div>
            </AppSettingsLayout>
        </AppLayout>
    );
}
