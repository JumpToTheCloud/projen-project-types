import { execSync } from 'child_process';
import { AwsCdkConstructLibrary } from 'projen/lib/awscdk';
import { CommonOptionsConfig } from '../common/common-options';
import { Cdk8sComponent, Commitzent } from '../components';
import { Cdk8sLibraryOptions } from './interfaces/cdk8s-library-options';

/**
 * CDK Construct Library Project
 *
 * @pjid cdk8s-library
 */
export class Cdk8sLibrary extends AwsCdkConstructLibrary {
  readonly cdk8s: Cdk8sComponent;
  readonly commitzent?: Commitzent;
  constructor(options: Cdk8sLibraryOptions) {
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

    this.cdk8s = new Cdk8sComponent(this, 'cdk8s-component', opts);
    this.addDeps('constructs@^10.4.2');

    const components = CommonOptionsConfig.withCommonComponents(this, opts);
    this.commitzent = components.commitzent;
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
