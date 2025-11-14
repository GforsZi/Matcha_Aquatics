// resources/js/components/shipping/ShippingCostCalculator.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Province {
    id: string;
    name: string;
}

interface City {
    id: string;
    name: string;
    type?: string;
}

interface Cost {
    service: string;
    description: string;
    cost: { value: number; etd: string; note: string }[];
}

interface ShippingCostCalculatorProps {
    defaultOriginId?: string;
    defaultDestinationId?: string;
    defaultOriginProviceName?: string;
    defaultOriginCityName?: string;
    defaultDestinationProviceName?: string;
    defaultDestinationCityName?: string;
    onCostSelected?: (cost: Cost) => void;
}

const couriers = [
    { code: 'jne', name: 'JNE' },
    { code: 'pos', name: 'POS' },
    { code: 'tiki', name: 'TIKI' },
];

export function getCsrfToken(): string {
    const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');
    if (!token) {
        console.warn('CSRF token not found in <meta> tag');
        return '';
    }
    return token;
}

export default function ShippingCostCalculator({
    defaultOriginId,
    defaultOriginProviceName = '',
    defaultOriginCityName = '',
    defaultDestinationId,
    defaultDestinationProviceName = '',
    defaultDestinationCityName = '',
    onCostSelected,
}: ShippingCostCalculatorProps) {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [originCities, setOriginCities] = useState<City[]>([]);
    const [destinationCities, setDestinationCities] = useState<City[]>([]);

    const [originProvince, setOriginProvince] = useState('');
    const [destinationProvince, setDestinationProvince] = useState('');

    const [originCity, setOriginCity] = useState(defaultOriginId || '');
    const [destinationCity, setDestinationCity] = useState(
        defaultDestinationId || '',
    );

    const [queryProvOrigin, setQueryProvOrigin] = useState(
        defaultOriginProviceName,
    );
    const [queryProvDestination, setQueryProvDestination] = useState(
        defaultDestinationProviceName,
    );
    const [queryCityOrigin, setQueryCityOrigin] = useState(
        defaultOriginCityName,
    );
    const [queryCityDestination, setQueryCityDestination] = useState(
        defaultDestinationCityName,
    );

    const [selectedCourier, setSelectedCourier] = useState('jne');
    const [weight, setWeight] = useState('1000');
    const [costs, setCosts] = useState<Cost[]>([]);
    const [loading, setLoading] = useState(false);

    const [showProvList, setShowProvList] = useState<
        'origin' | 'destination' | null
    >(null);
    const [showCityList, setShowCityList] = useState<
        'origin' | 'destination' | null
    >(null);

    const ref = useRef<HTMLDivElement>(null);

    const getShipping = () => {
        fetch('/system/shipping/provinces')
            .then((res) => res.json())
            .then(setProvinces);
    };

    const handleProvinceChange = async (
        provinceId: string,
        type: 'origin' | 'destination',
    ) => {
        const res = await fetch(`/system/shipping/cities/${provinceId}`);
        const data = await res.json();

        if (type === 'origin') {
            setOriginProvince(provinceId);
            setOriginCities(data);
        } else {
            setDestinationProvince(provinceId);
            setDestinationCities(data);
        }
    };

    const handleCalculate = async () => {
        if (!originCity || !destinationCity || !weight) return;
        setLoading(true);

        try {
            const res = await fetch('/system/shipping/cost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    origin: originCity,
                    destination: destinationCity,
                    weight: parseInt(weight),
                    courier: selectedCourier,
                }),
            });

            const data = await res.json();

            let parsed: Cost[] = [];

            if (data?.rajaongkir?.results?.length) {
                parsed = data.rajaongkir.results.flatMap((r: any) => r.costs);
            } else if (data?.data?.rajaongkir?.results?.length) {
                parsed = data.data.rajaongkir.results.flatMap(
                    (r: any) => r.costs,
                );
            } else if (Array.isArray(data)) {
                parsed = data;
            }

            setCosts(parsed);
        } catch (err) {
            console.error('Error fetching cost:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCost = (cost: Cost) => {
        onCostSelected?.(cost);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setShowProvList(null);
                setShowCityList(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <Card className="w-full">
            <CardContent className="space-y-4 p-4" ref={ref}>
                <h2 className="text-base font-semibold">Hitung Ongkir</h2>
                <div>
                    <Label className="mb-1">Kota Asal</Label>

                    {/* Provinsi Asal */}
                    <div className="relative mb-2">
                        <Input
                            type="text"
                            placeholder="Cari provinsi..."
                            value={queryProvOrigin}
                            onChange={(e) => setQueryProvOrigin(e.target.value)}
                            onFocus={() => {
                                setShowProvList('origin');
                                if (provinces.length === 0) {
                                    getShipping();
                                }
                            }}
                            onBlur={() => {
                                setTimeout(() => setShowProvList(null), 500);
                            }}
                            className="pr-10"
                        />
                        {queryProvOrigin && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1/2 right-1 -translate-y-1/2"
                                onClick={() => setQueryProvOrigin('')}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}

                        {showProvList === 'origin' && (
                            <div className="absolute z-50 mt-1 w-full rounded-xl border bg-white shadow-md">
                                <Command>
                                    <CommandGroup>
                                        {provinces
                                            .filter((p) =>
                                                p.name
                                                    .toLowerCase()
                                                    .includes(
                                                        queryProvOrigin.toLowerCase(),
                                                    ),
                                            )
                                            .map((prov) => (
                                                <CommandItem
                                                    key={`origin-prov-${prov.id}`}
                                                    onSelect={() => {
                                                        setQueryProvOrigin(
                                                            prov.name,
                                                        );
                                                        handleProvinceChange(
                                                            prov.id,
                                                            'origin',
                                                        );
                                                        setShowProvList(null);
                                                    }}
                                                >
                                                    {prov.name}
                                                </CommandItem>
                                            ))}
                                    </CommandGroup>
                                </Command>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Cari kota..."
                            value={queryCityOrigin}
                            onChange={(e) => setQueryCityOrigin(e.target.value)}
                            onFocus={() => setShowCityList('origin')}
                            onBlur={() => {
                                setTimeout(() => setShowCityList(null), 500);
                            }}
                            className="pr-10"
                        />
                        {queryCityOrigin && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1/2 right-1 -translate-y-1/2"
                                onClick={() => setQueryCityOrigin('')}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}

                        {showCityList === 'origin' && (
                            <div className="absolute z-50 mt-1 w-full rounded-xl border bg-white shadow-md">
                                <Command>
                                    <CommandGroup>
                                        {originCities
                                            .filter((c) =>
                                                c.name
                                                    .toLowerCase()
                                                    .includes(
                                                        queryCityOrigin.toLowerCase(),
                                                    ),
                                            )
                                            .map((city) => (
                                                <CommandItem
                                                    key={`origin-city-${city.id}`}
                                                    onSelect={() => {
                                                        setQueryCityOrigin(
                                                            city.type
                                                                ? `${city.type} ${city.name}`
                                                                : city.name,
                                                        );
                                                        setOriginCity(city.id);
                                                        setShowCityList(null);
                                                    }}
                                                >
                                                    {city.type
                                                        ? `${city.type} ${city.name}`
                                                        : city.name}
                                                </CommandItem>
                                            ))}
                                    </CommandGroup>
                                </Command>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <Label className="mb-1">Kota Tujuan</Label>
                    <div className="relative mb-2">
                        <Input
                            type="text"
                            placeholder="Cari provinsi..."
                            value={queryProvDestination}
                            onChange={(e) =>
                                setQueryProvDestination(e.target.value)
                            }
                            onFocus={() => {
                                setShowProvList('destination');
                                if (provinces.length === 0) {
                                    getShipping();
                                }
                            }}
                            onBlur={() => {
                                setTimeout(() => setShowProvList(null), 500);
                            }}
                            className="pr-10"
                        />
                        {queryProvDestination && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1/2 right-1 -translate-y-1/2"
                                onClick={() => setQueryProvDestination('')}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}

                        {showProvList === 'destination' && (
                            <div className="absolute z-50 mt-1 w-full rounded-xl border bg-white shadow-md">
                                <Command>
                                    <CommandGroup>
                                        {provinces
                                            .filter((p) =>
                                                p.name
                                                    .toLowerCase()
                                                    .includes(
                                                        queryProvDestination.toLowerCase(),
                                                    ),
                                            )
                                            .map((prov) => (
                                                <CommandItem
                                                    key={`dest-prov-${prov.id}`}
                                                    onSelect={() => {
                                                        setQueryProvDestination(
                                                            prov.name,
                                                        );
                                                        handleProvinceChange(
                                                            prov.id,
                                                            'destination',
                                                        );
                                                        setShowProvList(null);
                                                    }}
                                                >
                                                    {prov.name}
                                                </CommandItem>
                                            ))}
                                    </CommandGroup>
                                </Command>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Cari kota..."
                            value={queryCityDestination}
                            onChange={(e) =>
                                setQueryCityDestination(e.target.value)
                            }
                            onFocus={() => setShowCityList('destination')}
                            onBlur={() => {
                                setTimeout(() => setShowCityList(null), 500);
                            }}
                            className="pr-10"
                        />
                        {queryCityDestination && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1/2 right-1 -translate-y-1/2"
                                onClick={() => setQueryCityDestination('')}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}

                        {showCityList === 'destination' && (
                            <div className="absolute z-50 mt-1 w-full rounded-xl border bg-white shadow-md">
                                <Command>
                                    <CommandGroup>
                                        {destinationCities
                                            .filter((c) =>
                                                c.name
                                                    .toLowerCase()
                                                    .includes(
                                                        queryCityDestination.toLowerCase(),
                                                    ),
                                            )
                                            .map((city) => (
                                                <CommandItem
                                                    key={`dest-city-${city.id}`}
                                                    onSelect={() => {
                                                        setQueryCityDestination(
                                                            city.type
                                                                ? `${city.type} ${city.name}`
                                                                : city.name,
                                                        );
                                                        setDestinationCity(
                                                            city.id,
                                                        );
                                                        setShowCityList(null);
                                                    }}
                                                >
                                                    {city.type
                                                        ? `${city.type} ${city.name}`
                                                        : city.name}
                                                </CommandItem>
                                            ))}
                                    </CommandGroup>
                                </Command>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <Label className="mb-1">Berat (gram)</Label>
                    <Input
                        type="number"
                        placeholder="Contoh: 1000"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                </div>
                <div>
                    <Label className="mb-1">Kurir</Label>
                    <div className="flex flex-wrap gap-2">
                        {couriers.map((c) => (
                            <Button
                                key={c.code}
                                variant={
                                    selectedCourier === c.code
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() => setSelectedCourier(c.code)}
                            >
                                {c.name}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="pt-2">
                    <Button
                        onClick={handleCalculate}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Menghitung...' : 'Hitung Ongkir'}
                    </Button>
                </div>
                {costs.length > 0 && (
                    <div className="mt-4 border-t pt-3">
                        <p className="mb-2 text-sm font-semibold">
                            Hasil Perhitungan:
                        </p>
                        {costs.map((item) => (
                            <div
                                key={item.service}
                                className="mb-2 cursor-pointer rounded-lg border bg-muted/40 p-2 hover:bg-muted"
                                onClick={() => handleSelectCost(item)}
                            >
                                <p className="font-medium">
                                    {item.service} - {item.description}
                                </p>
                                {Array.isArray(item.cost) ? (
                                    item.cost.map((c, i) => (
                                        <div key={i}>
                                            <p>
                                                {c.value.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </p>
                                            <p>{c.etd} hari</p>
                                        </div>
                                    ))
                                ) : (
                                    <div>
                                        <p>
                                            {Number(item.cost).toLocaleString(
                                                'id-ID',
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
