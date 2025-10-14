import deepmerge from 'deepmerge';
import common from '../definitions/common.json';
import rawDefinition from '../definitions/opinion.json';

import { Base } from './Base';

class Opinion extends Base {
  constructor() {
    const definition_extension = {
      img: 'opinion.png',
      prefix: 'opinion--',
      active: true,
      relationships: [],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);

    this.properties.authors.control = 'csv';
    this.properties.object_refs.control = 'hidden';
    this.properties.explanation.control = 'textarea';
    this.properties.opinion.control = 'textarea';
  }
}

const singleton = new Opinion();

export default singleton;
