import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface User {
    usr_id: number;
    name: string;
    email: string;
}

interface Props {
    name?: string; // 👈 untuk dikirim ke backend
    value?: string;
    defaultId?: number | null;
    onChange?: (id: number | null, name: string | null) => void;
}

const UserSearchInput: React.FC<Props> = ({
    name,
    value = '',
    defaultId = null,
    onChange,
}) => {
    const [query, setQuery] = useState(value);
    const [selectedId, setSelectedId] = useState<number | null>(defaultId);
    const [users, setUsers] = useState<User[]>([]);
    const [showList, setShowList] = useState(false);
    const [loading, setLoading] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (query.trim() === '') {
            setUsers([]);
            return;
        }

        setLoading(true);
        fetch(`/system/users/search?q=${encodeURIComponent(query)}`)
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                setShowList(true);
            })
            .catch(() => setUsers([]))
            .finally(() => setLoading(false));
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setShowList(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (user: User) => {
        setQuery(user.name);
        setSelectedId(user.usr_id);
        setShowList(false);
        onChange?.(user.usr_id, user.name);
    };

    const handleClear = () => {
        setQuery('');
        setSelectedId(null);
        setUsers([]);
        onChange?.(null, null);
    };

    return (
        <div className="relative w-full" ref={ref}>
            {/* Hidden input untuk dikirim ke backend */}
            {name && (
                <input type="hidden" name={name} value={selectedId ?? ''} />
            )}

            <div className="relative flex items-center">
                <Input
                    type="text"
                    placeholder="Cari user..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => users.length > 0 && setShowList(true)}
                    className="pr-10"
                />
                {query && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClear}
                        className="absolute top-1/2 right-1 -translate-y-1/2"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {showList && users.length > 0 && (
                <div className="absolute z-50 mt-1 w-full rounded-xl border bg-white shadow-md">
                    <Command>
                        <CommandGroup>
                            {users.map((user) => (
                                <CommandItem
                                    key={user.usr_id}
                                    onSelect={() => handleSelect(user)}
                                    className="cursor-pointer"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </div>
            )}

            {loading && (
                <p className="absolute top-2 right-2 text-xs text-gray-400">
                    Memuat...
                </p>
            )}
        </div>
    );
};

export default UserSearchInput;
