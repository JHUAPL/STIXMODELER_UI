import deepmerge from 'deepmerge';
import common from '../definitions/common.json';
import rawDefinition from '../definitions/report.json';

import { Base } from './Base';

class Report extends Base {
  constructor() {
    const definition_extension = {
      img: 'report.png',
      prefix: 'report--',
      active: true,
      relationships: [],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);

    this.properties.object_refs.control = 'hidden';
    this.properties.report_types.vocab = this.definitions['report-type-ov'].enum;
  }
}

const singleton = new Report();

export default singleton;
