import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalAuthGuard } from 'src/guards/passport-auth.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { ImageValidationInterceptor } from 'src/interceptors/validations/image-validation.intercetor';
import { RoleCheckGuard } from 'src/guards/role-check.guard';
import { RoleDecorator } from 'src/helpers/role-decorator';
import { SearchUserDto } from './dto/search-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Req() request: Request | any) {
    const { user } = request;
    return this.usersService.login(user);
  }

  @UseGuards(AuthGuard)
  @Delete('/logout')
  logout(@Req() request: Request | any) {
    const { token } = request;
    return this.usersService.logout(token);
  }

  @UseGuards(AuthGuard, RoleCheckGuard)
  @RoleDecorator('ADMIN')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], multerConfig),
    ImageValidationInterceptor,
  )
  @UseGuards(AuthGuard, RoleCheckGuard)
  @RoleDecorator('ADMIN')
  @Post('')
  create(
    @Body() body: CreateUserDto,
    @UploadedFiles()
    files,
  ) {
    return this.usersService.createUser(body, files.image[0]);
  }

  @UseGuards(AuthGuard, RoleCheckGuard)
  @RoleDecorator('ADMIN')
  @Delete('/:userId')
  remove(@Param('userId') userId: string) {
    return this.usersService.removeUser(+userId);
  }

  @UseGuards(AuthGuard, RoleCheckGuard)
  @RoleDecorator('ADMIN')
  @Patch('/:userId')
  update(@Param('userId') userId: string, @Body() user: CreateUserDto) {
    return this.usersService.updateUser(+userId, user);
  }

  @UseGuards(AuthGuard, RoleCheckGuard)
  @RoleDecorator('ADMIN')
  @Get('/search')
  search(@Query() searchDto: SearchUserDto) {
    return this.usersService.search(searchDto);
  }
}
