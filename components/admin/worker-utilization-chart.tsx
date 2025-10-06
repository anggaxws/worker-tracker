"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { IconInfoCircle } from '@tabler/icons-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';

const chartConfig = {
    expected: {
        label: 'Expected (hrs)',
        color: 'hsl(var(--chart-2))',
    },
    actual: {
        label: 'Actual (hrs)',
        color: 'hsl(var(--chart-5))',
    },
} satisfies ChartConfig;

const sampleData = [
    { name: 'Alex M.', expected: 24, actual: 26 },
    { name: 'Priya S.', expected: 28, actual: 22 },
    { name: 'Keiko O.', expected: 20, actual: 24 },
    { name: 'Luis H.', expected: 26, actual: 27 },
    { name: 'Jordan F.', expected: 18, actual: 15 },
];

export function WorkerUtilizationChart() {
    return (
        <Card className="border-border/60 bg-card">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                    <CardTitle>Worker Utilization</CardTitle>
                    <CardDescription>
                        Comparing logged hours versus expectations this week.
                    </CardDescription>
                </div>
                <Badge variant="outline" className="gap-1 text-xs">
                    <IconInfoCircle className="size-3.5" />
                    Snapshot
                </Badge>
            </CardHeader>
            <CardContent className="px-2 pb-6 pt-2 sm:px-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[320px] w-full"
                >
                    <BarChart
                        data={sampleData}
                        layout="vertical"
                        barGap={6}
                        barSize={14}
                    >
                        <CartesianGrid
                            horizontal={false}
                            strokeDasharray="4 4"
                            stroke="hsl(var(--muted-foreground)/0.2)"
                        />
                        <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 30]}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            width={110}
                        />
                        <ChartTooltip
                            cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
                            content={
                                <ChartTooltipContent
                                    indicator="dot"
                                    labelFormatter={(value) => value}
                                />
                            }
                        />
                        <Bar
                            dataKey="expected"
                            fill="var(--color-expected)"
                            radius={[4, 4, 4, 4]}
                        />
                        <Bar
                            dataKey="actual"
                            fill="var(--color-actual)"
                            radius={[4, 4, 4, 4]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
