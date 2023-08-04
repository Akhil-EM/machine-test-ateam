import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { responseModel } from './helpers/response.helper';
import { LocalAuthGuard } from './guards/auth.guard';
import { LocalStrategy } from './passport/localStorage.strategy';

@ApiTags('root')
@Controller()
export class AppController {
  @ApiOperation({ summary: 'base url of application.' })
  @Get()
  getHello() {
    return responseModel('application up and running.');
  }

  @UseGuards(LocalStrategy)
  @Post('/login')
  login() {
    return responseModel("ok");
    console.log('====================================');
    console.log('user login success');
    console.log('====================================');
  }
}
