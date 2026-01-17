export interface ProviderDefinition {
  readonly $schema: string;
  readonly $id: string;
  readonly title: string;
  readonly description: string;
  readonly definitions: Definitions;
  readonly type: string;
  readonly patternProperties: ProviderDefinitionPatternProperties;
  readonly properties: ProviderDefinitionProperties;
  readonly required: string[];
  readonly additionalProperties: boolean;
}

export interface Definitions {
  readonly handlerSchema: HandlerSchema;
  readonly handlerDefinitionWithSchemaOverride: HandlerDefinitionWithSchemaOverride;
  readonly handlerDefinition: HandlerDefinition;
  readonly replacementStrategy: ReplacementStrategy;
  readonly resourceLink: ResourceLink;
}

export interface HandlerDefinition {
  readonly description: string;
  readonly type: string;
  readonly properties: HandlerDefinitionProperties;
  readonly additionalProperties: boolean;
  readonly required: string[];
}

export interface HandlerDefinitionProperties {
  readonly permissions: Permissions;
  readonly timeoutInMinutes: TimeoutInMinutes;
}

export interface Permissions {
  readonly type: string;
  readonly items: AZaZ09164$;
  readonly additionalItems: boolean;
}

export interface AZaZ09164$ {
  readonly type: string;
}

export interface TimeoutInMinutes {
  readonly description: string;
  readonly type: string;
  readonly minimum: number;
  readonly maximum: number;
  readonly default: number;
}

export interface HandlerDefinitionWithSchemaOverride {
  readonly description: string;
  readonly type: string;
  readonly properties: HandlerDefinitionWithSchemaOverrideProperties;
  readonly additionalProperties: boolean;
  readonly required: string[];
}

export interface HandlerDefinitionWithSchemaOverrideProperties {
  readonly handlerSchema: ID;
  readonly permissions: Permissions;
  readonly timeoutInMinutes: TimeoutInMinutes;
}

export interface ID {
  readonly $ref: string;
}

export interface HandlerSchema {
  readonly type: string;
  readonly properties: HandlerSchemaProperties;
  readonly required: string[];
  readonly additionalProperties: boolean;
}

export interface HandlerSchemaProperties {
  readonly properties: ID;
  readonly required: ID;
  readonly allOf: ID;
  readonly anyOf: ID;
  readonly oneOf: ID;
}

export interface ReplacementStrategy {
  readonly type: string;
  readonly description: string;
  readonly default: string;
  readonly enum: string[];
}

export interface ResourceLink {
  readonly type: string;
  readonly properties: ResourceLinkProperties;
  readonly required: string[];
  readonly additionalProperties: boolean;
}

export interface ResourceLinkProperties {
  readonly $comment: ID;
  readonly templateUri: TemplateURI;
  readonly mappings: Mappings;
}

export interface Mappings {
  readonly type: string;
  readonly patternProperties: MappingsPatternProperties;
  readonly additionalProperties: boolean;
}

export interface MappingsPatternProperties {
  readonly '^[A-Za-z0-9]{1,64}$': PurpleAZaZ09164$;
}

export interface PurpleAZaZ09164$ {
  readonly type: string;
  readonly format: string;
}

export interface TemplateURI {
  readonly type: string;
  readonly pattern: string;
}

export interface ProviderDefinitionPatternProperties {
  readonly '^\\$id$': ID;
}

export interface ProviderDefinitionProperties {
  readonly $schema: ID;
  readonly type: Type;
  readonly typeName: DocumentationURL;
  readonly $comment: ID;
  readonly title: ID;
  readonly description: AdditionalProperties;
  readonly sourceUrl: DocumentationURL;
  readonly documentationUrl: DocumentationURL;
  readonly taggable: Taggable;
  readonly tagging: Tagging;
  readonly replacementStrategy: AdditionalProperties;
  readonly additionalProperties: AdditionalProperties;
  readonly properties: ID;
  readonly definitions: ID;
  readonly handlers: Handlers;
  readonly remote: ConditionalCreateOnlyProperties;
  readonly readOnlyProperties: ConditionalCreateOnlyProperties;
  readonly writeOnlyProperties: ConditionalCreateOnlyProperties;
  readonly conditionalCreateOnlyProperties: ConditionalCreateOnlyProperties;
  readonly nonPublicProperties: ConditionalCreateOnlyProperties;
  readonly nonPublicDefinitions: ConditionalCreateOnlyProperties;
  readonly createOnlyProperties: ConditionalCreateOnlyProperties;
  readonly deprecatedProperties: ConditionalCreateOnlyProperties;
  readonly primaryIdentifier: ConditionalCreateOnlyProperties;
  readonly additionalIdentifiers: AdditionalIdentifiers;
  readonly required: ID;
  readonly allOf: ID;
  readonly anyOf: ID;
  readonly oneOf: ID;
  readonly resourceLink: ConditionalCreateOnlyProperties;
  readonly propertyTransform: PropertyTransform;
  readonly typeConfiguration: ConditionalCreateOnlyProperties;
}

export interface AdditionalIdentifiers {
  readonly description: string;
  readonly type: string;
  readonly minItems: number;
  readonly items: ID;
}

export interface AdditionalProperties {
  readonly $comment: string;
  readonly $ref: string;
}

export interface ConditionalCreateOnlyProperties {
  readonly description: string;
  readonly $ref: string;
}

export interface DocumentationURL {
  readonly $comment: string;
  readonly examples: string[];
  readonly $ref: string;
}

export interface Handlers {
  readonly description: string;
  readonly type: string;
  readonly properties: HandlersProperties;
  readonly additionalProperties: boolean;
}

export interface HandlersProperties {
  readonly create: ID;
  readonly read: ID;
  readonly update: ID;
  readonly delete: ID;
  readonly list: ID;
}

export interface PropertyTransform {
  readonly description: string;
  readonly type: string;
  readonly patternProperties: PropertyTransformPatternProperties;
}

export interface PropertyTransformPatternProperties {
  readonly '^[A-Za-z0-9]{1,64}$': AZaZ09164$;
}

export interface Taggable {
  readonly description: string;
  readonly type: string;
  readonly default: boolean;
}

export interface Tagging {
  readonly type: string;
  readonly properties: TaggingProperties;
  readonly required: string[];
  readonly additionalProperties: boolean;
}

export interface TaggingProperties {
  readonly taggable: Taggable;
  readonly tagOnCreate: Taggable;
  readonly tagUpdatable: Taggable;
  readonly cloudFormationSystemTags: Taggable;
  readonly tagProperty: TagProperty;
  readonly permissions: Permissions;
}

export interface TagProperty {
  readonly description: string;
  readonly $ref: string;
  readonly default: string;
}

export interface Type {
  readonly $comment: string;
  readonly type: string;
  readonly const: string;
}
