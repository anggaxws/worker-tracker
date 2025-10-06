import { and, eq, gte, lt } from 'drizzle-orm';

import type { db } from '@/db';
import {
    projects,
    tasks,
    timeEntries,
    workerUsers,
} from '@/db/schema/worker-tracker';

type Database = typeof db;

export const REPORTING_SYSTEM_PROMPT =
    'You are a world-class business operations analyst. Your task is to review the following worker daily task log and provide a concise, objective performance summary and three key insights, focusing on time variance (Actual vs. Expected), productivity, and completion status.';

export interface WorkerTaskSummary {
    taskId: string;
    title: string;
    projectName: string | null;
    expectedDurationMinutes: number;
    actualDurationMinutes: number;
    varianceMinutes: number;
    status: string;
    isFollowUp: boolean;
    notes: string[];
}

export interface WorkerDailySummary {
    workerId: string;
    workerName: string | null;
    workerEmail: string;
    date: string;
    totalMinutes: number;
    tasks: WorkerTaskSummary[];
}

interface WorkerTaskAccumulator extends WorkerTaskSummary {
    notes: string[];
}

interface WorkerAccumulator
    extends Omit<WorkerDailySummary, 'tasks' | 'totalMinutes'> {
    totalMinutes: number;
    tasks: Map<string, WorkerTaskAccumulator>;
}

function getUtcDayRange(targetDate: Date) {
    const start = new Date(
        Date.UTC(
            targetDate.getUTCFullYear(),
            targetDate.getUTCMonth(),
            targetDate.getUTCDate(),
        ),
    );
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    return { start, end };
}

export async function fetchDailyWorkerLogs(
    database: Database,
    targetDate: Date,
): Promise<WorkerDailySummary[]> {
    const { start, end } = getUtcDayRange(targetDate);

    const rows = await database
        .select({
            workerId: timeEntries.workerId,
            workerName: workerUsers.name,
            workerEmail: workerUsers.email,
            taskId: tasks.id,
            taskTitle: tasks.title,
            projectName: projects.name,
            status: tasks.status,
            expectedDurationMinutes: tasks.expectedDurationMinutes,
            isFollowUp: tasks.isFollowUp,
            entryDuration: timeEntries.durationMinutes,
            entryNotes: timeEntries.notes,
            entryStart: timeEntries.startTime,
            entryEnd: timeEntries.endTime,
        })
        .from(timeEntries)
        .innerJoin(tasks, eq(timeEntries.taskId, tasks.id))
        .innerJoin(projects, eq(tasks.projectId, projects.id))
        .innerJoin(workerUsers, eq(timeEntries.workerId, workerUsers.id))
        .where(
            and(
                gte(timeEntries.startTime, start),
                lt(timeEntries.startTime, end),
            ),
        );

    const workerMap = new Map<string, WorkerAccumulator>();

    for (const row of rows) {
        if (!row.workerId) continue;

        const worker =
            workerMap.get(row.workerId) ??
            (() => {
                const accumulator: WorkerAccumulator = {
                    workerId: row.workerId,
                    workerName: row.workerName,
                    workerEmail: row.workerEmail ?? 'unknown@email',
                    date: start.toISOString().split('T')[0],
                    totalMinutes: 0,
                    tasks: new Map(),
                };
                workerMap.set(row.workerId, accumulator);
                return accumulator;
            })();

        const duration =
            row.entryDuration ??
            (row.entryStart && row.entryEnd
                ? Math.round(
                      (row.entryEnd.getTime() - row.entryStart.getTime()) /
                          (1000 * 60),
                  )
                : 0);

        if (duration > 0) {
            worker.totalMinutes += duration;
        }

        const task =
            worker.tasks.get(row.taskId) ??
            (() => {
                const taskAccumulator: WorkerTaskAccumulator = {
                    taskId: row.taskId,
                    title: row.taskTitle ?? 'Untitled Task',
                    projectName: row.projectName,
                    expectedDurationMinutes: row.expectedDurationMinutes ?? 0,
                    actualDurationMinutes: 0,
                    varianceMinutes: 0,
                    status: row.status ?? 'pending',
                    isFollowUp: row.isFollowUp ?? false,
                    notes: [],
                };
                worker.tasks.set(row.taskId, taskAccumulator);
                return taskAccumulator;
            })();

        if (duration > 0) {
            task.actualDurationMinutes += duration;
        }
        task.varianceMinutes =
            task.actualDurationMinutes - task.expectedDurationMinutes;

        if (row.entryNotes) {
            task.notes.push(row.entryNotes);
        }
    }

    return Array.from(workerMap.values())
        .map<WorkerDailySummary>((worker) => ({
            workerId: worker.workerId,
            workerName: worker.workerName,
            workerEmail: worker.workerEmail,
            date: worker.date,
            totalMinutes: worker.totalMinutes,
            tasks: Array.from(worker.tasks.values()).map((task) => ({
                taskId: task.taskId,
                title: task.title,
                projectName: task.projectName,
                expectedDurationMinutes: task.expectedDurationMinutes,
                actualDurationMinutes: task.actualDurationMinutes,
                varianceMinutes: task.varianceMinutes,
                status: task.status,
                isFollowUp: task.isFollowUp,
                notes: task.notes,
            })),
        }))
        .sort((a, b) => a.workerEmail.localeCompare(b.workerEmail));
}

export function buildWorkerReportPrompt(summary: WorkerDailySummary): string {
    const header = `Worker: ${summary.workerName ?? 'Unknown'} <${
        summary.workerEmail
    }>\nDate: ${summary.date}\nTotal Minutes Logged: ${summary.totalMinutes}`;

    if (summary.tasks.length === 0) {
        return `${header}\n\nNo tasks logged for this worker on the specified date.`;
    }

    const body = summary.tasks
        .map((task, index) => {
            const notesBlock = task.notes.length
                ? `Notes:\n${task.notes.map((note) => `- ${note}`).join('\n')}`
                : 'Notes: None';

            return [
                `${index + 1}. Task: ${task.title}`,
                `   Project: ${task.projectName ?? 'Unassigned'}`,
                `   Expected Duration (min): ${task.expectedDurationMinutes}`,
                `   Actual Duration (min): ${task.actualDurationMinutes}`,
                `   Variance (min): ${task.varianceMinutes}`,
                `   Status: ${task.status}`,
                `   Follow-up Task: ${task.isFollowUp ? 'Yes' : 'No'}`,
                `   ${notesBlock}`,
            ].join('\n');
        })
        .join('\n\n');

    return `${header}\n\n${body}`;
}

export function serializeDailySummary(summary: WorkerDailySummary): string {
    return JSON.stringify(summary, null, 2);
}
