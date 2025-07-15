import { z } from 'zod';

/**
 * Agent Schema - MCP Server Infrastructure Manager
 *
 * Agents operate BEHIND THE SCENES, hidden from Purusha's direct view.
 * They manage the MCP Server infrastructure that powers the system.
 *
 * Key insights:
 * - Agents manage Tools → Agents manage MCP Servers
 * - Google MCP Database Toolbox = MCP on steroids
 * - Agent is the hidden infrastructure layer
 * - Agent performs complex operations invisibly
 */

/**
 * MCP Server Management - Agent's primary responsibility
 */
export const MCPServerSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['database', 'filesystem', 'api', 'tool', 'custom']),
  endpoint: z.string(),
  capabilities: z.array(z.string()).default([]),

  // MCP Server configuration
  mcpConfig: z.object({
    version: z.string().default('1.0'),
    transport: z.enum(['stdio', 'http', 'websocket']).default('stdio'),
    authentication: z.record(z.string()).optional(),
    toolbox: z.boolean().default(false), // Is this a "toolbox" server like Google's?
  }),

  // Server state
  status: z.enum(['offline', 'starting', 'ready', 'error']).default('offline'),
  healthCheck: z
    .object({
      lastCheck: z.number().optional(),
      healthy: z.boolean().default(false),
      latencyMs: z.number().optional(),
    })
    .optional(),
});

export type MCPServer = z.infer<typeof MCPServerSchema>;

/**
 * Tool Management - Agent manages sophisticated tooling
 */
export const ToolManagementSchema = z.object({
  managedTools: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(['mcp-tool', 'native-tool', 'api-tool', 'database-tool']),
        mcpServerId: z.string().optional(), // Reference to MCP server providing this tool
        capabilities: z.array(z.string()).default([]),
        configuration: z.record(z.any()).optional(),
      }),
    )
    .default([]),

  toolboxServers: z.array(z.string()).default([]), // IDs of "toolbox" MCP servers

  // Agent's tool orchestration
  toolOrchestration: z
    .object({
      orchestrationStrategy: z.enum(['sequential', 'parallel', 'adaptive']),
      failureHandling: z.enum(['abort', 'continue', 'retry']),
      resourceOptimization: z.boolean().default(true),
    })
    .optional(),
});

export type ToolManagement = z.infer<typeof ToolManagementSchema>;

/**
 * TopicMap Construction - Agent's dialectical work
 * Agents construct topic maps as dialectical synthesis
 */
export const TopicMapSchema = z.object({
  id: z.string(),
  topics: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(['constructed', 'derived', 'mediating']),
        dialecticalFunction: z.string().optional(),
        properties: z.record(z.any()).optional(),
      }),
    )
    .default([]),
  topicRelations: z
    .array(
      z.object({
        id: z.string(),
        sourceTopicId: z.string(),
        targetTopicId: z.string(),
        relationType: z.string(),
        dialecticalNature: z.string().optional(),
      }),
    )
    .default([]),
  constructionProcess: z.string().optional(), // How topics were constructed
});

export type TopicMap = z.infer<typeof TopicMapSchema>;

/**
 * View System - Agent's Logic of Appearance
 * Agents maintain view systems for dialectical construction
 */
export const ViewSystemSchema = z.object({
  id: z.string(),
  agentId: z.string(),
  viewDefinitions: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        perspectiveType: z.enum(['agential', 'dialectical', 'transcendental']),
        appearanceLogic: z.string().optional(),
        constructionRules: z.record(z.any()).optional(),
      }),
    )
    .default([]),
  dialecticalConstruction: z
    .object({
      constructionMethod: z.string(),
      synthesisCapability: z.boolean().default(true),
      mediatingFunction: z.string().optional(),
    })
    .optional(),
});

export type ViewSystem = z.infer<typeof ViewSystemSchema>;

/**
 * Property Reification - Agent's unique pointing to Agential View System
 */
export const PropertyReificationSchema = z.object({
  agentialProperties: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum([
          'ontological-class',
          'transcendental-mark',
          'dialectical-topic',
        ]),
        reificationMethod: z.string(),
        agentialPointing: z.string(), // Unique pointing to AgentialViewSystem
        persistenceLevel: z.enum(['session', 'agent-lifetime', 'permanent']),
        ontologicalClass: z.record(z.any()).optional(),
      }),
    )
    .default([]),
  logicOfExperience: z
    .object({
      experienceRules: z.array(z.string()).default([]),
      propertyMaintenance: z.string().optional(),
      ontologicalCompetence: z.record(z.any()).optional(),
    })
    .optional(),
});

export type PropertyReification = z.infer<typeof PropertyReificationSchema>;

/**
 * Agent Identity and Classification
 */
export const AgentIdentitySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.string(), // e.g., "ai-worker", "human-operator", "service-proxy", "compute-node"
  category: z.string().optional(),
  version: z.string().default('1.0.0'),
  tags: z.array(z.string()).default([]),
});

/**
 * Agent Capabilities and Skills
 */
export const AgentCapabilitiesSchema = z.object({
  skills: z.array(z.string()).default([]), // e.g., ["data-processing", "ml-inference", "text-generation"]
  tools: z.array(z.string()).default([]), // Available tool IDs/names
  models: z.array(z.string()).default([]), // AI models this agent can use
  languages: z.array(z.string()).default([]), // Programming/natural languages supported
  protocols: z.array(z.string()).default([]), // Communication protocols (HTTP, gRPC, WebSocket, etc.)
  formats: z.array(z.string()).default([]), // Data formats supported (JSON, XML, CSV, etc.)
  certifications: z.array(z.string()).default([]), // Security/compliance certifications

  // Performance characteristics
  performance: z
    .object({
      maxConcurrentTasks: z.number().int().positive().default(1),
      avgResponseTimeMs: z.number().positive().optional(),
      reliabilityScore: z.number().min(0).max(1).optional(), // 0.0 to 1.0
      throughputTasksPerHour: z.number().positive().optional(),
    })
    .optional(),
});

/**
 * Agent Operational State
 */
export const AgentStatusEnum = z.enum([
  'offline',
  'starting',
  'idle',
  'busy',
  'overloaded',
  'maintenance',
  'error',
  'stopping',
]);

export const AgentOperationalStateSchema = z.object({
  status: AgentStatusEnum.default('offline'),
  availability: z.number().min(0).max(1).default(1), // 0.0 to 1.0, current availability
  loadFactor: z.number().min(0).optional(), // Current load (can exceed 1.0 for overload)
  activeTasks: z.array(z.string()).default([]), // Currently executing task IDs
  queuedTasks: z.array(z.string()).default([]), // Queued task IDs
  lastHeartbeat: z.number().optional(), // Unix timestamp
  healthScore: z.number().min(0).max(1).optional(), // Overall health indicator

  // Resource utilization
  resourceUsage: z
    .object({
      cpuPercent: z.number().min(0).max(100).optional(),
      memoryPercent: z.number().min(0).max(100).optional(),
      diskPercent: z.number().min(0).max(100).optional(),
      networkBytesPerSecond: z.number().min(0).optional(),
    })
    .optional(),
});

/**
 * Agent Configuration
 */
export const AgentConfigurationSchema = z.object({
  // Deployment configuration
  deployment: z
    .object({
      environment: z.string().optional(), // e.g., "development", "production"
      region: z.string().optional(),
      availabilityZone: z.string().optional(),
      nodeId: z.string().optional(),
      clusterId: z.string().optional(),
    })
    .optional(),

  // Runtime configuration
  runtime: z
    .object({
      maxMemoryMB: z.number().int().positive().optional(),
      maxCpuCores: z.number().positive().optional(),
      timeoutMs: z.number().int().positive().optional(),
      environmentVariables: z.record(z.string()).optional(),
      secrets: z.array(z.string()).optional(),
    })
    .optional(),

  // Communication configuration
  communication: z
    .object({
      endpoints: z
        .array(
          z.object({
            type: z.enum(['http', 'grpc', 'websocket', 'message-queue']),
            address: z.string(),
            port: z.number().int().positive().optional(),
            protocol: z.string().optional(),
            authentication: z
              .object({
                type: z.enum(['none', 'basic', 'bearer', 'oauth2', 'mtls']),
                credentials: z.record(z.string()).optional(),
              })
              .optional(),
          }),
        )
        .default([]),
      heartbeatIntervalMs: z.number().int().positive().default(30000),
      timeoutMs: z.number().int().positive().default(5000),
    })
    .optional(),

  // Scheduling configuration
  scheduling: z
    .object({
      strategy: z
        .enum(['fifo', 'priority', 'fair-share', 'round-robin'])
        .default('priority'),
      maxQueueSize: z.number().int().positive().default(100),
      taskSelectionCriteria: z.array(z.string()).default([]),
      workingHours: z
        .object({
          timezone: z.string().optional(),
          schedule: z.string().optional(), // Cron-like schedule
        })
        .optional(),
    })
    .optional(),
});

/**
 * Agent Genkit Integration
 */
export const AgentGenkitSchema = z.object({
  genkitAgentId: z.string().optional(), // Genkit Agent identifier
  flows: z.array(z.string()).default([]), // Genkit Flow IDs this agent can execute
  tools: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        schema: z.record(z.any()).optional(),
        endpoint: z.string().optional(),
      }),
    )
    .default([]),

  // AI-specific configuration
  aiConfig: z
    .object({
      defaultModel: z.string().optional(),
      temperature: z.number().min(0).max(2).optional(),
      maxTokens: z.number().int().positive().optional(),
      topP: z.number().min(0).max(1).optional(),
      frequencyPenalty: z.number().min(-2).max(2).optional(),
      presencePenalty: z.number().min(-2).max(2).optional(),
    })
    .optional(),
});

/**
 * Agent Metrics and Analytics
 */
export const AgentMetricsSchema = z.object({
  // Performance metrics
  performance: z
    .object({
      totalTasksExecuted: z.number().int().min(0).default(0),
      totalTasksSuccessful: z.number().int().min(0).default(0),
      totalTasksFailed: z.number().int().min(0).default(0),
      avgExecutionTimeMs: z.number().positive().optional(),
      avgQueueTimeMs: z.number().positive().optional(),
      uptimeSeconds: z.number().min(0).default(0),
    })
    .default({}),

  // Resource metrics
  resources: z
    .object({
      peakMemoryUsageMB: z.number().positive().optional(),
      peakCpuUsagePercent: z.number().min(0).max(100).optional(),
      totalNetworkBytesTransferred: z.number().min(0).default(0),
      totalStorageBytesUsed: z.number().min(0).default(0),
    })
    .default({}),

  // Cost metrics
  cost: z
    .object({
      totalCostUSD: z.number().min(0).default(0),
      costPerTask: z.number().min(0).optional(),
      costPerHour: z.number().min(0).optional(),
      billingPeriodStart: z.number().optional(),
      billingPeriodEnd: z.number().optional(),
    })
    .default({}),
});

/**
 * Agent Metadata and Audit
 */
export const AgentMetadataSchema = z.object({
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
      apiDocs: z.string().optional(), // URL or content
      examples: z
        .array(
          z.object({
            name: z.string(),
            description: z.string().optional(),
            code: z.string().optional(),
            url: z.string().optional(),
          }),
        )
        .default([]),
    })
    .optional(),
});

/**
 * Agent Security and Compliance
 */
export const AgentSecuritySchema = z.object({
  // Authentication and authorization
  authentication: z
    .object({
      required: z.boolean().default(true),
      methods: z
        .array(z.enum(['basic', 'bearer', 'oauth2', 'mtls', 'api-key']))
        .default([]),
      roles: z.array(z.string()).default([]),
      permissions: z.array(z.string()).default([]),
    })
    .optional(),

  // Network security
  network: z
    .object({
      allowedSources: z.array(z.string()).default([]), // IP ranges or hostnames
      deniedSources: z.array(z.string()).default([]),
      tlsRequired: z.boolean().default(true),
      certificateIds: z.array(z.string()).default([]),
    })
    .optional(),

  // Data security
  data: z
    .object({
      encryptionAtRest: z.boolean().default(false),
      encryptionInTransit: z.boolean().default(true),
      dataClassification: z
        .enum(['public', 'internal', 'confidential', 'restricted'])
        .optional(),
      retentionPolicyDays: z.number().int().positive().optional(),
      piiHandling: z.boolean().default(false),
    })
    .optional(),

  // Compliance
  compliance: z
    .object({
      frameworks: z.array(z.string()).default([]), // e.g., ["SOC2", "GDPR", "HIPAA"]
      auditRequired: z.boolean().default(false),
      lastAuditDate: z.number().optional(),
      complianceNotes: z.string().optional(),
    })
    .optional(),
});

/**
 * Agent Health Check Schema
 */
export const AgentHealthCheckSchema = z.object({
  id: z.string().uuid(),
  agentId: z.string(),
  timestamp: z
    .number()
    .int()
    .positive()
    .default(() => Date.now()),
  status: z.enum(['healthy', 'degraded', 'unhealthy', 'unknown']),

  checks: z
    .array(
      z.object({
        name: z.string(),
        status: z.enum(['pass', 'warn', 'fail']),
        output: z.string().optional(),
        duration: z.number().optional(), // Check execution time in ms
      }),
    )
    .default([]),

  details: z
    .object({
      version: z.string().optional(),
      uptime: z.number().optional(),
      dependencies: z
        .array(
          z.object({
            name: z.string(),
            status: z.enum(['available', 'degraded', 'unavailable']),
            responseTime: z.number().optional(),
          }),
        )
        .optional(),
    })
    .optional(),
});

/**
 * Complete Agent Schema - Engineering Implementation
 *
 * This combines all the component schemas into a complete Agent definition
 * suitable for NestJS Controllers, Genkit integration, and concrete class implementation.
 */
export const AgentSchema = z.object({
  // Core identity and classification
  ...AgentIdentitySchema.shape,

  // Capabilities and skills
  capabilities: AgentCapabilitiesSchema,

  // Operational state
  operationalState: AgentOperationalStateSchema,

  // Configuration
  configuration: AgentConfigurationSchema.optional(),

  // Genkit integration
  genkit: AgentGenkitSchema.optional(),

  // Metrics and analytics
  metrics: AgentMetricsSchema.optional(),

  // Metadata and audit
  metadata: AgentMetadataSchema,

  // Security and compliance
  security: AgentSecuritySchema.optional(),
});

export type Agent = z.infer<typeof AgentSchema>;

/**
 * Agent Creation Schema - For API endpoints
 */
export const CreateAgentSchema = AgentSchema.omit({
  id: true,
  metadata: true,
  operationalState: true,
  metrics: true,
}).extend({
  metadata: AgentMetadataSchema.partial().optional(),
});

export type CreateAgent = z.infer<typeof CreateAgentSchema>;

/**
 * Agent Update Schema - For API endpoints
 */
export const UpdateAgentSchema = AgentSchema.partial()
  .omit({
    id: true,
    metadata: true,
  })
  .extend({
    metadata: AgentMetadataSchema.pick({
      updatedAt: true,
      lastModifiedBy: true,
      auditLog: true,
      labels: true,
      annotations: true,
    })
      .partial()
      .optional(),
  });

export type UpdateAgent = z.infer<typeof UpdateAgentSchema>;

/**
 * Agent Query Schema - For search/filter operations
 */
export const AgentQuerySchema = z.object({
  ids: z.array(z.string()).optional(),
  types: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  statuses: z.array(AgentStatusEnum).optional(),
  skills: z.array(z.string()).optional(),
  regions: z.array(z.string()).optional(),
  availabilityMin: z.number().min(0).max(1).optional(),
  loadFactorMax: z.number().min(0).optional(),
  healthScoreMin: z.number().min(0).max(1).optional(),
  createdAfter: z.number().optional(),
  createdBefore: z.number().optional(),
  labels: z.record(z.string()).optional(),
  limit: z.number().int().positive().max(1000).default(100),
  offset: z.number().int().min(0).default(0),
  sortBy: z
    .enum([
      'createdAt',
      'updatedAt',
      'name',
      'status',
      'loadFactor',
      'healthScore',
    ])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type AgentQuery = z.infer<typeof AgentQuerySchema>;

/**
 * Agent Event Schema
 */
export const AgentEventSchema = z.object({
  id: z.string().uuid(),
  agentId: z.string(),
  type: z.enum([
    'created',
    'started',
    'stopped',
    'status-changed',
    'task-assigned',
    'task-completed',
    'task-failed',
    'health-check',
    'configuration-updated',
    'error',
  ]),
  timestamp: z
    .number()
    .int()
    .positive()
    .default(() => Date.now()),
  data: z.record(z.any()).optional(),
  source: z.string().optional(), // Component that generated the event
  severity: z
    .enum(['debug', 'info', 'warn', 'error', 'critical'])
    .default('info'),
});

export type AgentEvent = z.infer<typeof AgentEventSchema>;
