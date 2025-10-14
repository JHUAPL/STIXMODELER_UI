import deepmerge from 'deepmerge';
import common from '../definitions/common.json';
import rawDefinition from '../definitions/marking-definition.json';

import { Base } from './Base';

class MarkingDefinitionWhite extends Base {
  constructor() {
    const definition_extension = {
      img: 'tlp-white.png',
      prefix: 'marking-definition--',
      active: true,
      relationships: [],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);

    this.properties.definition_type = {
      value: 'tlp',
      type: 'string',
      control: 'hidden'
    }
    this.properties.definition = {
      value: {
        tlp: 'white',
      },
      type: 'object',
      control: 'hidden'
    };
  }
}

const singleton = new MarkingDefinitionWhite();

export default singleton;
