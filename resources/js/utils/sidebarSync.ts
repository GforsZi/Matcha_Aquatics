// utils/sidebarSync.ts
export const toggleSidebarEvent = new Event('sidebar-toggle');

export function setSidebarState(state: boolean) {
    localStorage.setItem('sidebar_open', String(state));
    window.dispatchEvent(toggleSidebarEvent);
}

export function getSidebarState(): boolean {
    const stored = localStorage.getItem('sidebar_open');
    return stored ? stored === 'true' : true;
}
