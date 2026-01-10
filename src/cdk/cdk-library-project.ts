import { AwsCdkConstructLibrary } from 'projen/lib/awscdk';
import { CommonOptionsConfig } from '../common/common-options';
import { Commitzent } from '../components';
import { CdkLibraryOptions } from './interfaces/cdk-library-options';

/**
 * CDK Construct Library Project
 *
 * @pjid cdk-library
 */
export class CdkLibrary extends AwsCdkConstructLibrary {
  readonly commitzent?: Commitzent;
  constructor(options: CdkLibraryOptions) {
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
