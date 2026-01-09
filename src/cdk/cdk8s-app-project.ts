import { execSync } from 'child_process';
import { TypeScriptProject } from 'projen/lib/typescript';
import { CommonOptionsConfig } from '../common/common-options';
import { Cdk8sAppOptions, Cdk8sComponent } from '../components';

/**
 * CDK8s Application Project
 *
 * @pjid cdk8s-app
 */
export class Cdk8App extends TypeScriptProject {
  readonly cdk8s: Cdk8sComponent;

  constructor(options: Cdk8sAppOptions) {
    const opts = CommonOptionsConfig.withCommonOptionsDefaults({
      ...options,
      sampleCode: false,
      eslintOptions: {
        dirs: ['src', 'test', 'build-tools', 'projenrc', '.projenrc.ts'],
        ignorePatterns: [
          '*.js',
          '*.d.ts',
          'node_modules/',
          '*.generated.ts',
          'coverage',
          '**/k8s.ts',
        ],
      },
    });

    super(opts);

    // Add constructs dependency
    this.addDeps('constructs@^10.4.2');

    this.cdk8s = new Cdk8sComponent(this, 'cdk8s-component', options);

    CommonOptionsConfig.withCommonComponents(this, opts);
  }

  postSynthesize(): void {
    const cdk8sImportTask = this.tasks.tryFind('cdk8s:import');
    if (cdk8sImportTask) {
      execSync(this.runTaskCommand(cdk8sImportTask), {
        cwd: this.outdir,
      });
    }
  }
}
