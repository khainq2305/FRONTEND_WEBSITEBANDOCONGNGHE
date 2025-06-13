// src/casl/ability.js
import { AbilityBuilder, createMongoAbility } from '@casl/ability';

export const defineAbilitiesFor = (permissions = []) => {
  const { can, rules } = new AbilityBuilder(createMongoAbility);

  for (const perm of permissions) {
    can(perm.action, perm.subject); // ví dụ: manage all
  }

  return createMongoAbility(rules);
};

