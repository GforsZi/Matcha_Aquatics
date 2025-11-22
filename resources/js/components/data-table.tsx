'use client';

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface searchData {
    header: string;
    value: string;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    search: searchData;
    link: PaginationLink[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
    search,
    link,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="my-3 space-y-4">
            <div className="flex items-center">
                <Input
                    placeholder={`Filter berdasarkan ${search.header}...`}
                    value={
                        (table
                            .getColumn(search.value)
                            ?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) =>
                        table
                            .getColumn(search.value)
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Data tidak tersedia.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {link.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                    {(() => {
                        const activeIndex = link.findIndex((l) => l.active);
                        const start = Math.max(1, activeIndex - 2);
                        const end = Math.min(link.length - 2, activeIndex + 2);
                        const sliced = link.slice(start, end + 1);
                        const prev = link[0];
                        const next = link[link.length - 1];

                        return (
                            <>
                                <Button
                                    asChild
                                    size="sm"
                                    variant="outline"
                                    disabled={!prev.url}
                                >
                                    <Link
                                        href={prev.url || '#'}
                                        dangerouslySetInnerHTML={{
                                            __html: prev.label,
                                        }}
                                    />
                                </Button>

                                {sliced.map((link, index) => (
                                    <Button
                                        key={index}
                                        asChild
                                        size="sm"
                                        className={
                                            link.active
                                                ? 'bg-emerald-600 text-stone-950 hover:bg-emerald-700'
                                                : ''
                                        }
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        disabled={!link.url}
                                    >
                                        <Link
                                            href={link.url || '#'}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    </Button>
                                ))}
                                <Button
                                    asChild
                                    size="sm"
                                    variant="outline"
                                    disabled={!next.url}
                                >
                                    <Link
                                        href={next.url || '#'}
                                        dangerouslySetInnerHTML={{
                                            __html: next.label,
                                        }}
                                    />
                                </Button>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}
