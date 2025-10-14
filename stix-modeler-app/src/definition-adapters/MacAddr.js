import deepmerge from 'deepmerge';
import common from '../definitions/observable-common.json';
import rawDefinition from '../definitions/mac-addr.json';

import { Base } from './Base';

class MacAddr extends Base {
  constructor() {
    const definition_extension = {
      img: 'observable.png',
      prefix: 'mac-addr--',
      active: false,
      relationships: [],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);
  }
}

const singleton = new MacAddr();

export default singleton;
