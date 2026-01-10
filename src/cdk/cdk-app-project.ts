import { AwsCdkTypeScriptApp } from 'projen/lib/awscdk';
import { CommonOptionsConfig } from '../common/common-options';
import { Commitzent } from '../components';
import { CdkAppOptions } from './interfaces/cdk-app-options';

/**
 * CDK TypeScript App Project
 *
 * @pjid cdk-app
 */
export class CdkApp extends AwsCdkTypeScriptApp {
  readonly commitzent?: Commitzent;
  constructor(options: CdkAppOptions) {
    const opts = CommonOptionsConfig.withCommonOptionsDefaults({
      ...options,
    });
    super({
      ...opts,
    });
    const components = CommonOptionsConfig.withCommonComponents(this, opts);
    this.commitzent = components.commitzent;
  }
}
