/**
 * Task Module - Concrete Classes
 *
 * This module provides the concrete implementation classes for the NeoVM-TaskD system.
 * These classes implement the engineering schemas and provide the business logic
 * for Task, Agent, and Workflow entities.
 */

// Core concrete classes
export { Task } from './Task';
export { Agent } from './Agent';
export { Workflow } from './Workflow';

// Re-export schemas for convenience
export * from './schema';

/**
 * Class Architecture Overview
 *
 * The concrete classes follow the naming convention from src/form, dropping
 * the 'Schema' suffix from the schema names. Each class provides:
 *
 * 1. Task Class - Computational work units
 *    - Manages execution state and lifecycle
 *    - Genkit Step() integration
 *    - Resource requirements and constraints
 *    - Event generation and audit trails
 *
 * 2. Agent Class - Computational actors/workers
 *    - Capability and skill management
 *    - Operational state tracking
 *    - Health monitoring and metrics
 *    - Task assignment and queue management
 *
 * 3. Workflow Class - Process orchestration
 *    - DAG-based step execution
 *    - Genkit Flow integration
 *    - Progress tracking and state management
 *    - Scheduling and trigger management
 *
 * Design Patterns:
 *
 * - Validation: All classes validate input using Zod schemas
 * - Immutability: Update methods return new instances
 * - Events: Rich event generation for observability
 * - Builder Pattern: Static create() methods for construction
 * - Type Safety: Full TypeScript type inference
 *
 * Integration Points:
 *
 * - NestJS: Classes are Injectable services
 * - Genkit: Native integration with flows, steps, and tools
 * - Observability: Built-in metrics, logging, and tracing
 * - Persistence: JSON serialization for storage
 */
