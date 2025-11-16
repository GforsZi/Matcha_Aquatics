'use client';

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { Form, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import * as React from 'react';

export function CommandDialogSearch() {
    const [open, setOpen] = React.useState(false);
    const [categories, setCategories] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    // Fetch API setelah komponen dirender
    React.useEffect(() => {
        setLoading(true);
        fetch('/system/categories/search')
            .then((res) => res.json())
            .then((data) => {
                setCategories(data);
            })
            .catch((err) => console.error('Error:', err))
            .finally(() => setLoading(false));
    }, []);

    function openCommand() {
        setOpen((open) => !open);
    }
    const [value, setValue] = React.useState('');
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const keyword = params.get('s') || '';
        setValue(keyword);
    }, []);
    return (
        <>
            <p className="text-sm text-muted-foreground" onClick={openCommand}>
                <Search className="!size-5 opacity-80 group-hover:opacity-100" />
            </p>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <Form method="get" action={'/search'}>
                    <input type="hidden" name="s" value={value} />

                    <CommandInput
                        placeholder="Masukan kata kunci..."
                        value={value}
                        onValueChange={setValue}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                e.currentTarget.form?.submit();
                            }
                        }}
                    />
                </Form>

                <CommandList>
                    <CommandGroup heading="Kategori">
                        {categories.map((c: any) => (
                            <Link
                                href={`/search?category=${c.cat_slug}`}
                                key={c.cat_id}
                            >
                                <CommandItem value={c.cat_name}>
                                    <span>{c.cat_name}</span>
                                </CommandItem>
                            </Link>
                        ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandEmpty>
                        {loading ? 'Memuat data...' : 'Tidak ada hasil.'}
                    </CommandEmpty>
                </CommandList>
            </CommandDialog>
        </>
    );
}
