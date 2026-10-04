export const roles={superAdmin:'SUPER_ADMIN',agencyAdmin:'AGENCY_ADMIN',manager:'MANAGER',agent:'AGENT',contentEditor:'CONTENT_EDITOR',customer:'CUSTOMER'} as const;
export const permissions={
  propertyRead:'property:read',propertyWrite:'property:write',propertyPublish:'property:publish',propertyExport:'property:export',
  leadRead:'lead:read',leadWrite:'lead:write',leadAssign:'lead:assign',leadExport:'lead:export',
  appointmentRead:'appointment:read',appointmentWrite:'appointment:write',
  cmsRead:'cms:read',cmsWrite:'cms:write',settingsWrite:'settings:write',reportsRead:'reports:read',
  usersManage:'users:manage',auditRead:'audit:read'
} as const;
export const rolePermissions:Record<string,string[]>={
  SUPER_ADMIN:Object.values(permissions),
  AGENCY_ADMIN:Object.values(permissions),
  MANAGER:[permissions.propertyRead,permissions.propertyWrite,permissions.propertyPublish,permissions.leadRead,permissions.leadWrite,permissions.leadAssign,permissions.appointmentRead,permissions.appointmentWrite,permissions.reportsRead],
  AGENT:[permissions.propertyRead,permissions.leadRead,permissions.leadWrite,permissions.appointmentRead,permissions.appointmentWrite],
  CONTENT_EDITOR:[permissions.propertyRead,permissions.cmsRead,permissions.cmsWrite],
  CUSTOMER:[permissions.propertyRead,permissions.appointmentWrite]
};
export function can(role:string,permission:string){return rolePermissions[role]?.includes(permission)??false;}
