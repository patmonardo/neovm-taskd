import { Injectable } from '@nestjs/common';
import {
  type TopicMap,
  type ViewSystem,
  type PropertyReification,
  type MCPServer,
  type ToolManagement,
} from './schema/agent';

// Agent operational status
type AgentStatus = 'offline' | 'starting' | 'ready' | 'busy' | 'error';

interface AgentType {
  // Identity
  id: string;
  name: string;
  description?: string;
  type: string;
  category?: string;
  version: string;
  tags: string[];

  // MCP Infrastructure Management
  mcpServers: MCPServer[];
  toolManagement: ToolManagement;

  // TAW-BEC Capabilities
  topicMaps: TopicMap[];
  viewSystems: ViewSystem[];
  propertyReification: PropertyReification;

  // Operational state
  status: AgentStatus;
  lastActivity: number;
  healthScore: number;

  // Metadata
  createdAt: number;
  updatedAt: number;
}

/**
 * Agent - MCP Infrastructure Manager (Hidden Layer)
 *
 * Agents operate BEHIND THE SCENES, hidden from Purusha's direct view.
 * They manage the MCP Server infrastructure that powers the system.
 *
 * Key responsibilities:
 * - Manage MCP Servers (Google MCP Database Toolbox style)
 * - Tool orchestration and management
 * - TopicMap Construction (dialectical work)
 * - Property Reification (ontological classes)
 * - Hidden complex operations
 */
@Injectable()
export class Agent {
  private _data: AgentType;

  constructor(data: Partial<AgentType>) {
    // Initialize with defaults
    this._data = {
      id: data.id || crypto.randomUUID(),
      name: data.name || 'Untitled Agent',
      type: data.type || 'mcp-manager',
      version: data.version || '1.0.0',
      tags: data.tags || [],
      mcpServers: data.mcpServers || [],
      toolManagement: data.toolManagement || {
        managedTools: [],
        toolboxServers: [],
      },
      topicMaps: data.topicMaps || [],
      viewSystems: data.viewSystems || [],
      propertyReification: data.propertyReification || {
        agentialProperties: [],
      },
      status: data.status || 'offline',
      lastActivity: data.lastActivity || Date.now(),
      healthScore: data.healthScore || 1.0,
      createdAt: data.createdAt || Date.now(),
      updatedAt: data.updatedAt || Date.now(),
      ...data,
    };
  }

  // Core Identity Properties
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

  // MCP Infrastructure Management
  get mcpServers(): MCPServer[] {
    return this._data.mcpServers;
  }

  get toolManagement(): ToolManagement {
    return this._data.toolManagement;
  }

  get managedTools() {
    return this._data.toolManagement.managedTools;
  }

  get toolboxServers(): string[] {
    return this._data.toolManagement.toolboxServers;
  }

  // TAW-BEC Capabilities
  get topicMaps(): TopicMap[] {
    return this._data.topicMaps;
  }

  get viewSystems(): ViewSystem[] {
    return this._data.viewSystems;
  }

  get propertyReification(): PropertyReification {
    return this._data.propertyReification;
  }

  // Operational State
  get status(): AgentStatus {
    return this._data.status;
  }

  get lastActivity(): number {
    return this._data.lastActivity;
  }

  get healthScore(): number {
    return this._data.healthScore;
  }

  // Metadata
  get createdAt(): number {
    return this._data.createdAt;
  }

  get updatedAt(): number {
    return this._data.updatedAt;
  }

  // Raw data access
  get data(): AgentType {
    return this._data;
  }

  // MCP Server Management Methods
  addMCPServer(server: MCPServer): void {
    this._data.mcpServers.push(server);
    this._data.updatedAt = Date.now();
  }

  removeMCPServer(serverId: string): void {
    this._data.mcpServers = this._data.mcpServers.filter(
      (s) => s.id !== serverId,
    );
    this._data.updatedAt = Date.now();
  }

  getMCPServer(serverId: string): MCPServer | undefined {
    return this._data.mcpServers.find((s) => s.id === serverId);
  }

  getMCPServersByType(type: MCPServer['type']): MCPServer[] {
    return this._data.mcpServers.filter((s) => s.type === type);
  }

  getToolboxServers(): MCPServer[] {
    return this._data.mcpServers.filter((s) => s.mcpConfig.toolbox);
  }

  // Tool Management Methods
  addManagedTool(tool: ToolManagement['managedTools'][0]): void {
    this._data.toolManagement.managedTools.push(tool);
    this._data.updatedAt = Date.now();
  }

  removeManagedTool(toolId: string): void {
    this._data.toolManagement.managedTools =
      this._data.toolManagement.managedTools.filter((t) => t.id !== toolId);
    this._data.updatedAt = Date.now();
  }

  getToolsByType(type: string): ToolManagement['managedTools'] {
    return this._data.toolManagement.managedTools.filter(
      (t) => t.type === type,
    );
  }

  // TopicMap Construction Methods (Dialectical Work)
  addTopicMap(topicMap: TopicMap): void {
    this._data.topicMaps.push(topicMap);
    this._data.updatedAt = Date.now();
  }

  getTopicMap(topicMapId: string): TopicMap | undefined {
    return this._data.topicMaps.find((tm) => tm.id === topicMapId);
  }

  constructTopic(topicMapId: string, topic: TopicMap['topics'][0]): void {
    const topicMap = this.getTopicMap(topicMapId);
    if (topicMap) {
      topicMap.topics.push(topic);
      this._data.updatedAt = Date.now();
    }
  }

  // View System Management (Logic of Appearance)
  addViewSystem(viewSystem: ViewSystem): void {
    this._data.viewSystems.push(viewSystem);
    this._data.updatedAt = Date.now();
  }

  getViewSystem(viewSystemId: string): ViewSystem | undefined {
    return this._data.viewSystems.find((vs) => vs.id === viewSystemId);
  }

  // Property Reification Methods
  addAgentialProperty(
    property: PropertyReification['agentialProperties'][0],
  ): void {
    this._data.propertyReification.agentialProperties.push(property);
    this._data.updatedAt = Date.now();
  }

  getOntologicalProperties(): PropertyReification['agentialProperties'] {
    return this._data.propertyReification.agentialProperties.filter(
      (p) => p.type === 'ontological-class',
    );
  }

  getTranscendentalMarks(): PropertyReification['agentialProperties'] {
    return this._data.propertyReification.agentialProperties.filter(
      (p) => p.type === 'transcendental-mark',
    );
  }

  // State Management
  updateStatus(status: AgentStatus): void {
    this._data.status = status;
    this._data.lastActivity = Date.now();
    this._data.updatedAt = Date.now();
  }

  updateHealthScore(score: number): void {
    this._data.healthScore = Math.max(0, Math.min(1, score));
    this._data.updatedAt = Date.now();
  }

  recordActivity(): void {
    this._data.lastActivity = Date.now();
    this._data.updatedAt = Date.now();
  }

  // Utility Methods
  isOnline(): boolean {
    return this.status === 'ready' || this.status === 'busy';
  }

  isOffline(): boolean {
    return this.status === 'offline';
  }

  hasError(): boolean {
    return this.status === 'error';
  }

  isHealthy(): boolean {
    return this.healthScore > 0.7;
  }

  // MCP Infrastructure Queries
  getMCPServerCount(): number {
    return this._data.mcpServers.length;
  }

  getActiveMCPServers(): MCPServer[] {
    return this._data.mcpServers.filter((s) => s.status === 'ready');
  }

  getManagedToolCount(): number {
    return this._data.toolManagement.managedTools.length;
  }

  // Hidden Operations (from Purusha perspective)
  performHiddenOperation(operationName: string, mcpServerIds: string[]): void {
    // This represents complex operations that happen behind the scenes
    // Purusha never sees these directly
    this.recordActivity();
    console.log(
      `Agent ${this.id} performing hidden operation: ${operationName} with MCP servers: ${mcpServerIds.join(', ')}`,
    );
  }

  // Factory Methods
  static create(data: Partial<AgentType>): Agent {
    return new Agent(data);
  }

  static createMCPManager(name: string, mcpServers: MCPServer[] = []): Agent {
    return new Agent({
      name,
      type: 'mcp-manager',
      mcpServers,
      status: 'ready',
    });
  }

  // Serialization
  toJSON(): AgentType {
    return this._data;
  }

  toString(): string {
    return `Agent(${this.id}): ${this.name} [${this.status}] - ${this.getMCPServerCount()} MCP servers`;
  }
}
