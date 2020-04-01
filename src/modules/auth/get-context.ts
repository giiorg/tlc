import Container from 'typedi';

import { JwtService } from './jwt.service';
import { Context } from './context.interface';
import { UserService } from '../user/user.service';

const jwtService = new JwtService();

// TODO: better typing for 'httpContext'
export async function getContext(httpContext: any) {
  const context: Context = {};

  try {
    const tokenWithBearer = httpContext.req.headers.authorization || '';
    if (!tokenWithBearer) {
      return context;
    }

    const token = tokenWithBearer.replace('Bearer ', '');
    const decoded = jwtService.verify(token);

    if (decoded?.userId) {
      const userService = Container.get(UserService);
      context.user = await userService.getUser(decoded.userId);
    }
  } catch (err) {}

  return context;
}
