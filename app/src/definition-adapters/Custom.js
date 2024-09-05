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

    const extProps = { extension_type: extensionDefinition.extension_types[0], };
    this.properties.extensions = {};
    this.properties.extensions.type = 'object';
    this.properties.extensions.value = {};
    this.properties.extensions.value[extensionDefinition.id] = extProps;
    this.properties.extensions.control = 'hidden';
  }
}

const factory = (rawDefinition, extensionDefinition) => new Custom(rawDefinition, extensionDefinition);

export default factory;
