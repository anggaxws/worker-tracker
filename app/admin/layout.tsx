import { DashboardShell } from '@/components/dashboard-shell';

import '@/app/dashboard/theme.css';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardShell variant="admin">{children}</DashboardShell>;
}
