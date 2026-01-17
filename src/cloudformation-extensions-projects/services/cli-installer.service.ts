import { Project } from 'projen';
import { CommandExecutor } from '../utils';

/**
 * Service responsible for checking CLI tools for CloudFormation Extensions development
 */
export class CliInstallerService {
  /**
   * Checks if SAM CLI is installed
   * @param project Project instance for Logger
   * @returns true if SAM CLI is installed, false otherwise
   */
  static isSamCliInstalled(project: Project): boolean {
    const result = CommandExecutor.execCommand('sam --version');
    if (result.success) {
      project.logger.info(`✅ SAM CLI is installed: ${result.output}`);
      return true;
    }

    project.logger.warn('SAM CLI is not installed');
    return false;
  }

  /**
   * Shows installation instructions for SAM CLI
   * @param project Project instance for Logger
   */
  static showSamCliInstallationInstructions(project: Project): void {
    project.logger.error(
      '❌ SAM CLI is required for CloudFormation Extensions development',
    );
    project.logger.info(
      '📖 Installation guide: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html',
    );
    project.logger.info('🍺 macOS (Homebrew): brew install aws-sam-cli');
    project.logger.info('🐍 Linux/Windows (pip): pip3 install aws-sam-cli');
  }
}
