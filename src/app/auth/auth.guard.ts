import { PrismaService } from '@/prisma/prisma.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

/**
 * This is a basic implementation of an authentication guard that checks for an API key in the request headers.
 * In a real-world application, it is recommended to use a more secure authentication method such as JWT, OAuth, or
 * a third-party authentication service like Auth0.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request: Request): Promise<boolean> {
    const apiKey = request.get('x-api-key');

    if (!apiKey) {
      throw new UnauthorizedException();
    }

    const user = await this.prisma.user.findUnique({
      where: {
        apiKey,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    request.user = user;

    return true;
  }
}
