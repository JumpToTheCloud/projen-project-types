import { JsiiProject as Jsii } from 'projen/lib/cdk';
import { CommonOptionsConfig } from '../common/common-options';
import { Commitzent } from '../components';
import { JsiiOptions } from './interfaces/jsii-options';

/**
 * JSII Project
 *
 * @pjid jsii-project
 */
export class JsiiProject extends Jsii {
  readonly commitzent?: Commitzent;
  constructor(options: JsiiOptions) {
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
