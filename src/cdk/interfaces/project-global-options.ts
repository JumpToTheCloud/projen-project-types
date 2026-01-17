/**
 * Global configuration options that apply to all projects
 */
export interface ProjectGlobalOptions {
  /**
   * Whether to include Agents component for coding agent documentation
   * @default true
   */
  readonly agents?: boolean;

  /**
   * Whether to include Commitzent component for conventional commits
   * @default true
   */
  readonly commitzent?: boolean;
}
