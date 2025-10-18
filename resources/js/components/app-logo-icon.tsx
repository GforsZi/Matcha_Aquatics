import { usePage } from '@inertiajs/react';
import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    const { assetBaseUrl } = usePage().props;
    const asset = (path: string) => `${assetBaseUrl}${path}`;
    return (
        <>
            <img
                src={asset('matcha_aquatics_full.jpeg')}
                alt="Image"
                className="rounded-full"
            />
        </>
    );
}
