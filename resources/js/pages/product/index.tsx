import { DataTable } from '@/components/data-table';
import DropdownTable from '@/components/dropdown-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { formatDate } from '@/utils/date';
import { Head, Link, usePage } from '@inertiajs/react';
import { IconPlus } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kelola Produk',
        href: '/manage/product',
    },
];

interface product {
    id: number;
    prd_name: string;
    prd_price: number;
    prd_status: '1' | '2' | '3' | '4';
    prd_created_at: Date;
    categories: { cat_name: string; cat_slug: string };
}

export const columns: ColumnDef<product>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    ID
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="ml-3 lowercase">{row.getValue('id')}</div>
        ),
    },
    {
        accessorKey: 'prd_name',
        header: () => <div className="text-left">Nama Product</div>,
    },
    {
        accessorKey: 'prd_price',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Harga
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => {
            const price = Number(row.getValue('prd_price'));

            const formatted = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(price);

            return (
                <div className="text-left font-medium text-green-700">
                    {formatted + ',-'}
                </div>
            );
        },
    },
    {
        accessorKey: 'prd_status',
        header: () => <div className="text-left">Status</div>,
        cell: ({ row }) => {
            const status = row.getValue('prd_status') as string;

            let label = '';
            let color = '';

            switch (status) {
                case '1':
                    label = 'Aktif';
                    color = 'text-green-500';
                    break;
                case '2':
                    label = 'Terjual';
                    color = 'text-yellow-600';
                    break;
                case '3':
                    label = 'Diarsipkan';
                    color = 'text-gray-600';
                    break;
                case '4':
                    label = 'Diorder';
                    color = 'text-amber-600';
                    break;
            }

            return (
                <div className={`font-medium capitalize ${color}`}>{label}</div>
            );
        },
    },
    {
        accessorKey: 'prd_created_at',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Tanggal
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue('prd_created_at')}</div>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const product = row.original;

            return (
                <>
                    <DropdownTable
                        data={product}
                        page={'product'}
                        showDetail
                        showEdit
                        showDelete
                    />
                </>
            );
        },
    },
];

export default function index() {
    const { products } = usePage<{
        products: {
            data: product[];
            links: { url: string | null; label: string; active: boolean }[];
        };
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
    const manipulateData = (data: product[]) => {
        return data.map((item) => {
            const manipulatedItem: any = { ...item };
            if (item.prd_created_at) {
                manipulatedItem.prd_created_at = formatDate(
                    item.prd_created_at,
                );
            }

            return manipulatedItem;
        });
    };
    const formattedData = manipulateData(products.data);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola produk" />
            <div className="mx-5 mt-5">
                <div className="mb-5 flex items-center justify-end px-4 lg:px-6">
                    <Button
                        variant={'default'}
                        asChild
                        className="bg-emerald-600 text-stone-950 hover:bg-emerald-700"
                    >
                        <Link href={'/manage/product/add'}>
                            <IconPlus />
                            <span>Tambah Produk</span>
                        </Link>
                    </Button>
                </div>
                <Toaster position="top-center" richColors closeButton />
                <DataTable
                    search={{ header: 'nama produk', value: 'prd_name' }}
                    columns={columns}
                    data={formattedData}
                    link={products.links}
                />
            </div>
        </AppLayout>
    );
}
