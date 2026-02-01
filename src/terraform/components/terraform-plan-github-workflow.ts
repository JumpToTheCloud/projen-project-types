import { Component, Project } from 'projen';
import { GitHub } from 'projen/lib/github';
import { JobPermission } from 'projen/lib/github/workflows-model';

/**
 * Options for TerraformPlanGithubWorkflow component.
 */
export interface TerraformPlanGithubWorkflowOptions {
  /**
   * Terraform version to use in the workflow.
   * @default "1.6.0"
   */
  readonly terraformVersion?: string;

  /**
   * Name of the workflow.
   * @default "terraform-plan"
   */
  readonly workflowName?: string;

  /**
   * Working directory for Terraform commands.
   * @default "."
   */
  readonly workingDirectory?: string;
}

/**
 * GitHub workflow component for Terraform plan on Pull Requests.
 * Creates a workflow that validates, plans Terraform changes and comments results on PRs.
 *
 * This component is designed for Terraform stack projects to show plan results
 * in Pull Requests without actually applying changes.
 */
export class TerraformPlanGithubWorkflow extends Component {
  constructor(
    project: Project,
    options: TerraformPlanGithubWorkflowOptions = {},
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

    const workflowName = options.workflowName ?? 'terraform-plan';
    const terraformVersion = options.terraformVersion ?? '1.6.0';
    const workingDirectory =
      options.workingDirectory ?? (project.parent ? project.outdir : '.');

    const workflow = github.addWorkflow(workflowName);

    workflow.on({
      pullRequest: {
        branches: ['main'],
        paths: ['**.tf', '**.tfvars'],
      },
    });

    // Add environment variable for working directory
    workflow.addJob('terraform-plan', {
      name: 'Terraform Plan',
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
            terraformVersion: terraformVersion,
          },
        },
        {
          name: 'Terraform Format',
          id: 'fmt',
          run: 'terraform fmt -check',
          continueOnError: true,
        },
        {
          name: 'Terraform Init',
          id: 'init',
          run: 'terraform init -input=false',
        },
        {
          name: 'Terraform Validate',
          id: 'validate',
          run: 'terraform validate -no-color',
        },
        {
          name: 'Terraform Plan',
          id: 'plan',
          run: 'terraform plan -no-color -input=false',
          continueOnError: true,
        },
        {
          name: 'Comment PR',
          uses: 'actions/github-script@v7',
          if: "github.event_name == 'pull_request'",
          env: {
            PLAN: 'terraform\\n${{ steps.plan.outputs.stdout }}',
          },
          with: {
            'github-token': '${{ secrets.GITHUB_TOKEN }}',
            script: `
              // 1. Retrieve existing bot comments for the PR
              const { data: comments } = await github.rest.issues.listComments({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
              })
              const botComment = comments.find(comment => {
                return comment.user.type === 'Bot' && comment.body.includes('Terraform Format and Style')
              })

              // 2. Prepare format of the comment
              const output = \`#### Terraform Format and Style 🖌\\\`\${{ steps.fmt.outcome }}\\\`
              #### Terraform Initialization ⚙️\\\`\${{ steps.init.outcome }}\\\`
              #### Terraform Validation 🤖\\\`\${{ steps.validate.outcome }}\\\`
              <details><summary>Validation Output</summary>

              \\\`\\\`\\\`
              \${{ steps.validate.outputs.stdout }}
              \\\`\\\`\\\`

              </details>

              #### Terraform Plan 📖\\\`\${{ steps.plan.outcome }}\\\`

              <details><summary>Show Plan</summary>

              \\\`\\\`\\\`
              \${process.env.PLAN}
              \\\`\\\`\\\`

              </details>

              *Pusher: @\${{ github.actor }}, Action: \\\`\${{ github.event_name }}\\\`, Working Directory: \\\`\${{ env.tf_actions_working_dir }}\\\`, Workflow: \\\`\${{ github.workflow }}\\\`*\`;

              // 3. If we have a comment, update it, otherwise create a new one
              if (botComment) {
                github.rest.issues.updateComment({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  comment_id: botComment.id,
                  body: output
                })
              } else {
                github.rest.issues.createComment({
                  issue_number: context.issue.number,
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  body: output
                })
              }
            `,
          },
        },
      ],
    });
  }
}
