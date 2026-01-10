/**
 * Global configuration options that apply to all projects
 */
export interface ProjectGlobalOptions {
  /**
   * Whether to include Commitzent component for conventional commits
   * @default true
   */
  readonly commitzent?: boolean;
}
