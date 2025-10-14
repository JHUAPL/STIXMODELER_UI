import common from '../definitions/common.json';

import { Base } from './Base';

class Unknown extends Base {
  constructor() {
    const def = {
      img: 'unknown.png',
      type: 'object',
      prefix: '',
      active: true,
      properties: {},
      relationships: [
      ],
    };

    super(common, def);

    this.properties.type.enum = ['unknown'];
    this.properties.type.value = 'unknown';

  }
}

const singleton = new Unknown();

export default singleton;
