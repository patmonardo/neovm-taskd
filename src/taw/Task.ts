import { Injectable } from '@nestjs/common';
import {
  TaskDefinitionSchema,
  type TaskDefinition as TaskType,
  type TaskEvent,
} from './schema/task';

/**
 * Task - Simple/Immediate Model Implementation
 *
 * Tasks represent simple, immediate determinations of Models in MVC.
 * They are "Being" - immediate, simple data structures that get
 * presented to Purusha through the Workflow/Controller interface.
 *
 * Key principles:
 * - Simple and immediate (no complexity)
 * - Pure model/data layer
 * - No complex operations (handled by Agents)
 * - Direct, straightforward state
 */
@Injectable()
export class Task {
  private _data: TaskType;

  constructor(data: TaskType) {
    this._data = TaskDefinitionSchema.parse(data);
  }

  // Core Properties - Simple/Immediate
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

  // Simple Structure - Being/Immediate
  get data(): Record<string, any> | undefined {
    return this._data.data;
  }

  get parameters(): Record<string, any> | undefined {
    return this._data.parameters;
  }

  get dependencies(): string[] {
    return this._data.dependencies || [];
  }

  // Simple State - Being/Immediate
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

  // Simple Input/Output
  get input(): Record<string, any> | undefined {
    return this._data.input;
  }

  get output(): Record<string, any> | undefined {
    return this._data.output;
  }

  // Metadata
  get createdAt(): number {
    return this._data.createdAt;
  }

  get updatedAt(): number {
    return this._data.updatedAt;
  }

  // Raw data access
  get rawData(): TaskType {
    return this._data;
  }

  // Simple State Management Methods
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

  setData(data: Record<string, any>): void {
    this._data.data = data;
    this._data.updatedAt = Date.now();
  }

  setInput(input: Record<string, any>): void {
    this._data.input = input;
    this._data.updatedAt = Date.now();
  }

  setOutput(output: Record<string, any>): void {
    this._data.output = output;
    this._data.updatedAt = Date.now();
  }

  // Simple Validation and Creation
  static create(data: Partial<TaskType>): Task {
    const taskData: TaskType = {
      id: data.id || crypto.randomUUID(),
      name: data.name || 'Untitled Task',
      type: data.type || 'data',
      status: 'created',
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

  // Simple Event Creation
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

  // Simple Utility Methods
  isReady(): boolean {
    return this.status === 'ready';
  }

  isProcessing(): boolean {
    return this.status === 'processing';
  }

  isCompleted(): boolean {
    return this.status === 'completed';
  }

  isFailed(): boolean {
    return this.status === 'failed';
  }

  isCreated(): boolean {
    return this.status === 'created';
  }

  // Simple Serialization
  toJSON(): TaskType {
    return this._data;
  }

  toString(): string {
    return `Task(${this.id}): ${this.name} [${this.status}]`;
  }
}
