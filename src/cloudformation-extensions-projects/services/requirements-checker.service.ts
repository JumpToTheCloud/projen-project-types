import { Project } from 'projen';
import { CommandExecutor } from '../utils';

/**
 * Result of checking system requirements
 */
export interface RequirementsCheckResult {
  /**
   * Whether Python is available and meets version requirements
   */
  readonly hasPython: boolean;

  /**
   * Whether SAM CLI is available
   */
  readonly hasSam: boolean;

  /**
   * Whether all requirements are met
   */
  readonly hasRequirements: boolean;
}

/**
 * Service responsible for checking system requirements for CloudFormation Extensions development
 */
export class RequirementsCheckerService {
  /**
   * Checks if Python 3.6+ is installed and meets version requirements
   * @param project Project instance for Logger
   * @returns true if Python 3.6+ is available, false otherwise
   */
  static checkPythonVersion(project: Project): boolean {
    const result = CommandExecutor.execCommand('python3 --version');
    if (!result.success) {
      project.logger.error(
        'Python 3 is not installed or not available in PATH',
      );
      return false;
    }

    const versionMatch = result.output.match(/Python (\d+)\.(\d+)/);
    if (!versionMatch) {
      project.logger.error('Could not determine Python version');
      return false;
    }

    const major = parseInt(versionMatch[1]);
    const minor = parseInt(versionMatch[2]);

    if (major < 3 || (major === 3 && minor < 6)) {
      project.logger.error(
        `Python ${major}.${minor} found, but Python 3.6+ is required for CloudFormation CLI TypeScript Plugin`,
      );
      return false;
    }

    project.logger.info(
      `✅ Python ${major}.${minor} meets requirements (3.6+)`,
    );
    return true;
  }

  /**
   * Checks if SAM CLI is installed
   * @param project Project instance for Logger
   * @returns true if SAM CLI is available, false otherwise
   */
  static checkSamCli(project: Project): boolean {
    const result = CommandExecutor.execCommand('sam --version');
    if (!result.success) {
      project.logger.error(
        'SAM CLI is not installed. Please install SAM CLI: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html',
      );
      return false;
    }

    project.logger.info(`✅ SAM CLI is installed: ${result.output}`);
    return true;
  }

  /**
   * Validates all prerequisites for CloudFormation Extensions development
   * @param project Project instance for Logger
   * @returns object with individual check results and overall status
   */
  static validateAllRequirements(project: Project): RequirementsCheckResult {
    project.logger.info(
      '🔍 Validating CloudFormation Extensions prerequisites...',
    );

    const pythonOk = this.checkPythonVersion(project);
    const samOk = this.checkSamCli(project);

    const allRequirementsMet = pythonOk && samOk;

    if (allRequirementsMet) {
      project.logger.info('✅ Basic prerequisites validated successfully!');
    } else {
      project.logger.error('❌ Some prerequisites are missing');
    }

    return {
      hasPython: pythonOk,
      hasSam: samOk,
      hasRequirements: allRequirementsMet,
    };
  }
}
