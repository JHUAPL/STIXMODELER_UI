import deepmerge from 'deepmerge';
import common from '../definitions/common.json';
import rawDefinition from '../definitions/note.json';

import { Base } from './Base';

class Note extends Base {
  constructor() {
    const definition_extension = {
      img: 'note.png',
      prefix: 'note--',
      active: true,
      relationships: [
        {
          type: 'note', target: 'note', x_embed: 'object_refs',
        }
      ],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);

    this.properties.authors.control = 'csv';
    this.properties.object_refs.control = 'hidden';
    this.properties.content.control = 'textarea';
  }
}

const singleton = new Note();

export default singleton;
