import { SampleFile } from 'projen';
import { TerraformPlanGithubWorkflow } from './components';
import {
  TerraformBaseProject,
  TerraformBaseProjectOptions,
} from './terraform-base-project';

/**
 * Options for Terraform module project.
 */
export interface TerraformModuleProjectOptions extends TerraformBaseProjectOptions {
  /**
   * Enable GitHub workflow for Terraform plan on Pull Requests.
   * Creates a workflow that validates and plans Terraform changes on PRs,
   * and comments the results back to the PR.
   * @default true
   */
  readonly enablePlanWorkflow?: boolean;
}

/**
 * Terraform module project for creating reusable infrastructure components.
 *
 * This project type is designed for Terraform modules that are published
 * and consumed by other projects, not for deploying infrastructure directly.
 *
 * @pjid terraform-module
 */
export class TerraformModuleProject extends TerraformBaseProject {
  constructor(options: TerraformModuleProjectOptions) {
    super(options);

    // Create main.tf
    new SampleFile(this, 'main.tf', {
      contents: `# Main Terraform configuration
`,
    });

    // Create variables.tf
    new SampleFile(this, 'variables.tf', {
      contents: `# Terraform variables
`,
    });

    // Create outputs.tf
    new SampleFile(this, 'outputs.tf', {
      contents: `# Terraform outputs
`,
    });

    // Add terraform-specific tasks
    this.addTask('terraform', {
      description: 'Run terraform command with arguments',
      exec: 'terraform',
      receiveArgs: true,
    });

    this.addTask('terraform:plan', {
      description: 'Plan Terraform changes',
      exec: 'terraform plan',
    });

    // Note: No terraform:apply task for modules since they shouldn't be applied directly

    // Modify pre-compile to run terraform format and validate
    const preCompileTask = this.tasks.tryFind('pre-compile');
    if (preCompileTask) {
      const formatTask = this.tasks.tryFind('terraform:format');
      const validateTask = this.tasks.tryFind('terraform:validate');

      if (formatTask) {
        preCompileTask.spawn(formatTask);
      }
      if (validateTask) {
        preCompileTask.spawn(validateTask);
      }
    }

    // Modify compile to run terraform plan
    const compileTask = this.tasks.tryFind('compile');
    if (compileTask) {
      const planTask = this.tasks.tryFind('terraform:plan');
      if (planTask) {
        compileTask.spawn(planTask);
      }
    }

    // Add Plan workflow for PRs if enabled (modules don't need deploy workflow)
    if (options.enablePlanWorkflow !== false) {
      new TerraformPlanGithubWorkflow(this, {
        terraformVersion: options.terraformVersion,
      });
    }
  }
}
