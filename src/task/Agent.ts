import { Injectable } from '@nestjs/common';
import {
  AgentSchema,
  type Agent as AgentType,
  type AgentEvent,
} from './schema/agent';

// Simple health check type for agent monitoring
type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

interface SimpleHealthCheck {
  id: string;
  agentId: string;
  timestamp: number;
  status: HealthStatus;
  checks: Record<string, boolean>;
  details?: Record<string, unknown>;
}

/**
 * Agent - Concrete implementation class
 *
 * Represents a computational actor/worker that can execute tasks.
 * This is the engineering realization of the philosophical Agent concept,
 * designed for NestJS and Genkit integration.
 */
@Injectable()
export class Agent {
  private _data: AgentType;

  constructor(data: AgentType) {
    this._data = AgentSchema.parse(data);
  }

  // Core Properties
  get id(): string {
    return this._data.id;
  }

  get name(): string {
    return this._data.name;
  }

  get description(): string | undefined {
    return this._data.description;
  }

  get type(): string {
    return this._data.type;
  }

  get category(): string | undefined {
    return this._data.category;
  }

  get version(): string {
    return this._data.version;
  }

  get tags(): string[] {
    return this._data.tags;
  }

  // Capabilities
  get capabilities() {
    return this._data.capabilities;
  }

  get skills(): string[] {
    return this._data.capabilities.skills;
  }

  get tools(): string[] {
    return this._data.capabilities.tools;
  }

  get models(): string[] {
    return this._data.capabilities.models;
  }

  get languages(): string[] {
    return this._data.capabilities.languages;
  }

  get protocols(): string[] {
    return this._data.capabilities.protocols;
  }

  get performance() {
    return this._data.capabilities.performance;
  }

  // Operational State
  get operationalState() {
    return this._data.operationalState;
  }

  get status() {
    return this._data.operationalState.status;
  }

  get availability(): number {
    return this._data.operationalState.availability;
  }

  get loadFactor(): number | undefined {
    return this._data.operationalState.loadFactor;
  }

  get activeTasks(): string[] {
    return this._data.operationalState.activeTasks;
  }

  get queuedTasks(): string[] {
    return this._data.operationalState.queuedTasks;
  }

  get healthScore(): number | undefined {
    return this._data.operationalState.healthScore;
  }

  get lastHeartbeat(): number | undefined {
    return this._data.operationalState.lastHeartbeat;
  }

  // Configuration
  get configuration() {
    return this._data.configuration;
  }

  // Genkit Integration
  get genkit() {
    return this._data.genkit;
  }

  get genkitAgentId(): string | undefined {
    return this._data.genkit?.genkitAgentId;
  }

  get genkitFlows(): string[] {
    return this._data.genkit?.flows || [];
  }

  get genkitTools() {
    return this._data.genkit?.tools || [];
  }

  get aiConfig() {
    return this._data.genkit?.aiConfig;
  }

  // Metrics
  get metrics() {
    return this._data.metrics;
  }

  // Metadata
  get metadata() {
    return this._data.metadata;
  }

  get createdAt(): number {
    return this._data.metadata.createdAt;
  }

  get updatedAt(): number {
    return this._data.metadata.updatedAt;
  }

  get createdBy(): string | undefined {
    return this._data.metadata.createdBy;
  }

  get labels(): Record<string, string> | undefined {
    return this._data.metadata.labels;
  }

  // Security
  get security() {
    return this._data.security;
  }

  // Raw data access
  get data(): AgentType {
    return this._data;
  }

  // State Management Methods
  updateStatus(status: AgentType['operationalState']['status']): void {
    this._data.operationalState.status = status;
    this._data.operationalState.lastHeartbeat = Date.now();
    this._data.metadata.updatedAt = Date.now();

    // Add audit log entry
    this._data.metadata.auditLog.push({
      timestamp: Date.now(),
      action: `status_changed_to_${status}`,
    });
  }

  updateAvailability(availability: number): void {
    this._data.operationalState.availability = Math.max(
      0,
      Math.min(1, availability),
    );
    this._data.metadata.updatedAt = Date.now();
  }

  updateLoadFactor(loadFactor: number): void {
    this._data.operationalState.loadFactor = Math.max(0, loadFactor);
    this._data.metadata.updatedAt = Date.now();
  }

  updateHealthScore(healthScore: number): void {
    this._data.operationalState.healthScore = Math.max(
      0,
      Math.min(1, healthScore),
    );
    this._data.metadata.updatedAt = Date.now();
  }

  heartbeat(): void {
    this._data.operationalState.lastHeartbeat = Date.now();
    this._data.metadata.updatedAt = Date.now();
  }

  assignTask(taskId: string): void {
    if (!this._data.operationalState.activeTasks.includes(taskId)) {
      this._data.operationalState.activeTasks.push(taskId);
      this._data.metadata.updatedAt = Date.now();
    }
  }

  unassignTask(taskId: string): void {
    const index = this._data.operationalState.activeTasks.indexOf(taskId);
    if (index > -1) {
      this._data.operationalState.activeTasks.splice(index, 1);
      this._data.metadata.updatedAt = Date.now();
    }
  }

  queueTask(taskId: string): void {
    if (!this._data.operationalState.queuedTasks.includes(taskId)) {
      this._data.operationalState.queuedTasks.push(taskId);
      this._data.metadata.updatedAt = Date.now();
    }
  }

  dequeueTask(taskId: string): void {
    const index = this._data.operationalState.queuedTasks.indexOf(taskId);
    if (index > -1) {
      this._data.operationalState.queuedTasks.splice(index, 1);
      this._data.metadata.updatedAt = Date.now();
    }
  }

  addLabel(key: string, value: string): void {
    if (!this._data.metadata.labels) {
      this._data.metadata.labels = {};
    }
    this._data.metadata.labels[key] = value;
    this._data.metadata.updatedAt = Date.now();
  }

  removeLabel(key: string): void {
    if (this._data.metadata.labels) {
      delete this._data.metadata.labels[key];
      this._data.metadata.updatedAt = Date.now();
    }
  }

  // Capability Management
  hasSkill(skill: string): boolean {
    return this._data.capabilities.skills.includes(skill);
  }

  hasTool(tool: string): boolean {
    return this._data.capabilities.tools.includes(tool);
  }

  hasModel(model: string): boolean {
    return this._data.capabilities.models.includes(model);
  }

  addSkill(skill: string): void {
    if (!this._data.capabilities.skills.includes(skill)) {
      this._data.capabilities.skills.push(skill);
      this._data.metadata.updatedAt = Date.now();
    }
  }

  removeSkill(skill: string): void {
    const index = this._data.capabilities.skills.indexOf(skill);
    if (index > -1) {
      this._data.capabilities.skills.splice(index, 1);
      this._data.metadata.updatedAt = Date.now();
    }
  }

  addTool(tool: string): void {
    if (!this._data.capabilities.tools.includes(tool)) {
      this._data.capabilities.tools.push(tool);
      this._data.metadata.updatedAt = Date.now();
    }
  }

  removeTool(tool: string): void {
    const index = this._data.capabilities.tools.indexOf(tool);
    if (index > -1) {
      this._data.capabilities.tools.splice(index, 1);
      this._data.metadata.updatedAt = Date.now();
    }
  }

  // Performance Metrics
  updatePerformanceMetrics(
    metrics: Partial<NonNullable<AgentType['metrics']>['performance']>,
  ): void {
    if (!this._data.metrics) {
      this._data.metrics = {
        performance: {
          totalTasksExecuted: 0,
          totalTasksSuccessful: 0,
          totalTasksFailed: 0,
          uptimeSeconds: 0,
        },
        resources: {
          totalNetworkBytesTransferred: 0,
          totalStorageBytesUsed: 0,
        },
        cost: {
          totalCostUSD: 0,
        },
      };
    }

    this._data.metrics.performance = {
      ...this._data.metrics.performance,
      ...metrics,
    };
    this._data.metadata.updatedAt = Date.now();
  }

  incrementTaskCount(successful: boolean): void {
    if (!this._data.metrics) {
      this._data.metrics = {
        performance: {
          totalTasksExecuted: 0,
          totalTasksSuccessful: 0,
          totalTasksFailed: 0,
          uptimeSeconds: 0,
        },
        resources: {
          totalNetworkBytesTransferred: 0,
          totalStorageBytesUsed: 0,
        },
        cost: {
          totalCostUSD: 0,
        },
      };
    }

    this._data.metrics.performance.totalTasksExecuted += 1;
    if (successful) {
      this._data.metrics.performance.totalTasksSuccessful += 1;
    } else {
      this._data.metrics.performance.totalTasksFailed += 1;
    }
    this._data.metadata.updatedAt = Date.now();
  }

  // Validation and Transformation
  static create(data: Partial<AgentType>): Agent {
    const agentData: AgentType = {
      id: data.id || crypto.randomUUID(),
      name: data.name || 'Untitled Agent',
      type: data.type || 'ai-worker',
      version: '1.0.0',
      tags: [],
      capabilities: {
        skills: [],
        tools: [],
        models: [],
        languages: [],
        protocols: [],
        formats: [],
        certifications: [],
      },
      operationalState: {
        status: 'offline',
        availability: 1.0,
        activeTasks: [],
        queuedTasks: [],
      },
      metadata: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        auditLog: [],
      },
      ...data,
    };

    return new Agent(agentData);
  }

  update(updates: Partial<AgentType>): Agent {
    const updatedData = {
      ...this._data,
      ...updates,
      metadata: {
        ...this._data.metadata,
        ...updates.metadata,
        updatedAt: Date.now(),
      },
    };

    return new Agent(updatedData);
  }

  // Health Check
  createHealthCheck(): SimpleHealthCheck {
    return {
      id: crypto.randomUUID(),
      agentId: this.id,
      timestamp: Date.now(),
      status: this.determineHealthStatus(),
      checks: this.runHealthChecks(),
      details: {
        version: this.version,
        uptime: this.getUptime(),
      },
    };
  }

  private determineHealthStatus(): HealthStatus {
    if (this.status === 'error') return 'unhealthy';
    if (this.status === 'maintenance') return 'degraded';
    if (this.status === 'overloaded') return 'degraded';
    if (this.healthScore !== undefined && this.healthScore < 0.5)
      return 'unhealthy';
    if (this.healthScore !== undefined && this.healthScore < 0.8)
      return 'degraded';
    return 'healthy';
  }

  private runHealthChecks(): Record<string, boolean> {
    const checks: Record<string, boolean> = {};

    // Basic status check
    checks.status =
      this.status === 'idle' ||
      this.status === 'busy' ||
      this.status === 'starting';

    // Load factor check
    if (this.loadFactor !== undefined) {
      checks.load_factor = this.loadFactor <= 1;
    }

    // Heartbeat check
    const heartbeatAge = this.lastHeartbeat
      ? Date.now() - this.lastHeartbeat
      : undefined;
    if (heartbeatAge !== undefined) {
      checks.heartbeat = heartbeatAge < 60000; // 1 minute
    }

    return checks;
  }

  private getUptime(): number {
    return Date.now() - this.createdAt;
  }

  // Event Creation
  createEvent(
    type: AgentEvent['type'],
    data?: Record<string, any>,
    source?: string,
  ): AgentEvent {
    return {
      id: crypto.randomUUID(),
      agentId: this.id,
      type,
      timestamp: Date.now(),
      data,
      source,
      severity: type === 'error' ? 'error' : 'info',
    };
  }

  // Genkit Integration Helpers
  isGenkitAgent(): boolean {
    return !!this._data.genkit?.genkitAgentId;
  }

  getGenkitConfig(): Record<string, any> {
    return this._data.genkit?.aiConfig || {};
  }

  // Utility Methods
  isOnline(): boolean {
    return ['idle', 'busy'].includes(this.status);
  }

  isAvailable(): boolean {
    return this.status === 'idle' && this.availability > 0;
  }

  isBusy(): boolean {
    return this.status === 'busy';
  }

  isOverloaded(): boolean {
    return this.status === 'overloaded';
  }

  canAcceptTask(): boolean {
    return (
      this.isAvailable() &&
      this.activeTasks.length < (this.performance?.maxConcurrentTasks || 1)
    );
  }

  // Serialization
  toJSON(): AgentType {
    return this._data;
  }

  toString(): string {
    return `Agent(${this.id}): ${this.name} [${this.status}]`;
  }
}
