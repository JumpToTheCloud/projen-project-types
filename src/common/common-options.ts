import { PrettierOptions, TrailingComma } from 'projen/lib/javascript';
import { TypeScriptProjectOptions } from 'projen/lib/typescript';
import { deepMerge } from 'projen/lib/util';
//import { CdkCommonOptions } from './cdk-commons-options';

/**
 * Utility class for configuring common project options with default values
 */
export class CommonOptionsConfig {
  /**
   * Default prettier configurations that will always be applied
   */
  private static readonly DEFAULT_PRETTIER_OPTIONS: PrettierOptions = {
    settings: {
      trailingComma: TrailingComma.ES5,
      singleQuote: true,
      bracketSpacing: true,
      semi: true,
    },
  };

  /**
   * Configures default options only if they are not already defined in the projen options
   * @param options - Project options that may include existing configurations
   * @returns Final options with default values applied where no previous configuration existed
   */
  static withCommonOptionsDefaults<T extends TypeScriptProjectOptions>(
    options: T
  ): T {
    const commonDefaults = {
      prettier: options.prettier ?? true,
      prettierOptions: options.prettierOptions ?? this.DEFAULT_PRETTIER_OPTIONS,
    };

    return deepMerge([{}, options, commonDefaults]) as T;
  }
}
