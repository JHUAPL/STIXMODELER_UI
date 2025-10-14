import deepmerge from 'deepmerge';
import common from '../definitions/common.json';
import rawDefinition from '../definitions/tool.json';

import { Base } from './Base';

class Tool extends Base {
  constructor() {
    const definition_extension = {
      img: 'tool.png',
      prefix: 'tool--',
      active: true,
      relationships: [
        { type: 'targets', target: 'identity', },
        { type: 'targets', target: 'vulnerability', },
        { type: 'targets', target: 'infrastructure', },
        { type: 'targets', target: 'location', },
        { type: 'uses', target: 'infrastructure', }
      ],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);

    this.properties.tool_types.vocab = this.definitions['tool-type-ov'].enum;
  }
}

const singleton = new Tool();

export default singleton;
