import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/database/sql/entities/user.entity';
import { comparePassword } from 'src/helpers/encryption.helper';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    if (!comparePassword(password, user.password))
      throw new HttpException(
        'wrong password provided.',
        HttpStatus.NOT_ACCEPTABLE,
      );

    return user;
  }
}
