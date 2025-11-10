import { ChartArea } from '@/components/chart-area';
import { ChartBarInteractive } from '@/components/chart-bar-interactive';
import { ChartRadarDots } from '@/components/chart-radar-dots';
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
                    <SectionCards />
                    <div className="px-4 lg:px-6">
                        <ChartArea />
                    </div>
                </div>
                <div className="flex flex-col gap-2 px-4 md:flex-row md:gap-6 md:pb-6 lg:px-6">
                    <div className="flex w-full justify-center md:w-1/3">
                        <ChartRadarDots />
                    </div>
                    <div className="md:w-2/3">
                        <ChartBarInteractive />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
