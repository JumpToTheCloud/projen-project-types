import { TypeScriptProject } from 'projen/lib/typescript';
import { NxConfigurations } from './components/NxConfiguration';
import { PublishRelease } from './components/publish-release';
import { NxMonorepoOptions } from './interfaces/NxMonorepo';
import { CommonOptionsConfig } from '../common/common-options';
import { Commitzent } from '../components';

/**
 * NX Monorepo Project
 *
 * @pjid nx-monorepo
 */
export class NxMonorepo extends TypeScriptProject {
  readonly commitzent?: Commitzent;
  readonly nx: NxConfigurations;
  constructor(options: NxMonorepoOptions) {
    const opts = CommonOptionsConfig.withCommonOptionsDefaults({
      ...options,
    });
    super({
      ...opts,
    });

    const components = CommonOptionsConfig.withCommonComponents(this, opts);
    this.commitzent = components.commitzent;

    this.addDevDeps('nx');
    this.addDevDeps('@nx/workspace', '@nx/devkit');

    this.addFields({
      private: 'true',
      workspaces: ['packages/*'],
    });

    this.addGitIgnore('.nx');

    new PublishRelease(this.github!, 'PublishRelease');

    this.nx = new NxConfigurations(this, 'nx.json');

    this.tasks.removeTask('release');
    this.tasks.removeTask('build');
    this.addRunManyCommand(
      'build',
      'Full release build for all affected projects',
    );

    this.tasks.removeTask('compile');
    this.addRunManyCommand('compile', 'Only compile for all affected projects');

    this.tasks.removeTask('test');
    this.addRunManyCommand('test', 'Only test for all affected projects');

    this.tasks.removeTask('test:watch');
    this.addTask('test:watch', {
      description: 'Only test for all affected projects',
      steps: [
        {
          exec: 'nx run-many --target=test:watch --output-style=stream --skip-nx-cache --nx-ignore-cycles --nx-bail',
          receiveArgs: true,
        },
      ],
    });

    this.tasks.removeTask('eslint');
    this.addRunManyCommand('eslint', 'Run eslint for all affected projects');

    this.tasks.removeTask('package');
    this.addRunManyCommand(
      'package',
      'Creates the distribution package for all affected projects',
    );

    this.tasks.removeTask('post-compile');
    this.addRunManyCommand(
      'post-compile',
      'Run post-compile for all affected projects',
    );

    this.tasks.removeTask('pre-compile');
    this.addRunManyCommand(
      'pre-compile',
      'Run pre-compile for all affected projects',
    );

    this.addTask('graph', {
      description: 'Generate dependency graph',
      steps: [
        {
          exec: 'nx graph',
        },
      ],
    });

    this.addTask('release', {
      description: 'Prepare a release from \"main\" branch',
      env: {
        RELEASE: 'true',
      },
      steps: [
        {
          exec: 'rm -fr dist',
        },
        {
          spawn: 'bump',
        },
        {
          spawn: 'build',
        },
        {
          spawn: 'unbump',
        },
        {
          exec: 'git diff --ignore-space-at-eol --exit-code',
        },
      ],
    });

    this.addExecRunManyCommand('install:ci');

    this.addTask('run-many', {
      description: 'Run task against multiple workspace projects',
      steps: [
        {
          exec: 'nx run-many',
          receiveArgs: true,
        },
      ],
    });

    this.addTask('nx', {
      description: 'Run Nx against multiple workspace projects',
      steps: [
        {
          exec: 'nx',
          receiveArgs: true,
        },
      ],
    });
  }

  addRunManyCommand(target: string, description: string) {
    this.addTask(target, {
      description,
      steps: [
        {
          exec: `nx run-many --target=${target} --output-style=stream --nx-bail`,
          receiveArgs: true,
        },
      ],
    });
  }

  addExecRunManyCommand(target: string) {
    const task = this.tasks.tryFind(target);
    if (task) {
      task.exec(
        `nx run-many --target=${target} --output-style=stream --nx-bail`,
      );
    }
  }
}
