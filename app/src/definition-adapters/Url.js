import _cloneDeep from 'lodash/cloneDeep';
import deepmerge from 'deepmerge';
import common from '../definitions/observable-common.json';
import rawDefinition from '../definitions/url.json';

import { Base } from './Base';

class Url extends Base {
  constructor() {
    const definition_extension = {
      img: 'observable.png',
      prefix: 'url--',
      active: false,
      relationships: [],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);

    this.properties.value.type = 'string';
  }
}

const singleton = new Url();

export default singleton;
