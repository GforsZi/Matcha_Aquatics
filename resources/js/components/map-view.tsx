import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import L from 'leaflet';
import { TrendingUp } from 'lucide-react';
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

export default function MapView() {
    const position: [number, number] = [-6.2, 106.816666];

    return (
        <Card className="w-full">
            <CardHeader className="items-center">
                <CardTitle>Leaflet Map - Location Overview</CardTitle>
                <CardDescription>
                    Showing asset locations and markers dynamically
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
                            <Popup>
                                Jakarta, Indonesia <br /> Example marker.
                            </Popup>
                        </Marker>
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
