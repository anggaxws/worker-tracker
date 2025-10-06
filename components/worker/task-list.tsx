import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Task {
    id: string;
    title: string;
    project: string;
    expectedMinutes: number;
    loggedMinutes: number;
    status: 'pending' | 'in_progress' | 'complete';
    isFollowUp?: boolean;
}

const taskBuckets: {
    title: string;
    description: string;
    tasks: Task[];
}[] = [
    {
        title: 'In Progress',
        description: 'Timers currently running or paused.',
        tasks: [
            {
                id: 'task-1',
                title: 'Payment microservice hand-off',
                project: 'Northwind Rollout',
                expectedMinutes: 150,
                loggedMinutes: 110,
                status: 'in_progress',
            },
            {
                id: 'task-2',
                title: 'QA regression suite',
                project: 'Support Queue Optimization',
                expectedMinutes: 120,
                loggedMinutes: 45,
                status: 'in_progress',
                isFollowUp: true,
            },
        ],
    },
    {
        title: 'Up Next',
        description: 'Tasks ready to start.',
        tasks: [
            {
                id: 'task-3',
                title: 'Draft daily client summary',
                project: 'Customer Reporting',
                expectedMinutes: 60,
                loggedMinutes: 0,
                status: 'pending',
            },
            {
                id: 'task-4',
                title: 'Investigate API latency spike',
                project: 'Incident Response',
                expectedMinutes: 90,
                loggedMinutes: 0,
                status: 'pending',
            },
        ],
    },
    {
        title: 'Completed Today',
        description: 'Work logged and submitted for today.',
        tasks: [
            {
                id: 'task-5',
                title: 'Close out backlog follow-ups',
                project: 'Northwind Rollout',
                expectedMinutes: 80,
                loggedMinutes: 75,
                status: 'complete',
            },
        ],
    },
];

function formatHours(minutes: number) {
    return `${(minutes / 60).toFixed(1)}h`;
}

export function WorkerTaskList() {
    return (
        <div className="grid gap-4 @3xl/main:grid-cols-3">
            {taskBuckets.map((bucket) => (
                <Card key={bucket.title} className="border-border/60">
                    <CardHeader>
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <CardTitle>{bucket.title}</CardTitle>
                                <CardDescription>{bucket.description}</CardDescription>
                            </div>
                            <Badge variant="outline" className="border-border/60">
                                {bucket.tasks.length} tasks
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {bucket.tasks.map((task) => {
                            const completion =
                                task.expectedMinutes > 0
                                    ? Math.min(
                                          Math.round(
                                              (task.loggedMinutes / task.expectedMinutes) * 100,
                                          ),
                                          120,
                                      )
                                    : 0;

                            return (
                                <div
                                    key={task.id}
                                    className="rounded-lg border border-border/60 bg-muted/40 p-4"
                                >
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-sm">
                                                {task.title}
                                            </p>
                                            {task.isFollowUp ? (
                                                <Badge variant="outline" className="text-xs">
                                                    Follow-up
                                                </Badge>
                                            ) : null}
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {task.project}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
                                        <span>Logged {formatHours(task.loggedMinutes)}</span>
                                        <span>Est. {formatHours(task.expectedMinutes)}</span>
                                    </div>
                                    <Progress
                                        className="mt-2 h-1.5"
                                        value={Math.min(completion, 100)}
                                        aria-label={`Progress ${completion}%`}
                                    />
                                    <div className="mt-2 text-xs text-muted-foreground">
                                        {completion > 100
                                            ? 'Tracking overtime – add notes when submitting.'
                                            : 'Keep notes ready for timer submission.'}
                                    </div>
                                </div>
                            );
                        })}
                        {bucket.tasks.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
                                Nothing here yet. Once you start work it will appear in this column.
                            </div>
                        ) : null}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
