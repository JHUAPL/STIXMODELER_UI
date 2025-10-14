import deepmerge from 'deepmerge';
import common from '../definitions/observable-common.json';
import rawDefinition from '../definitions/user-account.json';

import { Base } from './Base';

class UserAccount extends Base {
  constructor() {
    const definition_extension = {
      img: 'observable.png',
      prefix: 'user-account--',
      active: false,
      relationships: [
      ],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);
  }
}

const singleton = new UserAccount();

export default singleton;
