import deepmerge from 'deepmerge';
import common from '../definitions/observable-common.json';
import rawDefinition from '../definitions/windows-registry-key.json';

import { Base } from './Base';

class WindowsRegistryKey extends Base {
  constructor() {
    const definition_extension = {
      img: 'observable.png',
      prefix: 'windows-registry-key--',
      active: false,
      relationships: [
        {
          type: 'creator-user', target: 'observable', 'sub-target': 'user-account', x_exclusive: true,
        },
        { type: 'creator-user', target: 'user-account', x_exclusive: true, }
      ],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);

    this.properties.creator_user_ref.control = 'hidden';
    this.properties.number_of_subkeys.control = 'slider';

    this.properties.values.control = 'csv';
  }
}

const singleton = new WindowsRegistryKey();

export default singleton;
