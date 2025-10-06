import type { CSSProperties } from 'react';

import { cookies } from 'next/headers';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import {
    SidebarInset,
    SidebarProvider,
} from '@/components/ui/sidebar';

type DashboardVariant = 'default' | 'admin' | 'worker';

interface DashboardShellProps {
    children: React.ReactNode;
    variant?: DashboardVariant;
}

export async function DashboardShell({
    children,
    variant = 'default',
}: DashboardShellProps) {
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

    return (
        <SidebarProvider
            defaultOpen={defaultOpen}
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                } as CSSProperties
            }
        >
            <AppSidebar variant="inset" mode={variant} />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
