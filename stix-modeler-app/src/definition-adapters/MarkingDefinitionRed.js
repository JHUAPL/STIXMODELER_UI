import deepmerge from 'deepmerge';
import common from '../definitions/common.json';
import rawDefinition from '../definitions/marking-definition.json';

import { Base } from './Base';

class MarkingDefinitionRed extends Base {
  constructor() {
    const definition_extension = {
      img: 'tlp-red.png',
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
        tlp: 'red',
      },
      type: 'object',
      control: 'hidden'
    };
  }
}

const singleton = new MarkingDefinitionRed();

export default singleton;
