import deepmerge from 'deepmerge';
import common from '../definitions/common.json';
import rawDefinition from '../definitions/marking-definition.json';

import { Base } from './Base';

class MarkingDefinitionAmber extends Base {
  constructor() {
    const definition_extension = {
      img: 'tlp-amber.png',
      prefix: 'marking-definition--',
      active: true,
      relationships: [],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);

    this.properties.definition = {
      tlp: 'amber',
    };

    this.properties.definition.control = 'hidden';
  }
}

const singleton = new MarkingDefinitionAmber();

export default singleton;
