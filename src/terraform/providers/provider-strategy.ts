/**
 * Base options for Terraform providers.
 */
export interface TerraformProviderOptions {
  /**
   * Provider version constraint.
   * @example "~> 5.0"
   */
  readonly version?: string;

  /**
   * Provider alias (optional).
   */
  readonly alias?: string;
}

/**
 * Base class for Terraform provider configurations.
 * This is a strategy class that holds configuration, not a Projen component.
 */
export abstract class TerraformProvider {
  protected readonly version?: string;
  protected readonly alias?: string;
  protected readonly providerName: string;

  constructor(providerName: string, options?: TerraformProviderOptions) {
    this.providerName = providerName;
    this.version = options?.version;
    this.alias = options?.alias;
  }

  /**
   * Get the provider alias for the required_providers block.
   */
  public providerAlias(): string {
    return this.alias || this.providerName;
  }

  /**
   * Get the provider source (e.g., "hashicorp/aws").
   */
  public abstract providerSource(): string;

  /**
   * Generate the provider configuration block.
   */
  public abstract generateProviderBlock(): string[];

  /**
   * Get the version constraint.
   */
  public versionConstraint(): string | undefined {
    return this.version;
  }

  /**
   * Get the provider name.
   */
  public name(): string {
    return this.providerName;
  }
}
