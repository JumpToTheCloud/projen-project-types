import { TypeScriptProjectOptions } from 'projen/lib/typescript';
import { ProjectGlobalOptions } from './project-global-options';
import { K3dOptions } from '../../components';
import { Cdk8sBaseOptions } from '../../components/cdk8s/interfaces/Cdk8s';

/**
 * CDK8s Application Project options
 */
export interface Cdk8sAppOptions
  extends Cdk8sBaseOptions, TypeScriptProjectOptions, ProjectGlobalOptions {
  /**
   * Enable K3d component integration
   * @default true
   */
  readonly k3d?: boolean;
  /**
   * K3d component configuration options
   */
  readonly k3dOptions?: K3dOptions;
}
