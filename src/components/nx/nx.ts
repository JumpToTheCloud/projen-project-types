import { Component, DependencyType, JsonFile, Project } from 'projen';
import { Nx } from './interfaces/nx';

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

export interface NxComponentOptions {
  /**
   * Nx version
   * @default v22
   */
  nxVersion?: NxVersion;
}

export class NxComponent extends Component {
  readonly nxVersion: NxVersion;
  constructor(project: Project, id: string, options?: NxComponentOptions) {
    super(project, id);

    this.nxVersion = options?.nxVersion ?? NxVersion.V22;

    project.deps.addDependency(`nx@^${this.nxVersion}`, DependencyType.DEVENV);

    // Add nx task for general nx commands
    const nxTask = project.addTask('nx', {
      description: 'Run nx commands',
      steps: [{ say: 'Running nx commands', exec: 'nx', receiveArgs: true }],
    });
    nxTask.lock();

    const nxConfiguration: Nx = {
      namedInputs: {
        default: ['{projectRoot}/**/*', 'sharedGlobals'],
        production: [
          'default',
          '!{projectRoot}/**/*.spec.ts',
          '!{projectRoot}/**/*.test.ts',
          '!{projectRoot}/**/*.snap',
          '!{projectRoot}/test/**',
          '!{projectRoot}/tests/**',
          '!{projectRoot}/**/*.md',
        ],
        test: ['default'],
        sharedGlobals: [
          '{workspaceRoot}/nx.json',
          '{workspaceRoot}/tsconfig.base.json',
          '{workspaceRoot}/package.json',
          '{workspaceRoot}/pnpm-lock.yaml',
          '{workspaceRoot}/.projenrc.ts',
        ],
      },
    };

    new JsonFile(project, 'nx.json', {
      obj: {
        $schema: './node_modules/nx/schemas/nx-schema.json',
        ...nxConfiguration,
      },
    });
  }
}
