import { Injectable } from '@nestjs/common';
import {
  WorkflowSchema,
  type Workflow as WorkflowType,
} from './schema/workflow.js';

/**
 * Workflow - Controller/Monitor Implementation
 *
 * In TAW architecture:
 * - Workflow = Pure Program Code + Monitoring System
 * - Presents organized view (Sattva) to consciousness (Purusha)
 * - Monitors and coordinates Tasks and Agents
 * - Code that executes and observes itself
 *
 * Essence: This IS the program - executable code with built-in monitoring
 */
@Injectable()
export class Workflow {
  private _data: WorkflowType;

  constructor(data: Partial<WorkflowType>) {
    // Initialize with sensible defaults
    this._data = WorkflowSchema.parse({
      id: data.id || crypto.randomUUID(),
      name: data.name || 'Untitled Workflow',
      type: data.type || 'sequential',
      category: data.category || 'general',
      version: data.version || '1.0.0',
      tags: data.tags || [],
      definition: {
        steps: [],
        startStep: '',
        endSteps: [],
        flowType: 'sequential',
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
        currentStep: undefined,
        activeSteps: [],
        waitingSteps: [],
        stepStates: {},
        variables: {},
        outputs: {},
        ...data.executionState,
      },
      metadata: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        auditLog: [],
        labels: {},
        annotations: {},
        ...data.metadata,
      },
      // Include other optional schemas if provided
      ...data,
    });
  }

  // ============================================================
  // CORE PROPERTIES - PURE PROGRAM ESSENCE
  // ============================================================

  get id(): string {
    return this._data.id;
  }

  get name(): string {
    return this._data.name;
  }

  get type(): string {
    return this._data.type;
  }

  get status() {
    return this._data.executionState.status;
  }

  get progress() {
    return this._data.executionState.progress;
  }

  get steps() {
    return this._data.definition.steps;
  }

  get data(): WorkflowType {
    return this._data;
  }

  // ============================================================
  // PROGRAM EXECUTION - THE CODE ITSELF
  // ============================================================

  /**
   * Execute the workflow - This IS the program running
   */
  async execute(): Promise<void> {
    this.start();
    try {
      // Monitor execution state
      this.monitor('execution.started', { workflowId: this.id });
      const executableSteps = this.getExecutableSteps();
      for (const step of executableSteps) {
        await this.executeStep(step.id);
        // Monitor step completion
        this.monitor('step.completed', {
          stepId: step.id,
          progress: this.progress.progressPercent,
        });
      }
      this.complete();
      this.monitor('execution.completed', { workflowId: this.id });
    } catch (error) {
      this.fail(error instanceof Error ? error.message : String(error));
      this.monitor('execution.failed', {
        workflowId: this.id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Execute a single step - Code in action
   */
  async executeStep(stepId: string): Promise<any> {
    const step = this.getStep(stepId);
    if (!step) throw new Error(`Step ${stepId} not found`);
    if (!this.canExecuteStep(stepId)) {
      throw new Error(`Step ${stepId} cannot be executed - dependencies not met`);
    }

    // Monitor step start
    this.monitor('step.started', { stepId, stepName: step.name });
    this.setStepState(stepId, { status: 'running', startedAt: Date.now() });
    try {
      let result: any;

      // Execute based on step type - This is the actual program logic
      switch (step.type) {
        case 'task':
          if (step.taskId) {
            // Execute task through Task model
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            result = await this.executeTask(step.taskId);
          }
          break;

        case 'subworkflow':
          if (step.workflowId) {
            // Execute nested workflow
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            result = await this.executeSubworkflow(step.workflowId);
          }
          break;

        case 'decision':
          // Execute decision logic
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          result = await this.executeDecision(step);
          break;

        case 'parallel':
          // Execute parallel branches
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          result = await this.executeParallel(step);
          break;

        case 'wait':
          // Execute wait/delay
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          result = await this.executeWait(step);
          break;

        case 'manual':
          // Manual intervention required
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          result = await this.executeManual(step);
          break;

        default:
          // This should never happen due to TypeScript's exhaustive checking
          throw new Error(`Unknown step type`);
      }
      this.setStepState(stepId, {
        status: 'completed',
        completedAt: Date.now(),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        result,
      });
      this.updateProgress();
      return result;
    } catch (error) {
      this.setStepState(stepId, {
        status: 'failed',
        failedAt: Date.now(),
        error: error instanceof Error ? error.message : String(error),
      });

      this.monitor('step.failed', {
        stepId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  // ============================================================
  // STEP EXECUTION IMPLEMENTATIONS - PROGRAM LOGIC
  // ============================================================

  private async executeTask(taskId: string): Promise<any> {
    // This would integrate with Task execution
    // For now, simulate task execution
    this.monitor('task.executing', { taskId });
    // In real implementation, would create/execute Task instance
    // const task = new Task({ id: taskId, ... });
    // return await task.execute();
    return { taskId, result: 'task completed' };
  }

  private async executeSubworkflow(workflowId: string): Promise<any> {
    // Execute nested workflow
    this.monitor('subworkflow.executing', { workflowId });
    // In real implementation, would create/execute Workflow instance
    // const subworkflow = new Workflow({ id: workflowId, ... });
    // return await subworkflow.execute();
    return { workflowId, result: 'subworkflow completed' };
  }

  private async executeDecision(
    step: WorkflowType['definition']['steps'][0],
  ): Promise<any> {
    // Evaluate decision condition
    if (step.condition?.expression) {
      const result = this.evaluateCondition(
        step.condition.expression,
        step.condition.variables,
      );
      this.monitor('decision.evaluated', { stepId: step.id, result });
      return result;
    }
    return true;
  }

  private async executeParallel(
    step: WorkflowType['definition']['steps'][0],
  ): Promise<any> {
    // Execute parallel branches
    this.monitor('parallel.started', { stepId: step.id });
    // In real implementation, would execute parallel steps
    const parallelResults = await Promise.all([
      // Execute parallel branches
    ]);
    return parallelResults;
  }

  private async executeWait(
    step: WorkflowType['definition']['steps'][0],
  ): Promise<any> {
    // Execute wait/delay
    const delayMs = step.timeoutMs || 1000;
    this.monitor('wait.started', { stepId: step.id, delayMs });
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    this.monitor('wait.completed', { stepId: step.id });
    return { waited: delayMs };
  }

  private async executeManual(
    step: WorkflowType['definition']['steps'][0],
  ): Promise<any> {
    // Manual intervention - workflow pauses here
    this.monitor('manual.intervention.required', { stepId: step.id });
    // In real implementation, would wait for manual input
    // For now, simulate manual completion
    return { manual: true, intervention: 'simulated' };
  }

  // ============================================================
  // MONITORING SYSTEM - OBSERVABILITY
  // ============================================================

  /**
   * Monitor workflow events - Built-in observability
   */
  monitor(event: string, data: Record<string, any> = {}): void {
    // Add to audit log (which exists in the schema)
    this.addAuditEntry({
      action: event,
      details: data,
    });

    // Console monitoring for development
    console.log(`[WORKFLOW-MONITOR] ${this.name}: ${event}`, data);
  }

  private getEventSeverity(event: string): 'info' | 'warning' | 'error' {
    if (event.includes('failed') || event.includes('error')) return 'error';
    if (event.includes('warning') || event.includes('retry')) return 'warning';
    return 'info';
  }

  /**
   * Get monitoring summary - Current observability state
   */
  getMonitoringState(): {
    isHealthy: boolean;
    progressPercent: number;
    activeSteps: number;
    errors: number;
    lastActivity: number;
  } {
    const errors = Object.values(this._data.executionState.stepStates).filter(
      (state) => state.status === 'failed',
    ).length;

    return {
      isHealthy: this.status !== 'failed' && errors === 0,
      progressPercent: this.progress.progressPercent,
      activeSteps: this._data.executionState.activeSteps.length,
      errors,
      lastActivity: this._data.metadata.updatedAt,
    };
  }

  // ============================================================
  // WORKFLOW STATE MANAGEMENT
  // ============================================================

  start(): void {
    this._data.executionState.status = 'running';
    this._data.executionState.startedAt = Date.now();
    this._data.metadata.updatedAt = Date.now();
  }

  pause(): void {
    this._data.executionState.status = 'paused';
    this._data.metadata.updatedAt = Date.now();
  }

  resume(): void {
    this._data.executionState.status = 'running';
    this._data.metadata.updatedAt = Date.now();
  }

  complete(): void {
    this._data.executionState.status = 'completed';
    this._data.executionState.completedAt = Date.now();
    this._data.metadata.updatedAt = Date.now();
  }

  fail(error: string): void {
    this._data.executionState.status = 'failed';
    // Store error in metadata since it's not in execution state schema
    this._data.metadata.annotations = this._data.metadata.annotations || {};
    this._data.metadata.annotations['lastError'] = error;
    this._data.metadata.updatedAt = Date.now();
  }

  cancel(): void {
    this._data.executionState.status = 'cancelled';
    this._data.metadata.updatedAt = Date.now();
  }

  // ============================================================
  // STEP MANAGEMENT
  // ============================================================

  getStep(stepId: string): WorkflowType['definition']['steps'][0] | undefined {
    return this.steps.find((step) => step.id === stepId);
  }

  getExecutableSteps(): WorkflowType['definition']['steps'] {
    return this.steps.filter((step) => this.canExecuteStep(step.id));
  }

  canExecuteStep(stepId: string): boolean {
    const step = this.getStep(stepId);
    if (!step) return false;

    // Check dependencies
    return step.dependsOn.every((depId) => {
      const depState = this._data.executionState.stepStates[depId];
      return depState && depState.status === 'completed';
    });
  }

  setStepState(stepId: string, state: any): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this._data.executionState.stepStates[stepId] = {
      ...this._data.executionState.stepStates[stepId],
      ...state,
    };
    this._data.metadata.updatedAt = Date.now();
  }

  updateProgress(): void {
    const totalSteps = this.steps.length;
    const completedSteps = Object.values(
      this._data.executionState.stepStates,
    ).filter((state) => state.status === 'completed').length;
    const failedSteps = Object.values(
      this._data.executionState.stepStates,
    ).filter((state) => state.status === 'failed').length;

    this._data.executionState.progress = {
      totalSteps,
      completedSteps,
      failedSteps,
      skippedSteps: 0,
      progressPercent:
        totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0,
    };
  }

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  private evaluateCondition(
    expression: string,
    variables?: Record<string, any>,
  ): boolean {
    // Simple condition evaluation - in real implementation would use proper parser
    try {
      // For now, just return true for any expression
      // In production, use a safe expression parser like expr-eval
      return Boolean(expression && variables);
    } catch {
      return false;
    }
  }

  get variables(): Record<string, any> {
    return this._data.executionState.variables || {};
  }

  setVariable(key: string, value: any): void {
    if (!this._data.executionState.variables) {
      this._data.executionState.variables = {};
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this._data.executionState.variables[key] = value;
    this._data.metadata.updatedAt = Date.now();
  }

  addAuditEntry(
    entry: Omit<
      WorkflowType['metadata']['auditLog'][0],
      'id' | 'workflowId' | 'timestamp'
    >,
  ): void {
    const auditEntry = {
      id: crypto.randomUUID(),
      workflowId: this.id,
      timestamp: Date.now(),
      severity: 'info' as const,
      ...entry,
    };

    this._data.metadata.auditLog.push(auditEntry);
  }

  // ============================================================
  // SERIALIZATION
  // ============================================================

  toJSON(): WorkflowType {
    return this._data;
  }

  static fromJSON(data: WorkflowType): Workflow {
    return new Workflow(data);
  }

  clone(): Workflow {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Workflow.fromJSON(JSON.parse(JSON.stringify(this._data)));
  }
}
