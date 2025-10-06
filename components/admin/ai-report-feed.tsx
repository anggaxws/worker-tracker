import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const reports = [
    {
        id: 'report-1',
        worker: 'Priya Singh',
        summary:
            'Completed two follow-up tickets and cleared remaining backlog work with notable efficiency gains.',
        focusAreas: ['Time Variance -12%', 'High Focus', 'Strong Notes'],
        insight:
            'Priya delivered 12% under budget by batching similar tickets. Consider assigning her to the upcoming release stabilization tasks.',
        date: 'Oct 6',
    },
    {
        id: 'report-2',
        worker: 'Luis Hernandez',
        summary:
            'Support queue handled above capacity but three tasks exceeded estimates due to missing requirements.',
        focusAreas: ['Variance +18%', 'Context Switching', 'Follow-up needed'],
        insight:
            'Flag the mobile payments bug for re-estimation. Provide clearer reproduction steps to reduce lost time tomorrow.',
        date: 'Oct 6',
    },
    {
        id: 'report-3',
        worker: 'Alex Morgan',
        summary:
            'Led Northwind rollout QA and closed critical blockers. Noted consistent overtime across the past four days.',
        focusAreas: ['Variance +22%', 'Sustained overtime'],
        insight:
            'Recommend rotating Alex off night deployment shifts to avoid burnout. Assign validation tasks to backup engineer.',
        date: 'Oct 6',
    },
];

export function AiReportFeed() {
    return (
        <Card className="border-border/60">
            <CardHeader>
                <CardTitle>AI Daily Insights</CardTitle>
                <CardDescription>
                    GPT-4o highlights from last night&apos;s automated report run.
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <ScrollArea className="h-[320px] px-4">
                    <div className="space-y-6">
                        {reports.map((report, index) => (
                            <div key={report.id}>
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            {report.worker}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {report.summary}
                                        </p>
                                    </div>
                                    <Badge variant="outline">{report.date}</Badge>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {report.focusAreas.map((area) => (
                                        <Badge
                                            key={area}
                                            variant="outline"
                                            className="border-border/60 bg-muted/20 text-xs font-medium"
                                        >
                                            {area}
                                        </Badge>
                                    ))}
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                    {report.insight}
                                </p>
                                {index < reports.length - 1 ? (
                                    <Separator className="mt-4" />
                                ) : null}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
