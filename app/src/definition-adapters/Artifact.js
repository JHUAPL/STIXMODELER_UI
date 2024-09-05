import deepmerge from 'deepmerge';
import common from '../definitions/observable-common.json';
import rawDefinition from '../definitions/artifact.json';

import { Base } from './Base';

class Artifact extends Base {
  constructor() {
    const definition_extension = {
      img: 'observable.png',
      prefix: 'artifact--',
      active: false,
      relationships: [],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);

    this.properties.payload_bin.type = 'string';
    this.properties.url.type = 'string';
    this.properties.encryption_algorithm.type = 'string';

    this.properties.hashes.value = {};

    this.properties.hashes.control = 'genericobject';
  }
}

const singleton = new Artifact();

export default singleton;
