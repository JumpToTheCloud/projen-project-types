import { inspect } from 'util';
import { Component, DependencyType, Project, TextFile } from 'projen';
import {
  CommitzentConfiguration,
  CommitzentScopes,
} from './interfaces/Icommitzent';

export class Commitzent extends Component {
  private config: CommitzentConfiguration;
  constructor(project: Project, id: string) {
    super(project, id);

    project.deps.addDependency('commitizen', DependencyType.BUILD);
    project.deps.addDependency('cz-customizable', DependencyType.BUILD);

    const task = project.addTask('commit', {
      description:
        'Commit changes with conventional commits prompts provided by Commitizen',
      steps: [
        {
          exec: './node_modules/cz-customizable/standalone.js',
          receiveArgs: false,
          say: 'committing changes',
        },
      ],
    });

    task.lock();

    this.config = {
      types: [
        { value: 'feat', name: 'feat:     A new feature' },
        { value: 'fix', name: 'fix:      A bug fix' },
        { value: 'docs', name: 'docs:     Documentation only changes' },
        {
          value: 'style',
          name: 'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)',
        },
        {
          value: 'refactor',
          name: 'refactor: A code change that neither fixes a bug nor adds a feature',
        },
        {
          value: 'perf',
          name: 'perf:     A code change that improves performance',
        },
        { value: 'test', name: 'test:     Adding missing tests' },
        {
          value: 'chore',
          name: 'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation',
        },
        { value: 'revert', name: 'revert:   Revert to a commit' },
        { value: 'WIP', name: 'WIP:      Work in progress' },
      ],
      scopes: [],
      usePreparedCommit: true,
      allowTicketNumber: false,
      isTicketNumberRequired: false,
      ticketNumberPrefix: 'TICKET-',
      ticketNumberRegExp: '\\d{1,5}',
      messages: {
        type: "Select the type of change that you're committing:",
        scope: '\nDenote the SCOPE of this change (optional):',
        customScope: 'Denote the SCOPE of this change:',
        subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
        body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
        breaking: 'List any BREAKING CHANGES (optional):\n',
        footer:
          'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
        confirmCommit:
          'Are you sure you want to proceed with the commit above?',
      },
      allowCustomScopes: true,
      allowBreakingChanges: ['feat', 'fix'],
      subjectLimit: 100,
    };

    this.addScope({
      name: 'projen',
    });

    new TextFile(project, '.czrc', {
      marker: true,
      lines: [
        JSON.stringify(
          {
            path: 'node_modules/cz-customizable',
          },
          null,
          2,
        ),
      ],
    });
  }

  addScope(scope: CommitzentScopes): void {
    this.config.scopes.push(scope);
  }

  preSynthesize(): void {
    new TextFile(this, '.cz-config.js', {
      marker: true,
      lines: [
        `module.exports = ${inspect(this.config, {
          depth: null,
          compact: false,
          sorted: false,
        })}`,
      ],
    });
  }
}
