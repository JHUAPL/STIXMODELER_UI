import deepmerge from 'deepmerge';
import common from '../definitions/common.json';
import rawDefinition from '../definitions/attack-pattern.json';

import { Base } from './Base';

class AttackPattern extends Base {
  constructor() {
    const definition_extension = {
      img: 'attack-pattern.png',
      prefix: 'attack-pattern--',
      active: true,
      relationships: [
        { type: 'targets', target: 'identity', },
        { type: 'targets', target: 'location', },
        { type: 'targets', target: 'vulnerability', },
        { type: 'uses', target: 'malware', },
        { type: 'uses', target: 'tool', }
      ],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);
  }
}

const singleton = new AttackPattern();

export default singleton;
