import { CanActivate, ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    console.log(requiredRoles);
    const request = context.switchToHttp().getRequest();
    console.log(request.role);
    const userRole = request.role;  // Role set by AuthGuard
    
    return requiredRoles.some((role) => role === userRole);
  }
}

export const ROLES_KEY = 'roles'
export const Roles = (...roles:Role[]) =>{
    return SetMetadata(ROLES_KEY,roles)
};