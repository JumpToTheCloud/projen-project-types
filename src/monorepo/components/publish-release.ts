import { Component } from 'projen';
import { GitHub } from 'projen/lib/github';
import { JobPermission } from 'projen/lib/github/workflows-model';

export class PublishRelease extends Component {
  constructor(github: GitHub, id: string) {
    super(github, id);

    const publish = github.addWorkflow('publish');

    publish.on({
      release: {
        types: ['published'],
      },
      workflowDispatch: {
        inputs: {
          version: {
            description: 'Version to Publish',
            required: false,
            default: '',
          },
        },
      },
    });

    publish.addJob('publish', {
      name: 'Publish to npm',
      runsOn: ['ubuntu-latest'],
      permissions: {
        contents: JobPermission.READ,
        idToken: JobPermission.WRITE,
      },
      steps: [
        {
          name: 'Checkout',
          uses: 'actions/checkout@v4',
          with: {
            'fetch-depth': 0,
          },
        },
        {
          name: 'Setup Node.js',
          uses: 'actions/setup-node@v4',
          with: {
            'node-version': '18',
            cache: 'yarn',
          },
        },
        {
          name: 'Install dependencies',
          run: 'yarn install --check-files --frozen-lockfile',
        },
        {
          name: 'Run tests',
          run: 'yarn test',
        },
        {
          name: 'Build',
          run: 'yarn build',
        },
        {
          name: 'Publish',
          run: [
            'VERSION="${{ github.event.inputs.version || github.ref_name }}"',
            'if [ -n "$VERSION" ] && [ "$VERSION" != "" ]; then',
            '  yarn nx release version --specifier "$VERSION"',
            'else',
            '  yarn nx release version',
            'fi',
            'yarn nx release publish',
          ].join('\n'),
        },
      ],
    });
  }
}
