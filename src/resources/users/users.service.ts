import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { responseModel } from 'src/helpers/response.helper';

//mongodb example
// import { User } from 'src/database/sql/entities/user.entity';
//sql example
import { User } from '../../database/sql/entities/user.entity';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    try {
      //mongodb example
      // await this.userModel.create({});
      //sql example
      //await User.create({});
      return responseModel('new user created successfully');
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
