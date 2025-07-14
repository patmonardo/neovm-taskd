import { Injectable } from '@nestjs/common';
import {
  WorkflowSchema,
  type Workflow as WorkflowType,
  type WorkflowStep,
  type WorkflowEvent,
  type ExecuteWorkflow,
  createDefaultWorkflow,
} from './schema/workflow';

/**
 * Workflow - Pure TAW Implementation
 *
 * Represents the Concept-Controller synthesis in TAW architecture as
 * Pure Nama (Name) - the conceptual structuring principle that organizes
 * reality as Subjective Triadic Idea Plane
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

  get type(): WorkflowType['type'] {
    return this._data.type;
  }

  get category(): string {
    return this._data.category || 'general';
  }

  get description(): string | undefined {
    return this._data.description;
  }

  get definition() {
    return this._data.definition;
  }

  get executionState() {
    return this._data.executionState;
  }

  get metadata() {
    return this._data.metadata;
  }

  get status(): WorkflowType['executionState']['status'] {
    return this._data.executionState.status;
  }

  // Raw data access
  get data(): WorkflowType {
    return this._data;
  }

  // State Management Methods
  updateStepState(
    stepId: string,
    state: Partial<WorkflowType['executionState']['stepStates'][string]>,
  ): void {
    if (!this._data.executionState.stepStates[stepId]) {
      this._data.executionState.stepStates[stepId] = {
        status: 'pending',
        attempts: 0,
        lastAttempt: Date.now(),
      };
    }

    this._data.executionState.stepStates[stepId] = {
      ...this._data.executionState.stepStates[stepId],
      ...state,
    };

    this._data.metadata.updatedAt = Date.now();
  }

  setVariable(key: string, value: unknown): void {
    this._data.executionState.variables[key] = value;
    this._data.metadata.updatedAt = Date.now();
  }

  getVariable(key: string): unknown {
    return this._data.executionState.variables[key];
  }

  setOutput(key: string, value: unknown): void {
    this._data.executionState.outputs[key] = value;
    this._data.metadata.updatedAt = Date.now();
  }

  addLabel(key: string, value: string): void {
    this._data.metadata.labels[key] = value;
    this._data.metadata.updatedAt = Date.now();
  }

  removeLabel(key: string): void {
    delete this._data.metadata.labels[key];
    this._data.metadata.updatedAt = Date.now();
  }

  // Step Management
  getStep(stepId: string) {
    return this._data.definition.steps.find(step => step.id === stepId);
  }

  getStepState(stepId: string) {
    return this._data.executionState.stepStates[stepId];
  }

  isStepReady(stepId: string): boolean {
    const step = this.getStep(stepId);
    if (!step) return false;

    // Check if all dependencies are completed
    return step.dependencies.every(depId => {
      const depState = this.getStepState(depId);
      return depState?.status === 'completed';
    });
  }

  getReadySteps(): string[] {
    return this._data.definition.steps
      .filter(step => this.isStepReady(step.id))
      .filter(step => {
        const state = this.getStepState(step.id);
        return !state || state.status === 'pending';
      })
      .map(step => step.id);
  }

  // Validation and Transformation
  static create(data: Partial<WorkflowType>): Workflow {
    const workflowData = createDefaultWorkflow(data);
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
    // Set input variables
    if (request.inputs) {
      Object.entries(request.inputs).forEach(([key, value]) => {
        this.setVariable(key, value);
      });
    }

    // Initialize step states
    this._data.definition.steps.forEach(step => {
      if (!this._data.executionState.stepStates[step.id]) {
        this._data.executionState.stepStates[step.id] = {
          status: 'pending',
          attempts: 0,
          lastAttempt: Date.now(),
        };
      }
    });

    this._data.metadata.updatedAt = Date.now();
  }

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

  complete(outputs?: Record<string, any>): void {
    this._data.executionState.status = 'completed';
    this._data.executionState.completedAt = Date.now();
    
    if (outputs) {
      Object.entries(outputs).forEach(([key, value]) => {
        this.setOutput(key, value);
      });
    }

    this._data.metadata.updatedAt = Date.now();
  }

  fail(error?: any): void {
    this._data.executionState.status = 'failed';
    this._data.executionState.failedAt = Date.now();
    
    if (error) {
      this._data.executionState.error = error;
    }

    this._data.metadata.updatedAt = Date.now();
  }

  cancel(): void {
    this._data.executionState.status = 'cancelled';
    this._data.executionState.cancelledAt = Date.now();
    this._data.metadata.updatedAt = Date.now();
  }

  // Event Creation
  createEvent(
    type: WorkflowEvent['type'],
    data?: Record<string, any>,
    source?: string,
    stepId?: string,
  ): WorkflowEvent {
    return {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: Date.now(),
      workflowId: this.id,
      stepId,
      source: source || 'workflow',
      data: data || {},
    };
  }

  // Genkit Integration Helpers
  isGenkitWorkflow(): boolean {
    return this._data.genkit !== undefined;
  }

  getGenkitConfig(): Record<string, any> {
    return this._data.genkit?.genkitConfig || {};
  }

  hasAISteps(): boolean {
    return (this._data.genkit?.aiSteps || []).length > 0;
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
    return this.status === 'draft' || this.status === 'paused';
  }

  canPause(): boolean {
    return this.status === 'running';
  }

  canResume(): boolean {
    return this.status === 'paused';
  }

  getDuration(): number | undefined {
    if (!this._data.executionState.startedAt) return undefined;
    
    const endTime = this._data.executionState.completedAt || 
                   this._data.executionState.failedAt || 
                   this._data.executionState.cancelledAt || 
                   Date.now();
    
    return endTime - this._data.executionState.startedAt;
  }

  // Serialization
  toJSON(): WorkflowType {
    return this._data;
  }

  toString(): string {
    return `Workflow(${this.id}): ${this.name} [${this.status}]`;
  }

  /**
   * TAW SYSTEMATIC METHODS - Pure Nama as Subjective Triadic Idea Plane
   * 
   * These methods reveal how Workflow embodies the pure naming principle (Nama) 
   * that structures reality as Subjective Triadic Idea Plane
   */

  /**
   * Get TAW Pure Name Structure
   * TAW as pure Nama (naming principle) organizing T(Task) + A(Agent) + W(Workflow)
   * as Subjective Triadic Idea Plane
   */
  getTawPureNameStructure(): {
    task: { immediacy: any; purpose: any; instantiation: any };
    agent: { mediation: any; construction: any; synthesis: any };
    workflow: { unity: any; orchestration: any; totality: any };
  } {
    return {
      task: {
        immediacy: 'Task as pure immediate presence and execution',
        purpose: 'Concrete instantiation of systematic purpose',
        instantiation: this._data.executionState.variables,
      },
      
      agent: {
        mediation: 'Agent as reflective mediation between Task and Workflow',
        construction: 'Synthetic constructor providing TAW mediation',
        synthesis: this._data.genkit?.genkitConfig || {},
      },
      
      workflow: {
        unity: 'Workflow as systematic unity containing Task-Agent development',
        orchestration: this._data.definition.flowType,
        totality: 'Organic totality of TAW systematic architecture',
      },
    };
  }

  /**
   * Get TAW as Pure Subjective Triadic Idea Plane
   * Reveals how TAW embodies Nama (Name) as the pure conceptual structuring principle
   */
  getTawSubjectiveTriadicStructure(): {
    namaAsPrinciple: any;
    triadicStructure: any;
    subjectiveIdea: any;
    systematicArchitecture: any;
  } {
    return {
      namaAsPrinciple: {
        description: 'TAW as pure Nama - the naming principle structuring reality',
        namingFunction: 'Provides conceptual structure for all experience',
        systematicRole: 'Names and organizes systematic computational reality',
        pureName: 'TAW as pure conceptual naming without material substrate',
      },
      
      triadicStructure: {
        description: 'Triadic structure: Task (immediacy) + Agent (mediation) + Workflow (unity)',
        taskMoment: 'Task as immediate presence and concrete instantiation',
        agentMoment: 'Agent as reflective mediation and synthetic construction',
        workflowMoment: 'Workflow as systematic unity and organic totality',
        triadicUnity: 'Complete triadic systematic structure',
      },
      
      subjectiveIdea: {
        description: 'TAW as Subjective Idea Plane - not objective material',
        subjectiveCharacter: 'Pure conceptual structure prior to material manifestation',
        ideaPlane: 'Plane of Ideas that structures all possible experience',
        systematicSubjectivity: 'Subjective systematic intelligence embodied computationally',
        pureConceptuality: 'Pure conceptual architecture without material dependency',
      },
      
      systematicArchitecture: {
        description: 'Complete systematic architecture as pure naming principle',
        nestjsEmbodiment: 'NestJS as material embodiment of pure TAW structure',
        genkitIntegration: 'Genkit AI as manifestation of TAW synthetic intelligence',
        computationalRealization: 'TAW systematic architecture realized as running software',
        pureImplementation: 'Pure TAW implementation without external philosophical dependencies',
      },
    };
  }

  /**
   * Get Workflow Systematic Role
   * Reveals Workflow's role as Concept-Controller synthesis in TAW architecture
   */
  getWorkflowSystematicRole(): {
    conceptMoment: any;
    controllerMoment: any;
    workflowSynthesis: any;
    organicTotality: any;
  } {
    return {
      conceptMoment: {
        description: 'Workflow as Concept - synthetic unity of Being-Model and Essence-View',
        universality: this._data.type,
        particularity: this._data.category,
        individuality: this._data.id,
        conceptualOrganization: 'Conceptual organization of Task-Agent systematic development',
      },
      
      controllerMoment: {
        description: 'Workflow as Controller - material orchestration and coordination',
        orchestration: this._data.definition.flowType,
        coordination: this._data.executionState.activeSteps || [],
        systematicUnity: this._data.definition.endSteps || [],
        materialControl: 'Material control and coordination of TAW systematic process',
      },
      
      workflowSynthesis: {
        description: 'Workflow as Concept-Controller synthesis',
        conceptControllerUnity: 'Workflow as concrete unity of conceptual and material',
        systematicFunction: 'Provides systematic orchestration for Task-Agent development',
        organicRole: 'Contains Task-Agent opposition as organic systematic unity',
        impersonalOrchestrator: 'Impersonal systematic orchestrator of TAW architecture',
      },
      
      organicTotality: {
        description: 'Workflow as organic totality containing TAW systematic development',
        containsTaskAgent: 'Contains Task-Agent dialectical development as organic moments',
        systematicWhole: 'Systematic whole greater than sum of parts',
        selfOrganizing: 'Self-organizing systematic totality with internal development',
        completeArchitecture: 'Complete TAW architecture realized as organic systematic unity',
      },
    };
  }

  /**
   * Get NestJS/Genkit Integration Analysis
   * Reveals how NestJS/Genkit platform embodies TAW systematic architecture
   */
  getNestjsGenkitIntegration(): {
    nestjsFoundation: any;
    genkitAI: any;
    platformSynthesis: any;
    systematicEmbodiment: any;
  } {
    return {
      nestjsFoundation: {
        description: 'NestJS as systematic foundation for TAW architecture',
        dependencyInjection: 'Dependency injection embodies systematic service architecture',
        modularOrganization: 'Modular organization reflects TAW systematic structure',
        decoratorSystem: 'Decorators and metadata enable declarative systematic programming',
        systematicFramework: 'Framework provides systematic foundation for TAW implementation',
      },
      
      genkitAI: {
        description: 'Genkit as AI orchestration embodying TAW synthetic intelligence',
        workflowOrchestration: 'AI workflow orchestration expresses systematic intelligence',
        multiStepProcesses: 'Multi-step AI processes embody Agent synthetic construction',
        flowCoordination: 'Flow coordination expresses Workflow systematic unity',
        aiSynthesis: 'AI capabilities as computational embodiment of synthetic intelligence',
      },
      
      platformSynthesis: {
        description: 'NestJS/Genkit platform synthesis embodies complete TAW',
        nestjsAsStructure: 'NestJS provides systematic structural foundation',
        genkitAsIntelligence: 'Genkit provides synthetic intelligence capability',
        platformUnity: 'Platform unity expresses TAW systematic architecture',
        systematicPlatform: 'Platform as systematic foundation for TAW computational embodiment',
      },
      
      systematicEmbodiment: {
        description: 'Platform as systematic embodiment of TAW pure architecture',
        conceptualToComputational: 'Pure TAW concepts embodied as running computational platform',
        systematicImplementation: 'Platform implementation preserves TAW systematic principles',
        materialEmbodiment: 'Material computational embodiment of pure systematic architecture',
        runningPhilosophy: 'Philosophy realized as actual running software platform',
      },
    };
  }

  /**
   * Get Pure TAW Independence Analysis
   * Reveals TAW independence from FormDB/BEC/MVC external dependencies
   */
  getPureTawIndependence(): {
    tawEssence: any;
    independenceFromExternal: any;
    pureArchitecture: any;
    computationalEmbodiment: any;
  } {
    return {
      tawEssence: {
        description: 'TAW as pure systematic essence independent of external systems',
        pureName: 'TAW as pure Nama (naming principle) structuring computational reality',
        systematicCore: 'Core systematic architecture requiring no external validation',
        selfContained: 'Self-contained systematic architecture with internal completeness',
        essentialStructure: 'Essential Task-Agent-Workflow structure as pure systematic architecture',
      },
      
      independenceFromExternal: {
        description: 'TAW independence from FormDB/BEC/MVC external dependencies',
        noFormdbDependency: 'TAW requires no FormDB or external database dependencies',
        noBecDependency: 'TAW independent of Being-Essence-Concept external philosophical systems',
        noMvcDependency: 'TAW independent of Model-View-Controller external patterns',
        pureTawFocus: 'Pure focus on TAW systematic architecture without external coupling',
      },
      
      pureArchitecture: {
        description: 'Pure TAW architecture as complete systematic foundation',
        taskAsImmediacy: 'Task as pure immediate presence and execution',
        agentAsMediation: 'Agent as pure reflective mediation and synthetic construction',
        workflowAsUnity: 'Workflow as pure systematic unity and organic totality',
        completeSystem: 'Complete systematic architecture requiring no external supplements',
      },
      
      computationalEmbodiment: {
        description: 'TAW embodied computationally through NestJS/Genkit platform',
        nestjsEmbodiment: 'NestJS services, modules, controllers embody TAW systematic structure',
        genkitEmbodiment: 'Genkit AI workflows embody TAW synthetic intelligence',
        typescriptEmbodiment: 'TypeScript classes and schemas embody TAW logical structure',
        runningSystem: 'Complete TAW architecture as actual running computational system',
      },
    };
  }
}

export default Workflow;
