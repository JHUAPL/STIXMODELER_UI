import deepmerge from 'deepmerge';
import common from '../definitions/observable-common.json';
import rawDefinition from '../definitions/mutex.json';

import { Base } from './Base';

class Mutex extends Base {
  constructor() {
    const definition_extension = {
      img: 'observable.png',
      prefix: 'mutex--',
      active: false,
      relationships: [],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);
  }
}

const singleton = new Mutex();

export default singleton;
