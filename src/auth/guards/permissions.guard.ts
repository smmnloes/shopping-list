import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PERMISSIONS_KEY } from '../permissions/permissions.decorator'
import { Permission } from '../permissions/permission'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (!requiredRoles) {
      return true
    }
    const {user} = context.switchToHttp().getRequest()
    // Todo: Controller that requires ALL roles
    return requiredRoles.some((role) => user.roles?.includes(role))
  }
}
