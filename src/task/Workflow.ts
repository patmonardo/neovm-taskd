import { Injectable } from '@nestjs/common';
import {
  WorkflowSchema,
  type Workflow as WorkflowType,
  type ExecuteWorkflow,
  type WorkflowEvent,
} from './schema/workflow';

/**
 * Workflow - Concrete implementation class
 *
 * Represents a complex multi-step process that orchestrates tasks through agents.
 * This is the engineering realization of the philosophical Workflow concept,
 * designed for NestJS and Genkit integration.
 */
@Injectable()
export class Workflow {
  private _data: WorkflowType;

  constructor(data: WorkflowType) {
    this._data = WorkflowSchema.parse(data);
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

  // Definition and Structure
  get definition() {
    return this._data.definition;
  }

  get steps() {
    return this._data.definition.steps;
  }

  get startStep(): string {
    return this._data.definition.startStep;
  }

  get endSteps(): string[] {
    return this._data.definition.endSteps;
  }

  get flowType() {
    return this._data.definition.flowType;
  }

  get maxConcurrency(): number | undefined {
    return this._data.definition.maxConcurrency;
  }

  // Execution State
  get executionState() {
    return this._data.executionState;
  }

  get status() {
    return this._data.executionState.status;
  }

  get progress() {
    return this._data.executionState.progress;
  }

  get startedAt(): number | undefined {
    return this._data.executionState.startedAt;
  }

  get completedAt(): number | undefined {
    return this._data.executionState.completedAt;
  }

  get currentStep(): string | undefined {
    return this._data.executionState.currentStep;
  }

  get activeSteps(): string[] {
    return this._data.executionState.activeSteps;
  }

  get waitingSteps(): string[] {
    return this._data.executionState.waitingSteps;
  }

  get stepStates() {
    return this._data.executionState.stepStates;
  }

  get variables(): Record<string, any> | undefined {
    return this._data.executionState.variables;
  }

  get outputs(): Record<string, any> | undefined {
    return this._data.executionState.outputs;
  }

  // Scheduling
  get scheduling() {
    return this._data.scheduling;
  }

  get triggers() {
    return this._data.scheduling?.triggers || [];
  }

  // Genkit Integration
  get genkit() {
    return this._data.genkit;
  }

  get genkitFlowId(): string | undefined {
    return this._data.genkit?.genkitFlowId;
  }

  get subflows() {
    return this._data.genkit?.subflows || [];
  }

  get aiSteps() {
    return this._data.genkit?.aiSteps || [];
  }

  // Resources
  get resources() {
    return this._data.resources;
  }

  // Monitoring
  get monitoring() {
    return this._data.monitoring;
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

  // Raw data access
  get data(): WorkflowType {
    return this._data;
  }

  // State Management Methods
  updateStatus(status: WorkflowType['executionState']['status']): void {
    this._data.executionState.status = status;
    this._data.metadata.updatedAt = Date.now();

    if (status === 'running' && !this._data.executionState.startedAt) {
      this._data.executionState.startedAt = Date.now();
    }

    if (['completed', 'failed', 'cancelled'].includes(status)) {
      this._data.executionState.completedAt = Date.now();
    }

    // Add audit log entry
    this._data.metadata.auditLog.push({
      timestamp: Date.now(),
      action: `status_changed_to_${status}`,
    });
  }

  updateProgress(): void {
    const totalSteps = this._data.definition.steps.length;
    const completedSteps = Object.values(
      this._data.executionState.stepStates,
    ).filter((state) => state.status === 'completed').length;
    const failedSteps = Object.values(
      this._data.executionState.stepStates,
    ).filter((state) => state.status === 'failed').length;
    const skippedSteps = Object.values(
      this._data.executionState.stepStates,
    ).filter((state) => state.status === 'skipped').length;

    this._data.executionState.progress = {
      totalSteps,
      completedSteps,
      failedSteps,
      skippedSteps,
      progressPercent: totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0,
    };

    this._data.metadata.updatedAt = Date.now();
  }

  setCurrentStep(stepId: string): void {
    this._data.executionState.currentStep = stepId;
    if (!this._data.executionState.activeSteps.includes(stepId)) {
      this._data.executionState.activeSteps.push(stepId);
    }
    this._data.metadata.updatedAt = Date.now();
  }

  updateStepState(
    stepId: string,
    state: Partial<WorkflowType['executionState']['stepStates'][string]>,
  ): void {
    if (!this._data.executionState.stepStates[stepId]) {
      this._data.executionState.stepStates[stepId] = {
        status: 'pending',
        retryCount: 0,
      };
    }

    this._data.executionState.stepStates[stepId] = {
      ...this._data.executionState.stepStates[stepId],
      ...state,
    };

    // Update active steps
    if (state.status === 'running') {
      if (!this._data.executionState.activeSteps.includes(stepId)) {
        this._data.executionState.activeSteps.push(stepId);
      }
    } else {
      const index = this._data.executionState.activeSteps.indexOf(stepId);
      if (index > -1) {
        this._data.executionState.activeSteps.splice(index, 1);
      }
    }

    this.updateProgress();
    this._data.metadata.updatedAt = Date.now();
  }

  setVariable(key: string, value: unknown): void {
    if (!this._data.executionState.variables) {
      this._data.executionState.variables = {};
    }
    this._data.executionState.variables[key] = value;
    this._data.metadata.updatedAt = Date.now();
  }

  getVariable(key: string): unknown {
    return this._data.executionState.variables?.[key];
  }

  setOutput(key: string, value: unknown): void {
    if (!this._data.executionState.outputs) {
      this._data.executionState.outputs = {};
    }
    this._data.executionState.outputs[key] = value;
    this._data.metadata.updatedAt = Date.now();
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

  // Step Management
  getStep(stepId: string) {
    return this._data.definition.steps.find((step) => step.id === stepId);
  }

  getStepState(stepId: string) {
    return this._data.executionState.stepStates[stepId];
  }

  isStepReady(stepId: string): boolean {
    const step = this.getStep(stepId);
    if (!step) return false;

    // Check dependencies
    for (const depId of step.dependsOn) {
      const depState = this.getStepState(depId);
      if (!depState || depState.status !== 'completed') {
        return false;
      }
    }

    return true;
  }

  getReadySteps(): string[] {
    return this._data.definition.steps
      .filter((step) => {
        const state = this.getStepState(step.id);
        return (
          (!state || state.status === 'pending') && this.isStepReady(step.id)
        );
      })
      .map((step) => step.id);
  }

  // Validation and Transformation
  static create(data: Partial<WorkflowType>): Workflow {
    const workflowData: WorkflowType = {
      id: data.id || crypto.randomUUID(),
      name: data.name || 'Untitled Workflow',
      type: data.type || 'dag',
      version: '1.0.0',
      tags: [],
      definition: {
        steps: [],
        startStep: '',
        endSteps: [],
        flowType: 'dag',
        ...data.definition,
      },
      executionState: {
        status: 'draft',
        progress: {
          totalSteps: 0,
          completedSteps: 0,
          failedSteps: 0,
          skippedSteps: 0,
          progressPercent: 0,
        },
        activeSteps: [],
        waitingSteps: [],
        stepStates: {},
        ...data.executionState,
      },
      metadata: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        versionHistory: [],
        auditLog: [],
        ...data.metadata,
      },
      ...data,
    };

    return new Workflow(workflowData);
  }

  update(updates: Partial<WorkflowType>): Workflow {
    const updatedData = {
      ...this._data,
      ...updates,
      metadata: {
        ...this._data.metadata,
        ...updates.metadata,
        updatedAt: Date.now(),
      },
    };

    return new Workflow(updatedData);
  }

  // Execution Management
  prepareExecution(request: ExecuteWorkflow): void {
    // Set initial variables
    if (request.variables) {
      this._data.executionState.variables = {
        ...this._data.executionState.variables,
        ...request.variables,
      };
    }

    // Apply configuration overrides
    if (request.config) {
      this._data.definition.globalConfig = {
        ...this._data.definition.globalConfig,
        ...request.config,
      };
    }

    // Set scheduling
    if (request.scheduledAt) {
      this._data.executionState.scheduledAt = request.scheduledAt;
    }

    this.updateStatus('pending');
  }

  start(): void {
    this.updateStatus('running');
    this.updateProgress();
  }

  pause(): void {
    this.updateStatus('paused');
  }

  resume(): void {
    this.updateStatus('running');
  }

  complete(outputs?: Record<string, any>): void {
    if (outputs) {
      this._data.executionState.outputs = {
        ...this._data.executionState.outputs,
        ...outputs,
      };
    }
    this.updateStatus('completed');
  }

  fail(error?: any): void {
    if (error) {
      this._data.metadata.auditLog.push({
        timestamp: Date.now(),
        action: 'workflow_failed',
        details: { error: String(error) },
      });
    }
    this.updateStatus('failed');
  }

  cancel(): void {
    this.updateStatus('cancelled');
  }

  // Event Creation
  createEvent(
    type: WorkflowEvent['type'],
    data?: Record<string, any>,
    source?: string,
    stepId?: string,
  ): WorkflowEvent {
    return {
      id: crypto.randomUUID(),
      workflowId: this.id,
      executionId: crypto.randomUUID(), // In practice, this would be the execution instance ID
      type,
      timestamp: Date.now(),
      stepId,
      data,
      source,
      severity: ['failed', 'step-failed', 'timeout'].includes(type)
        ? 'error'
        : 'info',
    };
  }

  // Genkit Integration Helpers
  isGenkitWorkflow(): boolean {
    return !!this._data.genkit?.genkitFlowId;
  }

  getGenkitConfig(): Record<string, any> {
    return this._data.genkit?.genkitConfig || {};
  }

  hasAISteps(): boolean {
    return this.aiSteps.length > 0;
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

  isPaused(): boolean {
    return this.status === 'paused';
  }

  isCancelled(): boolean {
    return this.status === 'cancelled';
  }

  isDraft(): boolean {
    return this.status === 'draft';
  }

  canStart(): boolean {
    return ['draft', 'pending'].includes(this.status);
  }

  canPause(): boolean {
    return this.status === 'running';
  }

  canResume(): boolean {
    return this.status === 'paused';
  }

  getDuration(): number | undefined {
    if (this.startedAt && this.completedAt) {
      return this.completedAt - this.startedAt;
    }
    return undefined;
  }

  // Serialization
  toJSON(): WorkflowType {
    return this._data;
  }

  toString(): string {
    return `Workflow(${this.id}): ${this.name} [${this.status}]`;
  }
}
