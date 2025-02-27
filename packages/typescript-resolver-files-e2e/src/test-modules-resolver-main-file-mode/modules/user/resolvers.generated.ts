/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
import type { Resolvers } from './../types.generated';
import { Profile } from './resolvers/Profile';
import { me as Query_me } from './resolvers/Query/me';
import { userByAccountName as Query_userByAccountName } from './resolvers/Query/userByAccountName';
import { profileChanges as Subscription_profileChanges } from './resolvers/Subscription/profileChanges';
import { User } from './resolvers/User';
import { UserPayload } from './resolvers/UserPayload';
import { UserResult } from './resolvers/UserResult';
export const resolvers: Resolvers = {
  Query: { me: Query_me, userByAccountName: Query_userByAccountName },

  Subscription: { profileChanges: Subscription_profileChanges },
  Profile: Profile,
  User: User,
  UserPayload: UserPayload,
  UserResult: UserResult,
};
