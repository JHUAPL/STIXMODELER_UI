import deepmerge from 'deepmerge';
import common from '../definitions/common.json';
import rawDefinition from '../definitions/identity.json';

import { Base } from './Base';

class Identity extends Base {
  constructor() {
    const definition_extension = {
      img: 'identity.png',
      prefix: 'identity--',
      active: true,
      relationships: [
        { type: 'located-at', target: 'location', }
      ],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);

    this.properties.identity_class.vocab = this.definitions['identity-class-ov'].enum;
    this.properties.identity_class.control = 'stringselector';
    this.properties.sectors.vocab = this.definitions['industry-sector-ov'].enum;

    this.properties.roles.control = 'csv';
  }
}

const singleton = new Identity();

export default singleton;
