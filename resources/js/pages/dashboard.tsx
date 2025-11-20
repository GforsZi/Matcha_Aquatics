import { ChartArea } from '@/components/chart-area';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import MapView from '@/components/map-view';
import { SectionCards } from '@/components/section-cards';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const {
        app_location_latitude = { app_stg_title: '', app_stg_value: '' },
        app_location_longitude = { app_stg_title: '', app_stg_value: '' },
        logins,
        total_product,
        total_customer,
        transactions,
        total_transaction,
    } = usePage<{
        app_location_latitude: { app_stg_title: string; app_stg_value: string };
        app_location_longitude: {
            app_stg_title: string;
            app_stg_value: string;
        };
        logins: {
            date: string;
            desktop: number;
            mobile: number;
            tablet: number;
        }[];
        total_product: number;
        total_customer: number;
        total_transaction: number;
        transactions: { date: string; desktop: number }[];
    }>().props;
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
            <Head title="Dashboard" />
            <Toaster position="top-center" richColors closeButton />
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <SectionCards
                        total_product={total_product}
                        total_customer={total_customer}
                        total_transaction={total_transaction}
                    />
                    <div className="px-4 lg:px-6">
                        <ChartArea chartData={transactions} />
                    </div>
                </div>
                <div className="flex flex-col gap-2 px-4 md:flex-row md:gap-6 md:pb-6 lg:px-6">
                    <div className="flex w-full justify-center md:w-1/3">
                        <MapView
                            Latitude={app_location_latitude?.app_stg_value}
                            Longitude={app_location_longitude?.app_stg_value}
                        />
                    </div>
                    <div className="md:w-2/3">
                        <ChartAreaInteractive chartData={logins} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
