import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { aiReports } from '@/db/schema/worker-tracker';
import {
    REPORTING_SYSTEM_PROMPT,
    buildWorkerReportPrompt,
    fetchDailyWorkerLogs,
    serializeDailySummary,
} from '@/lib/ai/reporting';

const CRON_SECRET = process.env.WORKER_TRACKER_CRON_SECRET;
const AI_ENDPOINT =
    process.env.WORKER_TRACKER_AI_ENDPOINT ??
    'https://api.openai.com/v1/responses';
const AI_MODEL = process.env.WORKER_TRACKER_AI_MODEL ?? 'gpt-4o-mini';
const AI_API_KEY = process.env.WORKER_TRACKER_AI_API_KEY;

type AiInsights = {
    summary: string;
    insights: string[];
};

function toReportDate(date: string): Date {
    return new Date(`${date}T00:00:00Z`);
}

async function requestInsights(prompt: string): Promise<AiInsights> {
    if (!AI_API_KEY) {
        return {
            summary:
                'AI reporting is not configured. Provide WORKER_TRACKER_AI_API_KEY to enable automated reports.',
            insights: [
                'No insights generated because the AI provider credentials are missing.',
            ],
        };
    }

    const body = {
        model: AI_MODEL,
        input: [
            { role: 'system', content: REPORTING_SYSTEM_PROMPT },
            { role: 'user', content: prompt },
        ],
        response_format: {
            type: 'json_schema',
            json_schema: {
                name: 'worker_daily_report',
                schema: {
                    type: 'object',
                    properties: {
                        summary: { type: 'string' },
                        insights: {
                            type: 'array',
                            items: { type: 'string' },
                        },
                    },
                    required: ['summary', 'insights'],
                    additionalProperties: false,
                },
            },
        },
    };

    const response = await fetch(AI_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('AI request failed', response.status, errorText);
        throw new Error('Failed to generate AI report');
    }

    const payload = await response.json();
    const output = payload?.output?.[0]?.content?.[0];

    if (output?.type === 'output_text') {
        try {
            const parsed = JSON.parse(output.text);
            if (parsed.summary && Array.isArray(parsed.insights)) {
                return {
                    summary: parsed.summary,
                    insights: parsed.insights,
                };
            }
        } catch (error) {
            console.error('Failed to parse AI response', error);
        }
        return {
            summary: output.text,
            insights: [],
        };
    }

    if (output?.type === 'text') {
        try {
            const parsed = JSON.parse(output.text);
            return {
                summary: parsed.summary ?? output.text,
                insights: Array.isArray(parsed.insights)
                    ? parsed.insights
                    : [],
            };
        } catch {
            return {
                summary: output.text,
                insights: [],
            };
        }
    }

    if (payload?.response?.output?.[0]?.content?.[0]?.text) {
        const text = payload.response.output[0].content[0].text;
        try {
            const parsed = JSON.parse(text);
            return {
                summary: parsed.summary ?? text,
                insights: Array.isArray(parsed.insights)
                    ? parsed.insights
                    : [],
            };
        } catch {
            return { summary: text, insights: [] };
        }
    }

    throw new Error('Unexpected AI response structure');
}

async function upsertReport({
    workerId,
    reportDate,
    summary,
    insights,
    rawDataUsed,
}: {
    workerId: string;
    reportDate: Date;
    summary: string;
    insights: string[];
    rawDataUsed: string;
}) {
    const insightsText = insights.length ? insights.join('\n') : null;

    await db
        .insert(aiReports)
        .values({
            workerId,
            reportDate,
            summary,
            insights: insightsText,
            rawDataUsed,
        })
        .onConflictDoUpdate({
            target: [aiReports.workerId, aiReports.reportDate],
            set: {
                summary,
                insights: insightsText,
                rawDataUsed,
                generatedAt: new Date(),
            },
        });
}

async function processReports(targetDate: Date) {
    const summaries = await fetchDailyWorkerLogs(db, targetDate);
    const processed = [];

    for (const summary of summaries) {
        if (summary.tasks.length === 0) {
            continue;
        }

        const prompt = buildWorkerReportPrompt(summary);
        const reportDate = toReportDate(summary.date);
        const rawDataUsed = serializeDailySummary(summary);

        const existing = await db
            .select({ id: aiReports.id })
            .from(aiReports)
            .where(
                and(
                    eq(aiReports.workerId, summary.workerId),
                    eq(aiReports.reportDate, reportDate),
                ),
            )
            .limit(1);

        if (existing.length && !AI_API_KEY) {
            processed.push({
                workerId: summary.workerId,
                skipped: true,
                reason: 'Existing report present and AI not configured',
            });
            continue;
        }

        const { summary: aiSummary, insights } = await requestInsights(prompt);
        await upsertReport({
            workerId: summary.workerId,
            reportDate,
            summary: aiSummary,
            insights,
            rawDataUsed,
        });

        processed.push({
            workerId: summary.workerId,
            skipped: false,
        });
    }

    return processed;
}

function assertAuthorized() {
    if (!CRON_SECRET) return;

    const headerSecret =
        headers().get('x-cron-secret') ?? headers().get('authorization');

    if (headerSecret !== CRON_SECRET) {
        throw new Error('Unauthorized');
    }
}

function getTargetDate(): Date {
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    return yesterday;
}

export async function POST() {
    try {
        assertAuthorized();
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 401 },
        );
    }

    try {
        const processed = await processReports(getTargetDate());
        return NextResponse.json({
            processed: processed.length,
            details: processed,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to generate reports' },
            { status: 500 },
        );
    }
}

export const GET = POST;
