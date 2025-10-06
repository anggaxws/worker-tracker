import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const aiSummary = {
    headline:
        'Strong focus on deployment tasks. Document the QA follow-up to protect tomorrow’s schedule.',
    insights: [
        'Maintain focus on Northwind follow-up to avoid slipping to overnight hours.',
        'Add quick context for the payments latency ticket; Admins flagged it in today’s stand-up.',
        'Block 30 minutes tomorrow morning for client summary before queue opens.',
    ],
    generatedAt: 'Updated at 02:30 AM by GPT-4o',
};

export function WorkerAiSummaryCard() {
    return (
        <Card className="border-border/60">
            <CardHeader className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <CardTitle>AI Daily Insight</CardTitle>
                        <CardDescription>Your personal assistant recap.</CardDescription>
                    </div>
                    <Badge variant="outline">Auto-generated</Badge>
                </div>
                <p className="text-sm text-foreground">{aiSummary.headline}</p>
            </CardHeader>
            <CardContent className="space-y-3">
                <Separator />
                <ul className="space-y-2 text-sm text-muted-foreground">
                    {aiSummary.insights.map((insight) => (
                        <li key={insight} className="flex items-start gap-3">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span>{insight}</span>
                        </li>
                    ))}
                </ul>
                <Separator />
                <p className="text-xs text-muted-foreground">
                    {aiSummary.generatedAt}
                </p>
            </CardContent>
        </Card>
    );
}
