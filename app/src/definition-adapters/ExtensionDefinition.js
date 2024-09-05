import deepmerge from 'deepmerge';
import common from '../definitions/common.json';
import rawDefinition from '../definitions/extension-definition.json';

import { Base } from './Base';

class ExtensionDefinition extends Base {
  constructor() {
    const definition_extension = {
      img: '',
      prefix: 'extension-definition--',
      active: false,
      relationships: [],

    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);

    // Hoist vocabs onto properties
    this.properties.extension_types.vocab = this.definitions['extension-type-enum'].enum;
    this.properties.extension_types.control = 'stringselector';
  }
}

const singleton = new ExtensionDefinition();

export default singleton;
