import { Testing } from 'projen/lib/testing';
import { TerraformModuleProject, HetznerProvider } from '../src';

describe('TerraformModuleProject', () => {
  test('should create a basic Terraform module', () => {
    const project = new TerraformModuleProject({
      name: 'my-terraform-module',
    });

    const snapshot = Testing.synth(project);

    // Verify basic Terraform files
    expect(snapshot['versions.tf']).toBeDefined();
    expect(snapshot['main.tf']).toBeDefined();
    expect(snapshot['variables.tf']).toBeDefined();
    expect(snapshot['outputs.tf']).toBeDefined();

    // Verify basic content in files
    expect(snapshot['main.tf']).toContain('# Main Terraform configuration');
    expect(snapshot['variables.tf']).toContain('# Terraform variables');
    expect(snapshot['outputs.tf']).toContain('# Terraform outputs');

    // Verify terraform tasks - tasks.json is an object
    const tasksJson =
      typeof snapshot['.projen/tasks.json'] === 'string'
        ? JSON.parse(snapshot['.projen/tasks.json'])
        : snapshot['.projen/tasks.json'];

    expect(tasksJson.tasks).toHaveProperty('terraform:plan');
    expect(tasksJson.tasks).toHaveProperty('terraform:format');
    expect(tasksJson.tasks).toHaveProperty('terraform:validate');

    // Verify no apply task (modules shouldn't have apply)
    expect(tasksJson.tasks).not.toHaveProperty('terraform:apply');
  });

  test('should create module with provider', () => {
    const project = new TerraformModuleProject({
      name: 'my-terraform-module',
      provider: new HetznerProvider({
        version: '~> 1.45',
      }),
    });

    const snapshot = Testing.synth(project);

    // Verify provider configuration in provider.tf
    expect(snapshot['provider.tf']).toBeDefined();
    expect(snapshot['provider.tf']).toContain('hetznercloud/hcloud');
    expect(snapshot['provider.tf']).toContain('~> 1.45');
  });

  test('should create terraform-plan workflow by default', () => {
    const project = new TerraformModuleProject({
      name: 'my-terraform-module',
    });

    const snapshot = Testing.synth(project);

    // Verify plan workflow file exists
    expect(snapshot['.github/workflows/terraform-plan.yml']).toBeDefined();

    const workflow = snapshot['.github/workflows/terraform-plan.yml'];

    // Verify workflow triggers (only PR, no push)
    expect(workflow).toContain('pull_request:');
    expect(workflow).toContain('- main');
    expect(workflow).not.toContain('push:');

    // Verify workflow steps
    expect(workflow).toContain('actions/checkout@v4');
    expect(workflow).toContain('hashicorp/setup-terraform@v3');
    expect(workflow).toContain('terraform init');
    expect(workflow).toContain('terraform plan');

    // Verify no apply step (modules shouldn't apply)
    expect(workflow).not.toContain('terraform apply');

    // Verify PR comment functionality
    expect(workflow).toContain('Comment PR');
    expect(workflow).toContain('actions/github-script@v7');
  });

  test('should not create deploy workflow', () => {
    const project = new TerraformModuleProject({
      name: 'my-terraform-module',
    });

    const snapshot = Testing.synth(project);

    // Verify NO deploy workflow exists (modules don't deploy)
    expect(snapshot['.github/workflows/terraform-deploy.yml']).toBeUndefined();
  });

  test('should not create plan workflow when disabled', () => {
    const project = new TerraformModuleProject({
      name: 'my-terraform-module',
      enablePlanWorkflow: false,
    });

    const snapshot = Testing.synth(project);

    // Verify no plan workflow when disabled
    expect(snapshot['.github/workflows/terraform-plan.yml']).toBeUndefined();
  });

  test('should work without provider', () => {
    const project = new TerraformModuleProject({
      name: 'my-terraform-module-no-provider',
    });

    const snapshot = Testing.synth(project);

    // Verify basic files exist
    expect(snapshot['versions.tf']).toBeDefined();
    expect(snapshot['main.tf']).toBeDefined();

    // Verify plan workflow file exists
    expect(snapshot['.github/workflows/terraform-plan.yml']).toBeDefined();

    const workflow = snapshot['.github/workflows/terraform-plan.yml'];
    expect(workflow).toContain('terraform init');
    expect(workflow).toContain('terraform plan');
  });

  test('should accept custom terraform version', () => {
    const project = new TerraformModuleProject({
      name: 'my-terraform-module-custom',
      terraformVersion: '1.7.0',
    });

    const snapshot = Testing.synth(project);

    // Verify custom terraform version in versions.tf
    expect(snapshot['versions.tf']).toContain('>= 1.7.0');

    // Verify custom terraform version in workflow
    const workflow = snapshot['.github/workflows/terraform-plan.yml'];
    expect(workflow).toContain('terraformVersion: 1.7.0');
  });
});
