import { DashboardShell } from '@/components/dashboard-shell';

import '@/app/dashboard/theme.css';

export default async function WorkerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardShell variant="worker">{children}</DashboardShell>;
}
