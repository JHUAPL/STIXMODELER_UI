import deepmerge from 'deepmerge';
import common from '../definitions/common.json';
import rawDefinition from '../definitions/location.json';

import { Base } from './Base';

class Location extends Base {
  constructor() {
    const definition_extension = {
      img: 'location.png',
      prefix: 'location--',
      active: true,
      relationships: [],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);
  }
}

const singleton = new Location();

export default singleton;
