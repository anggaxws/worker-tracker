Technical Specification: AI-Powered Worker Tracker
Project Name: Worker Tracker
Version: 1.0
Date: October 7, 2025

1. Project Overview
The Worker Tracker application is a full-stack project designed to enhance operational efficiency by providing real-time task management, accurate time tracking, and automated daily performance insights powered by a GPT-4o AI assistant.

The system supports two primary user types: Administrators (Admins) who assign tasks, monitor overall performance, and view AI reports; and Workers, who track their time against assigned tasks and view their daily status.

2. Core Features
Feature Area

Component

Description

User Management

Authentication (Better Auth)

Secure login/session management with distinct roles: Admin and Worker.

Project Management

Project Creation

Admins create and manage projects, setting budgets (optional) and descriptions.

Task Assignment

Assignment Workflow

Admins assign specific tasks (with optional follow-ups) to individual Workers within a Project.

Time Tracking

Live Timer (Frontend)

Workers use a simple Start/Stop timer function tied to a specific Task.



Actual vs. Expected

Each task has an expected_duration (set by Admin) and tracks actual_duration (logged by Worker).



Time Log Recording

Stored in the database as discrete TimeEntry records, capturing start time, end time, and duration.

AI Assistant (GPT-4o)

Daily Report Generation

A nightly cron job or scheduled Next.js API route aggregates a Worker's daily time entries and task notes.



Insight Generation

GPT-4o processes the data (Tasks completed, time variance, notes) to generate a concise, objective daily performance report and proactive insights, stored in the database.

Admin Dashboard

Real-time Overview

Utilizes Recharts for data visualization (e.g., Worker utilization, Project progress, Time variance).



AI Report Viewer

Interface to browse and filter the daily AI-generated reports and insights.

Worker Portal

Task List

View of assigned, pending, and completed tasks.



Timer Interface

Accessible live timer for the currently selected task.

3. User Roles and Flows
3.1. Admin User Flow
Login: Authenticate via Better Auth.

Project Setup: Create new Projects (/admin/projects/new).

Task Assignment: Assign new Tasks (with expected_duration) to Workers.

Dashboard View: Access the main dashboard (/admin/dashboard) displaying:

Overall worker utilization charts.

Project time allocation vs. budget.

A feed of the latest AI Daily Reports/Insights.

Data Drill-Down: View individual Worker or Project time logs and specific AI reports.

3.2. Worker User Flow
Login: Authenticate via Better Auth.

Task Selection: View the personal task list (/worker/tasks).

Time Tracking: Select a Task and click "Start Timer." The timer tracks time until "Stop Timer" is clicked.

Submission: Upon stopping the timer, the Worker optionally adds completion notes, marks the task status (e.g., Complete, Paused), and the system submits the TimeEntry to the database.

Daily Review: View personal history and daily AI summaries.

4. Technical Stack Summary
Layer

Technology

Purpose

Frontend

Next.js 15, React 19, TypeScript

High-performance, type-safe UI framework.

Styling

Tailwind CSS 4, Radix UI

Responsive, accessible, and fast UI development.

Backend

Next.js API Routes (App Router)

Secure serverless functions for business logic and API interactions.

Database

PostgreSQL, Drizzle ORM

Robust, relational data persistence with type-safe queries.

Auth

Better Auth

Session management and user authentication.

Data Visualization

Recharts

Generating utilization and time variance charts for the Admin Dashboard.

AI Integration

External API (GPT-4o)

Used via a secure API route for analytical reporting.

5. Data Architecture (PostgreSQL/Drizzle Schema)
We will define five core tables. All tables will use PostgreSQL uuid for primary keys and Drizzle's pgTable structure.

import { pgTable, uuid, text, numeric, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- ENUMS ---
// Define the roles for Better Auth integration
export const userRoleEnum = pgEnum('user_role', ['admin', 'worker']);
export const taskStatusEnum = pgEnum('task_status', ['pending', 'in_progress', 'complete', 'on_hold']);

// --- CORE TABLES ---

// 1. Users Table (Maps to Better Auth user IDs)
export const users = pgTable('users', {
    id: uuid('id').primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name'),
    role: userRoleEnum('role').default('worker').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Projects Table
export const projects = pgTable('projects', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    adminId: uuid('admin_id').references(() => users.id).notNull(), // Creator/Owner
    isArchived: boolean('is_archived').default(false).notNull(),
    expectedBudgetHours: numeric('expected_budget_hours'), // Optional project budget
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Tasks Table (The assignments given to workers)
export const tasks = pgTable('tasks', {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id').references(() => projects.id).notNull(),
    assignedWorkerId: uuid('assigned_worker_id').references(() => users.id).notNull(),
    title: text('title').notNull(),
    description: text('description'),
    expectedDurationMinutes: numeric('expected_duration_minutes').notNull(), // Admin estimate
    status: taskStatusEnum('status').default('pending').notNull(),
    isFollowUp: boolean('is_follow_up').default(false).notNull(), // Tracks follow-up tasks
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. TimeEntries Table (The tracked work segments)
export const timeEntries = pgTable('time_entries', {
    id: uuid('id').primaryKey().defaultRandom(),
    taskId: uuid('task_id').references(() => tasks.id).notNull(),
    workerId: uuid('worker_id').references(() => users.id).notNull(),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time'), // Null if still running
    durationMinutes: numeric('duration_minutes'), // Calculated on timer stop
    notes: text('notes'), // Worker notes on what was accomplished
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. AI Reports Table (Stores daily insights)
export const aiReports = pgTable('ai_reports', {
    id: uuid('id').primaryKey().defaultRandom(),
    workerId: uuid('worker_id').references(() => users.id).notNull(),
    reportDate: timestamp('report_date').notNull().unique('worker_date_unique'), // Daily report for a specific worker
    summary: text('summary').notNull(), // AI-generated concise summary
    insights: text('insights'), // AI-generated deeper analysis/suggestions
    rawDataUsed: text('raw_data_used'), // JSON string of aggregated time entries used to generate report (for debugging/audit)
    generatedAt: timestamp('generated_at').defaultNow().notNull(),
});

// --- RELATIONSHIPS (Drizzle) ---
export const usersRelations = relations(users, ({ many }) => ({
    projectsCreated: many(projects),
    tasksAssigned: many(tasks),
    timeEntries: many(timeEntries),
    aiReports: many(aiReports),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
    project: one(projects, { fields: [tasks.projectId], references: [projects.id] }),
    assignedWorker: one(users, { fields: [tasks.assignedWorkerId], references: [users.id] }),
    timeEntries: many(timeEntries),
}));
// ... other relationships for projects, timeEntries, and aiReports

6. AI Reporting Strategy (GPT-4o Integration)
The AI assistant's core function is to transform raw time log data into actionable insights and structured daily reports.

6.1. Architecture
Trigger: A scheduled serverless function (e.g., Next.js API route /api/cron/generate-reports) runs nightly (or on-demand).

Data Aggregation: The function queries the PostgreSQL database (via Drizzle ORM) to pull all TimeEntry records and corresponding Task data for each Worker for the previous day.

Prompt Construction: The aggregated data is structured into a comprehensive prompt for GPT-4o.

System Instruction: “You are a world-class business operations analyst. Your task is to review the following worker's daily task log and provide a concise, objective performance summary and three key insights, focusing on time variance (Actual vs. Expected), productivity, and completion status.”

User Data: A JSON or Markdown block containing:

Worker Name.

Date.

List of Tasks attempted/completed, including: Task Title, Project, Expected Duration, Actual Total Duration, Variance (+/- time), and Worker's Notes.

API Call: The function securely calls the GPT-4o API endpoint.

Response Handling & Persistence: The LLM's structured response is parsed (ideally using structured JSON output from GPT-4o's response schema feature), and the resulting summary and insights are saved into the aiReports table.

6.2. Key Report Data Points
The AI reports should explicitly analyze and comment on:

Time Variance: Which tasks significantly exceeded or undercut the expectedDurationMinutes.

Focus: Number of distinct tasks worked on (context switching analysis).

Follow-ups: Successful resolution of follow-up tasks.

Productivity Score: A qualitative assessment based on notes and completion status.