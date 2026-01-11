import { Project } from 'projen';
import { CommandExecutor } from '../utils';

/**
 * Service responsible for installing plugins and dependencies for CloudFormation Extensions development
 */
export class PluginInstallerService {
  /**
   * Checks if CloudFormation CLI TypeScript Plugin is installed
   * @param project Project instance for Logger
   * @returns true if the plugin is installed, false otherwise
   */
  static isCloudFormationPluginInstalled(project: Project): boolean {
    const result = CommandExecutor.execCommand(
      'pip3 list | grep cloudformation-cli-typescript-plugin',
    );
    if (result.success) {
      project.logger.info(
        '✅ CloudFormation CLI TypeScript Plugin is installed',
      );
      return true;
    }

    project.logger.warn(
      'CloudFormation CLI TypeScript Plugin is not installed',
    );
    return false;
  }

  /**
   * Installs CloudFormation CLI TypeScript Plugin using pip3
   * @param project Project instance for Logger
   * @returns true if installation was successful, false otherwise
   */
  static installCloudFormationPlugin(project: Project): boolean {
    // Check if already installed first
    if (this.isCloudFormationPluginInstalled(project)) {
      return true;
    }

    project.logger.info(
      '📦 Installing CloudFormation CLI TypeScript Plugin...',
    );
    const result = CommandExecutor.execCommand(
      'pip3 install cloudformation-cli-typescript-plugin',
    );
    if (!result.success) {
      project.logger.error(
        '❌ Failed to install CloudFormation CLI TypeScript Plugin',
      );
      project.logger.error(result.error || 'Unknown installation error');
      return false;
    }

    project.logger.info(
      '✅ CloudFormation CLI TypeScript Plugin installed successfully',
    );
    return true;
  }

  /**
   * Attempts to install CloudFormation CLI TypeScript Plugin with user permission
   * @param project Project instance for Logger
   * @returns true if installation was successful or already installed, false otherwise
   */
  static ensureCloudFormationPlugin(project: Project): boolean {
    project.logger.info(
      '🔄 Ensuring CloudFormation CLI TypeScript Plugin is available...',
    );

    // Check if already installed
    if (this.isCloudFormationPluginInstalled(project)) {
      return true;
    }

    // If not installed, attempt installation
    const installResult = this.installCloudFormationPlugin(project);
    if (!installResult) {
      project.logger.error(
        '💡 Manual installation required: pip3 install cloudformation-cli-typescript-plugin',
      );
      return false;
    }

    return true;
  }
}
