import { applyDecorators, UseGuards } from '@nestjs/common';

import { AuthGuard } from './auth.guard';

/**
 * Use the AuthGuard to protect a route or controller from unauthorized access.
 */
export function UseAuth() {
  return applyDecorators(UseGuards(AuthGuard));
}
