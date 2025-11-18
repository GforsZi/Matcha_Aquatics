import { Card, CardContent } from '@/components/ui/card';
import L, { LeafletMouseEvent } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

// Pastikan leaflet CSS sudah diimport di app.tsx
import { Input } from '@/components/ui/input';
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

interface ShippingCostCalculatorProps {
    Latitude?: string;
    Longitude?: string;
    mapType: string;
}

export default function MapTransaction({
    Longitude = '107.606223',
    Latitude = '-6.922480',
    mapType,
}: ShippingCostCalculatorProps) {
    const [varLatitude, setVarLatitude] = useState(Latitude);
    const [varLongitude, setVarLongitude] = useState(Longitude);

    const originIcon = new L.Icon({
        iconUrl:
            'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
        shadowUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -35],
    });

    const destinationIcon = new L.Icon({
        iconUrl:
            'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        shadowUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -35],
    });
    const selectedIcon = mapType === 'origin' ? originIcon : destinationIcon;
    const popupText = mapType === 'origin' ? 'Lokasi Toko' : 'Lokasi Pembeli';

    const position: [number, number] = [Number(Latitude), Number(Longitude)];

    useEffect(() => {
        if (!Latitude && !Longitude) {
            setVarLatitude('-6.922480');
            setVarLongitude('107.606223');
        }
    }, [Latitude, Longitude]);

    function MapClickHandler() {
        const map = useMap();

        useEffect(() => {
            const handleClick = (e: LeafletMouseEvent) => {
                const lat = e.latlng.lat.toFixed(6);
                const lng = e.latlng.lng.toFixed(6);

                // ID input berdasarkan mapType
                const latInput = document.getElementById(
                    `lat-input-${mapType}`,
                ) as HTMLInputElement | null;

                const lngInput = document.getElementById(
                    `lng-input-${mapType}`,
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

    const ref = useRef<HTMLDivElement>(null);

    return (
        <Card className="w-full">
            <CardContent className="pb-0">
                <div className="mx-auto aspect-square max-h-[250px] w-full overflow-hidden rounded-xl border sm:max-h-[250px]">
                    <MapContainer
                        key={mapType}
                        center={position}
                        zoom={13}
                        scrollWheelZoom={true}
                        className="z-0 h-full w-full"
                    >
                        <TileLayer
                            attribution="Matcha Aquatics"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position} icon={selectedIcon}>
                            <Popup>{popupText}</Popup>
                        </Marker>
                        <MapClickHandler />
                    </MapContainer>
                </div>
                <div className="mt-4 mb-2 flex gap-4">
                    <Input
                        id={`lat-input-${mapType}`}
                        type="text"
                        placeholder="Latitude"
                        value={varLatitude}
                        readOnly
                        name={`shp_${mapType}_latitude`}
                        className="w-1/2 rounded-md border px-3 py-2 text-sm"
                    />
                    <Input
                        id={`lng-input-${mapType}`}
                        type="text"
                        value={varLongitude}
                        placeholder="Longitude"
                        readOnly
                        name={`shp_${mapType}_longitude`}
                        className="w-1/2 rounded-md border px-3 py-2 text-sm"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
