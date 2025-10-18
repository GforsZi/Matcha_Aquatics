import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BookOpen,
    FileChartColumnIncreasing,
    Folder,
    LayoutGrid,
    PackagePlus,
    PackageSearch,
    ShoppingCart,
    SquareUser,
    Truck,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Kelola Pengguna',
        href: '/manage/user',
        icon: SquareUser,
    },
    {
        title: 'Kelola Produk',
        href: '/manage/product',
        icon: PackagePlus,
    },
    {
        title: 'Kelola Category',
        href: '/manage/category',
        icon: PackageSearch,
    },
    {
        title: 'Kelola Transaksi',
        href: '/manage/transaction',
        icon: ShoppingCart,
    },
    {
        title: 'Kelola Pengiriman',
        href: '/manage/shipment',
        icon: Truck,
    },
    {
        title: 'Kelola Laporan',
        href: '/manage/report',
        icon: FileChartColumnIncreasing,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
