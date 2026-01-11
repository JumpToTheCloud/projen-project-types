import { Component, Project } from 'projen';

/**
 * CloudFormation CLI Tasks component
 *
 * Adds all necessary CloudFormation CLI and SAM CLI tasks to a project
 */
export class CloudFormationTasks extends Component {
  constructor(project: Project, id: string = 'CloudFormationTasks') {
    super(project, id);

    this.setupCloudFormationTasks();
    this.setupSamTasks();
  }

  /**
   * Sets up CloudFormation CLI tasks
   */
  private setupCloudFormationTasks(): void {
    // cfn generate - Generates TypeScript models from JSON schema
    this.project.addTask('cfn:generate', {
      description: 'Generate TypeScript models from CloudFormation resource schema',
      exec: 'cfn generate',
    });

    // cfn validate - Validates the CloudFormation resource schema and implementation
    this.project.addTask('cfn:validate', {
      description: 'Validate CloudFormation resource schema and implementation',
      exec: 'cfn validate',
    });

    // cfn invoke - Invoke CloudFormation resource handlers locally for testing
    this.project.addTask('cfn:invoke', {
      description: 'Invoke CloudFormation resource handlers locally',
      exec: 'cfn invoke',
    });

    // cfn test - Run CloudFormation resource contract tests
    this.project.addTask('cfn:test', {
      description: 'Run CloudFormation resource contract tests',
      exec: 'cfn test',
    });

    // cfn submit - Submit CloudFormation resource type to registry
    this.project.addTask('cfn:submit', {
      description: 'Submit CloudFormation resource type to registry',
      exec: 'cfn submit --dry-run',
    });

    // cfn submit:live - Submit to registry without dry-run
    this.project.addTask('cfn:submit:live', {
      description: 'Submit CloudFormation resource type to registry (live)',
      exec: 'cfn submit',
    });
  }

  /**
   * Sets up SAM CLI tasks for local testing
   */
  private setupSamTasks(): void {
    // sam build - Build SAM application for local testing
    this.project.addTask('sam:build', {
      description: 'Build SAM application for local testing',
      exec: 'sam build',
    });

    // sam invoke - Invoke CloudFormation resource handlers using SAM local
    this.project.addTask('sam:invoke', {
      description: 'Invoke CloudFormation resource handlers using SAM local',
      exec: 'sam local invoke TypeFunction',
    });

    // sam start-api - Start SAM local API for testing
    this.project.addTask('sam:start-api', {
      description: 'Start SAM local API for testing',
      exec: 'sam local start-api',
    });
  }
}