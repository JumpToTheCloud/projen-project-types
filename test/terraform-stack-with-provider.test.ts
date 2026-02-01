import { Testing } from 'projen/lib/testing';
import { TerraformStackProject, HetznerProvider } from '../src';

describe('TerraformStackProject with Provider', () => {
  test('should create a stack project with default Hetzner provider configuration', () => {
    const project = new TerraformStackProject({
      name: 'my-terraform-stack-default',
      provider: new HetznerProvider({
        version: '~> 1.45',
        // No providers array specified - should use default configuration
      }),
    });

    const snapshot = Testing.synth(project);

    // Verify provider.tf is created with Hetzner provider
    expect(snapshot['provider.tf']).toBeDefined();
    expect(snapshot['provider.tf']).toContain('hetznercloud/hcloud');
    expect(snapshot['provider.tf']).toContain('~> 1.45');
    expect(snapshot['provider.tf']).toContain('provider "hcloud"');
    // Should not have alias since it's the default configuration
    expect(snapshot['provider.tf']).not.toContain('alias =');
    // Should use environment token by default
    expect(snapshot['provider.tf']).toContain(
      'HCLOUD_TOKEN environment variable',
    );
    expect(snapshot['provider.tf']).not.toContain('token =');
  });

  test('should create a stack project with Hetzner provider with single configuration', () => {
    const project = new TerraformStackProject({
      name: 'my-terraform-stack',
      provider: new HetznerProvider({
        version: '~> 1.45',
        providers: [
          {
            token: 'my-hetzner-token',
            useEnvironmentToken: false,
          },
        ],
      }),
    });

    const snapshot = Testing.synth(project);

    // Verify basic files exist
    expect(snapshot['main.tf']).toBeDefined();
    expect(snapshot['variables.tf']).toBeDefined();
    expect(snapshot['outputs.tf']).toBeDefined();
    expect(snapshot['versions.tf']).toBeDefined();

    // Verify provider.tf is created with Hetzner provider
    expect(snapshot['provider.tf']).toBeDefined();
    expect(snapshot['provider.tf']).toContain('hetznercloud/hcloud');
    expect(snapshot['provider.tf']).toContain('my-hetzner-token');
    expect(snapshot['provider.tf']).toContain('~> 1.45');
    expect(snapshot['provider.tf']).toContain('provider "hcloud"');
  });

  test('should create a stack project with multiple Hetzner provider configurations', () => {
    const project = new TerraformStackProject({
      name: 'my-terraform-stack-multi',
      provider: new HetznerProvider({
        version: '~> 1.45',
        providers: [
          {
            alias: 'dns',
            token: 'dns-token',
            useEnvironmentToken: false,
            endpoint: 'https://api.hetzner.cloud/v1',
          },
          {
            alias: 'staging',
            useEnvironmentToken: true,
          },
          {
            alias: 'prod',
            useEnvironmentToken: true,
          },
        ],
      }),
    });

    const snapshot = Testing.synth(project);

    // Verify provider.tf is created with Hetzner provider
    expect(snapshot['provider.tf']).toBeDefined();
    expect(snapshot['provider.tf']).toContain('hetznercloud/hcloud');
    expect(snapshot['provider.tf']).toContain('~> 1.45');
    expect(snapshot['provider.tf']).toContain('provider "hcloud"');
    expect(snapshot['provider.tf']).toContain('alias = "dns"');
    expect(snapshot['provider.tf']).toContain('alias = "staging"');
    expect(snapshot['provider.tf']).toContain('alias = "prod"');
    expect(snapshot['provider.tf']).toContain('dns-token');
    expect(snapshot['provider.tf']).toContain('https://api.hetzner.cloud/v1');
  });

  test('should create a stack project with Hetzner provider using environment token', () => {
    const project = new TerraformStackProject({
      name: 'my-terraform-stack-env',
      provider: new HetznerProvider({
        version: '~> 1.45',
        providers: [
          {
            useEnvironmentToken: true,
          },
        ],
      }),
    });

    const snapshot = Testing.synth(project);

    // Verify provider.tf is created with Hetzner provider
    expect(snapshot['provider.tf']).toBeDefined();
    expect(snapshot['provider.tf']).toContain('hetznercloud/hcloud');
    expect(snapshot['provider.tf']).toContain('~> 1.45');
    expect(snapshot['provider.tf']).toContain('provider "hcloud"');
    // When useEnvironmentToken is true, no explicit token should be in config
    expect(snapshot['provider.tf']).not.toContain('token =');
  });

  test('should create a stack project without provider', () => {
    const project = new TerraformStackProject({
      name: 'my-terraform-stack-no-provider',
    });

    const snapshot = Testing.synth(project);

    // Verify basic files exist
    expect(snapshot['main.tf']).toBeDefined();
    expect(snapshot['variables.tf']).toBeDefined();
    expect(snapshot['outputs.tf']).toBeDefined();
    expect(snapshot['versions.tf']).toBeDefined();

    // Verify no provider.tf is created
    expect(snapshot['provider.tf']).toBeUndefined();
  });
});
