import jwt, { SignOptions } from 'jsonwebtoken';

const options: SignOptions = {
  expiresIn: '30d',
  algorithm: 'HS256',
};

export class JwtService {
  sign(payload: any): string {
    return jwt.sign(payload, process.env.JWT_SECRET, options);
  }

  verify(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET, options);
    } catch (err) {
      return null;
    }
  }
}
