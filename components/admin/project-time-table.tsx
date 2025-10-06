import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const rows = [
    {
        project: 'Northwind Rollout',
        manager: 'Alex Morgan',
        expected: 120,
        actual: 138,
        variance: 18,
        status: 'At Risk',
    },
    {
        project: 'Mobile App Sprint 4',
        manager: 'Priya Singh',
        expected: 96,
        actual: 88,
        variance: -8,
        status: 'On Track',
    },
    {
        project: 'Data Migration',
        manager: 'Keiko Ono',
        expected: 140,
        actual: 159,
        variance: 19,
        status: 'Watch',
    },
    {
        project: 'Support Queue Optimization',
        manager: 'Luis Hernandez',
        expected: 82,
        actual: 76,
        variance: -6,
        status: 'Ahead',
    },
];

const statusTone: Record<
    string,
    { label: string; className: string }
> = {
    'At Risk': { label: 'At Risk', className: 'bg-rose-500/10 text-rose-500' },
    'On Track': {
        label: 'On Track',
        className: 'bg-emerald-500/10 text-emerald-500',
    },
    Watch: { label: 'Watch', className: 'bg-amber-500/10 text-amber-600' },
    Ahead: { label: 'Ahead', className: 'bg-sky-500/10 text-sky-600' },
};

export function ProjectTimeTable() {
    return (
        <Card className="border-border/60">
            <CardHeader>
                <CardTitle>Project Time Variance</CardTitle>
                <CardDescription>
                    Snapshot of projects with the largest swings against expected
                    budgets.
                </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Project</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead className="text-right">
                                Expected (hrs)
                            </TableHead>
                            <TableHead className="text-right">
                                Actual (hrs)
                            </TableHead>
                            <TableHead className="text-right">Variance</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row) => {
                            const tone = statusTone[row.status] ?? statusTone['On Track'];
                            const varianceLabel =
                                row.variance > 0
                                    ? `+${row.variance}h`
                                    : `${row.variance}h`;

                            return (
                                <TableRow key={row.project}>
                                    <TableCell className="font-medium">
                                        {row.project}
                                    </TableCell>
                                    <TableCell>{row.manager}</TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {row.expected}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {row.actual}
                                    </TableCell>
                                    <TableCell className="text-right font-medium tabular-nums">
                                        {varianceLabel}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge
                                            variant="outline"
                                            className={`border-transparent ${tone.className}`}
                                        >
                                            {tone.label}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
