import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserType } from 'src/database/sql/entities/user-type.entity';
import { User } from 'src/database/sql/entities/user.entity';
import { comparePassword } from 'src/helpers/encryption.helper';
import { checkFreeMail } from 'src/helpers/free-mail-check';

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    //check for free mail
    if (checkFreeMail(username))
      throw new HttpException(
        'mail provider not acceptable',
        HttpStatus.NOT_ACCEPTABLE,
      );

    //check for password cases
    if (!passwordRegex.test(password))
      throw new HttpException(
        'Password should be a minimum of 8 letters with a combination of at least one number, one special character, and one Capital letter.',
        HttpStatus.NOT_ACCEPTABLE,
      );

    const user: any = await User.findOne({
      where: {
        username: username,
      },
      raw: true,
      include: [{ model: UserType, attributes: ['user_type'] }],
      attributes: ['user_id', 'password', 'first_name', 'last_name'],
    });
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    if (!(await comparePassword(password, user.password)))
      throw new HttpException(
        'wrong password provided.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    user.user_type = user['userType.user_type'];
    return user;
  }
}
