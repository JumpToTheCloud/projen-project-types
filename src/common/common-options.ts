import { Project } from 'projen';
import { PrettierOptions, TrailingComma } from 'projen/lib/javascript';
import { TypeScriptProjectOptions } from 'projen/lib/typescript';
import { deepMerge } from 'projen/lib/util';
import { VsCode } from 'projen/lib/vscode';

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

  private static readonly VSCODE_SETTINGS = {
    'editor.formatOnSave': true,
    'editor.indentSize': 2,
    'editor.defaultFormatter': 'esbenp.prettier-vscode',
    'eslint.nodePath': './node_modules',
    'eslint.useFlatConfig': false,
  };

  private static readonly VSCODE_EXTENSIONS = [
    'amazonwebservices.aws-toolkit-vscode',
    'DanielThielking.aws-cloudformation-yaml',
    'ms-azuretools.vscode-containers',
    'dbaeumer.vscode-eslint',
    'mhutchie.git-graph',
    'github.vscode-github-actions',
    'GitHub.vscode-pull-request-github',
    'eamodio.gitlens',
    'esbenp.prettier-vscode',
    'spmeesseman.vscode-taskexplorer',
    'wayou.vscode-todo-highlight',
    'vscode-icons-team.vscode-icons',
    'ms-vscode-remote.vscode-remote-extensionpack',
  ];

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

  /**
   * Configures common components like VSCode settings and extensions
   * @param project - The project instance to configure
   */
  static withCommonComponents(
    project: Project,
    options: TypeScriptProjectOptions
  ): void {
    if (options.vscode !== false) {
      const vscode = new VsCode(project);
      vscode.settings.addSettings(this.VSCODE_SETTINGS);
      vscode.extensions.addRecommendations(...this.VSCODE_EXTENSIONS);
    }
  }
}
