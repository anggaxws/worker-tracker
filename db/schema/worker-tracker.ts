import {
    boolean,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { user } from './auth';

export const userRoleEnum = pgEnum('user_role', ['admin', 'worker']);
export const taskStatusEnum = pgEnum('task_status', [
    'pending',
    'in_progress',
    'complete',
    'on_hold',
]);

export const workerUsers = pgTable('worker_users', {
    id: text('id')
        .primaryKey()
        .references(() => user.id, { onDelete: 'cascade' }),
    email: text('email').notNull().unique(),
    name: text('name'),
    role: userRoleEnum('role').default('worker').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    adminId: text('admin_id')
        .notNull()
        .references(() => workerUsers.id),
    isArchived: boolean('is_archived').default(false).notNull(),
    expectedBudgetHours: integer('expected_budget_hours'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tasks = pgTable('tasks', {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
        .notNull()
        .references(() => projects.id),
    assignedWorkerId: text('assigned_worker_id')
        .notNull()
        .references(() => workerUsers.id),
    title: text('title').notNull(),
    description: text('description'),
    expectedDurationMinutes: integer('expected_duration_minutes').notNull(),
    status: taskStatusEnum('status').default('pending').notNull(),
    isFollowUp: boolean('is_follow_up').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const timeEntries = pgTable('time_entries', {
    id: uuid('id').primaryKey().defaultRandom(),
    taskId: uuid('task_id')
        .notNull()
        .references(() => tasks.id),
    workerId: text('worker_id')
        .notNull()
        .references(() => workerUsers.id),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time'),
    durationMinutes: integer('duration_minutes'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const aiReports = pgTable(
    'ai_reports',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        workerId: text('worker_id')
            .notNull()
            .references(() => workerUsers.id),
        reportDate: timestamp('report_date').notNull(),
        summary: text('summary').notNull(),
        insights: text('insights'),
        rawDataUsed: text('raw_data_used'),
        generatedAt: timestamp('generated_at').defaultNow().notNull(),
    },
    (table) => ({
        workerDateUnique: uniqueIndex('ai_reports_worker_date_unique').on(
            table.workerId,
            table.reportDate,
        ),
    }),
);

export const workerUsersRelations = relations(workerUsers, ({ many }) => ({
    projects: many(projects),
    tasks: many(tasks),
    timeEntries: many(timeEntries),
    aiReports: many(aiReports),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
    admin: one(workerUsers, {
        fields: [projects.adminId],
        references: [workerUsers.id],
    }),
    tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
    project: one(projects, {
        fields: [tasks.projectId],
        references: [projects.id],
    }),
    assignedWorker: one(workerUsers, {
        fields: [tasks.assignedWorkerId],
        references: [workerUsers.id],
    }),
    timeEntries: many(timeEntries),
}));

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
    task: one(tasks, { fields: [timeEntries.taskId], references: [tasks.id] }),
    worker: one(workerUsers, {
        fields: [timeEntries.workerId],
        references: [workerUsers.id],
    }),
}));

export const aiReportsRelations = relations(aiReports, ({ one }) => ({
    worker: one(workerUsers, {
        fields: [aiReports.workerId],
        references: [workerUsers.id],
    }),
}));
