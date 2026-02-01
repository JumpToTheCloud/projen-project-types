import { Component, DependencyType, JsonFile, Project } from 'projen';
import { NamedInputClass, Nx, TargetDefaultsConfig } from './interfaces/nx';
import { NxNamedInput } from './nx-named-input';
import { NxTargetDefaults } from './nx-target-defaults';

/* declare module 'projen' {
  interface Project {
    nx?: NxWorkspace;
  }
} */
/**
 * Nx versions
 * @default v22
 */
export enum NxVersion {
  /**
   * Nx v22
   * @default
   */
  V22 = '22',

  /**
   * Nx v21
   */
  V21 = '21',

  /**
   * Nx v20
   */
  V20 = '20',

  /**
   * Nx v19
   */
  V19 = '19',
}

// nx-workspace.ts
const NX_ENABLED = Symbol('nx-enabled');
const nxInstances = new WeakMap<Project, NxWorkspace>();
export interface NxEnabledProject extends Project {
  readonly [NX_ENABLED]: true;
  readonly nx: NxWorkspace;
}
// Type guard para verificar si un proyecto tiene NX
export function hasNx(project: Project): project is NxEnabledProject {
  return nxInstances.has(project);
}

export interface NxComponentOptions {
  /**
   * Nx version
   * @default v22
   */
  nxVersion?: NxVersion;
}

export class NxWorkspace extends Component {
  readonly nxVersion: NxVersion;
  private nxConfiguration: Partial<Nx> = {};

  constructor(project: Project, id: string, options?: NxComponentOptions) {
    super(project, id);

    nxInstances.set(project, this);

    Object.defineProperty(project, NX_ENABLED, {
      value: true,
      writable: false,
      enumerable: true,
    });

    Object.defineProperty(project, 'nx', {
      get: () => nxInstances.get(project),
      enumerable: true,
      configurable: false,
    });

    this.nxVersion = options?.nxVersion ?? NxVersion.V22;

    project.deps.addDependency(`nx@^${this.nxVersion}`, DependencyType.DEVENV);

    // Add nx task for general nx commands
    const nxTask = project.addTask('nx', {
      description: 'Run nx commands',
      steps: [{ say: 'Running nx commands', exec: 'nx', receiveArgs: true }],
    });
    nxTask.lock();

    new NxNamedInput(project, 'NxNamedInput');
    new NxTargetDefaults(project, 'NxTargetDefaults');
  }

  addNamedInput(name: string, nameInput: Array<NamedInputClass | string>) {
    if (!this.nxConfiguration.namedInputs) {
      Object.assign(this.nxConfiguration, { namedInputs: {} });
    }
    this.nxConfiguration.namedInputs![name] = nameInput;
  }

  addTargetDefaults(name: string, target: TargetDefaultsConfig) {
    if (!this.nxConfiguration.targetDefaults) {
      Object.assign(this.nxConfiguration, { targetDefaults: {} });
    }
    this.nxConfiguration.targetDefaults![name] = target;
  }

  preSynthesize(): void {
    new JsonFile(this, 'nx.json', {
      obj: {
        $schema: './node_modules/nx/schemas/nx-schema.json',
        ...this.nxConfiguration,
      },
    });
  }
}
