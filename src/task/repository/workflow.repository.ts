import { WorkflowDefinition } from '../schema/definition';

/**
 * WorkflowRepository - In-memory and pluggable base for Workflow persistence.
 * Replace with a Neo4j/Cypher adapter as needed.
 */
export class WorkflowRepository {
  private workflows: Map<string, WorkflowDefinition> = new Map();

  async saveWorkflow(
    workflow: WorkflowDefinition,
  ): Promise<WorkflowDefinition> {
    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  async getWorkflowById(id: string): Promise<WorkflowDefinition | undefined> {
    return this.workflows.get(id);
  }

  async findWorkflows(
    query?: Partial<WorkflowDefinition>,
  ): Promise<WorkflowDefinition[]> {
    return Array.from(this.workflows.values()).filter((workflow) => {
      if (!query) return true;
      return Object.entries(query).every(
        ([key, value]) => (workflow as any)[key] === value,
      );
    });
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    return this.workflows.delete(id);
  }
}
