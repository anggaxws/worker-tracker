"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { ArrowUpRight, CalendarDays, Clock, Target, Users } from "lucide-react";

import { AIChatInput } from "@/components/ui/ai-chat-input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const panelClass =
  "rounded-3xl border border-white/40 bg-white/75 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-slate-700/50 dark:bg-slate-900/60";

const reportSummaries = [
  {
    id: "report-01",
    date: "Oct 6, 2025",
    worker: "Priya Singh",
    project: "Support Queue Optimisation",
    variance: "-1.4h",
    headline: "Cleared backlog ahead of schedule with automation batch",
    highlights: [
      "Regression suite finished 90 minutes ahead of plan",
      "No blocked tickets across customer success queue",
      "Flagged documentation gap for new payments flow",
    ],
  },
  {
    id: "report-02",
    date: "Oct 6, 2025",
    worker: "Luis Hernández",
    project: "Incident Response Overhaul",
    variance: "+1.5h",
    headline: "Support load surged – follow-ups pending for payments incident",
    highlights: [
      "Escalated high-priority payments bug to platform team",
      "Handled 12 incoming tickets, 3 still pending deep dive",
      "Recommends pairing with QA to reproduce edge case",
    ],
  },
  {
    id: "report-03",
    date: "Oct 6, 2025",
    worker: "Alex Morgan",
    project: "Northwind Rollout",
    variance: "-0.8h",
    headline: "Deployment hand-off ready; QA blockers resolved",
    highlights: [
      "Deployment checklist finalised with platform",
      "Prepared notes for client readiness email",
      "Requests additional QA capacity for smoke tests",
    ],
  },
];

const quickStats = [
  {
    title: "Reports generated",
    value: "18",
    icon: CalendarDays,
    subtext: "+6 in last 48h",
  },
  {
    title: "Overtime flagged",
    value: "4",
    icon: Clock,
    subtext: "Across Support & Platform teams",
  },
  {
    title: "Focus prompts",
    value: "11",
    icon: Target,
    subtext: "Workers with focus score > 85",
  },
  {
    title: "Follow-up owners",
    value: "6",
    icon: Users,
    subtext: "Assigned to high-priority items",
  },
];

interface ChatMessage {
  id: string;
  role: "admin" | "assistant";
  content: string;
  timestamp: string;
}

export default function AdminReportsPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      role: "assistant",
      content:
        "Priya completed all support queue actions 90 minutes ahead of schedule. Luis is overloaded and has three follow-ups pending for the payments incident.",
      timestamp: "Today · 08:05",
    },
    {
      id: "msg-2",
      role: "admin",
      content: "Summarise the biggest risks for this week.",
      timestamp: "Today · 08:07",
    },
    {
      id: "msg-3",
      role: "assistant",
      content:
        "Top risks: (1) Payments incident follow-ups (Luis) — needs platform pairing. (2) QA coverage for Northwind smoke tests (Priya + Alex). (3) Incident runbook updates blocked while Maya is OOO.",
      timestamp: "Today · 08:07",
    },
  ]);

  const summary = useMemo(
    () => ({
      reports: reportSummaries.length,
      overtime: reportSummaries.filter((report) => report.variance.startsWith("+")).length,
    }),
    []
  );

  const handleChatSubmit = (value: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${prev.length + 1}`,
        role: "admin",
        content: value,
        timestamp: `Today · ${timestamp}`,
      },
      {
        id: `msg-${prev.length + 2}`,
        role: "assistant",
        content:
          "Thanks! I\'ll review the latest time entries and share a follow-up summary. (Backend integration pending.)",
        timestamp: `Today · ${timestamp}`,
      },
    ]);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 pb-12 pt-6 lg:px-12">
      <div className="mx-auto w-full max-w-6xl space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
              AI report insights
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300/90">
              Review daily AI summaries, track follow-ups, and ask the assistant for deeper analysis.
            </p>
          </div>
          <Badge
            variant="outline"
            className="rounded-full border-white/50 bg-white/70 px-4 py-2 text-xs text-slate-600 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200"
          >
            {summary.reports} reports · {summary.overtime} overtime warnings
          </Badge>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.title} className={panelClass}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300/90">
                <stat.icon className="size-4" />
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-semibold text-slate-800 dark:text-slate-100">{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-300/80">{stat.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card className={panelClass}>
          <CardHeader className="flex flex-col gap-2 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Latest daily reports
              </CardTitle>
              <CardDescription>
                AI-generated summaries combining time entries, variances, and worker notes.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {reportSummaries.map((report) => (
              <div
                key={report.id}
                className="rounded-3xl border border-white/40 bg-white/70 p-4 shadow-sm transition hover:border-white/70 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/60"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {report.worker}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-300/80">{report.project}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-300/80">
                    <span>{report.date}</span>
                    <Separator orientation="vertical" className="h-4 bg-white/40 dark:bg-slate-700/60" />
                    <Badge
                      variant="outline"
                      className={clsx(
                        "border-transparent px-3 py-1 text-xs",
                        report.variance.startsWith("+")
                          ? "bg-rose-500/15 text-rose-600 dark:text-rose-300"
                          : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-200"
                      )}
                    >
                      {report.variance}
                    </Badge>
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-800 dark:text-slate-100">
                  {report.headline}
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-200">
                  {report.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <ArrowUpRight className="mt-0.5 size-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex h-full flex-col gap-4">
          <Card className={`${panelClass} flex-1 overflow-hidden`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Ask the assistant
              </CardTitle>
              <CardDescription>
                Chat with the reporting assistant to explain variances, compile updates, or draft follow-ups.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-full flex-col gap-4">
              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={clsx(
                      "max-w-[90%] rounded-3xl px-5 py-3 text-sm shadow-sm",
                      message.role === "assistant"
                        ? "bg-white/80 text-slate-700 dark:bg-slate-800/70 dark:text-slate-100"
                        : "ml-auto bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    )}
                  >
                    <p>{message.content}</p>
                    <p className={clsx(
                      "mt-2 text-xs",
                      message.role === "assistant"
                        ? "text-slate-500 dark:text-slate-300/80"
                        : "text-white/70 dark:text-slate-500"
                    )}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                ))}
              </div>
              <AIChatInput onSubmit={handleChatSubmit} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
