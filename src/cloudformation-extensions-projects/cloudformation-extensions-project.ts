import {
  TypeScriptAppProject,
  TypeScriptProjectOptions,
} from 'projen/lib/typescript';
import { CommonOptionsConfig } from '../common/common-options';
import { Commitzent } from '../components';
import { CloudFormationTasks } from './components';
import {
  RequirementsCheckerService,
  PluginInstallerService,
  CliInstallerService,
} from './services';

/**
 * Cloudformation Extensions Project options
 */
export interface CloudformationExtensionsProjectOptions extends TypeScriptProjectOptions {
  // Future Cloudformation Extensions specific options can be added here
}

/**
 * Cloudformation Extensions Project
 *
 * @pjid cloudformation-extensions
 */
export class CloudformationExtensions extends TypeScriptAppProject {
  readonly commitzent?: Commitzent;

  constructor(options: CloudformationExtensionsProjectOptions) {
    const opts = CommonOptionsConfig.withCommonOptionsDefaults({
      ...options,
    });
    super({
      ...opts,
    });
    const components = CommonOptionsConfig.withCommonComponents(this, opts);
    this.commitzent = components.commitzent;

    this.addDeps(
      '@amazon-web-services-cloudformation/cloudformation-cli-typescript-lib',
      'class-transformer',
    );

    new CloudFormationTasks(this);
    this.preCompileTask.exec('npx projen generate:types');
    this.preCompileTask.exec('npx tsc');
  }

  public preSynthesize(): void {
    super.preSynthesize();

    try {
      const pythonOk = RequirementsCheckerService.checkPythonVersion(this);
      if (!pythonOk) {
        throw new Error(
          'Python 3.6+ is required but not found. Please install Python 3.6 or higher.',
        );
      }

      // Check if SAM CLI is installed, show instructions if not
      const samInstalled = CliInstallerService.isSamCliInstalled(this);
      if (!samInstalled) {
        CliInstallerService.showSamCliInstallationInstructions(this);
        throw new Error(
          'SAM CLI is required but not installed. Please install it following the instructions above.',
        );
      }

      // Handle CloudFormation plugin installation
      PluginInstallerService.installCloudFormationPlugin(this);

      this.logger.info('🎉 Environment setup completed successfully!');
    } catch (error) {
      this.logger.error(
        `Environment validation failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }
}
