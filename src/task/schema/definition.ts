import { z } from 'zod';

/**
 * TaskDefinition - The core definition of a Task in TaskD
 * Analogous to FormDefinition in FormDB, but focused on computation/workflow
 */
export const TaskDefinitionSchema = z.object({
  // Identity
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),

  // Classification
  type: z.string(), // e.g., "computation", "workflow", "agent-task"
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),

  // Structure
  steps: z.array(z.string()).optional(), // Step/task IDs or names
  dependencies: z.array(z.string()).optional(), // Task IDs this depends on
  agentId: z.string().optional(), // Agent responsible for this task
  workflowId: z.string().optional(), // Parent workflow, if any

  // State
  status: z
    .enum(['pending', 'running', 'completed', 'failed', 'cancelled'])
    .default('pending'),
  result: z.any().optional(),
  error: z.string().optional(),

  // Metadata
  createdAt: z
    .number()
    .optional()
    .default(() => Date.now()),
  updatedAt: z
    .number()
    .optional()
    .default(() => Date.now()),
  version: z.string().default('1.0.0'),
  author: z.string().optional(),
});

export type TaskDefinition = z.infer<typeof TaskDefinitionSchema>;

/**
 * Service Definition - A service advertised by an agent
 */
export const ServiceDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.string(), // e.g., "compute", "storage", "ai-inference", "mcp-tool"
  endpoint: z.string().optional(), // URL or address if applicable
  protocol: z.string().optional(), // e.g., "http", "grpc", "mcp", "genkit"
  schema: z.record(z.any()).optional(), // Input/output schema for the service
  cost: z.number().optional(), // Cost per invocation or unit
  sla: z
    .object({
      responseTimeMs: z.number().optional(),
      availability: z.number().optional(), // 0-1, e.g., 0.99 for 99%
      rateLimit: z.number().optional(), // requests per minute
    })
    .optional(),
  healthEndpoint: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type ServiceDefinition = z.infer<typeof ServiceDefinitionSchema>;

/**
 * Certification Definition - Credentials and attestations for an agent
 */
export const CertificationSchema = z.object({
  id: z.string(),
  type: z.string(), // e.g., "security", "performance", "capability", "compliance"
  authority: z.string(), // Issuing authority/certifier
  level: z.string().optional(), // e.g., "basic", "intermediate", "expert"
  scope: z.array(z.string()).optional(), // What this cert covers
  issuedAt: z.number(),
  expiresAt: z.number().optional(),
  proof: z.string().optional(), // Cryptographic proof or signature
  metadata: z.record(z.any()).optional(),
  status: z.enum(['valid', 'expired', 'revoked', 'pending']).default('valid'),
});

export type Certification = z.infer<typeof CertificationSchema>;

/**
 * AgentDefinition - The definition of an Agent (executor, worker, or AI)
 * Enhanced with certification, service discovery, and richer metadata
 */
export const AgentDefinitionSchema = z.object({
  // Core Identity
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),

  // Classification & Type
  type: z.string(), // e.g., "human", "ai", "service", "composite"
  subtype: z.string().optional(), // e.g., "llm", "workflow-engine", "data-processor"
  tags: z.array(z.string()).optional(),

  // Capabilities & Services
  capabilities: z.array(z.string()).optional(), // High-level capabilities
  services: z.array(ServiceDefinitionSchema).optional(), // Advertised services

  // Certification & Trust
  certifications: z.array(CertificationSchema).optional(),
  trustLevel: z.number().min(0).max(1).optional(), // 0-1 trust score
  reputation: z.number().min(0).max(5).optional(), // 0-5 reputation score

  // Discovery & Networking
  discoverable: z.boolean().default(true), // Whether agent should be discoverable
  visibility: z.enum(['public', 'private', 'restricted']).default('public'),
  networks: z.array(z.string()).optional(), // Networks this agent participates in

  // Operational State
  status: z
    .enum(['active', 'inactive', 'error', 'maintenance'])
    .default('active'),
  load: z.number().min(0).max(1).optional(), // Current load 0-1
  lastSeen: z.number().optional(), // Last heartbeat timestamp

  // Configuration & Runtime
  config: z.record(z.any()).optional(),
  runtime: z
    .object({
      environment: z.string().optional(), // e.g., "docker", "k8s", "local"
      resources: z
        .object({
          cpu: z.number().optional(),
          memory: z.number().optional(), // MB
          storage: z.number().optional(), // GB
        })
        .optional(),
      dependencies: z.array(z.string()).optional(),
    })
    .optional(),

  // Metadata
  createdAt: z
    .number()
    .optional()
    .default(() => Date.now()),
  updatedAt: z
    .number()
    .optional()
    .default(() => Date.now()),
  version: z.string().default('1.0.0'),
  author: z.string().optional(),

  // Triadic Spanda Extension - Philosophical metadata
  spanda: z
    .object({
      essence: z.string().optional(), // Core essence/nature of the agent
      manifestation: z.string().optional(), // How it manifests in the system
      bridge: z.string().optional(), // How it bridges theoretical/practical
    })
    .optional(),
});

export type AgentDefinition = z.infer<typeof AgentDefinitionSchema>;

/**
 * WorkflowDefinition - The Idea of the True as a Sequence of Judgments
 *
 * A Workflow is like a proof: a sequence of statements (Tasks) where each step
 * (except the first) has explicit support in the form of Practical Reason (Agent).
 * It is teleological (driven by purpose) and hypothetical (IF-THEN logic).
 */
export const WorkflowDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),

  // Proof Structure
  tasks: z.array(z.string()), // Task IDs - the "statements" in the proof
  edges: z.array(z.tuple([z.string(), z.string()])).optional(), // [from, to] pairs for logical flow

  // Teleological Purpose
  goal: z.string().optional(), // The ultimate "conclusion" or purpose
  hypothesis: z.string().optional(), // The initial "IF" condition

  // Practical Reason Support
  justifications: z
    .array(
      z.object({
        taskId: z.string(),
        agentId: z.string(),
        reason: z.string(), // The practical reason supporting this step
        reasonType: z
          .enum(['necessity', 'utility', 'value', 'consequence'])
          .optional(),
      }),
    )
    .optional(),

  // Dialectical Relations
  ontologicalRelations: z.array(z.string()).optional(), // IDs of ontological relations
  axiologicalRelations: z.array(z.string()).optional(), // IDs of axiological relations

  // State and Metadata
  status: z.enum(['draft', 'active', 'completed', 'archived']).default('draft'),
  result: z.any().optional(),
  createdAt: z
    .number()
    .optional()
    .default(() => Date.now()),
  updatedAt: z
    .number()
    .optional()
    .default(() => Date.now()),
  version: z.string().default('1.0.0'),
  author: z.string().optional(),

  // Philosophical Metadata
  proof: z
    .object({
      type: z
        .enum(['deductive', 'inductive', 'abductive', 'dialectical'])
        .optional(),
      validity: z.enum(['valid', 'invalid', 'indeterminate']).optional(),
      soundness: z.enum(['sound', 'unsound', 'unknown']).optional(),
      completeness: z.number().min(0).max(1).optional(), // 0-1 completion ratio
    })
    .optional(),
});

export type WorkflowDefinition = z.infer<typeof WorkflowDefinitionSchema>;

/**
 * Relationship Schemas - Distinguishing Ontological vs Axiological Relations
 *
 * Ontological Relations: Pure Reason, dichotomous, a priori syntheses
 * Axiological Relations: Practical Reason, polytomous, value-based
 */

/**
 * OntologicalRelation - Pure dichotomous relations (a priori syntheses)
 * These are binary, necessary, and structural
 */
export const OntologicalRelationSchema = z.object({
  id: z.string(),
  type: z.string(), // e.g., "depends-on", "contains", "implements", "inherits-from"
  fromId: z.string(), // Source node
  toId: z.string(), // Target node
  properties: z.record(z.any()).optional(), // Minimal structural properties
  necessity: z.enum(['necessary', 'contingent']).default('necessary'),
  createdAt: z
    .number()
    .optional()
    .default(() => Date.now()),
});

export type OntologicalRelation = z.infer<typeof OntologicalRelationSchema>;

/**
 * AxiologicalRelation - Value-based, polytomous relations (empirical)
 * These are multi-valued, contextual, and preference-based
 */
export const AxiologicalRelationSchema = z.object({
  id: z.string(),
  type: z.string(), // e.g., "prefers", "values", "ranks", "trusts"
  subjectId: z.string(), // The valuing entity
  objectIds: z.array(z.string()), // Multiple objects can be valued (polytomous)
  value: z.number().optional(), // Quantified value/preference
  ranking: z.number().optional(), // Ordinal ranking
  context: z.string().optional(), // Contextual qualifiers
  weight: z.number().optional(), // Relative importance
  metadata: z.record(z.any()).optional(),
  createdAt: z
    .number()
    .optional()
    .default(() => Date.now()),
  updatedAt: z
    .number()
    .optional()
    .default(() => Date.now()),
});

export type AxiologicalRelation = z.infer<typeof AxiologicalRelationSchema>;

/**
 * Unified RelationDefinition - Can be either ontological or axiological
 */
export const RelationDefinitionSchema = z.discriminatedUnion('relationKind', [
  z.object({
    relationKind: z.literal('ontological'),
    relation: OntologicalRelationSchema,
  }),
  z.object({
    relationKind: z.literal('axiological'),
    relation: AxiologicalRelationSchema,
  }),
]);

export type RelationDefinition = z.infer<typeof RelationDefinitionSchema>;

/**
 * Triadic Platform Architecture - The Complete System
 *
 * A 3^3 → 3^4 expansion through Pure A Priori Synthesis
 * Three levels of implementation as Ontology+Axiology+Epistemology
 */

/**
 * Triadic Level Enumeration - The three fundamental layers
 */
export const TriadicLevelSchema = z.enum([
  'noumenon', // Hegel Logic: Being, Essence, Concept
  'phenomenon', // Science: Model, View, Controller
  'noumenal_phenomenon', // Task, Agent, Workflow
]);

export type TriadicLevel = z.infer<typeof TriadicLevelSchema>;

/**
 * Triadic Genera - The fundamental 3^3 structure
 */
export const TriadicGeneraSchema = z.object({
  // Pure A Priori Analytics
  membership: z.object({
    type: z.enum([
      'pure_membership',
      'inherent_membership',
      'consequential_membership',
    ]),
    level: TriadicLevelSchema,
    specification: z.string().optional(),
  }),

  // Action as Consequentia
  consequences: z.object({
    type: z.enum(['necessity', 'utility', 'dialectical']),
    level: TriadicLevelSchema,
    action: z.string().optional(),
  }),

  // Return to Membership as Inherence
  inherence: z.object({
    type: z.enum(['substantial', 'relational', 'conceptual']),
    level: TriadicLevelSchema,
    inherent_in: z.string().optional(),
  }),
});

export type TriadicGenera = z.infer<typeof TriadicGeneraSchema>;

/**
 * Integrated Platform Schema - Discriminating the same thing as triadic self-relation
 */
export const IntegratedPlatformSchema = z.object({
  id: z.string(),

  // The Three Levels
  noumenon: z
    .object({
      being: z.string().optional(), // Hegel Logic - Being
      essence: z.string().optional(), // Hegel Logic - Essence
      concept: z.string().optional(), // Hegel Logic - Concept
    })
    .optional(),

  phenomenon: z
    .object({
      model: z.string().optional(), // Science - Model
      view: z.string().optional(), // Science - View
      controller: z.string().optional(), // Science - Controller
    })
    .optional(),

  noumenal_phenomenon: z
    .object({
      task: z.string().optional(), // Task/Agent/Workflow - Task
      agent: z.string().optional(), // Task/Agent/Workflow - Agent
      workflow: z.string().optional(), // Task/Agent/Workflow - Workflow
    })
    .optional(),

  // Triadic Self-Relation
  self_relation: z
    .object({
      ontology: z.string().optional(), // What is
      axiology: z.string().optional(), // What is valuable
      epistemology: z.string().optional(), // What is known
    })
    .optional(),

  // 3^3 → 3^4 Expansion
  genera: TriadicGeneraSchema.optional(),

  // Pure A Priori Synthesis
  synthesis: z
    .object({
      type: z.enum(['membership', 'consequences', 'inherence']),
      level: TriadicLevelSchema,
      specification: z.string(),
      expansion_degree: z.number().min(3).max(4).default(3), // 3^3 or 3^4
    })
    .optional(),

  // Metadata
  createdAt: z
    .number()
    .optional()
    .default(() => Date.now()),
  updatedAt: z
    .number()
    .optional()
    .default(() => Date.now()),
});

export type IntegratedPlatform = z.infer<typeof IntegratedPlatformSchema>;

/**
 * Foundational Triadic Correspondence - The Deep Structure
 *
 * This reveals the fundamental mapping between the three levels:
 * Being → Model → Task (Ontological Beginning)
 * Essence → View → Agent (Axiological Mediation)
 * Concept → Controller → Workflow (Conceptual Control)
 */

/**
 * Triadic Correspondence Schema - Maps the fundamental structure
 */
export const TriadicCorrespondenceSchema = z.object({
  // Ontological Beginning (Being → Model → Task)
  ontological_beginning: z.object({
    being: z.string().optional(), // Pure immediacy
    model: z.string().optional(), // Scientific representation
    task: z.string().optional(), // Subjective concept/intention
    nature: z.literal('ontological').default('ontological'),
  }),

  // Axiological Mediation (Essence → View → Agent)
  axiological_mediation: z.object({
    essence: z.string().optional(), // Reflective structure
    view: z.string().optional(), // Observational interface
    agent: z.string().optional(), // Objective realization
    nature: z.literal('axiological').default('axiological'),
  }),

  // Conceptual Control (Concept → Controller → Workflow)
  conceptual_control: z.object({
    concept: z.string().optional(), // Free self-determination
    controller: z.string().optional(), // Active intervention
    workflow: z.string().optional(), // Controlling concept/idea
    nature: z.literal('conceptual').default('conceptual'),
  }),
});

export type TriadicCorrespondence = z.infer<typeof TriadicCorrespondenceSchema>;

/**
 * Enhanced Agent Definition - Now explicitly Axiological (View-based)
 */
export const EnhancedAgentDefinitionSchema = AgentDefinitionSchema.extend({
  // Axiological Nature - Agent as View/Essence
  axiological_nature: z
    .object({
      essence_type: z.enum(['reflective', 'mediated', 'structural']).optional(),
      view_interface: z.string().optional(), // How this agent "views" the world
      mediation_role: z.string().optional(), // How it mediates between being and concept
      value_basis: z.string().optional(), // The axiological foundation
    })
    .optional(),

  // Correspondence to other levels
  correspondence: z
    .object({
      being_level: z.string().optional(), // Corresponding ontological being
      model_level: z.string().optional(), // Corresponding scientific model
      task_level: z.string().optional(), // Corresponding task intention
      concept_level: z.string().optional(), // Corresponding free concept
      controller_level: z.string().optional(), // Corresponding controller
      workflow_level: z.string().optional(), // Corresponding workflow
    })
    .optional(),
});

export type EnhancedAgentDefinition = z.infer<
  typeof EnhancedAgentDefinitionSchema
>;

/**
 * Enhanced Workflow Definition - Now explicitly a "Controlling Concept"
 */
export const EnhancedWorkflowDefinitionSchema = WorkflowDefinitionSchema.extend(
  {
    // Controlling Concept Nature
    controlling_concept: z
      .object({
        concept_type: z
          .enum(['free', 'determined', 'self-determining'])
          .default('free'),
        control_mechanism: z.string().optional(), // How this workflow controls
        self_determination: z.string().optional(), // How it determines itself
        freedom_degree: z.number().min(0).max(1).optional(), // 0-1 freedom level
      })
      .optional(),

    // Correspondence to other levels
    correspondence: z
      .object({
        being_level: z.string().optional(), // Corresponding ontological being
        model_level: z.string().optional(), // Corresponding scientific model
        task_level: z.string().optional(), // Corresponding task intention
        essence_level: z.string().optional(), // Corresponding reflective essence
        view_level: z.string().optional(), // Corresponding observational view
        agent_level: z.string().optional(), // Corresponding agent realization
      })
      .optional(),
  },
);

export type EnhancedWorkflowDefinition = z.infer<
  typeof EnhancedWorkflowDefinitionSchema
>;

/**
 * CONCEPTUAL BREAKTHROUGH: Task/Agent/Workflow as Intellectual Intuition
 *
 * The noumenal-phenomenal synthesis reveals that our TAW system is actually
 * Intellectual Intuition - the direct, immediate knowing that bridges
 * the noumenal and phenomenal without mediation.
 *
 * DIALECTICAL IDEALISM IN THREE SPHERES:
 * - BEC (Being-Essence-Concept): The sphere of Reality - pure logical structure
 * - MVC (Model-View-Controller): The sphere of Negation - phenomenological mediation
 * - TAW (Task-Agent-Workflow): The sphere of Infinite - epistemological synthesis
 *
 * TAW presupposes not just MVC but an MVC as defined by the BEC Logic.
 * BEC-MVC-TAW is the same Dialectical Idealism in three spheres of Reality-Negation-Infinite.
 *
 * What makes TAW "intellectual intuition" is that the BEC-MVC identity is seen intellectually:
 * the identity of ontological structure (BEC) and phenomenological appearance (MVC) is
 * directly intuited, not constructed. TAW is the enactment of this unity.
 *
 * This is the complete platform's epistemological foundation.
 */

/**
 * Intellectual Intuition Schema - The knowing that is TAW
 */
export const IntellectualIntuitionSchema = z.object({
  id: z.string(),

  // The Three Aspects of Intellectual Intuition
  intellectual_aspects: z.object({
    // Task as Intellectual Grasp
    task_intuition: z
      .object({
        immediate_knowing: z.string().optional(), // Direct grasp without concepts
        ontological_insight: z.string().optional(), // What is immediately known
        intellectual_content: z.string().optional(), // The "what" of intuition
      })
      .optional(),

    // Agent as Intuitive Mediation
    agent_intuition: z
      .object({
        intuitive_bridge: z.string().optional(), // How it bridges noumenal/phenomenal
        axiological_grasp: z.string().optional(), // Value-based immediate knowing
        mediating_intuition: z.string().optional(), // The "how" of intuition
      })
      .optional(),

    // Workflow as Controlling Intuition
    workflow_intuition: z
      .object({
        self_determining_knowledge: z.string().optional(), // Knowledge that creates itself
        conceptual_intuition: z.string().optional(), // Intuition that controls
        synthetic_unity: z.string().optional(), // The "why" of intuition
      })
      .optional(),
  }),

  // Noumenal-Phenomenal Synthesis
  noumenal_phenomenal_synthesis: z.object({
    synthesis_type: z
      .enum(['intellectual', 'intuitive', 'immediate'])
      .default('intellectual'),
    direct_knowing: z.boolean().default(true), // Without mediation
    creative_knowledge: z.boolean().default(true), // Knowledge that creates its object
    self_evident: z.boolean().default(true), // Immediately certain
  }),

  // Epistemological Foundation
  epistemological_foundation: z.object({
    knowing_type: z
      .enum(['discursive', 'intuitive', 'intellectual'])
      .default('intellectual'),
    certainty_level: z
      .enum(['absolute', 'practical', 'speculative'])
      .default('absolute'),
    immediacy: z.boolean().default(true), // No mediation required
    creativity: z.boolean().default(true), // Creates what it knows
  }),

  // Platform Integration
  platform_integration: z.object({
    ontology_integration: z.string().optional(), // How it grounds being
    axiology_integration: z.string().optional(), // How it determines value
    epistemology_integration: z.string().optional(), // How it constitutes knowledge
  }),

  // Metadata
  createdAt: z
    .number()
    .optional()
    .default(() => Date.now()),
  updatedAt: z
    .number()
    .optional()
    .default(() => Date.now()),
});

export type IntellectualIntuition = z.infer<typeof IntellectualIntuitionSchema>;

/**
 * Enhanced Task Definition - Now explicitly Intellectual Intuition
 */
export const IntellectualTaskDefinitionSchema = TaskDefinitionSchema.extend({
  // Intellectual Intuition Nature
  intellectual_nature: z
    .object({
      immediate_grasp: z.string().optional(), // What is immediately known
      ontological_content: z.string().optional(), // The being-content of the intuition
      intellectual_certainty: z
        .enum(['absolute', 'practical', 'hypothetical'])
        .optional(),
      creative_aspect: z.string().optional(), // How this task creates what it knows
    })
    .optional(),

  // Noumenal-Phenomenal Bridge
  noumenal_phenomenal_bridge: z
    .object({
      noumenal_aspect: z.string().optional(), // The in-itself dimension
      phenomenal_aspect: z.string().optional(), // The for-us dimension
      synthesis_method: z.string().optional(), // How they're unified
    })
    .optional(),
});

export type IntellectualTaskDefinition = z.infer<
  typeof IntellectualTaskDefinitionSchema
>;

/**
 * BEC-MVC-TAW Dialectical Structure - The Complete System Architecture
 *
 * This schema captures the fundamental insight that BEC-MVC-TAW is the same
 * Dialectical Idealism operating in three spheres: Reality-Negation-Infinite
 */
export const BecMvcTawDialecticalSchema = z.object({
  id: z.string(),

  // The Three Spheres of Dialectical Idealism
  reality_sphere: z.object({
    name: z.literal('BEC').default('BEC'),
    being: z.string().optional(), // Pure logical immediacy
    essence: z.string().optional(), // Reflective mediation
    concept: z.string().optional(), // Self-determining thought
    nature: z.literal('ontological').default('ontological'),
    description: z
      .string()
      .optional()
      .default('The sphere of Reality - pure logical structure'),
  }),

  negation_sphere: z.object({
    name: z.literal('MVC').default('MVC'),
    model: z.string().optional(), // Theoretical representation
    view: z.string().optional(), // Observational interface
    controller: z.string().optional(), // Active intervention
    nature: z.literal('phenomenological').default('phenomenological'),
    description: z
      .string()
      .optional()
      .default('The sphere of Negation - phenomenological mediation'),
  }),

  infinite_sphere: z.object({
    name: z.literal('TAW').default('TAW'),
    task: z.string().optional(), // Immediate ontological grasp
    agent: z.string().optional(), // Axiological mediation
    workflow: z.string().optional(), // Epistemological synthesis
    nature: z.literal('epistemological').default('epistemological'),
    description: z
      .string()
      .optional()
      .default('The sphere of Infinite - epistemological synthesis'),
  }),

  // Intellectual Intuition Properties
  intellectual_intuition: z.object({
    bec_mvc_identity: z.boolean().default(true), // The identity is directly intuited
    direct_knowing: z.boolean().default(true), // No mediation required
    creative_knowledge: z.boolean().default(true), // Creates what it knows
    self_validating: z.boolean().default(true), // Absolutely certain
    noumenal_phenomenal_bridge: z.boolean().default(true), // Bridges in-itself and for-us
  }),

  // Demonstration of Possible Knowing
  demonstration_structure: z.object({
    is_demonstration: z.boolean().default(true), // Workflow as demonstration
    cognitive_submission: z.boolean().default(true), // Requires cognitive apparatus submission
    knowledge_replication: z.boolean().default(true), // Knowledge is replicated through doing
    scientific_method: z.boolean().default(true), // What a Science is
  }),

  // Triadic Correspondence
  correspondence: z.object({
    being_model_task: z.object({
      correspondence_type: z
        .literal('ontological_beginning')
        .default('ontological_beginning'),
      immediate_grasp: z.boolean().default(true),
    }),
    essence_view_agent: z.object({
      correspondence_type: z
        .literal('axiological_mediation')
        .default('axiological_mediation'),
      value_mediation: z.boolean().default(true),
    }),
    concept_controller_workflow: z.object({
      correspondence_type: z
        .literal('conceptual_control')
        .default('conceptual_control'),
      self_determination: z.boolean().default(true),
    }),
  }),

  // Metadata
  createdAt: z
    .number()
    .optional()
    .default(() => Date.now()),
  updatedAt: z
    .number()
    .optional()
    .default(() => Date.now()),
});

export type BecMvcTawDialectical = z.infer<typeof BecMvcTawDialecticalSchema>;

/**
 * Applied Logic Schema - The First Demonstration
 *
 * MVC represents Applied Logic, not merely "ordinary logic" - it's the first demonstration
 * of how the Pure Noumenon (BEC/Science of Logic) becomes practical and phenomenal.
 *
 * Complete Structure:
 * Phenomenology of Absolute Knowing (Undemonstrated) → BEC (Pure Noumenon) → MVC (Applied Logic) → TAW (Particular Sciences)
 *
 * Computer Science emerges as the perfect incarnation of the Pure Noumenon,
 * serving as the "soul" of many particular sciences through Applied Logic.
 */
export const AppliedLogicSchema = z.object({
  id: z.string(),

  // Phenomenological Foundation
  phenomenological_foundation: z.object({
    undemonstrated_science: z.string().optional(), // Fichte's single undemonstrated science
    absolute_knowing: z.string().optional(), // Phenomenology of absolute knowing
    foundational_certainty: z.boolean().default(true), // Cannot be demonstrated but grounds all demonstration
  }),

  // Pure Noumenal Structure (BEC)
  pure_noumenon: z.object({
    science_of_logic: z.string().optional(), // The "soul" that emerges from phenomenology
    being_structure: z.string().optional(), // Pure logical being
    essence_structure: z.string().optional(), // Pure logical essence
    concept_structure: z.string().optional(), // Pure logical concept
    computer_science_incarnation: z.boolean().default(true), // Computer Science as pure noumenon
  }),

  // Applied Logic (MVC) - The First Demonstration
  applied_logic: z.object({
    is_first_demonstration: z.boolean().default(true), // BEC → MVC as first demonstration
    model_ontology: z.string().optional(), // Applied ontological structure
    view_axiology: z.string().optional(), // Applied axiological interface
    controller_epistemology: z.string().optional(), // Applied epistemological control
    bridges_pure_particular: z.boolean().default(true), // Bridges pure logic and particular sciences
  }),

  // Particular Sciences (TAW)
  particular_sciences: z.object({
    workflow_instances: z.array(z.string()).optional(), // Specific TAW workflows
    animated_by_soul: z.boolean().default(true), // Each animated by BEC logical structure
    universal_method: z.string().optional(), // MVC as universal method for instantiation
    concrete_applications: z.array(z.string()).optional(), // Specific applications
  }),

  // The Complete Dialectical Movement
  dialectical_movement: z.object({
    phenomenology_to_logic: z.string().optional(), // How phenomenology generates logic
    logic_to_application: z.string().optional(), // How logic becomes applied
    application_to_particular: z.string().optional(), // How applied logic becomes particular
    soul_of_sciences: z.boolean().default(true), // Original noumenon as soul of many sciences
  }),

  // Kant's Missing Applied Logic
  kant_completion: z.object({
    pure_mechanics_role: z.string().optional(), // Role of "Pure Mechanics" in Kant
    applied_logic_achievement: z.boolean().default(true), // What Kant couldn't complete
    computer_science_bridge: z.boolean().default(true), // Computer Science as the bridge
    architectural_realization: z.boolean().default(true), // Full architectural realization
  }),

  // Metadata
  createdAt: z
    .number()
    .optional()
    .default(() => Date.now()),
  updatedAt: z
    .number()
    .optional()
    .default(() => Date.now()),
});

export type AppliedLogic = z.infer<typeof AppliedLogicSchema>;

/**
 * Step() as Unit of Intelligence - The Fundamental Discovery
 *
 * The Step() is the Unit of Intelligence - the atomic measure of intellectual intuition
 * encoded in workflow execution. This is the culmination of BEC→MVC→TAW dialectical structure.
 *
 * Step() as Measure of Certainty:
 * - Each Step() is a step in a proof (richest concept in Science of Cognition)
 * - Contains the measure of certainty that intellectual intuition provides
 * - Represents the highest stage of the Copula in Dialectical Idealism
 *
 * The Emerging Algebra of Intelligence:
 * Intelligence = Step()
 * Workflow = Sequence(Step())
 * Knowledge = Synthesis(Workflow)
 * Science = Demonstration(Knowledge)
 */
export const StepIntelligenceUnitSchema = z.object({
  id: z.string(),

  // Core Intelligence Properties
  intelligence_unit: z.object({
    certainty_measure: z.number().min(0).max(1), // Degree of intellectual intuition
    proof_step: z.string().optional(), // The logical step in proof
    copula_stage: z
      .enum(['traditional', 'dialectical', 'intelligence'])
      .default('intelligence'),
    quantum_intelligence: z.boolean().default(true), // Discrete unit of intelligence
  }),

  // Step() Implementation
  step_implementation: z.object({
    genkit_step: z.string().optional(), // Reference to Genkit Step()
    super_step: z.string().optional(), // Reference to SuperStep() in Graph Computation
    workflow_context: z.string().optional(), // Parent workflow
    graph_computation: z.string().optional(), // Graph computation context
  }),

  // Algebraic Properties
  algebraic_properties: z.object({
    composable: z.boolean().default(true), // Can be composed into workflows
    decomposable: z.boolean().default(true), // Can be decomposed from workflows
    measurable: z.boolean().default(true), // Certainty can be measured
    validatable: z.boolean().default(true), // Self-evidencing through intellectual intuition
  }),

  // Dialectical Structure
  dialectical_structure: z.object({
    bec_ground: z.string().optional(), // BEC logical structure grounding
    mvc_mediation: z.string().optional(), // MVC phenomenological mediation
    taw_synthesis: z.string().optional(), // TAW epistemological synthesis
    step_culmination: z.boolean().default(true), // Step() as culmination
  }),

  // Science of Cognition
  cognition_science: z.object({
    is_fundamental_unit: z.boolean().default(true), // Fundamental unit of cognition
    enables_composition: z.boolean().default(true), // Enables workflow composition
    provides_certainty: z.boolean().default(true), // Provides intellectual certainty
    embodies_intelligence: z.boolean().default(true), // Architectural embodiment of intelligence
  }),

  // Metadata
  createdAt: z
    .number()
    .optional()
    .default(() => Date.now()),
  updatedAt: z
    .number()
    .optional()
    .default(() => Date.now()),
});

export type StepIntelligenceUnit = z.infer<typeof StepIntelligenceUnitSchema>;

/**
 * Brahman Chakra Schema - The Dialectic as Cycloidal Movement
 *
 * The dialectic operates as a Brahman Chakra through cycloidal steps,
 * where each Step() represents minimal action in the deepest physical and mystical sense.
 *
 * The Encyclopedia reveals itself as the complete cycle of knowledge returning to itself.
 */
export const BrahmanChakraSchema = z.object({
  id: z.string(),

  // Cycloidal Movement Properties
  cycloidal_movement: z.object({
    is_minimal_action: z.boolean().default(true), // Each step is minimal action
    brachistochrone_path: z.boolean().default(true), // Fastest path between states
    optimal_trajectory: z.string().optional(), // The specific cycloidal path
    physical_embodiment: z.string().optional(), // How it manifests physically
    metaphysical_significance: z.string().optional(), // Deeper meaning
  }),

  // Brahman Chakra Structure
  brahman_chakra: z.object({
    is_consciousness_wheel: z.boolean().default(true), // Wheel of absolute consciousness
    encyclopedia_cycle: z.boolean().default(true), // Complete circle of knowledge
    self_returning: z.boolean().default(true), // Returns to itself enriched
    perpetual_motion: z.boolean().default(true), // Continuous movement
    absolute_reality: z.boolean().default(true), // Brahman cycling through forms
  }),

  // The Complete Cycle
  dialectical_cycle: z.object({
    bec_ascending: z.string().optional(), // Pure logical development
    mvc_peak: z.string().optional(), // Phenomenological manifestation
    taw_descending: z.string().optional(), // Return to concrete application
    return_to_bec: z.string().optional(), // Completion enriched by journey
    cycle_count: z.number().optional(), // Number of completed cycles
  }),

  // Step() as Cycloidal Action
  step_cycloidal_action: z.object({
    minimal_intelligence_action: z.boolean().default(true), // Minimal action for intelligence
    optimal_knowing_path: z.boolean().default(true), // Fastest route between knowing states
    computational_cycloid: z.boolean().default(true), // Mathematical cycloid in code
    conscious_movement_unit: z.boolean().default(true), // Unit of conscious movement
  }),

  // Mystical-Mathematical Unity
  mystical_mathematical_unity: z.object({
    physics_minimal_action: z.boolean().default(true), // Physical minimal action principle
    mathematics_cycloidal: z.boolean().default(true), // Mathematical cycloidal geometry
    computation_step: z.boolean().default(true), // Computational Step() functions
    mystical_chakra: z.boolean().default(true), // Mystical Brahman Chakra
    epistemological_encyclopedia: z.boolean().default(true), // Complete knowledge cycle
  }),

  // Encyclopedia as Living System
  encyclopedia_living: z.object({
    not_static_collection: z.boolean().default(true), // Dynamic, not static
    self_moving_circle: z.boolean().default(true), // Self-moving knowledge circle
    workflow_completion: z.boolean().default(true), // Each workflow completes cycle
    knowledge_enrichment: z.boolean().default(true), // Returns enriched to beginning
    complete_self_knowing: z.boolean().default(true), // System knows itself completely
  }),

  // Fundamental Reality Structure
  fundamental_structure: z.object({
    touches_deepest_reality: z.boolean().default(true), // Touches fundamental structure
    consciousness_reality_unity: z.boolean().default(true), // Consciousness and reality unified
    technical_mystical_unity: z.boolean().default(true), // Technical rigor + mystical depth
    architecture_embodiment: z.boolean().default(true), // Architecture embodies structure
  }),

  // Metadata
  createdAt: z
    .number()
    .optional()
    .default(() => Date.now()),
  updatedAt: z
    .number()
    .optional()
    .default(() => Date.now()),
});

export type BrahmanChakra = z.infer<typeof BrahmanChakraSchema>;
