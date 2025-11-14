import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import L, { LeafletMouseEvent } from 'leaflet';
import { X } from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

// Pastikan leaflet CSS sudah diimport di app.tsx
import { Input } from '@/components/ui/input';
import { useForm } from '@inertiajs/react';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';

// Konfigurasi icon agar tidak error
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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
    onCostSelected?: (cost: Cost) => void;
    Latitude?: string;
    Longitude?: string;
    Name?: string;
    Provice_name: string;
    City_name: string;
    City_id: string;
}

export default function MapInput({
    defaultOriginId,
    defaultDestinationId,
    onCostSelected,
    Longitude = '107.606223',
    Latitude = '-6.922480',
    Name = '',
    Provice_name,
    City_name,
    City_id,
}: ShippingCostCalculatorProps) {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [originCities, setOriginCities] = useState<City[]>([]);
    const [destinationProvince, setDestinationProvince] = useState('');
    const [destinationCities, setDestinationCities] = useState<City[]>([]);
    const [originCity, setOriginCity] = useState(City_id || '');
    const [destinationCity, setDestinationCity] = useState(
        defaultDestinationId || '',
    );
    const [originProvince, setOriginProvince] = useState('');
    const [queryProvOrigin, setQueryProvOrigin] = useState('');
    const [queryCityOrigin, setQueryCityOrigin] = useState('');
    const [varLatitude, setVarLatitude] = useState(Latitude);
    const [varLongitude, setVarLongitude] = useState(Longitude);

    const { data, setData } = useForm({
        name: Name,
    });
    const position: [number, number] = [Number(Latitude), Number(Longitude)];
    useEffect(() => {
        if (!Latitude && !Longitude) {
            setVarLatitude('-6.922480');
            setVarLongitude('107.606223');
        }
    }, [Latitude, Longitude]);

    useEffect(() => {
        if (!Provice_name || !City_name || !City_id) {
            setQueryProvOrigin('');
            setQueryCityOrigin('');
            setOriginCity('');
        } else {
            setQueryProvOrigin(Provice_name);
            setQueryCityOrigin(City_name);
            setOriginCity(City_id);
        }
    }, [Provice_name, City_name, City_id]);

    function MapClickHandler() {
        const map = useMap();

        useEffect(() => {
            const handleClick = (e: LeafletMouseEvent) => {
                const lat = e.latlng.lat.toFixed(6);
                const lng = e.latlng.lng.toFixed(6);

                const latInput = document.getElementById(
                    'lat-input',
                ) as HTMLInputElement | null;
                const lngInput = document.getElementById(
                    'lng-input',
                ) as HTMLInputElement | null;
                if (latInput && lngInput) {
                    latInput.value = lat;
                    lngInput.value = lng;
                    setVarLatitude(latInput.value);
                    setVarLongitude(lngInput.value);
                }

                L.popup()
                    .setLatLng(e.latlng)
                    .setContent(`Location:<br>${lat}, ${lng}`)
                    .openOn(map);
            };

            map.on('click', handleClick);
            return () => {
                map.off('click', handleClick);
            };
        }, [map]);

        return null;
    }

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
            <CardContent className="pb-0">
                <div className="mb-4">
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
                            name="app_provice_name"
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

                    {/* Kota Asal */}
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Cari kota..."
                            value={queryCityOrigin}
                            onChange={(e) => setQueryCityOrigin(e.target.value)}
                            onFocus={() => {
                                setShowCityList('origin');
                                if (provinces.length === 0) {
                                    getShipping();
                                }
                            }}
                            onBlur={() => {
                                setTimeout(() => setShowCityList(null), 500);
                            }}
                            name="app_city_name"
                            className="pr-10"
                        />
                        <Input
                            type="hidden"
                            name="app_city_id"
                            value={originCity}
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
                <div className="mx-auto aspect-square max-h-[250px] w-full overflow-hidden rounded-xl border sm:max-h-[250px]">
                    <MapContainer
                        center={position}
                        zoom={13}
                        scrollWheelZoom={true}
                        className="z-0 h-full w-full"
                    >
                        <TileLayer
                            attribution="Matcha Aquatics"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position}>
                            <Popup>
                                Jakarta, Indonesia <br /> Example marker.
                            </Popup>
                        </Marker>
                        <MapClickHandler />
                    </MapContainer>
                </div>
                <div className="mt-4 mb-2 flex gap-4">
                    <Input
                        id="lat-input"
                        type="text"
                        placeholder="Latitude"
                        value={varLatitude}
                        readOnly
                        name="app_location_latitude"
                        className="w-1/2 rounded-md border px-3 py-2 text-sm"
                    />
                    <Input
                        id="lng-input"
                        type="text"
                        value={varLongitude}
                        placeholder="Longitude"
                        readOnly
                        name="app_location_longitude"
                        className="w-1/2 rounded-md border px-3 py-2 text-sm"
                    />
                </div>
                <Input
                    id="lng-input"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    name="app_location_name"
                    placeholder="Nama Toko"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                />
            </CardContent>
        </Card>
    );
}
