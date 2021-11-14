export * from './user.factory';
export * from './credentials.factory';

import { UserFactory } from './user.factory';
import { CredentialsFactory } from './credentials.factory';

export const factories = [UserFactory, CredentialsFactory];
