import { ConstructLibraryCdktfOptions } from 'projen/lib/cdktf';
import { ProjectGlobalOptions } from './project-global-options';

/**
 * CDKTF (CDK for Terraform) Construct Library Project options
 */
export interface CdktfLibraryOptions
  extends ConstructLibraryCdktfOptions, ProjectGlobalOptions {
  // Future CDKTF Library specific options can be added here
}
