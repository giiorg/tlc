import { JwtService } from './jwt.service';
import { Context } from './context.interface';
import { UserService } from '../user/user.service';
import Container from 'typedi';

const jwtService = new JwtService();

// TODO: better typing for 'httpContext'
export async function getContext(httpContext: any) {
  try {
    const tokenWithBearer = httpContext.req.headers.authorization || '';
    const token = tokenWithBearer.replace('Bearer ', '');
    const decoded = jwtService.verify(token);

    const context: Context = {};
    if (decoded?.userId) {
      const userService = Container.get(UserService);
      context.user = await userService.getUser(decoded.userId);
    }

    return context;
  } catch (err) {
    throw new Error(err);
  }
}
