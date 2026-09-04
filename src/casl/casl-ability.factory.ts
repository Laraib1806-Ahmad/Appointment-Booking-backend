import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from './userRoles';
import { User } from '../modules/user/user.schema';

export type Subjects = any;
export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    if (user?.role === 'ADMIN') {
      can(Action.Manage, 'all');
    }

    return build();
  }
}
