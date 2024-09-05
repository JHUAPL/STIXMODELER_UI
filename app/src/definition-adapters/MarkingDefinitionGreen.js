import deepmerge from 'deepmerge';
import common from '../definitions/common.json';
import rawDefinition from '../definitions/marking-definition.json';

import { Base } from './Base';

class MarkingDefinitionGreen extends Base {
  constructor() {
    const definition_extension = {
      img: 'tlp-green.png',
      prefix: 'marking-definition--',
      active: true,
      relationships: [],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);

    this.properties.definition = {
      tlp: 'green',
    };

    this.properties.definition.control = 'hidden';
  }
}

const singleton = new MarkingDefinitionGreen();

export default singleton;
