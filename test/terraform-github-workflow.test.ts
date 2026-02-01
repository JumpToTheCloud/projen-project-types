import { Testing } from 'projen/lib/testing';
import { TerraformStackProject, HetznerProvider } from '../src';

describe('TerraformStackProject GitHub Workflow', () => {
  test('should create terraform-deploy workflow by default', () => {
    const project = new TerraformStackProject({
      name: 'my-terraform-stack',
      provider: new HetznerProvider({
        version: '~> 1.45',
      }),
    });

    const snapshot = Testing.synth(project);

    // Verify workflow file exists
    expect(snapshot['.github/workflows/terraform-deploy.yml']).toBeDefined();

    const workflow = snapshot['.github/workflows/terraform-deploy.yml'];

    // Verify workflow triggers
    expect(workflow).toContain('push:');
    expect(workflow).toContain('- main');
    expect(workflow).toContain('"**.tf"');
    expect(workflow).toContain('"**.tfvars"');
    expect(workflow).not.toContain('pull_request:');
    expect(workflow).toContain('workflow_dispatch:');

    // Verify workflow steps
    expect(workflow).toContain('actions/checkout@v4');
    expect(workflow).toContain('hashicorp/setup-terraform@v3');
    expect(workflow).toContain('terraform fmt -check');
    expect(workflow).toContain('terraform init');
    expect(workflow).toContain('terraform validate');
    expect(workflow).toContain('terraform plan -input=false');
    expect(workflow).toContain('terraform apply -auto-approve -input=false');

    // Verify no conditional execution (since only runs on main push or manual)
    expect(workflow).not.toContain("if: github.event_name == 'pull_request'");
    expect(workflow).not.toContain(
      "if: github.ref == 'refs/heads/main' && github.event_name == 'push'",
    );

    // Verify Terraform version
    expect(workflow).toContain('terraform_version: 1.6.0');
  });

  test('should create terraform-deploy workflow with custom terraform version', () => {
    const project = new TerraformStackProject({
      name: 'my-terraform-stack-custom',
      terraformVersion: '1.7.0',
      provider: new HetznerProvider({
        version: '~> 1.45',
      }),
    });

    const snapshot = Testing.synth(project);

    const workflow = snapshot['.github/workflows/terraform-deploy.yml'];
    expect(workflow).toContain('terraform_version: 1.7.0');
  });

  test('should not create workflow when disabled', () => {
    const project = new TerraformStackProject({
      name: 'my-terraform-stack-no-workflow',
      enableGitHubWorkflow: false,
      provider: new HetznerProvider({
        version: '~> 1.45',
      }),
    });

    const snapshot = Testing.synth(project);

    // Verify workflow file does not exist
    expect(snapshot['.github/workflows/terraform-deploy.yml']).toBeUndefined();
  });

  test('should work without provider', () => {
    const project = new TerraformStackProject({
      name: 'my-terraform-stack-no-provider',
    });

    const snapshot = Testing.synth(project);

    // Verify workflow file exists
    expect(snapshot['.github/workflows/terraform-deploy.yml']).toBeDefined();

    const workflow = snapshot['.github/workflows/terraform-deploy.yml'];
    expect(workflow).toContain('terraform init');
    expect(workflow).toContain('terraform validate');
  });

  test('should create terraform-plan workflow for PRs by default', () => {
    const project = new TerraformStackProject({
      name: 'my-terraform-stack-plan',
      provider: new HetznerProvider({
        version: '~> 1.45',
      }),
    });

    const snapshot = Testing.synth(project);

    // Verify plan workflow file exists
    expect(snapshot['.github/workflows/terraform-plan.yml']).toBeDefined();

    const workflow = snapshot['.github/workflows/terraform-plan.yml'];

    // Verify workflow triggers (only on PR)
    expect(workflow).toContain('pull_request:');
    expect(workflow).toContain('- main');
    expect(workflow).toContain('"**.tf"');
    expect(workflow).toContain('"**.tfvars"');
    expect(workflow).not.toContain('push:');
    expect(workflow).not.toContain('workflow_dispatch:');

    // Verify workflow steps
    expect(workflow).toContain('actions/checkout@v4');
    expect(workflow).toContain('hashicorp/setup-terraform@v3');
    expect(workflow).toContain('terraform fmt -check');
    expect(workflow).toContain('terraform init -input=false');
    expect(workflow).toContain('terraform validate -no-color');
    expect(workflow).toContain('terraform plan -no-color -input=false');

    // Verify PR comment functionality
    expect(workflow).toContain('actions/github-script@v7');
    expect(workflow).toContain("if: github.event_name == 'pull_request'");
    expect(workflow).toContain('Terraform Format and Style');
    expect(workflow).toContain('Show Plan');

    // Verify working directory configuration
    expect(workflow).toContain('tf_actions_working_dir');
    expect(workflow).toContain(
      'working-directory: ${{ env.tf_actions_working_dir }}',
    );
  });

  test('should not create plan workflow when disabled', () => {
    const project = new TerraformStackProject({
      name: 'my-terraform-stack-no-plan',
      enablePlanWorkflow: false,
      provider: new HetznerProvider({
        version: '~> 1.45',
      }),
    });

    const snapshot = Testing.synth(project);

    // Verify plan workflow file does not exist
    expect(snapshot['.github/workflows/terraform-plan.yml']).toBeUndefined();

    // But deploy workflow should still exist
    expect(snapshot['.github/workflows/terraform-deploy.yml']).toBeDefined();
  });
});
