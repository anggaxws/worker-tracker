"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Check,
  Clock3,
  Info,
  ShieldCheck,
  Users2,
} from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select";
import { Separator } from "@/components/ui/separator";

const taskSchema = z.object({
  title: z
    .string()
    .min(3, "Task title must be at least 3 characters long.")
    .max(120, "Keep task titles concise (max 120 characters)."),
  description: z
    .string()
    .max(500, "Description can be up to 500 characters.")
    .optional()
    .or(z.literal("")),
  expectedDuration: z.coerce
    .number()
    .refine((value) => !Number.isNaN(value), {
      message: "Enter the expected duration in minutes.",
    })
    .refine((value) => value >= 15 && value <= 1440, {
      message: "Expected duration should be between 15 and 1440 minutes.",
    }),
  projects: z
    .array(z.string())
    .min(1, "Select at least one project to associate this task."),
  workers: z
    .array(z.string())
    .min(1, "Assign the task to at least one worker."),
  isFollowUp: z.boolean().default(false),
});

type TaskFormValues = z.infer<typeof taskSchema>;

const mockProjects = [
  {
    id: "proj-northwind",
    name: "Northwind Rollout",
    client: "Northwind Traders",
    plannedHours: 160,
  },
  {
    id: "proj-support",
    name: "Support Queue Optimisation",
    client: "Internal Ops",
    plannedHours: 90,
  },
  {
    id: "proj-mobile",
    name: "Mobile App Sprint 5",
    client: "Contoso Retail",
    plannedHours: 120,
  },
  {
    id: "proj-data",
    name: "Data Migration Cleanup",
    client: "Globex",
    plannedHours: 200,
  },
] as const;

const mockWorkers = [
  {
    id: "worker-alex",
    name: "Alex Morgan",
    role: "Frontend Lead",
    weeklyCapacity: 32,
  },
  {
    id: "worker-priya",
    name: "Priya Singh",
    role: "QA Specialist",
    weeklyCapacity: 35,
  },
  {
    id: "worker-keiko",
    name: "Keiko Ono",
    role: "Platform Engineer",
    weeklyCapacity: 40,
  },
  {
    id: "worker-luis",
    name: "Luis Hernández",
    role: "Support Engineer",
    weeklyCapacity: 28,
  },
  {
    id: "worker-jordan",
    name: "Jordan Flynn",
    role: "Data Analyst",
    weeklyCapacity: 30,
  },
] as const;

type GeneratedAssignment = {
  worker: (typeof mockWorkers)[number];
  project: (typeof mockProjects)[number];
  title: string;
  description?: string;
  expectedDuration: number;
  isFollowUp: boolean;
};

export default function AdminCreateTaskPage() {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      expectedDuration: 60,
      projects: [],
      workers: [],
      isFollowUp: false,
    },
  });

  const [assignments, setAssignments] = useState<GeneratedAssignment[] | null>(
    null,
  );

  const projectOptions: MultiSelectOption[] = useMemo(
    () =>
      mockProjects.map((project) => ({
        value: project.id,
        label: project.name,
        meta: project.client,
      })),
    [],
  );

  const workerOptions: MultiSelectOption[] = useMemo(
    () =>
      mockWorkers.map((worker) => ({
        value: worker.id,
        label: worker.name,
        meta: worker.role,
      })),
    [],
  );

  const onSubmit = (values: TaskFormValues) => {
    const selectedProjects = mockProjects.filter((project) =>
      values.projects.includes(project.id),
    );
    const selectedWorkers = mockWorkers.filter((worker) =>
      values.workers.includes(worker.id),
    );

    const combinations: GeneratedAssignment[] = [];

    selectedProjects.forEach((project) => {
      selectedWorkers.forEach((worker) => {
        combinations.push({
          project,
          worker,
          title: values.title,
          description: values.description || undefined,
          expectedDuration: Number(values.expectedDuration),
          isFollowUp: values.isFollowUp,
        });
      });
    });

    setAssignments(combinations);
    toast.success("Task ready to dispatch", {
      description: `${combinations.length} assignment${
        combinations.length === 1 ? "" : "s"
      } generated. Connect the API to persist this data.`,
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 pb-10 pt-6 lg:px-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create multi-worker task
        </h1>
        <p className="text-sm text-muted-foreground">
          Launch a task across multiple projects and teammates. When you submit,
          the form generates individual assignments combining each selected
          project and worker.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle>Task definition</CardTitle>
            <CardDescription>
              Configure the work to be dispatched. Expected duration is recorded
              in minutes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Deploy payments hotfix"
                          className="h-11 rounded-lg border-zinc-800 bg-zinc-950 text-zinc-100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Context</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Outline steps, blockers, or acceptance criteria…"
                          rows={4}
                          className="rounded-lg border-zinc-800 bg-zinc-950 text-sm text-zinc-100"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Workers see this in the timer panel when they log the
                        task.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="projects"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select projects</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={projectOptions}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            placeholder="Choose project(s)"
                            searchPlaceholder="Filter projects…"
                          />
                        </FormControl>
                        <FormDescription>
                          Each project will receive its own copy of the task.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="workers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assign workers</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={workerOptions}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            placeholder="Choose worker(s)"
                            searchPlaceholder="Search roster…"
                          />
                        </FormControl>
                        <FormDescription>
                          Every worker selected will receive this task on each
                          project chosen.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="expectedDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected duration (minutes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={15}
                            max={1440}
                            className="h-11 rounded-lg border-zinc-800 bg-zinc-950 text-zinc-100"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Used for variance analysis in daily AI reports.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isFollowUp"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-between rounded-lg border border-zinc-800/80 bg-zinc-950/60 px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <FormLabel className="mb-1 block">
                              Mark as follow-up
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Flags the task in worker dashboards and analytics.
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => form.reset()}
                    disabled={form.formState.isSubmitting}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    className="gap-2"
                    disabled={form.formState.isSubmitting}
                  >
                    Generate assignments
                    <Check className="size-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <aside className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="size-4" />
                How multi-assign works
              </CardTitle>
              <CardDescription>
                Each task you create expands into combinations of projects and
                workers. Wire the API endpoint to persist these assignments in
                your database.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <Users2 className="mt-1 size-4 text-zinc-400" />
                <p>
                  Choosing 2 projects and 3 workers produces 6 unique task
                  records—one per worker/project pairing.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Clock3 className="mt-1 size-4 text-zinc-400" />
                <p>
                  Expected durations feed utilisation dashboards and AI daily
                  reports for variance tracking.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 size-4 text-zinc-400" />
                <p>
                  To persist the assignments, connect this form to a Next.js API
                  route that inserts records using the Drizzle schema.
                </p>
              </div>
            </CardContent>
          </Card>

          {assignments ? (
            <Card className="border-green-500/40 bg-green-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-green-200">
                  <Check className="size-4" />
                  Assignments generated
                </CardTitle>
                <CardDescription>
                  {assignments.length} ready to send. Replace this preview with a
                  call to your persistence layer.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-xs text-green-100">
                  <p className="text-[13px] font-medium">
                    Example payload (first item)
                  </p>
                  <pre className="mt-2 overflow-x-auto text-[11px] leading-relaxed">
                    {JSON.stringify(assignments[0], null, 2)}
                  </pre>
                </div>
                <Separator className="bg-green-500/20" />
                <div className="space-y-3">
                  {assignments.slice(0, 4).map((assignment) => (
                    <div
                      key={`${assignment.project.id}-${assignment.worker.id}`}
                      className="rounded-lg border border-green-500/10 bg-zinc-950/60 px-3 py-2"
                    >
                      <div className="flex items-center justify-between text-sm text-green-100">
                        <span>{assignment.title}</span>
                        <Badge
                          variant="outline"
                          className="border-green-500/40 bg-green-500/10 text-[10px] uppercase tracking-wide text-green-100"
                        >
                          {assignment.expectedDuration} min
                        </Badge>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-green-200/80">
                        <span>{assignment.project.name}</span>
                        <span>{assignment.worker.name}</span>
                      </div>
                    </div>
                  ))}
                  {assignments.length > 4 ? (
                    <p className="text-xs text-green-200/70">
                      …and {assignments.length - 4} more combinations.
                    </p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-zinc-800 bg-zinc-900/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-zinc-300">
                  <AlertCircle className="size-4" />
                  Awaiting configuration
                </CardTitle>
                <CardDescription>
                  Fill out the form to generate your first wave of assignments.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Once you submit, a preview of the worker/project combinations
                  appears here so you can verify before connecting the backend.
                </p>
                <p>
                  Hook into your `tasks` Drizzle schema by sending the generated
                  combinations to a secure API route.
                </p>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
