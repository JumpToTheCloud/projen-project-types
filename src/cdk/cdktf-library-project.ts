import { ConstructLibraryCdktf } from 'projen/lib/cdktf';
import { CommonOptionsConfig } from '../common/common-options';
import { Commitzent } from '../components';
import { CdktfLibraryOptions } from './interfaces/cdktf-library-options';

/**
 * CDKTF (CDK for Terraform) Construct Library Project
 *
 * @pjid cdktf-library
 */
export class CdktfLibrary extends ConstructLibraryCdktf {
  readonly commitzent?: Commitzent;
  constructor(options: CdktfLibraryOptions) {
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
