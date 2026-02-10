import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { TokenPayload } from '../../domain/services/token-service.port';
import { PERMISSIONS_KEY } from './roles.guard';
import {
  AUTO_PERMISSIONS_KEY,
  AUTO_PERMISSIONS_RESOURCE_KEY,
} from '../../application/decorators/auto-permissions.decorator';
import { IS_PUBLIC_KEY } from './jwt-auth.guard';

/**
 * Requires user to have ALL of the listed permissions.
 * Use with @Permissions('a', 'b') when every permission is required.
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions?.length) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as TokenPayload | undefined;
    if (!user?.permissions) {
      throw new ForbiddenException('No permissions found.');
    }

    const hasAll = requiredPermissions.every((p) =>
      user.permissions!.includes(p),
    );
    if (!hasAll) {
      throw new ForbiddenException('You do not have the required permissions.');
    }
    return true;
  }
}

/**
 * Derives required permission from controller resource + request method/handler.
 * Format: resource.action (e.g. platform_user.create, user.read).
 * Only enforces for platform users; others pass through for RolesGuard.
 */
@Injectable()
export class AutoPermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const isAuto = this.reflector.getAllAndOverride<boolean>(AUTO_PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isAuto) return true;

    const resource = this.reflector.getAllAndOverride<string>(
      AUTO_PERMISSIONS_RESOURCE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!resource) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as TokenPayload | undefined;
    if (!user) return true;

    if (!user.isPlatform) return true;

    if (!user.permissions?.length) {
      throw new ForbiddenException('No permissions found.');
    }

    if (user.role === 'SUPER_ADMIN') return true;

    const action = this.deriveAction(context, request.method);
    const permissionName = `${resource}.${action}`;

    if (!user.permissions.includes(permissionName)) {
      throw new ForbiddenException(
        `You do not have the required permission: ${permissionName}.`,
      );
    }
    return true;
  }

  private deriveAction(context: ExecutionContext, method: string): string {
    const handlerName = context.getHandler().name.toLowerCase();

    const handlerToAction: Record<string, string> = {
      putpermissions: 'put_permissions',
      additems: 'add_items',
      updateitems: 'update_items',
      getdrafts: 'list',
      getbydate: 'read',
      gettoken: 'read',
      getbyid: 'read',
      getone: 'read',
      findone: 'read',
      findbyid: 'read',
      create: 'create',
      list: 'list',
      update: 'update',
      patch: 'update',
      markread: 'update',
      markmessageread: 'update',
      delete: 'delete',
      remove: 'delete',
      calculate: 'calculate',
      close: 'close',
      confirm: 'confirm',
      verify: 'verify',
      reject: 'reject',
      retry: 'retry',
    };

    for (const [key, action] of Object.entries(handlerToAction)) {
      if (handlerName.includes(key)) return action;
    }

    const methodMap: Record<string, string> = {
      GET: 'read',
      POST: 'create',
      PUT: 'update',
      PATCH: 'update',
      DELETE: 'delete',
    };
    return methodMap[method] ?? 'read';
  }
}
