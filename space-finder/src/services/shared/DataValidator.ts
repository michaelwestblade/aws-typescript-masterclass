import { SpaceEntry } from '../model/Model';

export class MissingFieldException extends Error {
  constructor(missingField: string) {
    super(`Value for ${missingField} expected`);
  }
}

export function validateAsSpaceEntry(arg: any) {
  if ((arg as SpaceEntry).location === undefined) {
    throw new MissingFieldException('location');
  }

  if ((arg as SpaceEntry).id === undefined) {
    throw new MissingFieldException('id');
  }

  if ((arg as SpaceEntry).name === undefined) {
    throw new MissingFieldException('name');
  }
}
