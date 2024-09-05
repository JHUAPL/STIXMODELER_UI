import deepmerge from 'deepmerge';
import common from '../definitions/common.json';
import rawDefinition from '../definitions/grouping.json';

import { Base } from './Base';

class Grouping extends Base {
  constructor() {
    const definition_extension = {
      img: 'grouping.png',
      prefix: 'grouping--',
      active: true,
      relationships: [],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);

    this.properties.context.vocab = this.definitions['grouping-context-ov'].enum;
    this.properties.object_refs.control = 'hidden';
  }
}

const singleton = new Grouping();

export default singleton;
