import { HttpStatus, Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext, HttpCode, HttpException } from '@nestjs/common';
import { IExpressRequest } from 'src/types/expressRequest.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const request = ctx.switchToHttp().getRequest<IExpressRequest>();

    if (request.user) {
      return true;
    }

    throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
  }
}
