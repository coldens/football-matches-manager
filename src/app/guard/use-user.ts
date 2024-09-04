import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';

export const UseUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): User => {
    const auth = ctx.switchToHttp().getRequest<Request>().user;
    return auth;
  },
);
