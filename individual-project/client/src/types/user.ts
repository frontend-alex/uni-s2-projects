export enum AccountProviders {
  Local = 'Local',
  Google = 'Google',
  Github = 'Github',
  Facebook = 'Facebook',
}

export type User = {
  _id: string;
  username: string;
  email: string;
  provider: AccountProviders; 
  emailVerified: boolean;
  hasPassword: boolean;
  createdAt: string;
  updatedAt: string;
}