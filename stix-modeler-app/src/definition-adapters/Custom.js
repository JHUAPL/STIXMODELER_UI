import deepmerge from 'deepmerge';
import common from '../definitions/common.json';

import { Base } from './Base';

class Custom extends Base {
  constructor(rawDefinition, extensionDefinition) {
    let prefix = `${rawDefinition.title}--`;
    rawDefinition.allOf.map((item) => {
      if ('properties' in item) {
        if (item.properties.id.pattern) {
          prefix = `${rawDefinition.allOf[1].properties.id.pattern.substring(1)}`;
        }
      }
    });

    const definition_extension = {
      img: 'custom.png',
      prefix,
      active: true,
      relationships: [],
    };

    const def = deepmerge(definition_extension, rawDefinition);
    super(common, def);

    this.extensions.push(extensionDefinition.uiid);
  }
}

const factory = (rawDefinition, extensionDefinition) => new Custom(rawDefinition, extensionDefinition);

export default factory;
