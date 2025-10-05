import { LoginForm } from '@/components/login-form';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Login() {
    // Ambil flash messages dari Inertia props
    const { flash } = usePage().props as { flash?: { error?: string } };
    const errorMessage = flash?.error;

    // State untuk menampilkan error dengan fade-out
    const [showError, setShowError] = useState(!!errorMessage);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setShowError(false), 5000); // 5 detik
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <LoginForm />
            </div>
        </div>
    );
}
