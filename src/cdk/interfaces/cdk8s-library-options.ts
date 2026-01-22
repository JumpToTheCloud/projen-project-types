import { AwsCdkConstructLibraryOptions } from 'projen/lib/awscdk';
import { ProjectGlobalOptions } from './project-global-options';
import { Cdk8sBaseOptions } from '../../components/cdk8s/interfaces/Cdk8s';

/**
 * CDK8s Construct Library Project options
 */
export interface Cdk8sLibraryOptions
  extends
    Cdk8sBaseOptions,
    AwsCdkConstructLibraryOptions,
    ProjectGlobalOptions {
  // Future CDK8s Library specific options can be added here
}
