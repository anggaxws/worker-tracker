import { AdminOverviewCards } from '@/components/admin/overview-cards';
import { AiReportFeed } from '@/components/admin/ai-report-feed';
import { ProjectTimeTable } from '@/components/admin/project-time-table';
import { WorkerUtilizationChart } from '@/components/admin/worker-utilization-chart';

export default function AdminDashboardPage() {
    return (
        <div className="@container/main flex flex-1 flex-col gap-6 px-4 pb-8 pt-4 lg:px-6">
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Operations Command Center
                    </h1>
                    <p className="text-muted-foreground">
                        Monitor utilization, time variance, and AI findings across your
                        workforce.
                    </p>
                </div>
                <AdminOverviewCards />
                <div className="grid gap-4 @3xl/main:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    <WorkerUtilizationChart />
                    <AiReportFeed />
                </div>
                <ProjectTimeTable />
            </div>
        </div>
    );
}
