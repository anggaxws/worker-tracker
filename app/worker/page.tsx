import { ActiveTaskTimer } from '@/components/worker/active-task-timer';
import { WorkerAiSummaryCard } from '@/components/worker/ai-summary-card';
import { WorkerDailySummary } from '@/components/worker/daily-summary';
import { WorkerTaskList } from '@/components/worker/task-list';

export default function WorkerDashboardPage() {
    return (
        <div className="@container/main flex flex-1 flex-col gap-6 px-4 pb-8 pt-4 lg:px-6">
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Today&apos;s Focus</h1>
                    <p className="text-muted-foreground">
                        Start timers, keep notes, and review the AI assistant&apos;s quick guidance for the day.
                    </p>
                </div>
                <div className="grid gap-4 @3xl/main:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    <ActiveTaskTimer />
                    <div className="grid gap-4">
                        <WorkerDailySummary />
                        <WorkerAiSummaryCard />
                    </div>
                </div>
                <WorkerTaskList />
            </div>
        </div>
    );
}
