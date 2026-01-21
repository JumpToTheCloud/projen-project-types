import { JsiiProjectOptions } from 'projen/lib/cdk';
import { ProjectGlobalOptions } from './project-global-options';

/**
 * CDK Construct Library Project options
 */
export interface JsiiOptions extends JsiiProjectOptions, ProjectGlobalOptions {
  // Future CDK Library specific options can be added here
}
