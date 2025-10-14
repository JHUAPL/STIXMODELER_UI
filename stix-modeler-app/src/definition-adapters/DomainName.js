import deepmerge from 'deepmerge';
import common from '../definitions/observable-common.json';
import rawDefinition from '../definitions/domain-name.json';

import { Base } from './Base';

class DomainName extends Base {
  constructor() {
    const definition_extension = {
      img: 'observable.png',
      prefix: 'domain-name--',
      active: false,
      relationships: [],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);

    this.properties.resolves_to_refs.control = 'hidden';
  }
}

const singleton = new DomainName();

export default singleton;
