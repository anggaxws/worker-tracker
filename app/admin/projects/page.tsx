"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Clock,
  Filter,
  FolderOpen,
  RefreshCcw,
  Search,
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
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type ProjectStatus = "active" | "at_risk" | "completed" | "planning";

type ProjectRecord = {
  id: string;
  name: string;
  client: string;
  manager: string;
  status: ProjectStatus;
  hoursPlanned: number;
  hoursLogged: number;
  progress: number;
  startDate: string;
  dueDate: string;
  tags: string[];
  teamCount: number;
};

const projects: ProjectRecord[] = [
  {
    id: "proj-01",
    name: "Northwind Rollout",
    client: "Northwind Traders",
    manager: "Alex Morgan",
    status: "active",
    hoursPlanned: 160,
    hoursLogged: 132,
    progress: 72,
    startDate: "2024-08-01",
    dueDate: "2024-10-15",
    tags: ["Deployment", "Payments"],
    teamCount: 6,
  },
  {
    id: "proj-02",
    name: "Support Queue Optimisation",
    client: "Internal Ops",
    manager: "Priya Singh",
    status: "at_risk",
    hoursPlanned: 90,
    hoursLogged: 86,
    progress: 64,
    startDate: "2024-07-18",
    dueDate: "2024-09-30",
    tags: ["Automation", "Customer Success"],
    teamCount: 4,
  },
  {
    id: "proj-03",
    name: "Mobile App Sprint 5",
    client: "Contoso Retail",
    manager: "Keiko Ono",
    status: "active",
    hoursPlanned: 120,
    hoursLogged: 78,
    progress: 55,
    startDate: "2024-08-22",
    dueDate: "2024-10-05",
    tags: ["iOS", "Android"],
    teamCount: 5,
  },
  {
    id: "proj-04",
    name: "Data Migration Cleanup",
    client: "Globex",
    manager: "Jordan Flynn",
    status: "planning",
    hoursPlanned: 200,
    hoursLogged: 12,
    progress: 8,
    startDate: "2024-09-01",
    dueDate: "2024-12-01",
    tags: ["Data", "Infrastructure"],
    teamCount: 7,
  },
  {
    id: "proj-05",
    name: "Client Insights Dashboard",
    client: "Fabrikam Analytics",
    manager: "Luis Hernández",
    status: "completed",
    hoursPlanned: 140,
    hoursLogged: 138,
    progress: 100,
    startDate: "2024-05-01",
    dueDate: "2024-08-31",
    tags: ["BI", "Recharts"],
    teamCount: 3,
  },
  {
    id: "proj-06",
    name: "Incident Response Overhaul",
    client: "Internal Ops",
    manager: "Maya Chen",
    status: "at_risk",
    hoursPlanned: 110,
    hoursLogged: 124,
    progress: 48,
    startDate: "2024-06-10",
    dueDate: "2024-09-20",
    tags: ["Platform", "Runbooks"],
    teamCount: 4,
  },
];

const statusFilters: { label: string; value: ProjectStatus | "all" }[] = [
  { label: "All projects", value: "all" },
  { label: "Active", value: "active" },
  { label: "At risk", value: "at_risk" },
  { label: "Planning", value: "planning" },
  { label: "Completed", value: "completed" },
];

const statusStyles: Record<ProjectStatus, string> = {
  active: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-200",
  at_risk: "border-rose-500/40 bg-rose-500/15 text-rose-600 dark:text-rose-300",
  completed: "border-slate-400/30 bg-slate-200/60 text-slate-700 dark:border-slate-500/40 dark:bg-slate-700/40 dark:text-slate-100",
  planning: "border-sky-400/30 bg-sky-400/15 text-sky-700 dark:text-sky-200",
};

const panelClass =
  "rounded-3xl border border-white/40 bg-white/75 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-slate-700/50 dark:bg-slate-900/60";

export default function AdminProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");

  const summary = useMemo(() => {
    const active = projects.filter((project) => project.status === "active").length;
    const atRisk = projects.filter((project) => project.status === "at_risk").length;
    const completed = projects.filter((project) => project.status === "completed").length;
    const hoursPlanned = projects.reduce((total, project) => total + project.hoursPlanned, 0);
    const hoursLogged = projects.reduce((total, project) => total + project.hoursLogged, 0);

    return {
      active,
      atRisk,
      completed,
      hoursPlanned,
      hoursLogged,
      utilisation: Math.round((hoursLogged / hoursPlanned) * 100),
    };
  }, []);

  const filteredProjects = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      const matchesQuery =
        query.length === 0 ||
        project.name.toLowerCase().includes(query) ||
        project.client.toLowerCase().includes(query) ||
        project.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesStatus && matchesQuery;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 pb-12 pt-6 lg:px-12">
      <div className="mx-auto w-full max-w-6xl space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
          Project portfolio
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300/90">
          Review project health, utilisation, and focus areas at a glance. Filter to drill into the initiatives that need attention.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className={panelClass}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300/90">
              <FolderOpen className="size-4" />
              Active projects
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
            {summary.active}
          </CardContent>
        </Card>
        <Card className={panelClass}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300/90">
              <AlertTriangle className="size-4 text-amber-500" />
              At risk
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
            {summary.atRisk}
          </CardContent>
        </Card>
        <Card className={panelClass}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300/90">
              <Clock className="size-4" />
              Logged hours
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
            {summary.hoursLogged}h
          </CardContent>
        </Card>
        <Card className={panelClass}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300/90">
              <Check className="size-4 text-emerald-500" />
              Portfolio utilisation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
              {summary.utilisation}%
            </p>
            <Progress value={summary.utilisation} className="h-2 rounded-full bg-white/50 dark:bg-slate-800/60" />
          </CardContent>
        </Card>
      </div>

      <Card className={`${panelClass} mx-auto w-full max-w-6xl`}>
        <CardHeader className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Filter projects
            </CardTitle>
            <CardDescription>
              Search by project, client, or tag. Narrow results by status to focus the portfolio.
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
              placeholder="Search by project, client, or tag…"
              className="h-11 rounded-xl border-white/50 bg-white/80 pl-10 text-slate-800 placeholder:text-slate-400 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-100"
            />
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as ProjectStatus | "all")}
            >
              <SelectTrigger className="h-11 w-full rounded-xl border-white/50 bg-white/80 text-left text-slate-700 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-100">
                <SelectValue placeholder="Filter status" />
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
              {filteredProjects.length} results
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="mx-auto grid w-full max-w-6xl gap-5 pb-16 sm:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className={panelClass}>
            <CardHeader className="flex flex-col gap-3 border-b border-white/40 pb-4 dark:border-slate-700/50">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    {project.name}
                  </CardTitle>
                  <CardDescription>{project.client}</CardDescription>
                </div>
                <Badge variant="outline" className={statusStyles[project.status]}>
                  {project.status === "active" && "Active"}
                  {project.status === "at_risk" && "At Risk"}
                  {project.status === "planning" && "Planning"}
                  {project.status === "completed" && "Completed"}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-300/80">
                <span className="flex items-center gap-1.5">
                  <Users className="size-3.5" />
                  {project.teamCount} teammates
                </span>
                <Separator orientation="vertical" className="h-4 bg-white/40 dark:bg-slate-700/60" />
                <span>
                  Starts {project.startDate} · due {project.dueDate}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300/70">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2 rounded-full bg-white/40 dark:bg-slate-800/60" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300/90">
                <div className="rounded-2xl border border-white/40 bg-white/70 px-3 py-2 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/60">
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Hours logged
                  </p>
                  <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
                    {project.hoursLogged}h
                  </p>
                </div>
                <div className="rounded-2xl border border-white/40 bg-white/70 px-3 py-2 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/60">
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Planned
                  </p>
                  <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
                    {project.hoursPlanned}h
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="rounded-full border-transparent bg-slate-900/10 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur dark:bg-slate-800/60 dark:text-slate-200"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 ? (
        <Card className={`${panelClass} mx-auto w-full max-w-3xl`}>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Search className="size-10 text-slate-400 dark:text-slate-500" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              No projects found
            </h3>
            <p className="max-w-md text-sm text-slate-500 dark:text-slate-300/90">
              Adjust your filters or reset the search to see the full portfolio overview again.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
