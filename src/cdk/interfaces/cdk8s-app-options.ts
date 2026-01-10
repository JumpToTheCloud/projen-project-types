import { TypeScriptProjectOptions } from 'projen/lib/typescript';
import { ProjectGlobalOptions } from './project-global-options';
import { Cdk8sBaseOptions } from '../../components/cdk8s/interfaces/Cdk8s';

/**
 * CDK8s Application Project options
 */
export interface Cdk8sAppOptions
  extends Cdk8sBaseOptions, TypeScriptProjectOptions, ProjectGlobalOptions {
  // Future CDK8s App specific options can be added here
}
