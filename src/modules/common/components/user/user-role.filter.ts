export enum UserRole {
  namesapce_admin = 1,
  normal_admin = 2,
  system_admin = 3
}

export function userRoleFilter() {
  return function (value: UserRole) {
    switch (value) {
      case UserRole.namesapce_admin:
        return 'NAMESPACE_ADMIN';
      case UserRole.normal_admin:
        return 'NORMAL_ADMIN';
      case UserRole.system_admin:
        return 'SYSTEM_ADMIN';
      default:
        return 'UNKNOW';
    }
  };
}
