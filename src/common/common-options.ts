import { Project } from 'projen';
import { PrettierOptions, TrailingComma } from 'projen/lib/javascript';
import { TypeScriptProjectOptions } from 'projen/lib/typescript';
import { deepMerge } from 'projen/lib/util';
import { VsCode } from 'projen/lib/vscode';
import { ProjectGlobalOptions } from '../cdk/interfaces/project-global-options';
import { Commitzent } from '../components/commitzent/commitzent';

/**
 * TypeScript project options that include global project options
 */
export interface TypeScriptProjectWithGlobalOptions
  extends TypeScriptProjectOptions, ProjectGlobalOptions {}

export interface CommonsComponents {
  readonly commitzent?: Commitzent;
}
/**
 * Utility class for configuring common project options with default values
 */
export class CommonOptionsConfig {
  /**
   * Configures default options only if they are not already defined in the projen options
   * Prettier and ESLint are only enabled for root projects (not subprojects)
   * @param options - Project options that may include existing configurations
   * @returns Final options with default values applied where no previous configuration existed
   */
  static withCommonOptionsDefaults<T extends TypeScriptProjectOptions>(
    options: T,
  ): T {
    // Only enable prettier and eslint for root projects (not subprojects) unless explicitly set
    const isSubproject = options.parent != null;
    const prettierDefault = isSubproject ? false : true;
    const eslintDefault = isSubproject ? false : true;

    const commonDefaults = {
      prettier: options.prettier ?? prettierDefault,
      prettierOptions: options.prettierOptions ?? this.DEFAULT_PRETTIER_OPTIONS,
      eslint: options.eslint ?? eslintDefault,
    };

    return deepMerge([{}, options, commonDefaults]) as T;
  }

  /**
   * Configures common components like VSCode settings and extensions
   * If project has parent, configures VSCode in parent project instead of subproject
   * Commitzent is only added to root projects (not subprojects) unless explicitly requested
   * @param project - The project instance to configure
   * @param options - Project options (any type that has vscode and commitzent properties)
   */
  static withCommonComponents(
    project: Project,
    options: TypeScriptProjectWithGlobalOptions,
  ): CommonsComponents {
    if (options.vscode !== false) {
      // Determine target project: use parent if it's a subproject, otherwise use current project
      const targetProject = project.parent ?? project;

      // Try to find existing VsCode component by type in target project
      let vscode = targetProject.node.children.find(
        (child) => child instanceof VsCode,
      ) as VsCode;

      if (!vscode) {
        vscode = new VsCode(targetProject);
      }

      vscode.settings.addSettings(this.VSCODE_SETTINGS);
      vscode.extensions.addRecommendations(...this.VSCODE_EXTENSIONS);
    }

    // Add Commitzent component only for root projects (not subprojects) unless explicitly enabled
    let commitzent: Commitzent | undefined;
    const isSubproject = project.parent != null;

    // Only enable commitzent for root projects unless explicitly set
    const shouldEnableCommitzent =
      options.commitzent !== false && !isSubproject;

    if (shouldEnableCommitzent) {
      commitzent = new Commitzent(project, 'commitzent');
    }

    return { commitzent };
  }

  /**
   * Default prettier configurations that will always be applied
   */
  private static readonly DEFAULT_PRETTIER_OPTIONS: PrettierOptions = {
    settings: {
      trailingComma: TrailingComma.ALL,
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
}
