import { z } from 'zod';

/**
 * Workflow Schema - Engineering Implementation
 *
 * Practical Zod schema for Workflow entities, designed for:
 * - NestJS Controller integration
 * - Genkit functional API compatibility
 * - Distributed workflow orchestration
 * - Concrete class implementation
 *
 * This is the engineering realization of the philosophical Workflow concept
 * from definition.ts, focused on implementation and API design.
 */

/**
 * Workflow Identity and Classification
 */
export const WorkflowIdentitySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.string(), // e.g., "sequential", "parallel", "dag", "state-machine", "pipeline"
  category: z.string().optional(),
  version: z.string().default('1.0.0'),
  tags: z.array(z.string()).default([]),
});

/**
 * Workflow Definition and Structure
 */
export const WorkflowStepSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum([
    'task',
    'subworkflow',
    'decision',
    'parallel',
    'wait',
    'manual',
  ]),
  taskId: z.string().optional(), // Reference to Task if type is 'task'
  workflowId: z.string().optional(), // Reference to Workflow if type is 'subworkflow'

  // Dependencies and ordering
  dependsOn: z.array(z.string()).default([]), // Step IDs this step depends on
  runAfter: z.array(z.string()).default([]), // Step IDs to run after (weak dependency)

  // Conditional execution
  condition: z
    .object({
      expression: z.string().optional(), // Boolean expression
      variables: z.record(z.any()).optional(),
    })
    .optional(),

  // Retry and error handling
  retryPolicy: z
    .object({
      maxAttempts: z.number().int().min(1).default(1),
      backoffStrategy: z
        .enum(['fixed', 'exponential', 'linear'])
        .default('fixed'),
      initialDelayMs: z.number().int().positive().default(1000),
      maxDelayMs: z.number().int().positive().optional(),
      jitterPercent: z.number().min(0).max(100).default(0),
    })
    .optional(),

  // Timeout and resource limits
  timeoutMs: z.number().int().positive().optional(),
  resources: z
    .object({
      cpuCores: z.number().positive().optional(),
      memoryMB: z.number().int().positive().optional(),
      priority: z.number().int().min(0).max(10).default(5),
    })
    .optional(),

  // Step configuration
  config: z.record(z.any()).optional(),
});

export const WorkflowDefinitionSchema = z.object({
  // Basic structure
  steps: z.array(WorkflowStepSchema),
  startStep: z.string(), // ID of the starting step
  endSteps: z.array(z.string()).default([]), // IDs of terminal steps

  // Flow control
  flowType: z
    .enum(['sequential', 'parallel', 'dag', 'state-machine'])
    .default('dag'),
  maxConcurrency: z.number().int().positive().optional(), // Max parallel steps

  // Error handling
  errorHandling: z
    .object({
      strategy: z
        .enum(['fail-fast', 'continue', 'retry-failed', 'manual'])
        .default('fail-fast'),
      onFailure: z
        .object({
          stepId: z.string().optional(), // Step to run on failure
          notification: z.boolean().default(false),
          rollback: z.boolean().default(false),
        })
        .optional(),
    })
    .optional(),

  // Global configuration
  globalConfig: z.record(z.any()).optional(),
  environmentVariables: z.record(z.string()).optional(),
});

/**
 * Workflow Execution State
 */
export const WorkflowStatusEnum = z.enum([
  'draft',
  'pending',
  'running',
  'paused',
  'completed',
  'failed',
  'cancelled',
  'timeout',
  'suspended',
]);

export const WorkflowExecutionStateSchema = z.object({
  status: WorkflowStatusEnum.default('draft'),

  // Overall progress
  progress: z.object({
    totalSteps: z.number().int().min(0).default(0),
    completedSteps: z.number().int().min(0).default(0),
    failedSteps: z.number().int().min(0).default(0),
    skippedSteps: z.number().int().min(0).default(0),
    progressPercent: z.number().min(0).max(100).default(0),
  }),

  // Timing
  scheduledAt: z.number().optional(), // Unix timestamp
  startedAt: z.number().optional(),
  completedAt: z.number().optional(),
  lastActivityAt: z.number().optional(),
  estimatedCompletionAt: z.number().optional(),

  // Current execution context
  currentStep: z.string().optional(), // Currently executing step ID
  activeSteps: z.array(z.string()).default([]), // All currently running steps
  waitingSteps: z.array(z.string()).default([]), // Steps waiting for dependencies

  // Step execution tracking
  stepStates: z
    .record(
      z.object({
        status: z.enum([
          'pending',
          'running',
          'completed',
          'failed',
          'skipped',
          'cancelled',
        ]),
        startedAt: z.number().optional(),
        completedAt: z.number().optional(),
        duration: z.number().optional(), // Duration in ms
        retryCount: z.number().int().min(0).default(0),
        result: z.any().optional(),
        error: z.string().optional(),
      }),
    )
    .default({}),

  // Global state
  variables: z.record(z.any()).optional(), // Workflow-scoped variables
  outputs: z.record(z.any()).optional(), // Final workflow outputs
});

/**
 * Workflow Scheduling and Triggers
 */
export const WorkflowSchedulingSchema = z.object({
  // Trigger configuration
  triggers: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum([
          'manual',
          'cron',
          'event',
          'webhook',
          'file-change',
          'dependency',
        ]),

        // Cron scheduling
        cronExpression: z.string().optional(),
        timezone: z.string().optional(),

        // Event-based triggers
        eventType: z.string().optional(),
        eventFilter: z.record(z.any()).optional(),

        // Webhook triggers
        webhookUrl: z.string().optional(),
        webhookSecret: z.string().optional(),

        // Dependency triggers
        dependencyWorkflowIds: z.array(z.string()).optional(),
        dependencyCondition: z
          .enum(['all-success', 'any-success', 'any-complete'])
          .optional(),

        // Trigger state
        enabled: z.boolean().default(true),
        lastTriggered: z.number().optional(),
        nextScheduled: z.number().optional(),
      }),
    )
    .default([]),

  // Scheduling constraints
  maxConcurrentExecutions: z.number().int().positive().default(1),
  queuePolicy: z.enum(['queue', 'skip', 'replace']).default('queue'),

  // Execution windows
  allowedExecutionWindows: z
    .array(
      z.object({
        startTime: z.string(), // HH:MM format
        endTime: z.string(),
        timezone: z.string().optional(),
        daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(), // 0=Sunday
      }),
    )
    .optional(),
});

/**
 * Workflow Genkit Integration
 */
export const WorkflowGenkitSchema = z.object({
  genkitFlowId: z.string().optional(), // Primary Genkit Flow ID

  // Flow composition
  subflows: z
    .array(
      z.object({
        stepId: z.string(),
        flowId: z.string(),
        inputMapping: z.record(z.string()).optional(), // Map workflow vars to flow inputs
        outputMapping: z.record(z.string()).optional(), // Map flow outputs to workflow vars
      }),
    )
    .default([]),

  // AI integration
  aiSteps: z
    .array(
      z.object({
        stepId: z.string(),
        model: z.string(),
        prompt: z.string().optional(),
        tools: z.array(z.string()).default([]),
        config: z.record(z.any()).optional(),
      }),
    )
    .default([]),

  // Global Genkit configuration
  genkitConfig: z.record(z.any()).optional(),
});

/**
 * Workflow Resource Management
 */
export const WorkflowResourceSchema = z.object({
  // Resource requirements
  requirements: z
    .object({
      totalCpuCores: z.number().positive().optional(),
      totalMemoryMB: z.number().int().positive().optional(),
      totalStorageMB: z.number().int().positive().optional(),
      requiredAgentTypes: z.array(z.string()).default([]),
      requiredCapabilities: z.array(z.string()).default([]),
      geographicConstraints: z.array(z.string()).default([]),
    })
    .optional(),

  // Cost management
  cost: z
    .object({
      budgetUSD: z.number().positive().optional(),
      costPerExecution: z.number().positive().optional(),
      billingProject: z.string().optional(),
      costCenter: z.string().optional(),
    })
    .optional(),

  // SLA requirements
  sla: z
    .object({
      maxExecutionTimeMs: z.number().int().positive().optional(),
      targetAvailability: z.number().min(0).max(1).optional(), // 0.0 to 1.0
      maxFailureRate: z.number().min(0).max(1).optional(),
      supportTier: z
        .enum(['basic', 'standard', 'premium', 'enterprise'])
        .optional(),
    })
    .optional(),
});

/**
 * Workflow Monitoring and Observability
 */
export const WorkflowMonitoringSchema = z.object({
  // Metrics collection
  metrics: z
    .object({
      enabled: z.boolean().default(true),
      metricsEndpoint: z.string().optional(),
      customMetrics: z
        .array(
          z.object({
            name: z.string(),
            type: z.enum(['counter', 'gauge', 'histogram', 'summary']),
            description: z.string().optional(),
            labels: z.array(z.string()).default([]),
          }),
        )
        .default([]),
    })
    .optional(),

  // Logging configuration
  logging: z
    .object({
      level: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
      destination: z.enum(['console', 'file', 'remote']).default('console'),
      structured: z.boolean().default(true),
      includeStepLogs: z.boolean().default(true),
    })
    .optional(),

  // Tracing configuration
  tracing: z
    .object({
      enabled: z.boolean().default(false),
      samplingRate: z.number().min(0).max(1).default(0.1),
      tracingEndpoint: z.string().optional(),
      includeStepTraces: z.boolean().default(true),
    })
    .optional(),

  // Alerting configuration
  alerting: z
    .object({
      enabled: z.boolean().default(false),
      channels: z
        .array(
          z.object({
            type: z.enum(['email', 'slack', 'webhook', 'pagerduty']),
            endpoint: z.string(),
            events: z.array(
              z.enum(['started', 'completed', 'failed', 'timeout']),
            ),
          }),
        )
        .default([]),
    })
    .optional(),
});

/**
 * Workflow Metadata and Audit
 */
export const WorkflowMetadataSchema = z.object({
  createdAt: z
    .number()
    .int()
    .positive()
    .default(() => Date.now()),
  updatedAt: z
    .number()
    .int()
    .positive()
    .default(() => Date.now()),
  createdBy: z.string().optional(), // User/service ID
  lastModifiedBy: z.string().optional(),

  // Version control
  versionHistory: z
    .array(
      z.object({
        version: z.string(),
        timestamp: z.number().int().positive(),
        changes: z.string().optional(),
        author: z.string().optional(),
      }),
    )
    .default([]),

  // Audit trail
  auditLog: z
    .array(
      z.object({
        timestamp: z.number().int().positive(),
        action: z.string(),
        actor: z.string().optional(),
        details: z.record(z.any()).optional(),
      }),
    )
    .default([]),

  // Classification and discovery
  labels: z.record(z.string()).optional(), // Key-value labels for filtering
  annotations: z.record(z.string()).optional(), // Human-readable annotations

  // Documentation
  documentation: z
    .object({
      readme: z.string().optional(),
      changelog: z.string().optional(),
      examples: z
        .array(
          z.object({
            name: z.string(),
            description: z.string().optional(),
            config: z.record(z.any()).optional(),
          }),
        )
        .default([]),
    })
    .optional(),
});

/**
 * Complete Workflow Schema - Engineering Implementation
 *
 * This combines all the component schemas into a complete Workflow definition
 * suitable for NestJS Controllers, Genkit integration, and concrete class implementation.
 */
export const WorkflowSchema = z.object({
  // Core identity and classification
  ...WorkflowIdentitySchema.shape,

  // Workflow definition and structure
  definition: WorkflowDefinitionSchema,

  // Execution state
  executionState: WorkflowExecutionStateSchema,

  // Scheduling and triggers
  scheduling: WorkflowSchedulingSchema.optional(),

  // Genkit integration
  genkit: WorkflowGenkitSchema.optional(),

  // Resource management
  resources: WorkflowResourceSchema.optional(),

  // Monitoring and observability
  monitoring: WorkflowMonitoringSchema.optional(),

  // Metadata and audit
  metadata: WorkflowMetadataSchema,
});

export type Workflow = z.infer<typeof WorkflowSchema>;

/**
 * Workflow Creation Schema - For API endpoints
 */
export const CreateWorkflowSchema = WorkflowSchema.omit({
  id: true,
  metadata: true,
  executionState: true,
}).extend({
  metadata: WorkflowMetadataSchema.partial().optional(),
});

export type CreateWorkflow = z.infer<typeof CreateWorkflowSchema>;

/**
 * Workflow Update Schema - For API endpoints
 */
export const UpdateWorkflowSchema = WorkflowSchema.partial()
  .omit({
    id: true,
    metadata: true,
  })
  .extend({
    metadata: WorkflowMetadataSchema.pick({
      updatedAt: true,
      lastModifiedBy: true,
      auditLog: true,
      labels: true,
      annotations: true,
    })
      .partial()
      .optional(),
  });

export type UpdateWorkflow = z.infer<typeof UpdateWorkflowSchema>;

/**
 * Workflow Query Schema - For search/filter operations
 */
export const WorkflowQuerySchema = z.object({
  ids: z.array(z.string()).optional(),
  types: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  statuses: z.array(WorkflowStatusEnum).optional(),
  versions: z.array(z.string()).optional(),
  createdAfter: z.number().optional(),
  createdBefore: z.number().optional(),
  createdBy: z.array(z.string()).optional(),
  labels: z.record(z.string()).optional(),
  hasSchedule: z.boolean().optional(),
  isActive: z.boolean().optional(),
  limit: z.number().int().positive().max(1000).default(100),
  offset: z.number().int().min(0).default(0),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'name', 'status', 'version'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type WorkflowQuery = z.infer<typeof WorkflowQuerySchema>;

/**
 * Workflow Execution Request Schema
 */
export const ExecuteWorkflowSchema = z.object({
  workflowId: z.string(),
  inputs: z.record(z.any()).optional(),
  variables: z.record(z.any()).optional(),
  config: z.record(z.any()).optional(),
  priority: z.number().int().min(0).max(10).default(5),
  scheduledAt: z.number().optional(), // Unix timestamp for delayed execution
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string()).optional(),
});

export type ExecuteWorkflow = z.infer<typeof ExecuteWorkflowSchema>;

/**
 * Workflow Event Schema
 */
export const WorkflowEventSchema = z.object({
  id: z.string().uuid(),
  workflowId: z.string(),
  executionId: z.string().optional(), // Specific execution instance
  type: z.enum([
    'created',
    'updated',
    'deleted',
    'scheduled',
    'started',
    'step-started',
    'step-completed',
    'step-failed',
    'paused',
    'resumed',
    'completed',
    'failed',
    'cancelled',
    'timeout',
  ]),
  timestamp: z
    .number()
    .int()
    .positive()
    .default(() => Date.now()),
  stepId: z.string().optional(), // If event is step-specific
  data: z.record(z.any()).optional(),
  source: z.string().optional(), // Component that generated the event
  severity: z
    .enum(['debug', 'info', 'warn', 'error', 'critical'])
    .default('info'),
});

export type WorkflowEvent = z.infer<typeof WorkflowEventSchema>;
