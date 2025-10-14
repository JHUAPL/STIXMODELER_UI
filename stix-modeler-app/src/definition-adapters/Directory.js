import deepmerge from 'deepmerge';
import common from '../definitions/observable-common.json';
import rawDefinition from '../definitions/directory.json';

import { Base } from './Base';

class Directory extends Base {
  constructor() {
    const definition_extension = {
      img: 'observable.png',
      prefix: 'directory--',
      active: false,
      relationships: [
        {
          type: 'contains', target: 'observable', 'sub-target': 'directory', x_embed: 'contains_refs',
        }
      ],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);

    this.properties.contains_refs.control = 'hidden';
  }
}

const singleton = new Directory();

export default singleton;
