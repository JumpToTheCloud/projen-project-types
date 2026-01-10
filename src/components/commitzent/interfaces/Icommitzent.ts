export interface CommitzentTypes {
  readonly value: string;
  readonly name: string;
}

export interface CommitzentScopes {
  readonly name: string;
}

export interface CommitzentMessages {
  readonly type: string;
  readonly scope: string;
  readonly customScope: string;
  readonly subject: string;
  readonly body: string;
  readonly breaking: string;
  readonly footer: string;
  readonly confirmCommit: string;
}

export interface CommitzentConfiguration {
  readonly types: CommitzentTypes[];
  readonly scopes: CommitzentScopes[];
  readonly usePreparedCommit?: boolean;
  readonly allowTicketNumber?: boolean;
  readonly isTicketNumberRequired?: boolean;
  readonly ticketNumberPrefix?: string;
  readonly ticketNumberRegExp?: string;
  readonly messages: CommitzentMessages;
  readonly allowCustomScopes?: boolean;
  readonly allowBreakingChanges?: string[];
  readonly skipQuestions?: string[];
  readonly subjectLimit?: number;
  readonly breakLineChar?: string;
  readonly footerPrefix?: string;
  readonly askForBreakingChangeFirst?: boolean;
}
