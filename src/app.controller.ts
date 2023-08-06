import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { responseModel } from './helpers/response.helper';
import { LocalAuthGuard } from './guards/passport-auth.guard';
import { LocalStrategy } from './passport/localStorage.strategy';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return responseModel('application up and running.');
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Req() request: Request) {
    const { user } = request;
    console.log('====================================');
    console.log(user);
    console.log('====================================');
    return responseModel('ok');
  }
}
