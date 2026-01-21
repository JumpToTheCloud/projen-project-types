export type NamedInput = {
  readonly [name: string]: string[];
};

export type TargetDefaultConfigurations = {
  [name: string]: string;
};

export interface TargetDefaults {
  /**
   * Target name
   */
  readonly name: string;
  /**
   * The function that Nx will invoke when you run this target
   */
  readonly executor?: string;

  readonly options?: {
    [key: string]: string;
  };

  readonly outputs?: string[];

  /**
   * The name of a configuration to use as the default if a configuration is not provided
   */
  readonly defaultConfiguration?: string;

  /**
   * provides extra sets of values that will be merged into the options map
   */
  readonly configurations?: TargetDefaultConfigurations;

  /**
   * Whether this target runs continuously until stopped
   * @default false
   */
  readonly continuous?: boolean;

  /**
   * Whether this target can be run in parallel with other tasks
   * @default true
   */
  readonly parallelism?: boolean;

  readonly inputs?: string[];

  readonly dependsOn?: string[];

  /**
   * Specifies if the given target should be cacheable
   */
  readonly cache?: boolean;

  /**
   * List of generators to run before the target to ensure the workspace is up to date
   */
  readonly syncGenerators?: string[];
}

export interface RunnerOptions {
  readonly accessToken?: string;
  readonly nxCloudId?: string;
  /**
   * Defines whether the cache captures stderr or just stdout
   */
  readonly captureStderr?: boolean;

  /**
   * Defines the max number of targets ran in parallel
   */
  readonly parallel?: number;

  /**
   * Defines the list of targets/operations that are cached by Nx
   */
  readonly cacheableOperations: string[];

  /**
   * Defines where the local cache is stored
   */
  readonly cacheDirectory?: string;

  /**
   * Defines whether the Nx Cache should be skipped
   */
  readonly skipNxCache?: boolean;

  /**
   * Defines an encryption key to support end-to-end encryption of your cloud cache.
   * You may also provide an environment variable with the key NX_CLOUD_ENCRYPTION_KEY
   * that contains an encryption key as its value. The Nx Cloud task runner normalizes
   * the key length, so any length of key is acceptable.
   */
  readonly encryptionKey?: string;
}

export interface TaskRunnerOptions {
  /**
   * Name of the Task Runner
   */
  readonly name: string;
  /**
   * Path to resolve the runner
   */
  readonly runner: string;

  /**
   * Default options for the runner
   */
  readonly options: RunnerOptions;
}

export interface ReleaseVersion {
  readonly conventionalCommits: true;
}

export interface WorkspaceChangelog {
  readonly createRelease: string;
}
export interface ReleaseChangelogV1 {
  readonly workspaceChangelog: WorkspaceChangelog;
}

export interface NxRelease {
  readonly projects: string[];
  readonly version: ReleaseVersion;
  readonly changelog?: ReleaseChangelogV1;
}
export interface NxConfiguration {
  /**
   * Specifies the base config to exten
   * @default nx/presets/npm.json
   */
  readonly extends?: string;

  /**
   * Named inputs used by inputs defined in targets
   */
  readonly namedInput: NamedInput;

  readonly release?: NxRelease;
}
