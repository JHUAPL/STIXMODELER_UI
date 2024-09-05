import deepmerge from 'deepmerge';
import common from '../definitions/common.json';
import rawDefinition from '../definitions/marking-definition.json';

import { Base } from './Base';

class MarkingDefinitionStatement extends Base {
  constructor() {
    const definition_extension = {
      img: 'restricted-marking.png',
      prefix: 'marking-definition--',
      active: true,
      relationships: [],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);

    this.properties.definition = {};
    this.properties.definition.value = {};
    this.properties.definition.control = 'genericobject';
  }
}

const singleton = new MarkingDefinitionStatement();

export default singleton;
