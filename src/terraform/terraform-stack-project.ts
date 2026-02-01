import { SampleFile } from 'projen';
import { TerraformProvider } from './providers';
import {
  TerraformBaseProject,
  TerraformBaseProjectOptions,
} from './terraform-base-project';

/**
 * Options for Terraform stack project.
 */
export interface TerraformStackProjectOptions extends TerraformBaseProjectOptions {
  /**
   * Terraform provider configuration.
   */
  readonly provider?: TerraformProvider;
}

/**
 * Terraform stack project for managing infrastructure.
 */
export class TerraformStackProject extends TerraformBaseProject {
  constructor(options: TerraformStackProjectOptions) {
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

    this.addTask('terraform:apply', {
      description: 'Apply Terraform changes',
      exec: 'terraform apply',
    });

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
  }
}
