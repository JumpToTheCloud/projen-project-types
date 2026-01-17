import * as child_process from 'child_process';

/**
 * Result of executing a shell command
 */
export interface CommandResult {
  /**
   * Whether the command executed successfully
   */
  readonly success: boolean;

  /**
   * The command output
   */
  readonly output: string;

  /**
   * Error message if the command failed
   */
  readonly error?: string;
}

/**
 * Utility for executing shell commands
 */
export class CommandExecutor {
  /**
   * Executes a shell command and returns the result
   * @param command The command to execute
   * @returns Object with success status, output, and optional error
   */
  static execCommand(command: string): CommandResult {
    try {
      const output = child_process.execSync(command, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      return { success: true, output: output.trim() };
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: error.message || 'Unknown error',
      };
    }
  }
}
