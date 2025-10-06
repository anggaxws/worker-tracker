import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const stats = [
    { label: 'Hours logged today', value: '6.5h' },
    { label: 'Tasks completed', value: '3' },
    { label: 'Variance vs plan', value: '+18m' },
];

const focusItems = [
    'Wrap QA regression suite with notes for Alex.',
    'Drop hand-off summary in #northwind channel before 5pm.',
    'Add reproduction steps for payments latency ticket.',
];

export function WorkerDailySummary() {
    return (
        <Card className="border-border/60">
            <CardHeader>
                <CardTitle>Daily Snapshot</CardTitle>
                <CardDescription>
                    Quick wrap-up for how your day is trending so far.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="grid gap-3">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="flex items-center justify-between text-sm"
                        >
                            <span className="text-muted-foreground">{stat.label}</span>
                            <span className="font-semibold text-foreground">
                                {stat.value}
                            </span>
                        </div>
                    ))}
                </div>
                <Separator />
                <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                        Focus reminders
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                        {focusItems.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
