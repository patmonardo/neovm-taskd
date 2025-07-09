import { TaskDefinition } from '../schema/definition';

/**
 * TaskRepository - In-memory and pluggable base for Task persistence.
 * Replace with a Neo4j/Cypher adapter as needed.
 */
export class TaskRepository {
  private tasks: Map<string, TaskDefinition> = new Map();

  async saveTask(task: TaskDefinition): Promise<TaskDefinition> {
    this.tasks.set(task.id, task);
    return task;
  }

  async getTaskById(id: string): Promise<TaskDefinition | undefined> {
    return this.tasks.get(id);
  }

  async findTasks(query?: Partial<TaskDefinition>): Promise<TaskDefinition[]> {
    // Simple filter; extend for more complex queries
    return Array.from(this.tasks.values()).filter((task) => {
      if (!query) return true;
      return Object.entries(query).every(
        ([key, value]) => (task as any)[key] === value,
      );
    });
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }
}
