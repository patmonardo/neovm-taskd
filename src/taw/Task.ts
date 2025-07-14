import { Injectable } from '@nestjs/common';
import {
  TaskDefinitionSchema,
  type TaskDefinition as TaskType,
  type TaskEvent,
} from './schema/task';

/**
 * Task - Concrete implementation class
 *
 * Represents a computational unit of work that can be executed
 * by agents within workflows. This is the engineering realization
 * of the philosophical Task concept, designed for NestJS and Genkit integration.
 */
@Injectable()
export class Task {
  private _data: TaskType;

  constructor(data: TaskType) {
    this._data = TaskDefinitionSchema.parse(data);
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

  get tags(): string[] {
    return this._data.tags || [];
  }

  get version(): string {
    return this._data.version;
  }

  // Structure and Dependencies
  get steps(): string[] {
    return this._data.steps || [];
  }

  get dependencies(): string[] {
    return this._data.dependencies || [];
  }

  get agentId(): string | undefined {
    return this._data.agentId;
  }

  get workflowId(): string | undefined {
    return this._data.workflowId;
  }

  get priority(): number {
    return this._data.priority;
  }

  // Execution State
  get status() {
    return this._data.status;
  }

  get result(): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._data.result;
  }

  get error(): string | undefined {
    return this._data.error;
  }

  // Runtime Configuration
  get config(): Record<string, any> | undefined {
    return this._data.config;
  }

  get timeout(): number | undefined {
    return this._data.timeout;
  }

  get retries(): number {
    return this._data.retries;
  }

  // Input/Output Schema
  get inputSchema(): Record<string, any> | undefined {
    return this._data.inputSchema;
  }

  get outputSchema(): Record<string, any> | undefined {
    return this._data.outputSchema;
  }

  // Genkit Integration
  get genkitStep(): string | undefined {
    return this._data.genkitStep;
  }

  get genkitFlow(): string | undefined {
    return this._data.genkitFlow;
  }

  // Resource Requirements
  get resources() {
    return this._data.resources;
  }

  // Metadata
  get createdAt(): number {
    return this._data.createdAt || Date.now();
  }

  get updatedAt(): number {
    return this._data.updatedAt || Date.now();
  }

  get author(): string | undefined {
    return this._data.author;
  }

  // SystemD-style Service Properties
  get serviceType() {
    return this._data.serviceType;
  }

  get restartPolicy() {
    return this._data.restartPolicy;
  }

  // Raw data access
  get data(): TaskType {
    return this._data;
  }

  // State Management Methods
  updateStatus(status: TaskType['status']): void {
    this._data.status = status;
    this._data.updatedAt = Date.now();
  }

  setResult(result: any): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this._data.result = result;
    this._data.status = 'completed';
    this._data.updatedAt = Date.now();
  }

  setError(error: string | Error): void {
    this._data.error = typeof error === 'string' ? error : error.message;
    this._data.status = 'failed';
    this._data.updatedAt = Date.now();
  }

  incrementRetry(): void {
    this._data.retries += 1;
    this._data.updatedAt = Date.now();
  }

  // Validation and Transformation
  static create(data: Partial<TaskType>): Task {
    const taskData: TaskType = {
      id: data.id || crypto.randomUUID(),
      name: data.name || 'Untitled Task',
      type: data.type || 'computation',
      status: 'pending',
      retries: 0,
      priority: 0,
      version: '1.0.0',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...data,
    };

    return new Task(taskData);
  }

  update(updates: Partial<TaskType>): Task {
    const updatedData = {
      ...this._data,
      ...updates,
      updatedAt: Date.now(),
    };

    return new Task(updatedData);
  }

  // Event Creation
  createEvent(type: TaskEvent['type'], data?: any, source?: string): TaskEvent {
    return {
      id: crypto.randomUUID(),
      taskId: this.id,
      type,
      timestamp: Date.now(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
      source,
    };
  }

  // Genkit Integration Helpers
  isGenkitTask(): boolean {
    return !!(this._data.genkitStep || this._data.genkitFlow);
  }

  // Resource Management
  hasResourceRequirements(): boolean {
    return !!this._data.resources;
  }

  getResourceRequirements() {
    return this._data.resources;
  }

  // Utility Methods
  isRunning(): boolean {
    return this.status === 'running';
  }

  isCompleted(): boolean {
    return this.status === 'completed';
  }

  isFailed(): boolean {
    return this.status === 'failed';
  }

  isPending(): boolean {
    return this.status === 'pending';
  }

  isCancelled(): boolean {
    return this.status === 'cancelled';
  }

  // Serialization
  toJSON(): TaskType {
    return this._data;
  }

  toString(): string {
    return `Task(${this.id}): ${this.name} [${this.status}]`;
  }
}
