"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  Filter,
  Flame,
  LineChart,
  Timer,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const panelClass =
  "rounded-3xl border border-white/40 bg-white/75 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-slate-700/50 dark:bg-slate-900/60";

const utilisationTrend = [
  { week: "Aug 5", planned: 420, logged: 398 },
  { week: "Aug 12", planned: 436, logged: 412 },
  { week: "Aug 19", planned: 440, logged: 428 },
  { week: "Aug 26", planned: 452, logged: 445 },
  { week: "Sep 2", planned: 468, logged: 462 },
  { week: "Sep 9", planned: 472, logged: 489 },
  { week: "Sep 16", planned: 480, logged: 504 },
];

const varianceByTeam = [
  { team: "Frontend", expected: 128, actual: 134 },
  { team: "QA", expected: 96, actual: 92 },
  { team: "Platform", expected: 142, actual: 155 },
  { team: "Support", expected: 110, actual: 124 },
  { team: "Data", expected: 90, actual: 88 },
];

const topPerformers = [
  {
    name: "Priya Singh",
    hours: 42.5,
    variance: -1.4,
    focus: 94,
    Impact: "Stabilised queue backlog",
  },
  {
    name: "Alex Morgan",
    hours: 45.3,
    variance: -0.8,
    focus: 89,
    Impact: "Led rollout hand-off",
  },
  {
    name: "Keiko Ono",
    hours: 40.7,
    variance: -0.3,
    focus: 88,
    Impact: "Drafted deployment runbook",
  },
];

export default function AdminAnalyticsPage() {
  const summary = useMemo(
    () => ({
      portfolioUtilisation: 94,
      varianceThisWeek: -3.2,
      onTimeDelivery: 82,
      highFocus: 11,
    }),
    [],
  );

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 pb-12 pt-6 lg:px-12">
      <div className="mx-auto w-full max-w-6xl space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
              Operations analytics
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300/90">
              Monitor utilisation, variance, and focus trends across projects and teams to guide planning.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl border-white/50 bg-white/70 text-slate-700 backdrop-blur hover:bg-white dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            <Filter className="size-4" />
            Last 7 weeks
          </Button>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className={panelClass}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300/90">
              <Users className="size-4" />
              Portfolio utilisation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
              {summary.portfolioUtilisation}%
            </p>
            <Progress
              value={summary.portfolioUtilisation}
              className="h-2 rounded-full bg-white/40 dark:bg-slate-800/60"
            />
            <p className="text-xs text-slate-500 dark:text-slate-300/80">
              +2.4% vs previous period
            </p>
          </CardContent>
        </Card>
        <Card className={panelClass}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300/90">
              <Timer className="size-4 text-emerald-500" />
              Variance (hrs)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
              {summary.varianceThisWeek > 0 ? "+" : ""}
              {summary.varianceThisWeek}h
            </p>
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/15 text-xs text-emerald-600 dark:text-emerald-200"
            >
              <ArrowDownRight className="mr-1 size-3.5" />
              3h below plan
            </Badge>
            <p className="text-xs text-slate-500 dark:text-slate-300/80">
              Workloads aligned across Frontend & QA teams.
            </p>
          </CardContent>
        </Card>
        <Card className={panelClass}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300/90">
              <LineChart className="size-4 text-sky-500" />
              On-time delivery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
              {summary.onTimeDelivery}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-300/80">
              Down 4% vs goal — focus projects flagged in follow ups.
            </p>
          </CardContent>
        </Card>
        <Card className={panelClass}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300/90">
              <Flame className="size-4 text-orange-500" />
              High focus teammates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
              {summary.highFocus}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-300/80">
              Workers with focus score &gt; 85. Ensure they’re protected from context switching.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card className={panelClass}>
          <CardHeader className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Utilisation vs planned
              </CardTitle>
              <CardDescription>
                Weekly trend of planned vs actual hours across all projects.
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="border-white/50 bg-white/70 px-3 py-1 text-xs text-slate-600 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200"
            >
              7-week window
            </Badge>
          </CardHeader>
          <CardContent className="px-2 pb-6 pt-2 sm:px-6">
            <ChartContainer
              config={{
                planned: { label: "Planned (hrs)", color: "hsl(var(--chart-2))" },
                logged: { label: "Actual (hrs)", color: "hsl(var(--chart-5))" },
              }}
              className="aspect-auto h-[280px] w-full"
            >
              <AreaChart data={utilisationTrend}>
                <defs>
                  <linearGradient id="fillPlanned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-planned)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-planned)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillLogged" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-logged)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-logged)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="hsl(var(--muted-foreground)/0.2)" />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="planned"
                  type="natural"
                  fill="url(#fillPlanned)"
                  stroke="var(--color-planned)"
                  strokeWidth={2}
                />
                <Area
                  dataKey="logged"
                  type="natural"
                  fill="url(#fillLogged)"
                  stroke="var(--color-logged)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className={panelClass}>
          <CardHeader className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Variance by team
              </CardTitle>
              <CardDescription>
                Compare expected vs logged hours by functional area this month.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-2 pb-6 pt-4 sm:px-6">
            <ChartContainer
              config={{
                expected: { label: "Expected (hrs)", color: "hsl(var(--chart-1))" },
                actual: { label: "Actual (hrs)", color: "hsl(var(--chart-4))" },
              }}
              className="aspect-auto h-[280px] w-full"
            >
              <BarChart data={varianceByTeam} layout="vertical" barGap={6}>
                <CartesianGrid
                  horizontal={false}
                  strokeDasharray="4 4"
                  stroke="hsl(var(--muted-foreground)/0.2)"
                />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="team"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={110}
                />
                <ChartTooltip
                  cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="expected"
                  fill="var(--color-expected)"
                  radius={[4, 4, 4, 4]}
                  barSize={14}
                />
                <Bar
                  dataKey="actual"
                  fill="var(--color-actual)"
                  radius={[4, 4, 4, 4]}
                  barSize={14}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className={`${panelClass} mx-auto w-full max-w-6xl`}>
        <CardHeader className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Top contributors
            </CardTitle>
            <CardDescription>
              Highlights from last week&apos;s AI reports combining utilisation and follow-up outcomes.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {topPerformers.map((performer) => (
            <div
              key={performer.name}
              className="flex flex-col gap-3 rounded-3xl border border-white/40 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/60"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {performer.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-300/80">
                    {performer.hours}h logged
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`border-transparent ${
                    performer.variance > 0
                      ? "bg-rose-500/15 text-rose-600 dark:text-rose-300"
                      : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-200"
                  }`}
                >
                  {performer.variance > 0 ? "+" : ""}
                  {performer.variance}h variance
                </Badge>
              </div>
              <Separator className="bg-white/40 dark:bg-slate-700/60" />
              <div className="space-y-2 text-xs text-slate-500 dark:text-slate-300/80">
                <p>Focus score: {performer.focus}</p>
                <p className="font-medium text-slate-700 dark:text-slate-200">
                  {performer.Impact}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
