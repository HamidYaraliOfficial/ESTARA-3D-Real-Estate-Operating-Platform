import { BadRequestException, UnauthorizedException } from '@nestjs/common';
export interface TenantContext { agencyId: string; userId?: string; role?: string; }
export function requireTenant(value?: string): string {
  if (!value) throw new UnauthorizedException('Tenant context is required');
  return value;
}
export function assertSameTenant(expected: string, actual: string) {
  if (expected !== actual) throw new BadRequestException('Cross-tenant access denied');
}
