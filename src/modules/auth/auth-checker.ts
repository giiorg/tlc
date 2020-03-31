import { AuthChecker } from 'type-graphql';

import { Context } from './context.interface';

export const authChecker: AuthChecker<Context> = ({ context: { user } }) => {
  if (user) {
    return true;
  }

  return false;
};
