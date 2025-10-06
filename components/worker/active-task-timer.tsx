"use client";

import { useEffect, useMemo, useState } from 'react';
import { IconCheck, IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const tasks = [
    {
        id: 'task-1',
        title: 'Payment microservice hand-off',
        project: 'Northwind Rollout',
        status: 'in_progress',
        expectedMinutes: 150,
    },
    {
        id: 'task-2',
        title: 'QA regression suite',
        project: 'Support Queue Optimization',
        status: 'in_progress',
        expectedMinutes: 120,
    },
    {
        id: 'task-3',
        title: 'Draft daily client summary',
        project: 'Customer Reporting',
        status: 'pending',
        expectedMinutes: 60,
    },
];

function formatTimer(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
        .map((value) => value.toString().padStart(2, '0'))
        .join(':');
}

export function ActiveTaskTimer() {
    const [activeTaskId, setActiveTaskId] = useState(tasks[0]?.id ?? '');
    const [isRunning, setIsRunning] = useState(true);
    const [elapsedSeconds, setElapsedSeconds] = useState(3_600);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (!isRunning) return;

        const interval = window.setInterval(() => {
            setElapsedSeconds((seconds) => seconds + 1);
        }, 1000);

        return () => window.clearInterval(interval);
    }, [isRunning]);

    const selectedTask = useMemo(
        () => tasks.find((task) => task.id === activeTaskId),
        [activeTaskId],
    );

    const isOverExpected =
        !!selectedTask && elapsedSeconds / 60 > selectedTask.expectedMinutes;

    return (
        <Card className="border-border/60">
            <CardHeader className="flex flex-col gap-3">
                <div>
                    <CardTitle>Active Work Session</CardTitle>
                    <CardDescription>
                        Keep the timer running while you work on a task. Add a quick note before submitting.
                    </CardDescription>
                </div>
                <Select value={activeTaskId} onValueChange={setActiveTaskId}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a task to track" />
                    </SelectTrigger>
                    <SelectContent>
                        {tasks.map((task) => (
                            <SelectItem key={task.id} value={task.id}>
                                {task.title} · {task.project}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 px-6 py-4">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Elapsed time
                        </p>
                        <p className="font-mono text-3xl font-semibold tabular-nums">
                            {formatTimer(elapsedSeconds)}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={isRunning ? 'outline' : 'default'}
                            onClick={() => setIsRunning((current) => !current)}
                            className="gap-2"
                        >
                            {isRunning ? (
                                <>
                                    <IconPlayerPause className="size-4" />
                                    Pause
                                </>
                            ) : (
                                <>
                                    <IconPlayerPlay className="size-4" />
                                    Resume
                                </>
                            )}
                        </Button>
                        <Button
                            variant="secondary"
                            className="gap-2"
                            onClick={() => {
                                setIsRunning(false);
                                setElapsedSeconds(0);
                                setNotes('');
                            }}
                        >
                            <IconCheck className="size-4" />
                            Submit
                        </Button>
                    </div>
                </div>
                {selectedTask ? (
                    <div className="flex flex-col gap-2 rounded-lg border border-dashed border-border/60 bg-card/50 p-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                                {selectedTask.title}
                            </span>
                            <Badge variant="outline">{selectedTask.project}</Badge>
                        </div>
                        <span>
                            Expected duration: {(selectedTask.expectedMinutes / 60).toFixed(1)}h
                        </span>
                        {isOverExpected ? (
                            <span className="text-amber-500">
                                You&apos;re over the expected time. Add quick context below before submitting.
                            </span>
                        ) : (
                            <span>Stay focused and add wrap-up notes before stopping the timer.</span>
                        )}
                    </div>
                ) : null}
                <div className="flex flex-col gap-2">
                    <label htmlFor="worker-notes" className="text-sm font-medium text-foreground">
                        Notes for today
                    </label>
                    <Textarea
                        id="worker-notes"
                        placeholder="Summarize what you accomplished or blockers to flag…"
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        rows={3}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
