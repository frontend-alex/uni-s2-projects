export enum AccountProviders {
  Local = 'Local',
  Google = 'Google',
  Github = 'Github',
  Facebook = 'Facebook',
}

export type User = {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  onboarding: boolean;
}