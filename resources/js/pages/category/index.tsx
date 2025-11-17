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
        title: 'Kelola Kategori',
        href: '/manage/category',
    },
];

interface category {
    id: number;
    cat_name: string;
    cat_created_at: Date;
}

export const columns: ColumnDef<category>[] = [
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
        accessorKey: 'cat_name',
        header: () => <div className="text-left">Nama</div>,
    },
    {
        accessorKey: 'cat_slug',
        header: () => <div className="text-left">Slug</div>,
    },
    {
        accessorKey: 'cat_created_at',
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
            <div className="lowercase">{row.getValue('cat_created_at')}</div>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const category = row.original;

            return (
                <>
                    <DropdownTable
                        data={category}
                        page={'category'}
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
    const { categories } = usePage<{
        categories: {
            data: category[];
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
    const manipulateData = (data: category[]) => {
        return data.map((item) => {
            const manipulatedItem: any = { ...item };
            if (item.cat_created_at) {
                manipulatedItem.cat_created_at = formatDate(
                    item.cat_created_at,
                );
            }

            return manipulatedItem;
        });
    };
    const formattedData = manipulateData(categories.data);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola kategori" />
            <div className="mx-5 mt-5">
                <div className="mb-5 flex items-center justify-end px-4 lg:px-6">
                    <Button
                        variant={'default'}
                        asChild
                        className="bg-emerald-600 text-stone-950 hover:bg-emerald-700"
                    >
                        <Link href={'/manage/category/add'}>
                            <IconPlus />
                            <span>Tambah Kategori</span>
                        </Link>
                    </Button>
                </div>
                <Toaster position="top-center" richColors closeButton />
                <DataTable
                    search={{ header: 'nama kategori', value: 'cat_name' }}
                    columns={columns}
                    data={formattedData}
                    link={categories.links}
                />
            </div>
        </AppLayout>
    );
}
