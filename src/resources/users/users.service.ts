import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { responseModel } from 'src/helpers/response.helper';

import {
  generateJwtToken,
  generatePasswordHash,
} from 'src/helpers/encryption.helper';
import { Token } from 'src/database/sql/entities/token.entity';
import { TokenType } from 'src/database/sql/entities/token-type.entity';
import { Image } from 'src/database/sql/entities/image.enity';
import { UserType } from 'src/database/sql/entities/user-type.entity';
import { User } from 'src/database/sql/entities/user.entity';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { checkFreeMail } from 'src/helpers/free-mail-check';
import { sequelize } from 'src/database/sql/sql.provider';
import { SearchUserDto } from './dto/search-user.dto';

const uploadPath = join(__dirname, '../../../uploads', 'images');
const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
@Injectable()
export class UsersService {
  async login(user: any) {
    try {
      const { user_id, first_name, last_name, user_type } = user;
      //generate token and insert in db and sent back to user
      const token = await generateJwtToken({
        userId: user_id,
        userType: user_type,
      });

      //get token types
      const { token_type_id } = await TokenType.findOne({
        where: {
          token_type: 'AUTH',
        },
      });
      //insert into tokens
      await Token.create({
        token_type_id,
        user_id,
        token,
      });

      return responseModel('user login success', {
        token: token,
        userType: user_type,
        firstName: first_name,
        lastName: last_name,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async logout(token: string) {
    try {
      //make token inactive
      await Token.update(
        {
          active: false,
        },
        {
          where: {
            token,
          },
        },
      );

      return responseModel('user logout success');
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async createUser(user: CreateUserDto, image: any) {
    try {
      //check its'a  free mail or not
      if (checkFreeMail(user.username)) {
        await unlinkSync(`${uploadPath}/${image.filename}`);
        throw new HttpException(
          'this mail provider is not accepted',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      //check password
      if (!passwordRegex.test(user.password)) {
        await unlinkSync(`${uploadPath}/${image.filename}`);
        throw new HttpException(
          'Password should be a minimum of 8 letters with a combination of at least one number, one special character, and one Capital letter.',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      //check email exists
      const emailCheck = await User.findOne({
        where: {
          username: user.username,
        },
      });

      if (emailCheck) {
        //remove uploaded image
        await unlinkSync(`${uploadPath}/${image.filename}`);
        throw new HttpException(
          'username already in use',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      //save image and get id
      const { image_id } = await Image.create({
        image_path: image.filename,
      });

      //get manger user type id
      const { user_type_id } = await UserType.findOne({
        where: {
          user_type: 'MANAGER',
        },
      });

      //add new user
      await User.create({
        user_type_id,
        profile_image_id: image_id,
        username: user.username,
        first_name: user.firstName,
        last_name: user.lastName,
        password: await generatePasswordHash(user.password),
      });

      return responseModel('new user added successfully');
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async removeUser(userId: number) {
    try {
      //check userId exits
      const user = await User.findOne({
        where: {
          user_id: userId,
        },
        raw: true,
      });
      if (!user)
        throw new HttpException(
          `userId ${userId} not found.`,
          HttpStatus.NOT_FOUND,
        );

      //remove profile image from files
      const { image_path } = await Image.findOne({
        where: {
          image_id: user.profile_image_id,
        },
        raw: true,
      });

      await unlinkSync(`${uploadPath}/${image_path}`);
      //remove from user table
      await User.destroy({
        where: {
          user_id: userId,
        },
      });

      //remove from image from db it self
      await Image.destroy({
        where: {
          image_id: user.profile_image_id,
        },
      });

      return responseModel('user removed successfully');
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async updateUser(userId: number, user: CreateUserDto) {
    try {
      //check its'a  free mail or not
      if (checkFreeMail(user.username)) {
        throw new HttpException(
          'this mail provider is not accepted',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      //check password
      if (!passwordRegex.test(user.password)) {
        throw new HttpException(
          'Password should be a minimum of 8 letters with a combination of at least one number, one special character, and one Capital letter.',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      //add new user
      await User.update(
        {
          username: user.username,
          first_name: user.firstName,
          last_name: user.lastName,
          password: await generatePasswordHash(user.password),
        },
        {
          where: {
            user_id: userId,
          },
        },
      );

      return responseModel('user updated successfully');
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async search(searchDto: SearchUserDto) {
    try {
      const [users, meta] = await sequelize.query(
        `SELECT user_id,username,first_name,last_name,CONCAT('/images/',images.image_path) as 'profileImage'
         FROM users
         LEFT JOIN images ON images.image_id = users.profile_image_id
         WHERE users.username 
          LIKE '%${searchDto.searchQuery}%' 
           OR users.first_name 
          LIKE '%${searchDto.searchQuery}%' 
           OR users.last_name 
          LIKE '%${searchDto.searchQuery}%' 
          ORDER BY ${searchDto.orderBy} ${searchDto.order};`,
      );

      return responseModel('users', { users: users });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
