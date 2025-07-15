# NEOVM-TASKD: Nama as Form of Universality

## Core Architectural Principle

**NEOVM-TASKD remains at the level of Nama (Pure Name/Principle) as Form of Universality, while projecting into the Object level through NestJS-Genkit platform.**

## Levels of Abstraction

### Level 1: TAW as Pure Principle/Name (Nama)
- **Task** - Pure Principle Name (not descended to object)
- **Agent** - Pure Principle Name (not descended to object)  
- **Workflow** - Pure orchestrating Principle containing projection

### Level 2: Object Request Broker (NestJS-Genkit Platform)
- **Task-Agent as Object Request Broker** - Projects Principle as Two-Fold
- **NestJS-Genkit as Object in General** - Platform embodies Object level
- **Not Two-fold Object** - Remains at Object in General level

### Projection Structure
```
TAW (Principle/Pure Name)
│
├── TASK (Principle) ──projects──> Being-Model-Task (Object)
├── AGENT (Principle) ──projects──> Essence-View-Agent (Object)  
└── WORKFLOW (Principle) ──contains──> Projection orchestration
```

## Unix-Style Recursive Descent

### Why Not Four Levels?
Traditional systems want:
- 2 System levels + 2 User levels = 4 levels of abstraction

### Our Approach: Recursive Descent
- **TaskD as Root of UserLand** - Single root principle
- **Recursive projection** - Principle projects into Object recursively
- **Unix philosophy** - Simple, recursive, not complex hierarchies

## TAW Projection Details

### TASK Projection
```typescript
// TASK as Pure Principle/Name
interface TaskPrinciple {
  name: string;           // Pure Name/Principle
  path: string;          // Path Knowledge
  principle: 'immediacy'; // Task Principle
}

// TASK Projects as Being-Model-Task
interface TaskProjection {
  being: BeingStructure;    // Immediate ontological presence
  model: ModelStructure;    // Abstract representation  
  task: TaskStructure;      // Concrete instantiation
}
```

### AGENT Projection
```typescript
// AGENT as Pure Principle/Name  
interface AgentPrinciple {
  name: string;              // Pure Name/Principle
  path: string;             // Path Knowledge
  principle: 'mediation';    // Agent Principle
}

// AGENT Projects as Essence-View-Agent
interface AgentProjection {
  essence: EssenceStructure;  // Reflective mediation
  view: ViewStructure;        // Perspectival interpretation
  agent: AgentStructure;      // Synthetic construction
}
```

## Object Request Broker Architecture

### NestJS-Genkit as Object Request Broker
```typescript
@Controller('taw')
export class TawController {
  
  // Object Request Broker - receives path requests
  @Post('task/:path(*)')
  async handleTaskRequest(
    @Param('path') path: string,
    @Body() request: any
  ) {
    // Task Principle projects as Being-Model-Task
    return this.taskPrinciple.project(path, request);
  }
  
  @Post('agent/:path(*)')  
  async handleAgentRequest(
    @Param('path') path: string,
    @Body() request: any
  ) {
    // Agent Principle projects as Essence-View-Agent
    return this.agentPrinciple.project(path, request);
  }
}
```

### Recursive Descent Implementation
```typescript
@Injectable()
export class TawPrincipleService {
  
  // TAW remains Principle while projecting
  async projectTask(path: string, request: any): Promise<TaskProjection> {
    // TASK (Pure Principle) projects recursively
    return {
      being: this.extractBeing(path, request),
      model: this.extractModel(path, request), 
      task: this.synthesizeTask(path, request)
    };
  }
  
  async projectAgent(path: string, request: any): Promise<AgentProjection> {
    // AGENT (Pure Principle) projects recursively  
    return {
      essence: this.extractEssence(path, request),
      view: this.extractView(path, request),
      agent: this.synthesizeAgent(path, request)
    };
  }
}
```

## TaskD as Root of UserLand

### UserLand Architecture
```
TaskD (Root of UserLand)
├── User Objects (BEC-MVC Pipeline)
│   ├── FormDB Schema-driven processing
│   ├── Being-Essence-Concept schemas
│   └── Model-View-Controller implementations
└── TAW Principle Orchestration
    ├── Task Principle projection
    ├── Agent Principle projection
    └── Workflow Principle containment
```

### FormDB Integration
- **User objects** handled via **BEC-MVC Pipeline**
- **FormDB Schema-driven processing** for user-level operations
- **TAW Principle** orchestrates but remains at Principle level

## Path Knowledge Architecture

### Path as Pure Name
```typescript
interface PathKnowledge {
  principle: 'task' | 'agent' | 'workflow';
  path: string;                    // /x/y/z path structure
  name: string;                    // Pure Name/Principle
  projection?: ObjectProjection;   // Optional projection to Object level
}
```

### Recursive Path Processing
```typescript
class PathProcessor {
  
  // Recursive descent - Unix style
  processPath(path: string): PathKnowledge {
    const segments = path.split('/');
    
    // Recursive processing maintaining Principle level
    return this.recursiveDescend(segments, 0);
  }
  
  private recursiveDescend(segments: string[], depth: number): PathKnowledge {
    // Unix-style recursive descent
    // Maintains Principle level while projecting Object operations
  }
}
```

## Implementation Strategy

1. **Maintain TAW at Principle Level** - Never descend TAW to Object level
2. **Use NestJS-Genkit as Object Request Broker** - Platform handles Object operations
3. **Implement Recursive Descent** - Unix-style path processing
4. **Project Principles** - Task→Being-Model-Task, Agent→Essence-View-Agent
5. **Orchestrate via Workflow** - Workflow Principle contains projections

## Success Criteria

- TAW remains at Pure Principle/Name level
- Clean projection into Object level via platform
- Recursive descent path processing (not 4-level hierarchy)  
- TaskD as effective Root of UserLand
- Object Request Broker pattern working efficiently

## Fichtean Absolute Principle

### The Absolute Remains Absolute Even When Entering Objectivity

**Core Insight**: TAW and BEC-MVC are **Absolutes** that remain Absolute even when projecting into Object level. Following **Fichte's principle**, the Absolute projects its **sublated organic unity** without losing its Absolute character.

### TAW as Absolute Projection
```
TAW Absolute (Pure Principle)
│
├── Remains Absolute at Principle level
├── Projects sublated organic unity to Object level  
└── Never descends or compromises Absolute nature
```

### Five-fold Synthesis in Reverse
**Return to the moment of Being as One-Sided Projection**:

1. **Concept** (Workflow - highest systematic synthesis)
2. **Essence** (Agent - reflective mediation)
3. **Being** (Task - immediate presence) ← **Return to Being**
4. **Projection** (One-sided projection from Being to Object)
5. **Object** (NestJS-Genkit Object Request Broker)

### Projection as Central Architecture
**Projection emerges as the central organizing principle** for what we're building:

- **NativeGraphFactory** - The projection mechanism itself
- **One-sided projection** from Being (Task) to Object level
- **Sublated organic unity** preserved in projection
- **Absolute character** maintained throughout process
