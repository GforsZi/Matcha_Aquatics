import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, usePage } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import MapInputUser from '@/components/map-input-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Profil" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Informasi Pengguna"
                        description="Masukan informasi yang sesuai pada akun ini."
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama lengkap</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="wa">Nomor WhatsApp</Label>

                                    <Input
                                        id="wa"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.usr_no_wa}
                                        name="usr_no_wa"
                                        autoComplete="usr_no_wa"
                                        placeholder="Nomor WhatsApp"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.usr_no_wa}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Lokasi Anda</Label>
                                    <MapInputUser
                                        Latitude={
                                            auth.user.usr_latitude ||
                                            '-6.922480'
                                        }
                                        Longitude={
                                            auth.user.usr_longtitude ||
                                            '107.606223'
                                        }
                                        Provice_name={
                                            auth.user.usr_provice_name
                                        }
                                        City_name={auth.user.usr_city_name}
                                        City_id={auth.user.usr_city_id}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        Simpan
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            Tersimpan
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
