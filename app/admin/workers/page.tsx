"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Filter,
  RefreshCcw,
  Search,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type WorkerStatus = "available" | "focused" | "overloaded" | "on_leave";

type WorkerRecord = {
  id: string;
  name: string;
  role: string;
  avatarInitials: string;
  status: WorkerStatus;
  activeProject: string;
  projects: number;
  tasksToday: number;
  loggedHours: number;
  variance: number;
  focusScore: number;
  followUps: number;
  insights: string[];
  skills: string[];
};

const workers: WorkerRecord[] = [
  {
    id: "worker-01",
    name: "Alex Morgan",
    role: "Frontend Lead",
    avatarInitials: "AM",
    status: "focused",
    activeProject: "Northwind Rollout",
    projects: 2,
    tasksToday: 4,
    loggedHours: 6.5,
    variance: -0.8,
    focusScore: 87,
    followUps: 1,
    insights: [
      "Ship hand-off summary by 5pm",
      "Sync with QA on regression blockers",
    ],
    skills: ["React", "UI Systems", "Mentorship"],
  },
  {
    id: "worker-02",
    name: "Priya Singh",
    role: "QA Specialist",
    avatarInitials: "PS",
    status: "available",
    activeProject: "Support Queue Optimisation",
    projects: 1,
    tasksToday: 5,
    loggedHours: 5.1,
    variance: -1.2,
    focusScore: 92,
    followUps: 0,
    insights: [
      "Pair on payments bug reproduction",
      "Queue regression suite once dev drops build",
    ],
    skills: ["Automation", "Regression Suites", "Support Ops"],
  },
  {
    id: "worker-03",
    name: "Luis Hernández",
    role: "Support Engineer",
    avatarInitials: "LH",
    status: "overloaded",
    activeProject: "Incident Response Overhaul",
    projects: 3,
    tasksToday: 6,
    loggedHours: 8.2,
    variance: +1.5,
    focusScore: 63,
    followUps: 3,
    insights: [
      "Escalate blocked payments incident to platform",
      "Reassign legacy requests to free QA capacity",
    ],
    skills: ["Incident Response", "Runbooks", "Customer Success"],
  },
  {
    id: "worker-04",
    name: "Keiko Ono",
    role: "Platform Engineer",
    avatarInitials: "KO",
    status: "focused",
    activeProject: "Mobile App Sprint 5",
    projects: 2,
    tasksToday: 3,
    loggedHours: 4.4,
    variance: -0.2,
    focusScore: 84,
    followUps: 1,
    insights: [
      "Document new deployment checklist",
      "Review platform migration plan with data team",
    ],
    skills: ["Infrastructure", "API Design", "Documentation"],
  },
  {
    id: "worker-05",
    name: "Jordan Flynn",
    role: "Data Analyst",
    avatarInitials: "JF",
    status: "available",
    activeProject: "Data Migration Cleanup",
    projects: 2,
    tasksToday: 2,
    loggedHours: 3.9,
    variance: -0.5,
    focusScore: 78,
    followUps: 0,
    insights: [
      "Validate migration sample set with engineering",
      "Prep client KPI deck for Friday sync",
    ],
    skills: ["Analytics", "SQL", "Client Reporting"],
  },
  {
    id: "worker-06",
    name: "Maya Chen",
    role: "Incident Manager",
    avatarInitials: "MC",
    status: "on_leave",
    activeProject: "Incident Response Overhaul",
    projects: 1,
    tasksToday: 0,
    loggedHours: 0,
    variance: 0,
    focusScore: 0,
    followUps: 0,
    insights: ["OOO until Monday"],
    skills: ["Postmortems", "Runbooks", "Coordination"],
  },
];

const statusFilters: { value: WorkerStatus | "all"; label: string }[] = [
  { value: "all", label: "All workers" },
  { value: "focused", label: "Focused" },
  { value: "available", label: "Available" },
  { value: "overloaded", label: "Overloaded" },
  { value: "on_leave", label: "On leave" },
];

const statusStyles: Record<WorkerStatus, string> = {
  focused:
    "border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-200",
  available:
    "border-sky-400/30 bg-sky-400/15 text-sky-600 dark:text-sky-200",
  overloaded:
    "border-rose-500/40 bg-rose-500/15 text-rose-600 dark:text-rose-300",
  on_leave:
    "border-slate-400/30 bg-slate-200/60 text-slate-600 dark:border-slate-500/40 dark:bg-slate-700/40 dark:text-slate-200",
};

const panelClass =
  "rounded-3xl border border-white/40 bg-white/75 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-slate-700/50 dark:bg-slate-900/60";

export default function AdminWorkersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkerStatus | "all">("all");

  const summary = useMemo(() => {
    const activeRoster = workers.filter(
      (worker) => worker.status !== "on_leave",
    );
    const focused = activeRoster.filter(
      (worker) => worker.status === "focused",
    ).length;
    const overloaded = activeRoster.filter(
      (worker) => worker.status === "overloaded",
    ).length;
    const followUps = workers.reduce((total, worker) => total + worker.followUps, 0);
    const avgFocus =
      activeRoster.reduce((total, worker) => total + worker.focusScore, 0) /
      activeRoster.length;

    return {
      activeCount: activeRoster.length,
      focused,
      overloaded,
      followUps,
      avgFocus: Math.round(avgFocus || 0),
    };
  }, []);

  const filteredWorkers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return workers.filter((worker) => {
      const matchesStatus =
        statusFilter === "all" || worker.status === statusFilter;
      const matchesQuery =
        query.length === 0 ||
        worker.name.toLowerCase().includes(query) ||
        worker.role.toLowerCase().includes(query) ||
        worker.skills.some((skill) => skill.toLowerCase().includes(query));
      return matchesStatus && matchesQuery;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 pb-12 pt-6 lg:px-12">
      <div className="mx-auto w-full max-w-6xl space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
          Workforce overview
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300/90">
          Track utilisation, focus, and follow-ups for every teammate. Use filters to find who’s ready to take on new work.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className={panelClass}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300/90">
              <Users className="size-4" />
              Active teammates
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
            {summary.activeCount}
          </CardContent>
        </Card>
        <Card className={panelClass}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300/90">
              <CheckCircle2 className="size-4 text-emerald-500" />
              Focused
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
            {summary.focused}
          </CardContent>
        </Card>
        <Card className={panelClass}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300/90">
              <AlertTriangle className="size-4 text-rose-500" />
              Follow-ups
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
            {summary.followUps}
          </CardContent>
        </Card>
        <Card className={panelClass}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300/90">
              <Timer className="size-4 text-sky-500" />
              Avg focus score
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
            {summary.avgFocus}%
          </CardContent>
        </Card>
      </div>

      <Card className={`${panelClass} mx-auto w-full max-w-6xl`}>
        <CardHeader className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Filter teammates
            </CardTitle>
            <CardDescription>
              Search by name, role, or skill. Filter by availability and workload.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-2 text-slate-600 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-800/60"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
          >
            <RefreshCcw className="size-4" />
            Reset filters
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, role, or skill…"
              className="h-11 rounded-xl border-white/50 bg-white/80 pl-10 text-slate-800 placeholder:text-slate-400 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-100"
            />
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as WorkerStatus | "all")}
            >
              <SelectTrigger className="h-11 w-full rounded-xl border-white/50 bg-white/80 text-left text-slate-700 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-100">
                <SelectValue placeholder="Filter availability" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-white/50 bg-white/90 shadow-lg backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/80">
                {statusFilters.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge
              variant="outline"
              className="hidden whitespace-nowrap rounded-full border-white/40 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200 sm:flex"
            >
              <Filter className="mr-1 size-3.5" />
              {filteredWorkers.length} matches
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="mx-auto grid w-full max-w-6xl gap-5 pb-16 sm:grid-cols-2 xl:grid-cols-3">
        {filteredWorkers.map((worker) => (
          <Card key={worker.id} className={panelClass}>
            <CardHeader className="flex flex-col gap-4 border-b border-white/40 pb-4 dark:border-slate-700/60">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full border border-white/50 bg-white/80 text-lg font-semibold text-slate-700 shadow-sm backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-100">
                    {worker.avatarInitials}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                      {worker.name}
                    </CardTitle>
                    <CardDescription>{worker.role}</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className={statusStyles[worker.status]}>
                  {worker.status === "focused" && "Focused"}
                  {worker.status === "available" && "Available"}
                  {worker.status === "overloaded" && "Overloaded"}
                  {worker.status === "on_leave" && "On leave"}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-300/80">
                <span className="flex items-center gap-1.5">
                  {worker.projects} project{worker.projects === 1 ? "" : "s"}
                </span>
                <Separator orientation="vertical" className="h-4 bg-white/40 dark:bg-slate-700/60" />
                <span>{worker.tasksToday} tasks today</span>
                <Separator orientation="vertical" className="h-4 bg-white/40 dark:bg-slate-700/60" />
                <span>{worker.loggedHours.toFixed(1)}h logged</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              <div className="rounded-2xl border border-white/40 bg-white/70 px-3 py-3 text-sm text-slate-600 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200">
                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300/80">
                  <span>Variance vs plan</span>
                  <Badge
                    variant="outline"
                    className={`border-transparent ${
                      worker.variance > 0
                        ? "bg-rose-500/15 text-rose-600 dark:text-rose-300"
                        : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-200"
                    }`}
                  >
                    {worker.variance > 0 ? "+" : ""}
                    {worker.variance}h
                  </Badge>
                </div>
                <p className="mt-2 text-sm">
                  Active work on <span className="font-medium">{worker.activeProject}</span>.
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300/70">
                  AI insights
                </p>
                <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-200">
                  {worker.insights.map((insight) => (
                    <li key={insight} className="flex items-start gap-2">
                      <ArrowUpRight className="mt-0.5 size-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2">
                {worker.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="rounded-full border-transparent bg-slate-900/10 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur dark:bg-slate-800/60 dark:text-slate-200"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkers.length === 0 ? (
        <Card className={`${panelClass} mx-auto w-full max-w-3xl`}>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Search className="size-10 text-slate-400 dark:text-slate-500" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              No teammates found
            </h3>
            <p className="max-w-md text-sm text-slate-500 dark:text-slate-300/90">
              Try a different combination of filters or reset to show the entire workforce.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
