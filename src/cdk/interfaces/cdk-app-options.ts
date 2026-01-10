import { AwsCdkTypeScriptAppOptions } from 'projen/lib/awscdk';
import { ProjectGlobalOptions } from './project-global-options';

/**
 * CDK TypeScript App Project options
 */
export interface CdkAppOptions
  extends AwsCdkTypeScriptAppOptions, ProjectGlobalOptions {
  // Future CDK App specific options can be added here
}
