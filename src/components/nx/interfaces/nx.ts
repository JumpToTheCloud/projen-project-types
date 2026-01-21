export interface Nx {
  /**
   * Default options for `nx affected`.
   * @deprecated
   */
  readonly affected?: Affected;
  /**
   * Specifies the default location of the cache directory.
   */
  readonly cacheDirectory?: string;
  readonly cli?: CLIOptions;
  /**
   * Configuration for Nx Conformance
   */
  readonly conformance?: Conformance;
  /**
   * Default --base used by affected logic.
   */
  readonly defaultBase?: string;
  /**
   * Default project. When project isn't provided, the default project will be used.
   */
  readonly defaultProject?: string;
  /**
   * Specifies the base config to extend.
   */
  readonly extends?: string;
  readonly generators?: { [key: string]: any };
  /**
   * Map of files to projects that implicitly depend on them.
   * @deprecated
   */
  readonly implicitDependencies?: { [key: string]: any };
  /**
   * Named inputs used by inputs defined in targets
   */
  readonly namedInputs?: { [key: string]: Array<NamedInputClass | string> };
  /**
   * Setting this to true will cause all attempts to connect your workspace to Nx Cloud to
   * fail. This value does not prevent using Nx Cloud if already connected. Use
   * NX_NO_CLOUD=true env var to prevent using Nx Cloud when running commands.
   */
  readonly neverConnectToCloud?: boolean;
  /**
   * The access token to use for nx-cloud. If set, the default tasks runner will be nx-cloud.
   */
  readonly nxCloudAccessToken?: string;
  /**
   * Specifies the encryption key used to encrypt artifacts data before sending it to nx cloud.
   */
  readonly nxCloudEncryptionKey?: string;
  /**
   * Specifies the url pointing to an instance of nx cloud. Used for remote caching and
   * displaying run links.
   */
  readonly nxCloudUrl?: string;
  /**
   * Specifies how many tasks are ran in parallel by Nx for the default tasks runner.
   */
  readonly parallel?: number;
  /**
   * Plugins for extending the project graph.
   */
  readonly plugins?: Array<PluginsObject | string>;
  /**
   * Configuration for the nx release commands.
   */
  readonly release?: Release;
  /**
   * Configuration for the `nx sync` command
   */
  readonly sync?: Sync;
  /**
   * Target defaults
   */
  readonly targetDefaults?: { [key: string]: TargetDefaultsConfig };
  readonly tasksRunnerOptions?: { [key: string]: TasksRunnerOptions };
  /**
   * Settings for the Nx Terminal User Interface (TUI)
   */
  readonly tui?: Tui;
  /**
   * Specifies whether the daemon should be used for the default tasks runner.
   */
  readonly useDaemonProcess?: boolean;
  /**
   * Specifies whether to add inference plugins when generating new projects.
   */
  readonly useInferencePlugins?: boolean;
  /**
   * Where new apps + libs should be placed.
   */
  readonly workspaceLayout?: WorkspaceLayout;
}

/**
 * Default options for `nx affected`.
 */
export interface Affected {
  /**
   * Default based branch used by affected commands.
   */
  readonly defaultBase?: string;
}

/**
 * Default generator collection.
 */
export interface CLIOptions {
  /**
   * The default package manager to use.
   */
  readonly packageManager?: PackageManager;
}

/**
 * The default package manager to use.
 */
export enum PackageManager {
  Bun = 'bun',
  Npm = 'npm',
  Pnpm = 'pnpm',
  Yarn = 'yarn',
}

/**
 * Configuration for Nx Conformance
 */
export interface Conformance {
  /**
   * Optional path to write the conformance results to, defaults to
   * 'dist/conformance-result.json'. Set to false to disable writing the conformance results
   * to a file.
   */
  readonly outputPath?: boolean | string;
  /**
   * List of conformance rules to apply
   */
  readonly rules: Rule[];
}

export interface Rule {
  /**
   * Optional explanation field for users to be able to communicate to their colleagues why a
   * particular rule is enabled and important to the workspace in question.
   */
  readonly explanation?: string;
  /**
   * Rule specific configuration options.
   */
  readonly options?: { [key: string]: any };
  /**
   * The projects to apply this rule to. This property accepts an array of strings which can
   * be project names, glob patterns, directories, tag references or anything else that is
   * supported by the `--projects` filter. By default, the implied value is ['*'] (all
   * projects). You can also use objects with 'matcher' and 'explanation' properties to
   * document why specific projects are included or excluded.
   */
  readonly projects?: Array<ProjectClass | string>;
  /**
   * Relative path to a local rule implementation, node_module path or nx-cloud rule ID for Nx
   * Cloud Enterprise.
   */
  readonly rule: string;
  /**
   * Override the default status of the rule, which is 'enforced'. If set to 'evaluated', the
   * rule will be reported as normal, but not enforced (will exit with code 0). If set to
   * 'disabled', the rule will not be evaluated at all.
   */
  readonly status?: Status;
}

export interface ProjectClass {
  /**
   * An explanation to communicate to colleagues why this particular project or projects were
   * included or excluded from the rule
   */
  readonly explanation: string;
  /**
   * A project name, glob pattern, directory, tag reference, or any other valid project filter
   */
  readonly matcher: string;
}

/**
 * Override the default status of the rule, which is 'enforced'. If set to 'evaluated', the
 * rule will be reported as normal, but not enforced (will exit with code 0). If set to
 * 'disabled', the rule will not be evaluated at all.
 */
export enum Status {
  Disabled = 'disabled',
  Enforced = 'enforced',
  Evaluated = 'evaluated',
}

export interface NamedInputClass {
  /**
   * A glob
   */
  readonly fileset?: string;
  /**
   * Include files belonging to the input for all the project dependencies of this target.
   */
  readonly dependencies?: boolean;
  /**
   * The name of the input.
   */
  readonly input?: string;
  readonly projects?: string[] | string;
  /**
   * The command that will be executed and the results of which is added to the hash
   */
  readonly runtime?: string;
  /**
   * The name of the env var which value is added to the hash
   */
  readonly env?: string;
  /**
   * The list of external dependencies that our target depends on for `nx:run-commands` and
   * community plugins.
   */
  readonly externalDependencies?: string[];
  /**
   * The glob list of output files that project depends on.
   */
  readonly dependentTasksOutputFiles?: string;
  /**
   * Whether the check for outputs should be recursive or stop at the first level of
   * dependencies.
   */
  readonly transitive?: boolean;
}

export interface PluginsObject {
  /**
   * File patterns which are excluded by the plugin
   */
  readonly exclude?: string[];
  /**
   * File patterns which are included by the plugin
   */
  readonly include?: string[];
  /**
   * The options passed to the plugin when creating nodes and dependencies
   */
  readonly options?: { [key: string]: any };
  /**
   * The plugin module to load
   */
  readonly plugin?: string;
}

/**
 * Configuration for the nx release commands.
 */
export interface Release {
  readonly changelog?: ReleaseChangelog;
  readonly conventionalCommits?: NxReleaseConventionalCommitsConfiguration;
  readonly docker?: boolean | NxReleaseDockerConfiguration;
  readonly git?: NxReleaseGitConfiguration;
  readonly groups?: { [key: string]: Group };
  readonly projects?: string[] | string;
  readonly projectsRelationship?: ProjectsRelationship;
  /**
   * Configuration for release tag generation and matching.
   */
  readonly releaseTag?: ReleaseReleaseTag;
  /**
   * DEPRECATED: Use releaseTag.pattern instead. Will be removed in Nx 23.
   */
  readonly releaseTagPattern?: string;
  /**
   * DEPRECATED: Use releaseTag.checkAllBranchesWhen instead. Will be removed in Nx 23.
   */
  readonly releaseTagPatternCheckAllBranchesWhen?: string[] | boolean;
  /**
   * DEPRECATED: Use releaseTag.preferDockerVersion instead. Will be removed in Nx 23.
   */
  readonly releaseTagPatternPreferDockerVersion?:
    | boolean
    | ReleaseTagPatternPreferDockerVersionEnum;
  /**
   * DEPRECATED: Use releaseTag.requireSemver instead. Will be removed in Nx 23.
   */
  readonly releaseTagPatternRequireSemver?: boolean;
  /**
   * DEPRECATED: Use releaseTag.strictPreid instead. Will be removed in Nx 23.
   */
  readonly releaseTagPatternStrictPreid?: boolean;
  readonly version?: NxReleaseVersionConfiguration;
  readonly versionPlans?: boolean | NxReleaseVersionPlansConfiguration;
}

export interface ReleaseChangelog {
  /**
   * Whether or not to automatically look up the first commit for the workspace (or package,
   * if versioning independently) and use that as the starting point for changelog generation.
   * If this is not enabled, changelog generation will fail if there is no previous matching
   * git tag to use as a starting point.
   */
  readonly automaticFromRef?: boolean;
  readonly git?: NxReleaseGitConfiguration;
  readonly projectChangelogs?: boolean | NxReleaseChangelogConfiguration;
  readonly workspaceChangelog?: boolean | NxReleaseChangelogConfiguration;
}

export interface NxReleaseGitConfiguration {
  /**
   * Whether or not to automatically commit the changes made by current command
   */
  readonly commit?: boolean;
  /**
   * Additional arguments (added after the --message argument, which may or may not be
   * customized with --git-commit-message) to pass to the `git commit` command invoked behind
   * the scenes
   */
  readonly commitArgs?: any[] | string;
  /**
   * Custom git commit message to use when committing the changes made by this command
   */
  readonly commitMessage?: string;
  /**
   * Whether or not to automatically push the changes made by this command. This defaults to
   * false
   */
  readonly push?: boolean;
  /**
   * Additional arguments to pass to the `git push` command invoked behind the scenes
   */
  readonly pushArgs?: any[] | string;
  /**
   * Whether or not to stage the changes made by this command. Always treated as true if
   * commit is true.
   */
  readonly stageChanges?: boolean;
  /**
   * Whether or not to automatically tag the changes made by this command
   */
  readonly tag?: boolean;
  /**
   * Additional arguments to pass to the `git tag` command invoked behind the scenes
   */
  readonly tagArgs?: any[] | string;
  /**
   * Custom git tag message to use when tagging the changes made by this command. This
   * defaults to be the same value as the tag itself.
   */
  readonly tagMessage?: string;
}

export interface NxReleaseChangelogConfiguration {
  readonly createRelease?:
    | boolean
    | CreateReleaseEnum
    | CreateReleaseProviderConfiguration;
  readonly entryWhenNoChanges?: boolean | string;
  readonly file?: boolean | string;
  readonly renderer?: string;
  readonly renderOptions?: { [key: string]: any };
}

export enum CreateReleaseEnum {
  Github = 'github',
  Gitlab = 'gitlab',
}

export interface CreateReleaseProviderConfiguration {
  /**
   * The base URL for the relevant VCS provider API. If not set, this will default to
   * `https://${hostname}/api/v3` (github) or `https://${hostname}/api/v4` (gitlab).
   */
  readonly apiBaseUrl?: string;
  /**
   * The hostname of the VCS provider instance, e.g. github.example.com
   */
  readonly hostname: string;
  readonly provider: Provider;
}

export enum Provider {
  GithubEnterpriseServer = 'github-enterprise-server',
  Gitlab = 'gitlab',
}

export interface NxReleaseConventionalCommitsConfiguration {
  /**
   * A map of commit types to their configuration. If a type is set to 'true', then it will be
   * enabled with the default 'semverBump' of 'patch' and will appear in the changelog. If a
   * type is set to 'false', then it will not trigger a version bump and will be hidden from
   * the changelog.
   */
  readonly types?: { [key: string]: boolean | TypeObject };
  /**
   * Whether or not to rely on commit scope to resolve version specifier.
   * If set to 'true', then only commits with scope matching projectName and commits without
   * scope affects version determined, rest are assumed as patch change.
   * If set to 'false', then all commits that affected project used to determine semver
   * change.
   * If not set, this will default to 'true'
   */
  readonly useCommitScope?: boolean;
}

export interface TypeObject {
  /**
   * Configuration for the changelog section for commits of this type. If set to 'true', then
   * commits of this type will be included in the changelog with their default title for the
   * type. If set to 'false', then commits of this type will not be included in the changelog.
   */
  readonly changelog?: boolean | ChangelogChangelog;
  /**
   * The semver bump to apply to the version of the project(s) when a commit of this type is
   * included in the release.
   */
  readonly semverBump?: SemverBump;
}

export interface ChangelogChangelog {
  /**
   * Whether or not to include commits of this type in the changelog
   */
  readonly hidden?: boolean;
  /**
   * The title of the section in the changelog for commits of this type
   */
  readonly title?: string;
}

/**
 * The semver bump to apply to the version of the project(s) when a commit of this type is
 * included in the release.
 */
export enum SemverBump {
  Major = 'major',
  Minor = 'minor',
  None = 'none',
  Patch = 'patch',
}

/**
 * Configuration for handling Docker projects during nx release.
 */
export interface NxReleaseDockerConfiguration {
  /**
   * A command to run after validation of nx release configuration, but before docker
   * versioning begins. Useful for preparing docker build artifacts. If --dry-run is passed,
   * the command is still executed, but with the NX_DRY_RUN environment variable set to 'true'.
   */
  readonly preVersionCommand?: string;
  /**
   * Url of the Docker Image/Container Registry to push images to. Defaults to Docker Hub.
   */
  readonly registryUrl?: string;
  /**
   * Repository name for the image on the configured registry
   */
  readonly repositoryName?: string;
  /**
   * Projects which should use a no-op VersionActions implementation rather than any
   * potentially inferred by default or via Inference Plugins. Can be an array of project
   * names (subset of projects in the release setup/release group) or a boolean (true means
   * all projects).
   */
  readonly skipVersionActions?: string[] | boolean;
  /**
   * Record of named version patterns to choose between when versioning docker projects. e.g.
   * "production": "{currentDate|YYMM.DD}.{shortCommitSha}", "hotfix":
   * "{currentDate|YYMM.DD}-hotfix"
   */
  readonly versionSchemes?: { [key: string]: string };
}

export interface Group {
  readonly changelog?: boolean | NxReleaseChangelogConfiguration;
  readonly docker?: boolean | NxReleaseGroupDockerConfiguration;
  readonly projects: string[] | string;
  readonly projectsRelationship?: ProjectsRelationship;
  /**
   * Configuration for release tag generation and matching.
   */
  readonly releaseTag?: GroupReleaseTag;
  /**
   * DEPRECATED: Use releaseTag.pattern instead. Will be removed in Nx 23.
   */
  readonly releaseTagPattern?: string;
  /**
   * DEPRECATED: Use releaseTag.checkAllBranchesWhen instead. Will be removed in Nx 23.
   */
  readonly releaseTagPatternCheckAllBranchesWhen?: string[] | boolean;
  /**
   * DEPRECATED: Use releaseTag.preferDockerVersion instead. Will be removed in Nx 23.
   */
  readonly releaseTagPatternPreferDockerVersion?:
    | boolean
    | ReleaseTagPatternPreferDockerVersionEnum;
  /**
   * DEPRECATED: Use releaseTag.requireSemver instead. Will be removed in Nx 23.
   */
  readonly releaseTagPatternRequireSemver?: boolean;
  /**
   * DEPRECATED: Use releaseTag.strictPreid instead. Will be removed in Nx 23.
   */
  readonly releaseTagPatternStrictPreid?: boolean;
  readonly version?: NxReleaseGroupVersionConfiguration;
  readonly versionPlans?: boolean | NxReleaseVersionPlansConfiguration;
}

export interface NxReleaseGroupDockerConfiguration {
  /**
   * A command to run after validation of nx release configuration, but before docker
   * versioning begins. Used for preparing docker build artifacts. If --dry-run is passed, the
   * command is still executed, but with the NX_DRY_RUN environment variable set to 'true'. It
   * will run in addition to the global `preVersionCommand`
   */
  readonly groupPreVersionCommand?: string;
  /**
   * Url of the Docker Image/Container Registry to push images to. Defaults to Docker Hub.
   */
  readonly registryUrl?: string;
  /**
   * Repository name for the image on the configured registry
   */
  readonly repositoryName?: string;
  /**
   * Projects which should use a no-op VersionActions implementation rather than any
   * potentially inferred by default or via Inference Plugins. Can be an array of project
   * names (subset of projects in the release setup/release group) or a boolean (true means
   * all projects).
   */
  readonly skipVersionActions?: string[] | boolean;
  /**
   * Record of named version patterns to choose between when versioning docker projects. e.g.
   * "production": "{currentDate|YYMM.DD}.{shortCommitSha}", "hotfix":
   * "{currentDate|YYMM.DD}-hotfix"
   */
  readonly versionSchemes?: { [key: string]: string };
}

export enum ProjectsRelationship {
  Fixed = 'fixed',
  Independent = 'independent',
}

/**
 * Configuration for release tag generation and matching.
 */
export interface GroupReleaseTag {
  /**
   * By default, we will try and resolve the latest match for the releaseTagPattern from the
   * current branch, falling back to all branches if no match is found on the current branch.
   * Setting this to true will cause us to ALWAYS check all branches for the latest match.
   * Setting it to false will cause us to ONLY check the current branch for the latest match.
   * Setting it to an array of strings will cause us to check all branches WHEN the current
   * branch is one of the strings in the array. Glob patterns are supported.
   */
  readonly checkAllBranchesWhen?: string[] | boolean;
  /**
   * Optionally override the git/release tag pattern to use for this group.
   */
  readonly pattern?: string;
  /**
   * Controls how docker versions are used relative to semver versions when creating git tags
   * and changelog entries. Set to true to use only the docker version, false to use only the
   * semver version, or 'both' to create tags and changelog entries for both docker and semver
   * versions. By default, this is set to true when docker configuration is present, and false
   * otherwise.
   */
  readonly preferDockerVersion?:
    | boolean
    | ReleaseTagPatternPreferDockerVersionEnum;
  /**
   * Whether to require semver to be used for the release tag pattern. If set to false, the
   * release tag pattern will not be checked for semver compliance.
   */
  readonly requireSemver?: boolean;
  readonly strictPreid?: boolean;
}

export enum ReleaseTagPatternPreferDockerVersionEnum {
  Both = 'both',
}

export interface NxReleaseGroupVersionConfiguration {
  /**
   * Whether to apply the common convention for 0.x versions where breaking changes bump the
   * minor version (instead of major), and new features bump the patch version (instead of
   * minor). When enabled: 'major' bumps become 'minor' bumps for 0.x versions, 'minor' bumps
   * become 'patch' bumps for 0.x versions. Versions 1.0.0 and above are unaffected. This is
   * false by default for backward compatibility.
   */
  readonly adjustSemverBumpsForZeroMajorVersion?: boolean;
  /**
   * Shorthand for enabling the current version of projects to be resolved from git tags, and
   * the next version to be determined by analyzing commit messages according to the
   * Conventional Commits specification.
   */
  readonly conventionalCommits?: boolean;
  /**
   * The resolver to use for determining the current version of a project during versioning.
   * This is needed for versioning approaches which involve relatively modifying a current
   * version to arrive at a new version, such as semver bumps like 'patch', 'minor' etc. Using
   * 'none' explicitly declares that the current version is not needed to compute the new
   * version, and should only be used with appropriate version actions implementations that
   * support it.
   */
  readonly currentVersionResolver?: CurrentVersionResolver;
  /**
   * Metadata to provide to the configured currentVersionResolver to help it in determining
   * the current version. What to pass here is specific to each resolver.
   */
  readonly currentVersionResolverMetadata?: { [key: string]: any };
  /**
   * Whether to delete the processed version plans file after versioning is complete. This is
   * false by default because the version plans are also needed for changelog generation.
   */
  readonly deleteVersionPlans?: boolean;
  /**
   * The fallback version resolver to use when the configured currentVersionResolver fails to
   * resolve the current version.
   */
  readonly fallbackCurrentVersionResolver?: FallbackCurrentVersionResolver;
  readonly git?: NxReleaseGitConfiguration;
  /**
   * A command to run after validation of nx release configuration AND after the
   * release.version.preVersionCommand (if any), but before versioning begins for this
   * specific group. Useful for preparing build artifacts for the group. If --dry-run is
   * passed, the command is still executed, but with the NX_DRY_RUN environment variable set
   * to 'true'.
   */
  readonly groupPreVersionCommand?: string;
  /**
   * Whether to log projects that have not changed during versioning.
   */
  readonly logUnchangedProjects?: boolean;
  /**
   * A list of directories containing manifest files (such as package.json) to apply updates
   * to when versioning. By default, only the project root will be used, but you could
   * customize this to only version a manifest in a dist directory, or even version multiple
   * manifests in different directories, such as both source and dist.
   */
  readonly manifestRootsToUpdate?: Array<PurpleManifestRootsToUpdate | string>;
  /**
   * Whether to preserve local dependency protocols (e.g. file references, or the `workspace:`
   * protocol in package.json files) of local dependencies when updating them during
   * versioning.
   */
  readonly preserveLocalDependencyProtocols?: boolean;
  /**
   * Whether to preserve matching dependency ranges when updating them during versioning. This
   * is false by default. (e.g. The new version will be '1.2.0' and the current version range
   * in dependents is already '^1.0.0'. Therefore, the manifest file is not updated.)
   */
  readonly preserveMatchingDependencyRanges?:
    | PreserveMatchingDependencyRange[]
    | boolean;
  /**
   * The source to use for determining the specifier to use when versioning. 'prompt' is the
   * default and will interactively prompt the user for an explicit/imperative specifier.
   * 'conventional-commits' will attempt determine a specifier from commit messages conforming
   * to the Conventional Commits specification. 'version-plans' will determine the specifier
   * from the version plan files available on disk.
   */
  readonly specifierSource?: SpecifierSource;
  /**
   * When versioning independent projects, this controls whether to update their dependents
   * (i.e. the things that depend on them). 'never' means no dependents will be updated
   * (unless they happen to be versioned directly as well). 'auto' is the default and will
   * cause dependents to be updated (a patch version bump) when a dependency is versioned.
   */
  readonly updateDependents?: PurpleUpdateDependents;
  /**
   * The path to the version actions implementation to use for releasing all projects by
   * default. This can also be overridden on the release group and project levels.
   */
  readonly versionActions?: string;
  /**
   * The specific options that are defined by each version actions implementation. They will
   * be passed to the version actions implementation when running a release.
   */
  readonly versionActionsOptions?: { [key: string]: any };
  /**
   * The prefix to use when versioning dependencies. This can be one of the following: auto,
   * '', '~', '^', '=', where auto means the existing prefix will be preserved.
   */
  readonly versionPrefix?: VersionPrefix;
}

/**
 * The resolver to use for determining the current version of a project during versioning.
 * This is needed for versioning approaches which involve relatively modifying a current
 * version to arrive at a new version, such as semver bumps like 'patch', 'minor' etc. Using
 * 'none' explicitly declares that the current version is not needed to compute the new
 * version, and should only be used with appropriate version actions implementations that
 * support it.
 */
export enum CurrentVersionResolver {
  Disk = 'disk',
  GitTag = 'git-tag',
  None = 'none',
  Registry = 'registry',
}

/**
 * The fallback version resolver to use when the configured currentVersionResolver fails to
 * resolve the current version.
 */
export enum FallbackCurrentVersionResolver {
  Disk = 'disk',
}

export interface PurpleManifestRootsToUpdate {
  /**
   * Path to the directory containing a manifest file to update. Supports placeholders like
   * {projectRoot} and {projectName}.
   */
  readonly path: string;
  /**
   * Whether to preserve local dependency references using protocols like 'workspace:' or
   * 'file:'. Set this to false for dist files that need to be published if not using a
   * package manager that swaps references at publish time like pnpm or bun.
   */
  readonly preserveLocalDependencyProtocols?: boolean;
}

/**
 * Whether to preserve matching dependency ranges when updating them during versioning. This
 * is false by default. (e.g. The new version will be '1.2.0' and the current version range
 * in dependents is already '^1.0.0'. Therefore, the manifest file is not updated.)
 *
 * Whether to preserve matching dependency ranges when updating them during versioning. This
 * is true by default. (e.g. The new version will be '1.2.0' and the current version range
 * in dependents is already '^1.0.0'. Therefore, the manifest file is not updated.)
 */
export enum PreserveMatchingDependencyRange {
  Dependencies = 'dependencies',
  DevDependencies = 'devDependencies',
  OptionalDependencies = 'optionalDependencies',
  PeerDependencies = 'peerDependencies',
}

/**
 * The source to use for determining the specifier to use when versioning. 'prompt' is the
 * default and will interactively prompt the user for an explicit/imperative specifier.
 * 'conventional-commits' will attempt determine a specifier from commit messages conforming
 * to the Conventional Commits specification. 'version-plans' will determine the specifier
 * from the version plan files available on disk.
 */
export enum SpecifierSource {
  ConventionalCommits = 'conventional-commits',
  Prompt = 'prompt',
  VersionPlans = 'version-plans',
}

/**
 * When versioning independent projects, this controls whether to update their dependents
 * (i.e. the things that depend on them). 'never' means no dependents will be updated
 * (unless they happen to be versioned directly as well). 'auto' is the default and will
 * cause dependents to be updated (a patch version bump) when a dependency is versioned.
 */
export enum PurpleUpdateDependents {
  Auto = 'auto',
  Never = 'never',
}

/**
 * The prefix to use when versioning dependencies. This can be one of the following: auto,
 * '', '~', '^', '=', where auto means the existing prefix will be preserved.
 */
export enum VersionPrefix {
  Auto = 'auto',
  Empty = '',
  Fluffy = '=',
  Purple = '^',
  Prefix = '~',
}

export interface NxReleaseVersionPlansConfiguration {
  /**
   * Changes to files matching any of these optional patterns will be excluded from the
   * affected project logic within the `nx release plan:check` command. This is useful for
   * ignoring files that are not relevant to the versioning process, such as documentation or
   * configuration files.
   */
  readonly ignorePatternsForPlanCheck?: string[];
}

/**
 * Configuration for release tag generation and matching.
 */
export interface ReleaseReleaseTag {
  /**
   * By default, we will try and resolve the latest match for the releaseTagPattern from the
   * current branch, falling back to all branches if no match is found on the current branch.
   * Setting this to true will cause us to ALWAYS check all branches for the latest match.
   * Setting it to false will cause us to ONLY check the current branch for the latest match.
   * Setting it to an array of strings will cause us to check all branches WHEN the current
   * branch is one of the strings in the array. Glob patterns are supported.
   */
  readonly checkAllBranchesWhen?: string[] | boolean;
  /**
   * Optionally override the git/release tag pattern to use. This field is the source of truth
   * for changelog generation and release tagging, as well as for conventional commits
   * parsing. It supports interpolating the version as {version} and (if releasing
   * independently or forcing project level version control system releases) the project name
   * as {projectName} within the string. The default releaseTagPattern for fixed/unified
   * releases is: "v{version}". The default releaseTagPattern for independent releases at the
   * project level is: "{projectName}@{version}"
   */
  readonly pattern?: string;
  /**
   * Controls how docker versions are used relative to semver versions when creating git tags
   * and changelog entries. Set to true to use only the docker version, false to use only the
   * semver version, or 'both' to create tags and changelog entries for both docker and semver
   * versions. By default, this is set to true when docker configuration is present, and false
   * otherwise.
   */
  readonly preferDockerVersion?:
    | boolean
    | ReleaseTagPatternPreferDockerVersionEnum;
  /**
   * Whether to require semver to be used for the release tag pattern. If set to false, the
   * release tag pattern will not be checked for semver compliance.
   */
  readonly requireSemver?: boolean;
  readonly strictPreid?: boolean;
}

/**
 * Configuration for the versioning phase of releases.
 */
export interface NxReleaseVersionConfiguration {
  /**
   * Whether to strictly follow SemVer V2 spec for 0.x versions where breaking changes bump
   * the minor version (instead of major), and new features bump the patch version (instead of
   * minor). When enabled: 'major' bumps become 'minor' bumps for 0.x versions, 'minor' bumps
   * become 'patch' bumps for 0.x versions. Versions 1.0.0 and above are unaffected. This is
   * false by default for backward compatibility.
   */
  readonly adjustSemverBumpsForZeroMajorVersion?: boolean;
  /**
   * Shorthand for enabling the current version of projects to be resolved from git tags, and
   * the next version to be determined by analyzing commit messages according to the
   * Conventional Commits specification.
   */
  readonly conventionalCommits?: boolean;
  /**
   * The resolver to use for determining the current version of a project during versioning.
   * This is needed for versioning approaches which involve relatively modifying a current
   * version to arrive at a new version, such as semver bumps like 'patch', 'minor' etc. Using
   * 'none' explicitly declares that the current version is not needed to compute the new
   * version, and should only be used with appropriate version actions implementations that
   * support it.
   */
  readonly currentVersionResolver?: CurrentVersionResolver;
  /**
   * Metadata to provide to the configured currentVersionResolver to help it in determining
   * the current version. What to pass here is specific to each resolver.
   */
  readonly currentVersionResolverMetadata?: { [key: string]: any };
  /**
   * Whether to delete the processed version plans file after versioning is complete. This is
   * false by default because the version plans are also needed for changelog generation.
   */
  readonly deleteVersionPlans?: boolean;
  /**
   * The fallback version resolver to use when the configured currentVersionResolver fails to
   * resolve the current version.
   */
  readonly fallbackCurrentVersionResolver?: FallbackCurrentVersionResolver;
  readonly git?: NxReleaseGitConfiguration;
  /**
   * Whether to log projects that have not changed during versioning.
   */
  readonly logUnchangedProjects?: boolean;
  /**
   * A list of directories containing manifest files (such as package.json) to apply updates
   * to when versioning. By default, only the project root will be used, but you could
   * customize this to only version a manifest in a dist directory, or even version multiple
   * manifests in different directories, such as both source and dist.
   */
  readonly manifestRootsToUpdate?: Array<FluffyManifestRootsToUpdate | string>;
  /**
   * Whether to preserve local dependency protocols (e.g. file references, or the `workspace:`
   * protocol in package.json files) of local dependencies when updating them during
   * versioning.
   */
  readonly preserveLocalDependencyProtocols?: boolean;
  /**
   * Whether to preserve matching dependency ranges when updating them during versioning. This
   * is true by default. (e.g. The new version will be '1.2.0' and the current version range
   * in dependents is already '^1.0.0'. Therefore, the manifest file is not updated.)
   */
  readonly preserveMatchingDependencyRanges?:
    | PreserveMatchingDependencyRange[]
    | boolean;
  /**
   * A command to run after validation of nx release configuration, but before versioning
   * begins. Useful for preparing build artifacts. If --dry-run is passed, the command is
   * still executed, but with the NX_DRY_RUN environment variable set to 'true'.
   */
  readonly preVersionCommand?: string;
  /**
   * The source to use for determining the specifier to use when versioning. 'prompt' is the
   * default and will interactively prompt the user for an explicit/imperative specifier.
   * 'conventional-commits' will attempt determine a specifier from commit messages conforming
   * to the Conventional Commits specification. 'version-plans' will determine the specifier
   * from the version plan files available on disk.
   */
  readonly specifierSource?: SpecifierSource;
  /**
   * When versioning independent projects, this controls whether to update their dependents
   * (i.e. the things that depend on them). 'never' means no dependents will be updated
   * (unless they happen to be versioned directly as well). 'auto' is the default and will
   * cause dependents to be updated (a patch version bump) when a dependency is versioned, as
   * long as a group or projects filter is not applied that does not include them. 'always'
   * will cause dependents to be updated (a patch version bump) when a dependency is
   * versioned, even if they are not included in the group or projects filter.
   */
  readonly updateDependents?: FluffyUpdateDependents;
  /**
   * The path to the version actions implementation to use for releasing all projects by
   * default. This can also be overridden on the release group and project levels.
   */
  readonly versionActions?: string;
  /**
   * The specific options that are defined by each version actions implementation. They will
   * be passed to the version actions implementation when running a release.
   */
  readonly versionActionsOptions?: { [key: string]: any };
  /**
   * The prefix to use when versioning dependencies. This can be one of the following: auto,
   * '', '~', '^', '=', where auto means the existing prefix will be preserved.
   */
  readonly versionPrefix?: VersionPrefix;
}

export interface FluffyManifestRootsToUpdate {
  /**
   * Path to the directory containing a manifest file to update. Supports placeholders like
   * {projectRoot} and {projectName}.
   */
  readonly path: string;
  /**
   * Whether to preserve local dependency references using protocols like 'workspace:' or
   * 'file:'. Set this to false for dist files that need to be published if not using a
   * package manager that swaps references at publish time like pnpm or bun.
   */
  readonly preserveLocalDependencyProtocols?: boolean;
}

/**
 * When versioning independent projects, this controls whether to update their dependents
 * (i.e. the things that depend on them). 'never' means no dependents will be updated
 * (unless they happen to be versioned directly as well). 'auto' is the default and will
 * cause dependents to be updated (a patch version bump) when a dependency is versioned, as
 * long as a group or projects filter is not applied that does not include them. 'always'
 * will cause dependents to be updated (a patch version bump) when a dependency is
 * versioned, even if they are not included in the group or projects filter.
 */
export enum FluffyUpdateDependents {
  Always = 'always',
  Auto = 'auto',
  Never = 'never',
}

/**
 * Configuration for the `nx sync` command
 */
export interface Sync {
  /**
   * Whether to automatically apply sync generator changes when running tasks. If not set, the
   * user will be prompted. If set to `true`, the user will not be prompted and the changes
   * will be applied. If set to `false`, the user will not be prompted and the changes will
   * not be applied.
   */
  readonly applyChanges?: boolean;
  /**
   * List of registered task sync generators to disable.
   */
  readonly disabledTaskSyncGenerators?: string[];
  /**
   * Options for the sync generators.
   */
  readonly generatorOptions?: { [key: string]: { [key: string]: any } };
  /**
   * List of workspace-wide sync generators to be run (not attached to targets)
   */
  readonly globalGenerators?: string[];
}

/**
 * Target defaults
 */
export interface TargetDefaultsConfig {
  /**
   * Specifies if the given target should be cacheable
   */
  readonly cache?: boolean;
  /**
   * provides extra sets of values that will be merged into the options map
   */
  readonly configurations?: { [key: string]: { [key: string]: any } };
  /**
   * Whether this target runs continuously until stopped
   */
  readonly continuous?: boolean;
  /**
   * The name of a configuration to use as the default if a configuration is not provided
   */
  readonly defaultConfiguration?: string;
  readonly dependsOn?: Array<DependsOnClass | string>;
  /**
   * The function that Nx will invoke when you run this target
   */
  readonly executor?: string;
  readonly inputs?: Array<NamedInputClass | string>;
  readonly options?: { [key: string]: any };
  readonly outputs?: string[];
  /**
   * Whether this target can be run in parallel with other tasks
   */
  readonly parallelism?: boolean;
  /**
   * List of generators to run before the target to ensure the workspace is up to date
   */
  readonly syncGenerators?: string[];
}

export interface DependsOnClass {
  readonly dependencies?: boolean;
  /**
   * Configuration for params handling.
   */
  readonly params?: Params;
  readonly projects?: string[] | string;
  /**
   * The name of the target.
   */
  readonly target: string;
}

/**
 * Configuration for params handling.
 */
export enum Params {
  Forward = 'forward',
  Ignore = 'ignore',
}

/**
 * Available Task Runners.
 */
export interface TasksRunnerOptions {
  /**
   * Default options for the runner.
   */
  readonly options?: Options;
  /**
   * Path to resolve the runner.
   */
  readonly runner?: string;
}

/**
 * Default options for the runner.
 */
export interface Options {
  readonly accessToken?: string;
  /**
   * Defines the list of targets/operations that are cached by Nx.
   */
  readonly cacheableOperations?: string[];
  /**
   * Defines where the local cache is stored.
   */
  readonly cacheDirectory?: string;
  /**
   * Defines whether the cache captures stderr or just stdout.
   */
  readonly captureStderr?: boolean;
  /**
   * Defines an encryption key to support end-to-end encryption of your cloud cache. You may
   * also provide an environment variable with the key NX_CLOUD_ENCRYPTION_KEY that contains
   * an encryption key as its value. The Nx Cloud task runner normalizes the key length, so
   * any length of key is acceptable.
   */
  readonly encryptionKey?: string;
  readonly nxCloudId?: string;
  /**
   * Defines the max number of targets ran in parallel.
   */
  readonly parallel?: number;
  /**
   * Defines whether the Nx Cache should be skipped.
   */
  readonly skipNxCache?: boolean;
}

/**
 * Settings for the Nx Terminal User Interface (TUI)
 */
export interface Tui {
  /**
   * Whether to exit the TUI automatically after all tasks finish. If set to `true`, the TUI
   * will exit immediately. If set to `false` the TUI will not automatically exit. If set to a
   * number, an interruptible countdown popup will be shown for that many seconds before the
   * TUI exits.
   */
  readonly autoExit?: boolean | number;
  /**
   * Whether to enable the Terminal UI whenever possible (based on the current environment and
   * terminal).
   */
  readonly enabled?: boolean;
  /**
   * Whether to suppress hint popups that provide guidance for unhandled keys.
   */
  readonly suppressHints?: boolean;
}

/**
 * Where new apps + libs should be placed.
 */
export interface WorkspaceLayout {
  /**
   * Default folder name for apps.
   */
  readonly appsDir?: string;
  /**
   * Default folder name for libs.
   */
  readonly libsDir?: string;
}
