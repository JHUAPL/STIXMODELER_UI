import deepmerge from 'deepmerge';
import common from '../definitions/common.json';
import rawDefinition from '../definitions/course-of-action.json';

import { Base } from './Base';

class CourseOfAction extends Base {
  constructor() {
    const definition_extension = {
      img: 'course-of-action.png',
      prefix: 'course-of-action--',
      active: true,
      relationships: [
        { type: 'mitigates', target: 'attack-pattern', },
        { type: 'mitigates', target: 'vulnerability', },
        { type: 'mitigates', target: 'malware', },
        { type: 'mitigates', target: 'tool', },
        { type: 'investigates', target: 'indicator', },
        { type: 'mitigates', target: 'indicator', }
      ],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);
  }
}

const singleton = new CourseOfAction();

export default singleton;
