import { JsiiProject as Jsii } from 'projen/lib/cdk';
import { CommonOptionsConfig } from '../common/common-options';
import { Commitzent } from '../components';
import { JsiiOptions } from './interfaces/jsii-options';
//import { NxWorkspace } from '../components/nx/nx-workspace';

/**
 * JSII Project
 *
 * @pjid jsii-project
 */
export class JsiiProject extends Jsii {
  readonly commitzent?: Commitzent;
  //readonly nx?: NxWorkspace;
  constructor(options: JsiiOptions) {
    const opts = CommonOptionsConfig.withCommonOptionsDefaults({
      ...options,
    });
    super({
      ...opts,
    });
    const components = CommonOptionsConfig.withCommonComponents(this, opts);
    this.commitzent = components.commitzent;

    //new NxWorkspace(this, 'NxWorkspace');
  }
}
