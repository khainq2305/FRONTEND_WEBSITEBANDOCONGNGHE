import { AbilityBuilder, createMongoAbility } from '@casl/ability';

export function buildAbilityFromPermissions(permissions) {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  for (const { action, subject } of permissions) {
    can(action, subject);

    // 🔥 Nếu có 'manage', tự map thêm quyền phụ
    if (action === 'manage') {
      ['read', 'create', 'update', 'delete', 'access', 'export', 'approve'].forEach(act => {
        can(act, subject === 'all' ? 'all' : subject);
      });
    }
  }

  return build();
}
