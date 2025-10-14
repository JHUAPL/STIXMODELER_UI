import deepmerge from 'deepmerge';
import common from '../definitions/common.json';
import rawDefinition from '../definitions/relationship.json';

import { Base } from './Base';

class Relationship extends Base {
  constructor() {
    const definition_extension = {
      img: '',
      prefix: 'relationship--',
      active: false,
      relationships: [],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);
  }
}

const singleton = new Relationship();

export default singleton;
