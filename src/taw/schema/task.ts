import { z } from 'zod';

/**
 * TaskDefinition - Simple/Immediate Model Schema
 *
 * Tasks represent simple, immediate determinations of Models in MVC.
 * They are "Being" - immediate, simple data structures that get
 * presented to Purusha through the Workflow/Controller interface.
 *
 * Tasks are NOT complex - complexity is handled by Agents (behind the scenes)
 * and Workflows (Controller/Monitor that informs Purusha).
 */

export const TaskDefinitionSchema = z.object({
  // Core Identity - Simple/Immediate
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),

  // Simple Classification
  type: z.string(), // e.g., "data", "computation", "query", "transformation"
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),

  // Simple Structure - Tasks are immediate/simple
  data: z.record(z.any()).optional(), // Simple data payload
  parameters: z.record(z.any()).optional(), // Simple parameters

  // Minimal Dependencies (Tasks should be simple)
  dependencies: z.array(z.string()).optional(), // Simple task dependencies

  // Simple State - Being/Immediate
  status: z
    .enum(['created', 'ready', 'processing', 'completed', 'failed'])
    .default('created'),
  result: z.any().optional(),
  error: z.string().optional(),

  // Simple Input/Output
  input: z.record(z.any()).optional(),
  output: z.record(z.any()).optional(),

  // Minimal Metadata
  createdAt: z.number().default(() => Date.now()),
  updatedAt: z.number().default(() => Date.now()),
  version: z.string().default('1.0.0'),
});

export type TaskDefinition = z.infer<typeof TaskDefinitionSchema>;

/**
 * Task Execution Context - Runtime information for task execution
 */
export const TaskExecutionContextSchema = z.object({
  taskId: z.string(),
  executionId: z.string(),
  agentId: z.string().optional(),
  workflowId: z.string().optional(),

  // Runtime State
  startTime: z.number().optional(),
  endTime: z.number().optional(),
  duration: z.number().optional(),

  // Environment
  environment: z.record(z.string()).optional(),
  variables: z.record(z.any()).optional(),

  // Metrics
  metrics: z
    .object({
      cpuUsage: z.number().optional(),
      memoryUsage: z.number().optional(),
      diskUsage: z.number().optional(),
      networkIO: z.number().optional(),
    })
    .optional(),
});

export type TaskExecutionContext = z.infer<typeof TaskExecutionContextSchema>;

/**
 * Task Event - Represents state changes and lifecycle events
 */
export const TaskEventSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  type: z.enum([
    'created',
    'started',
    'progress',
    'completed',
    'failed',
    'cancelled',
    'retry',
  ]),
  timestamp: z.number(),
  data: z.any().optional(),
  source: z.string().optional(), // Component that generated the event
});

export type TaskEvent = z.infer<typeof TaskEventSchema>;
