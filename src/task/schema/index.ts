/**
 * Task Schema Module - Engineering Implementation Summary
 *
 * This module provides the complete set of engineering-focused Zod schemas
 * for the NeoVM-TaskD system, transforming the philosophical foundation
 * from definition.ts into practical, implementation-ready schemas.
 */

// Core schemas
export * from './task';
export * from './agent';
export * from './workflow';

// Keep the philosophical foundation available for reference
// Re-export definition schemas with explicit names to avoid conflicts
export {
  TaskDefinitionSchema as PhilosophicalTaskDefinitionSchema,
  AgentDefinitionSchema as PhilosophicalAgentDefinitionSchema,
  WorkflowDefinitionSchema as PhilosophicalWorkflowDefinitionSchema,
  IntegratedPlatformSchema,
  ArchitectonicReasonSchema,
  type TaskDefinition as PhilosophicalTaskDefinition,
  type AgentDefinition as PhilosophicalAgentDefinition,
  type WorkflowDefinition as PhilosophicalWorkflowDefinition,
  type IntegratedPlatform,
  type ArchitectonicReason,
} from './definition';

/**
 * Schema Architecture Overview
 *
 * The engineering schemas are organized into three main entities that form
 * the practical implementation of the BEC-MVC-TAW architectonic:
 *
 * 1. Task (task.ts) - The "Being" of computational work
 *    - Represents atomic units of work
 *    - Includes execution state, I/O, resources, metadata
 *    - Designed for NestJS controllers and Genkit integration
 *    - SystemD-style service management properties
 *
 * 2. Agent (agent.ts) - The "Entity" that executes work
 *    - Represents computational actors/workers
 *    - Includes capabilities, operational state, configuration
 *    - Health monitoring and metrics collection
 *    - Security and compliance features
 *
 * 3. Workflow (workflow.ts) - The "Container" that orchestrates
 *    - Represents complex multi-step processes
 *    - DAG-based execution with sophisticated scheduling
 *    - Genkit flow integration and AI step support
 *    - Comprehensive monitoring and observability
 *
 * Design Principles:
 *
 * - API-First: All schemas designed for REST/GraphQL APIs
 * - Framework Integration: NestJS and Genkit compatibility
 * - Production-Ready: Security, monitoring, audit trails
 * - Extensible: Plugin architecture through configuration
 * - Observable: Comprehensive metrics and logging support
 * - Scalable: Distributed execution and resource management
 *
 * Next Steps for Implementation:
 *
 * 1. Create concrete classes in src/task/:
 *    - TaskService (business logic)
 *    - TaskController (NestJS REST API)
 *    - TaskRepository (data persistence)
 *    - TaskExecutor (execution engine)
 *
 * 2. Similarly for Agent and Workflow modules
 *
 * 3. Integration layers:
 *    - Genkit flow adapters
 *    - Event sourcing/CQRS patterns
 *    - Distributed messaging
 *    - Observability stack integration
 */
