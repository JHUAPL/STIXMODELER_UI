import deepmerge from 'deepmerge';
import common from '../definitions/common.json';
import rawDefinition from '../definitions/infrastructure.json';

import { Base } from './Base';

class Infrastructure extends Base {
  constructor() {
    const definition_extension = {
      img: 'infrastructure.png',
      prefix: 'infrastructure--',
      active: true,
      relationships: [
        { type: 'communicates-with', target: 'infrastructure', },
        { type: 'consists-of', target: 'infrastructure', },
        { type: 'controls', target: 'infrastructure', },
        { type: 'uses', target: 'infrastructure', },
        { type: 'delivers', target: 'malware', },
        { type: 'has', target: 'vulnerability', },
        { type: 'hosts', target: 'tool', },
        { type: 'hosts', target: 'malware', },
        { type: 'located-at', target: 'location', }
      ],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);

    this.properties.infrastructure_types.vocab = this.definitions['infrastructure-type-ov'].enum;
  }
}

const singleton = new Infrastructure();

export default singleton;
