import { Component, Project } from 'projen';
import { GitHub } from 'projen/lib/github';
import { JobPermission } from 'projen/lib/github/workflows-model';

/**
 * Options for TerraformDeployGithubWorkflow component.
 */
export interface TerraformDeployGithubWorkflowOptions {
  /**
   * Terraform version to use in the workflow.
   * @default "1.6.0"
   */
  readonly terraformVersion?: string;

  /**
   * Name of the workflow.
   * @default "terraform-deploy"
   */
  readonly workflowName?: string;
}

/**
 * GitHub workflow component for Terraform deployment.
 * Creates a workflow that validates, plans, and applies Terraform changes.
 *
 * This component is designed for Terraform stack projects that need deployment,
 * not for module projects that need release workflows.
 */
export class TerraformDeployGithubWorkflow extends Component {
  constructor(
    project: Project,
    options: TerraformDeployGithubWorkflowOptions = {},
  ) {
    super(project);

    // Get or create GitHub component - use root project for subprojects, current project otherwise
    const targetProject = project.parent ? project.root : project;
    let github = targetProject.components.find(
      (c) => c.constructor.name === 'GitHub',
    ) as GitHub;
    if (!github) {
      github = new GitHub(targetProject);
    }

    const workflowName = options.workflowName ?? 'terraform-deploy';
    const terraformVersion = options.terraformVersion ?? '1.6.0';

    // Use project outdir for subprojects, current directory for root projects
    const workingDirectory = project.parent ? project.outdir : '.';

    const workflow = github.addWorkflow(workflowName);

    workflow.on({
      push: {
        branches: ['main'],
        paths: ['**.tf', '**.tfvars'],
      },
      workflowDispatch: {},
    });

    workflow.addJob('terraform', {
      name: 'Terraform',
      runsOn: ['ubuntu-latest'],
      env: {
        tf_actions_working_dir: workingDirectory,
      },
      defaults: {
        run: {
          workingDirectory: '${{ env.tf_actions_working_dir }}',
        },
      },
      permissions: {
        contents: JobPermission.READ,
        pullRequests: JobPermission.WRITE,
      },
      steps: [
        {
          name: 'Checkout',
          uses: 'actions/checkout@v4',
        },
        {
          name: 'Setup Terraform',
          uses: 'hashicorp/setup-terraform@v3',
          with: {
            terraform_version: terraformVersion,
          },
        },
        {
          name: 'Terraform Format',
          run: 'terraform fmt -check',
          continueOnError: true,
        },
        {
          name: 'Terraform Init',
          run: 'terraform init',
        },
        {
          name: 'Terraform Validate',
          run: 'terraform validate',
        },
        {
          name: 'Terraform Plan',
          run: 'terraform plan -input=false',
        },
        {
          name: 'Terraform Apply',
          run: 'terraform apply -auto-approve -input=false',
        },
      ],
    });
  }
}
