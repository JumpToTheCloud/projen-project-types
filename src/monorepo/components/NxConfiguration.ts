import { Component, JsonFile, Project } from 'projen';
import {
  NxConfiguration,
  TargetDefaults,
  TaskRunnerOptions,
} from '../interfaces';

export class NxConfigurations extends Component {
  private targetDefaults: Map<string, any> = new Map();
  private taskRunner: Map<string, any> = new Map();

  constructor(project: Project, id: string) {
    super(project, id);

    this.addTargetDefaults({
      name: 'default',
      inputs: ['default', '^default'],
      outputs: [
        '{projectRoot}/dist',
        '{projectRoot}/lib',
        '{projectRoot}/build',
        '{projectRoot}/coverage',
        '{projectRoot}/test-reports',
        '{projectRoot}/target',
        '{projectRoot}/cdk.out',
        '{projectRoot}/LICENSE_THIRD_PARTY',
        '{projectRoot}/.jsii',
      ],
      dependsOn: ['^build'],
    });

    this.addTargetDefaults({
      name: 'build',
      dependsOn: ['^build'],
    });

    this.addTaskRunner({
      name: 'default',
      runner: 'nx/tasks-runners/default',
      options: {
        cacheableOperations: ['build', 'test'],
      },
    });

    const config: NxConfiguration = {
      affected: {
        defaultBase: 'main',
      },
      namedInput: {
        default: [
          '{projectRoot}/**/*',
          '!{projectRoot}/**/*.{spec,test}.*',
          '!{projectRoot}/node_modules/**/*',
        ],
        production: ['default'],
        testing: ['{projectRoot}/**/*.{spec,test}.*'],
      },
      release: {
        projects: ['*'],
        version: {
          conventionalCommits: true,
        },
        changelog: {
          workspaceChangelog: {
            createRelease: 'github',
          },
        },
      },
    };

    new JsonFile(project, 'nx.json', {
      obj: {
        ...config,
        targetDefaults: Object.fromEntries(this.targetDefaults),
        taskRunnerOptions: Object.fromEntries(this.taskRunner),
      },
    });
  }

  /**
   * Adds a target default to the configuration.
   * @param target The target default to add.
   */
  public addTargetDefaults(target: TargetDefaults): void {
    this.targetDefaults.set(target.name, {
      executor: target.executor,
      options: target.options,
      outputs: target.outputs,
      defaultConfiguration: target.defaultConfiguration,
      configurations: target.configurations,
      continuous: target.continuous,
      parallelism: target.parallelism,
      inputs: target.inputs,
      dependsOn: target.dependsOn,
      cache: target.cache,
      syncGenerators: target.syncGenerators,
    });
  }

  /**
   * Adds a target default to the configuration.
   * @param target The target default to add.
   */
  public addTaskRunner(target: TaskRunnerOptions): void {
    this.taskRunner.set(target.name, {
      runner: target.runner,
      options: target.options,
    });
  }
}
