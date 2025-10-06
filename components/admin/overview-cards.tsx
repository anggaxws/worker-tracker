import {
    IconAlertTriangle,
    IconClockHour4,
    IconTargetArrow,
    IconUsersGroup,
} from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const metrics = [
    {
        label: 'Active Workers',
        value: '18',
        change: '+3 vs last week',
        icon: IconUsersGroup,
        tone: 'positive',
        caption: 'Workers logging time in the last 24 hours',
    },
    {
        label: 'Hours Logged',
        value: '126h',
        change: '+8% vs target',
        icon: IconClockHour4,
        tone: 'positive',
        caption: 'Total hours captured across all projects yesterday',
    },
    {
        label: 'On-Time Delivery',
        value: '82%',
        change: '-4% vs goal',
        icon: IconTargetArrow,
        tone: 'neutral',
        caption: 'Tasks completed within the expected duration this week',
    },
    {
        label: 'At-Risk Projects',
        value: '3',
        change: 'Needs attention',
        icon: IconAlertTriangle,
        tone: 'negative',
        caption: 'Projects projected to exceed planned hours',
    },
];

const toneMap: Record<
    'positive' | 'neutral' | 'negative',
    { label: string; className: string }
> = {
    positive: { label: 'Improving', className: 'bg-emerald-500/10 text-emerald-500' },
    neutral: { label: 'Monitoring', className: 'bg-amber-500/10 text-amber-500' },
    negative: { label: 'Immediate', className: 'bg-rose-500/10 text-rose-500' },
};

export function AdminOverviewCards() {
    return (
        <div className="@container/main grid grid-cols-1 gap-4 px-4 lg:px-6 @3xl/main:grid-cols-2 @6xl/main:grid-cols-4">
            {metrics.map((metric) => {
                const Icon = metric.icon;
                const tone = toneMap[metric.tone as keyof typeof toneMap];

                return (
                    <Card
                        key={metric.label}
                        className="flex flex-col justify-between border-border/60 bg-gradient-to-br from-card/40 to-card shadow-sm"
                    >
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                            <div>
                                <CardDescription>{metric.label}</CardDescription>
                                <CardTitle className="text-3xl font-semibold tabular-nums">
                                    {metric.value}
                                </CardTitle>
                            </div>
                            <Badge
                                variant="outline"
                                className={`gap-2 border-transparent ${tone.className}`}
                            >
                                <Icon className="size-4" />
                                {tone.label}
                            </Badge>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                                {metric.change}
                            </span>
                            <span>{metric.caption}</span>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
