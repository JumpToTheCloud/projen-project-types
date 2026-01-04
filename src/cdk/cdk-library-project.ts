import {
  AwsCdkConstructLibrary,
  AwsCdkConstructLibraryOptions,
} from 'projen/lib/awscdk';
import { CommonOptionsConfig } from '../common/common-options';

/**
 * CDK Construct Library Project
 *
 * @pjid cdk-library
 */
export class CdkLibrary extends AwsCdkConstructLibrary {
  constructor(options: AwsCdkConstructLibraryOptions) {
    const opts = CommonOptionsConfig.withCommonOptionsDefaults({
      ...options,
    });
    super({
      ...opts,
    });
    CommonOptionsConfig.withCommonComponents(this, opts);
  }
}
