# GraphCatalog Architecture: Universal Set of Schema-Seeded Stores

## Core Architectural Principle

**GraphCatalog** = **Universal Set of Independent GraphStores**
**GraphStore** = **Single Graph Schema** + **All its Projections**

### Universal Set Structure
```
GraphCatalog (Universal Set)
├── GraphStore₁ (Independent)
│   ├── Single Graph Schema (seed)
│   ├── SubSchemas (projected from seed)
│   ├── SubGraphs (projected from seed) 
│   └── Workflows (projected from seed)
├── GraphStore₂ (Independent)
│   ├── Single Graph Schema (seed)
│   ├── SubSchemas (projected from seed)
│   ├── SubGraphs (projected from seed)
│   └── Workflows (projected from seed)
└── GraphStore_n (Independent)
    ├── Single Graph Schema (seed)
    ├── SubSchemas (projected from seed)
    ├── SubGraphs (projected from seed)
    └── Workflows (projected from seed)
```

## Schema-Centric GraphStore Architecture

### Single Schema as Projection Seed

Each GraphStore contains **exactly one single graph schema** that serves as the **generative seed** for all projections within that store.

## GraphStore Internal Structure
```typescript
interface GraphStore {
  // Core: Single Schema as Universal Seed
  seedSchema: SingleGraphSchema;         // THE schema that generates everything
  userInfo: UserInfo;                    // User identification and metadata
  storeId: string;                       // Unique identifier for this store
  
  // All projections emerge from seed schema
  projectedContent: {
    subSchemas: SubSchema[];             // Schema → SubSchema projections
    subGraphs: SubGraph[];               // Schema → SubGraph projections
    workflowGraphs: WorkflowGraph[];     // Schema → Workflow projections
    taskGraphs: TaskGraph[];             // Schema → Task projections (Being-Model)
  };
  
  // Schema projection mechanisms
  projectionEngine: SchemaProjectionEngine; // How seed schema projects
}

interface GraphCatalog {
  // Universal Set of Independent GraphStores
  independentStores: Set<GraphStore>;       // Universal Set structure
  storeIndependence: StoreIndependencePolicy; // How stores remain independent
  universalOperations: UniversalSetOperations; // Operations across the set
}
```

## Single Graph = Single Workflow Relationship

**Key Insight**: A **Single Graph** represents a **Single Workflow** that is driven by a **projected Agent**.

```typescript
interface SingleGraph {
  workflowId: string;
  workflow: Workflow;                    // Single Workflow entity
  projectedAgent: ProjectedAgent;        // Agent driving this workflow
  
  // Agent is NOT stored as Graph
  agentSource: 'FormDB';                 // Agent stored as Schemas in FormDB
  agentSchemas: AgentSchemaReference[];  // References to FormDB schemas
  
  // Graph represents Workflow structure
  workflowGraph: WorkflowGraph;          // Graph structure of workflow
  beingModel: TaskGraph;                 // Being-Model = Task-Graph
}
```

## Agent Storage in FormDB vs Graph Storage

**Critical Distinction**: 
- **Workflow** = stored as **Graph** (Being-Model = Task-Graph)
- **Agent** = stored as **Schemas in FormDB** (not as Graph)

```typescript
interface AgentFormDBStorage {
  // Agent lives in FormDB as Schemas
  agentSchemas: {
    ontologySchema: OntologySchema;      // Agent's ontological structure
    axiologySchema: AxiologySchema;      // Agent's value structure  
    behaviorSchema: BehaviorSchema;      // Agent's behavior patterns
    projectionSchema: ProjectionSchema;  // How Agent projects to drive Workflow
  };
  
  // Agent projects to drive Workflow Graph
  projection: {
    source: 'FormDB';                    // Agent source location
    target: 'WorkflowGraph';             // Projection target
    mechanism: 'AgentProjection';        // Projection mechanism
    result: 'DrivenWorkflow';            // Workflow driven by Agent
  };
}
```

## Root Graph → SubGraph Projection (Future Research)

**Special Case**: Root Graph projecting as SubGraphs is identified as **future research** area.

```typescript
interface RootGraphProjection {
  rootGraph: RootGraph;                  // Primary graph structure
  subGraphProjections: SubGraph[];       // Projected sub-structures
  
  // Future research area
  projectionMechanism: 'future-research'; // How Root projects to Sub
  researchQuestions: [
    'How does Root Graph project SubGraphs?',
    'What is the relationship between Root and Sub?',
    'How do SubGraphs maintain connection to Root?',
    'What are the projection principles?'
  ];
}
```

## Implementation Architecture

### GDS NativeFactory Integration
```typescript
@Injectable()
export class GraphCatalogService {
  private userGraphs = new Map<string, SingleUserGraph>();
  private hugegraphUnion: HugeGraphUnion;
  
  // Create single user graph
  async createUserGraph(userId: string): Promise<SingleUserGraph> {
    const nativeFactory = new GDS_NativeFactory({
      userId,
      isolationLevel: 'complete',
      graphScope: 'single-user'
    });
    
    const userGraph: SingleUserGraph = {
      userId,
      nativeFactory,
      taskGraphs: [],
      workflowBeingModel: null,
      graphOperations: this.createGraphOperations(nativeFactory),
      isolation: {
        scope: 'single-user',
        noSharedState: true,
        independentProjections: true
      }
    };
    
    this.userGraphs.set(userId, userGraph);
    return userGraph;
  }
  
  // Project Task as Graph (Being-Model)
  async projectTaskAsGraph(
    userId: string, 
    taskAbsolute: TaskAbsolute
  ): Promise<TaskGraph> {
    const userGraph = this.userGraphs.get(userId);
    if (!userGraph) throw new Error('User graph not found');
    
    // Task projects as actual Graph structure
    const taskGraph = await userGraph.nativeFactory.projectTaskAsGraph({
      taskAbsolute,
      projectionType: 'being-model',
      targetType: 'graph-structure'
    });
    
    userGraph.taskGraphs.push(taskGraph);
    return taskGraph;
  }
  
  // Research union of user graphs
  async researchGraphUnion(userIds: string[]): Promise<UnionResult> {
    const userGraphs = userIds
      .map(id => this.userGraphs.get(id))
      .filter(graph => graph !== undefined);
    
    return this.hugegraphUnion.researchPlatform.createUnion(userGraphs);
  }
}
```

### NestJS Integration
```typescript
@Module({
  providers: [
    GraphCatalogService,
    {
      provide: 'HUGEGRAPH_UNION',
      useFactory: () => new HugeGraphUnion({
        researchMode: true,
        unionCapabilities: ['projection-union', 'one-many-analysis']
      })
    }
  ],
  controllers: [
    GraphCatalogController,
    TaskGraphController,
    UnionResearchController
  ]
})
export class GraphCatalogModule {}
```

## Key Benefits

### Architectural Clarity
- **Single User Graphs** via GDS NativeFactory (clear isolation)
- **GraphCatalog** manages collection (clear organization)
- **Task-Graph as Being-Model** (clear systematic role)
- **HugeGraph as Union Research** (clear research purpose)

### Research Capabilities
- **One-Many relationship** exploration
- **Projection union** mechanisms
- **Cross-user analysis** without violating isolation
- **Union algorithm** development and testing

### Scalability
- **Independent user graphs** (no shared state conflicts)
- **Catalog-based management** (easy to add/remove users)
- **Union research platform** (study aggregation without commitment)
- **Clear separation** between single-user operations and multi-user research

## Success Criteria

- Each user has isolated SingleUserGraph via GDS NativeFactory
- Tasks successfully project as Graph structures (Being-Model)
- GraphCatalog effectively manages collection of user graphs
- HugeGraph provides robust union research platform
- One-Many relationships clearly understood and implementable
- Clear architectural separation between isolation and union research

## Additional Interfaces

### SingleGraphSchema and SchemaProjectionEngine

To complete the schema-centric architecture, the following interfaces are added:

```typescript
interface SingleGraphSchema {
  schemaId: string;
  schemaDefinition: GraphSchemaDefinition;  // Core schema content
  
  // Generative capabilities - how this schema seeds projections
  generativeCapabilities: {
    toSubSchemas: SubSchemaGenerationRule[];
    toSubGraphs: SubGraphGenerationRule[];
    toWorkflows: WorkflowGenerationRule[];
    toTasks: TaskGenerationRule[];
  };
  
  // Projection preservation - all projections trace back to this seed
  projectionTraceability: {
    preserveSeedReference: boolean;      // All projections reference seed
    projectionHistory: ProjectionStep[]; // Track how projections were generated
  };
}

interface SchemaProjectionEngine {
  // Core seeding function
  seedSchema: SingleGraphSchema;         // The schema that seeds everything
  
  // Projection methods
  projectToSubSchemas(): SubSchema[];    // Generate subschemas from seed
  projectToSubGraphs(): SubGraph[];      // Generate subgraphs from seed
  projectToWorkflows(): WorkflowGraph[]; // Generate workflows from seed
  projectToTasks(): TaskGraph[];         // Generate tasks from seed
  
  // Projection tracking
  trackProjections: ProjectionTracker;   // Track all projections from seed
  validateProjections: ProjectionValidator; // Ensure projections valid from seed
}
```

### Universal Set Properties

**GraphCatalog as Universal Set**: Contains all possible independent GraphStores where each operates autonomously with its own schema seed.

```typescript
interface UniversalSetProperties {
  // Universal Set characteristics
  setType: 'Universal';
  elementType: 'IndependentGraphStore';
  independence: 'Complete';              // Stores completely independent
  
  // Set operations
  operations: {
    union: (stores: GraphStore[]) => HugeGraphUnion;        // Research platform
    intersection: (stores: GraphStore[]) => CommonPatterns; // Shared schema patterns
    difference: (storeA: GraphStore, storeB: GraphStore) => SchemaDifference;
    complement: (store: GraphStore) => ComplementaryStores;
  };
  
  // Independence guarantees
  independenceGuarantees: {
    schemaIsolation: 'Each store has independent schema seed';
    projectionIsolation: 'Projections never cross store boundaries';
    operationalIndependence: 'Stores operate without affecting each other';
    dataIsolation: 'No shared data between stores';
  };
}
```
