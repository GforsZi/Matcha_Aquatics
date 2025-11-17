import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// Pastikan leaflet CSS sudah diimport di app.tsx
import 'leaflet/dist/leaflet.css';

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
}
export default function MapView({
    Longitude = '107.606223',
    Latitude = '-6.922480',
}: ShippingCostCalculatorProps) {
    const position: [number, number] = [Number(Latitude), Number(Longitude)];

    return (
        <Card className="w-full">
            <CardHeader className="items-center">
                <CardTitle>Peta Lokasi Toko</CardTitle>
                <CardDescription>
                    Memperlihatkan titik lokasi dari toko.
                </CardDescription>
            </CardHeader>

            <CardContent className="pb-0">
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
                            <Popup>Lokasi Toko</Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </CardContent>

            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 text-center leading-none font-medium">
                    Data ini menjadi patokan pengiriman berasal dari mana.
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    Matcha Aquatics
                </div>
            </CardFooter>
        </Card>
    );
}
