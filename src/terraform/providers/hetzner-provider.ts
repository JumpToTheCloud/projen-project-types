import {
  TerraformProvider,
  TerraformProviderOptions,
} from './provider-strategy';

/**
 * Poll function types for Hetzner Cloud provider.
 */
export enum HetznerPollFunction {
  /**
   * Constant polling interval.
   */
  CONSTANT = 'constant',

  /**
   * Exponential backoff polling.
   */
  EXPONENTIAL = 'exponential',
}

/**
 * Configuration for a specific Hetzner Cloud provider instance.
 */
export interface HetznerProviderConfig {
  /**
   * Provider alias for multiple configurations.
   */
  readonly alias?: string;

  /**
   * Hetzner Cloud API token (can be set via HCLOUD_TOKEN env var).
   * Required unless useEnvironmentToken is true or set via environment variable.
   */
  readonly token?: string;

  /**
   * Use HCLOUD_TOKEN environment variable for authentication.
   * When true, the token will be read from HCLOUD_TOKEN environment variable
   * and no explicit token configuration will be generated in the provider block.
   * This is useful for CI/CD pipelines and different environments.
   * @default true
   */
  readonly useEnvironmentToken?: boolean;

  /**
   * Hetzner Cloud API endpoint.
   * @default "https://api.hetzner.cloud/v1"
   */
  readonly endpoint?: string;

  /**
   * Hetzner API endpoint (for Hetzner services, not Hetzner Cloud).
   * @default "https://api.hetzner.com/v1"
   */
  readonly endpointHetzner?: string;

  /**
   * Configures the interval in which actions are polled by the client.
   * @default "500ms"
   * @example "1s", "2000ms"
   */
  readonly pollInterval?: string;

  /**
   * Configures the type of function to be used during polling.
   * @default "exponential"
   */
  readonly pollFunction?: HetznerPollFunction;
}

/**
 * Options for Hetzner Terraform provider.
 */
export interface HetznerProviderOptions extends TerraformProviderOptions {
  /**
   * Array of provider configurations for multiple instances/projects.
   * Each configuration can have its own alias, token, and settings.
   *
   * If empty or not provided, a default configuration will be created
   * with useEnvironmentToken: true and no alias.
   *
   * @example
   * ```typescript
   * // Simple case - uses default configuration with HCLOUD_TOKEN env var
   * new HetznerProvider({
   *   version: '~> 1.45'
   * })
   *
   * // Multiple configurations
   * new HetznerProvider({
   *   version: '~> 1.45',
   *   providers: [
   *     {
   *       alias: 'dns',
   *       token: 'dns-project-token',
   *       useEnvironmentToken: false
   *     },
   *     {
   *       alias: 'staging',
   *       useEnvironmentToken: true
   *     }
   *   ]
   * })
   * ```
   */
  readonly providers?: HetznerProviderConfig[];
}

/**
 * Hetzner Cloud Terraform provider configuration.
 */
export class HetznerProvider extends TerraformProvider {
  private readonly providerConfigs: HetznerProviderConfig[];

  constructor(options: HetznerProviderOptions) {
    super('hcloud', options);

    // If no providers are specified, create a default configuration
    this.providerConfigs =
      options.providers && options.providers.length > 0
        ? options.providers
        : [
            {
              useEnvironmentToken: true,
            },
          ];
  }

  public providerSource(): string {
    return 'hetznercloud/hcloud';
  }

  public generateProviderBlock(): string[] {
    const lines: string[] = [];

    // Generate provider block for each configuration
    this.providerConfigs.forEach((config) => {
      lines.push('provider "hcloud" {');

      if (config.alias) {
        lines.push(`  alias = "${config.alias}"`);
      }

      if (config.useEnvironmentToken !== false) {
        lines.push(
          '  # token will be read from HCLOUD_TOKEN environment variable',
        );
      } else if (config.token) {
        lines.push(`  token = "${config.token}"`);
      } else {
        lines.push(
          '  # token = var.hcloud_token  # Please set token or use useEnvironmentToken: true',
        );
      }

      if (config.endpoint) {
        lines.push(`  endpoint = "${config.endpoint}"`);
      }

      if (config.endpointHetzner) {
        lines.push(`  endpoint_hetzner = "${config.endpointHetzner}"`);
      }

      if (config.pollInterval) {
        lines.push(`  poll_interval = "${config.pollInterval}"`);
      }

      if (config.pollFunction) {
        lines.push(`  poll_function = "${config.pollFunction}"`);
      }

      lines.push('}');
    });

    return lines;
  }

  /**
   * Get all provider configurations.
   */
  public getProviderConfigs(): HetznerProviderConfig[] {
    return [...this.providerConfigs];
  }

  /**
   * Add a new provider configuration.
   */
  public addProviderConfig(config: HetznerProviderConfig): void {
    this.providerConfigs.push(config);
  }
}
