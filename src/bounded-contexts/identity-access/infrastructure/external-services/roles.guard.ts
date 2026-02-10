import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { TokenPayload } from '../../domain/services/token-service.port';
import { IS_PUBLIC_KEY } from './jwt-auth.guard';

export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as TokenPayload | undefined;
    if (!user?.role) throw new ForbiddenException('Forbidden');

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (requiredPermissions?.length) {
      if (!user.permissions?.length) {
        throw new ForbiddenException('No permissions found.');
      }
      const hasOne = requiredPermissions.some((p) =>
        user.permissions!.includes(p),
      );
      if (!hasOne) {
        throw new ForbiddenException('Insufficient permissions');
      }
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (requiredRoles?.length) {
      if (!requiredRoles.includes(user.role))
        throw new ForbiddenException('Insufficient role');
    }
    return true;
  }
}
