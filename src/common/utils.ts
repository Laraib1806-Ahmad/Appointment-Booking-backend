import * as bcrypt from 'bcryptjs';

import type { Optional } from '../types';

export function generateHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function validateHash(
  password: Optional<string>,
  hash: Optional<string>,
): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash);
}

export function getVariableName<TResult>(getVar: () => TResult): string {
  const m = /\(\)=>(.*)/.exec(
    getVar.toString().replace(/(\r\n|\n|\r|\s)/gm, ''),
  );

  if (!m) {
    throw new Error(
      "The function does not contain a statement matching 'return variableName;'",
    );
  }

  const fullMemberName = m[1];
  const memberParts = fullMemberName.split('.');
  return memberParts[memberParts.length - 1];
}
