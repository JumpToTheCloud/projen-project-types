import {
  AwsCdkTypeScriptApp,
  AwsCdkTypeScriptAppOptions,
} from 'projen/lib/awscdk';
import { CommonOptionsConfig } from '../common/common-options';

/**
 * CDK TypeScript App Project
 *
 * @pjid cdk-app
 */
export class CdkApp extends AwsCdkTypeScriptApp {
  constructor(options: AwsCdkTypeScriptAppOptions) {
    const opts = CommonOptionsConfig.withCommonOptionsDefaults({
      ...options,
    });
    super({
      ...opts,
    });
    CommonOptionsConfig.withCommonComponents(this, opts);
  }
}
