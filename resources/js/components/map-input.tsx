import { Card, CardContent, CardFooter } from '@/components/ui/card';
import L, { LeafletMouseEvent } from 'leaflet';
import { TrendingUp } from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

// Pastikan leaflet CSS sudah diimport di app.tsx
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Konfigurasi icon agar tidak error
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapClickHandler() {
    const map = useMap();

    useEffect(() => {
        const handleClick = (e: LeafletMouseEvent) => {
            const lat = e.latlng.lat.toFixed(6);
            const lng = e.latlng.lng.toFixed(6);

            // Isi input HTML (jika elemen ada)
            const latInput = document.getElementById(
                'lat-input',
            ) as HTMLInputElement | null;
            const lngInput = document.getElementById(
                'lng-input',
            ) as HTMLInputElement | null;
            if (latInput && lngInput) {
                latInput.value = lat;
                lngInput.value = lng;
            }

            // Tampilkan popup pada lokasi yang diklik
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

export default function MapInput() {
    const position: [number, number] = [-6.2, 106.816666];

    return (
        <Card className="w-full">
            <CardContent className="pb-0">
                <div className="mb-4 flex gap-4">
                    <input
                        id="lat-input"
                        type="text"
                        placeholder="Latitude"
                        readOnly
                        className="w-1/2 rounded-md border px-3 py-2 text-sm"
                    />
                    <input
                        id="lng-input"
                        type="text"
                        placeholder="Longitude"
                        readOnly
                        className="w-1/2 rounded-md border px-3 py-2 text-sm"
                    />
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
            </CardContent>

            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Showing latest updated markers{' '}
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    Last updated: November 2025
                </div>
            </CardFooter>
        </Card>
    );
}
