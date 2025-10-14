import deepmerge from 'deepmerge';
import common from '../definitions/observable-common.json';
import rawDefinition from '../definitions/autonomous-system.json';

import { Base } from './Base';

class AutonomousSystem extends Base {
  constructor() {
    const definition_extension = {
      img: 'observable.png',
      prefix: 'autonomous-system--',
      active: false,
      relationships: [],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);

    this.properties.number.control = 'slider';
  }
}

const singleton = new AutonomousSystem();

export default singleton;
