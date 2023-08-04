import { generatePasswordHash } from 'src/helpers/encryption.helper';
import { TokenType } from '../entities/token-type.entity';
import { UserType } from '../entities/user-type.entity';
import { User } from '../entities/user.entity';

export const seedDb = async () => {
  await UserType.bulkCreate([
    {
      user_type: 'MANAGER',
    },
    { user_type: 'ADMIN' },
  ]);
  //adding token types
  await TokenType.bulkCreate([
    {
      token_type: 'AUTH',
    },
  ]);

  //insert admin user
  {
    const { user_type_id } = await UserType.findOne({
      where: {
        user_type: 'ADMIN',
      },
    });

    await User.create({
      user_type_id: user_type_id,
      username: 'admin@gmail.com',
      first_name: 'admin',
      last_name: 'user',
      password: await generatePasswordHash('qwerty'),
    });
  }
};