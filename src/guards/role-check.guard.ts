import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleCheckGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      // No roles defined, allow access by default
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRole = request.user.userType;

    return roles.includes(userRole);
  }
}
