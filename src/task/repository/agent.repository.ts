import { AgentDefinition } from '../schema/definition';

/**
 * AgentRepository - In-memory and pluggable base for Agent persistence.
 * Replace with a Neo4j/Cypher adapter as needed.
 */
export class AgentRepository {
  private agents: Map<string, AgentDefinition> = new Map();

  async saveAgent(agent: AgentDefinition): Promise<AgentDefinition> {
    this.agents.set(agent.id, agent);
    return agent;
  }

  async getAgentById(id: string): Promise<AgentDefinition | undefined> {
    return this.agents.get(id);
  }

  async findAgents(
    query?: Partial<AgentDefinition>,
  ): Promise<AgentDefinition[]> {
    return Array.from(this.agents.values()).filter((agent) => {
      if (!query) return true;
      return Object.entries(query).every(
        ([key, value]) => (agent as any)[key] === value,
      );
    });
  }

  async deleteAgent(id: string): Promise<boolean> {
    return this.agents.delete(id);
  }
}
