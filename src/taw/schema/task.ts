import { z } from 'zod';

/**
 * TaskDefinition - Core task schema for NeoVM-TaskD
 *
 * Represents a computational unit of work that can be executed
 * by agents within workflows. Designed for NestJS controllers
 * and Genkit functional API integration.
 */
export const TaskDefinitionSchema = z.object({
  // Core Identity
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),

  // Classification
  type: z.string(), // e.g., "computation", "workflow", "agent-task", "genkit-step"
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),

  // Structure & Dependencies
  steps: z.array(z.string()).optional(), // Step/task IDs or names
  dependencies: z.array(z.string()).optional(), // Task IDs this depends on
  agentId: z.string().optional(), // Agent responsible for this task
  workflowId: z.string().optional(), // Parent workflow, if any

  // Execution State
  status: z
    .enum(['pending', 'running', 'completed', 'failed', 'cancelled'])
    .default('pending'),
  result: z.any().optional(),
  error: z.string().optional(),

  // Runtime Configuration
  config: z.record(z.any()).optional(),
  timeout: z.number().optional(), // Execution timeout in ms
  retries: z.number().default(0), // Number of retry attempts
  priority: z.number().default(0), // Execution priority

  // Input/Output Schema
  inputSchema: z.record(z.any()).optional(), // Expected input structure
  outputSchema: z.record(z.any()).optional(), // Expected output structure

  // Genkit Integration
  genkitStep: z.string().optional(), // Reference to Genkit Step function
  genkitFlow: z.string().optional(), // Reference to Genkit Flow

  // Resource Requirements
  resources: z
    .object({
      cpu: z.number().optional(), // CPU units required
      memory: z.number().optional(), // Memory in MB
      storage: z.number().optional(), // Storage in GB
      gpu: z.boolean().optional(), // GPU requirement
    })
    .optional(),

  // Metadata
  createdAt: z
    .number()
    .optional()
    .default(() => Date.now()),
  updatedAt: z
    .number()
    .optional()
    .default(() => Date.now()),
  version: z.string().default('1.0.0'),
  author: z.string().optional(),

  // SystemD-style Service Properties
  serviceType: z
    .enum(['oneshot', 'simple', 'exec', 'forking', 'notify'])
    .optional(),
  restartPolicy: z
    .enum(['no', 'always', 'on-failure', 'unless-stopped'])
    .optional(),
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
