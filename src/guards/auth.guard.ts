import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Token } from 'src/database/sql/entities/token.entity';
import { verifyJwtToken } from 'src/helpers/encryption.helper';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization } = request.headers;
      const token = authorization.split(' ')[1];
      if (!token) throw new Error('token not found');

      //check if token is valid
      const checkToken = await verifyJwtToken(token);
      //check token  exists in db
      const tokenDbCheck = await Token.findOne({
        where: {
          token,
          active: true,
        },
      });

      if (!tokenDbCheck) throw new Error('invalid token provided');

      request.token = token;
      request.user = checkToken;
      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNAUTHORIZED);
    }
  }
}
