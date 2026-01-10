import { AwsCdkConstructLibraryOptions } from 'projen/lib/awscdk';
import { ProjectGlobalOptions } from './project-global-options';

/**
 * CDK Construct Library Project options
 */
export interface CdkLibraryOptions
  extends AwsCdkConstructLibraryOptions, ProjectGlobalOptions {
  // Future CDK Library specific options can be added here
}
