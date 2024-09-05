import deepmerge from 'deepmerge';
import common from '../definitions/observable-common.json';
import rawDefinition from '../definitions/email-addr.json';

import { Base } from './Base';

class EmailAddr extends Base {
  constructor() {
    const definition_extension = {
      img: 'observable.png',
      prefix: 'email-addr--',
      active: false,
      relationships: [
        {
          type: 'addr-belongs-to', target: 'observable', 'sub-target': 'user-account', x_embed: 'belongs_to_ref',
        },
        { type: 'addr-belongs-to', target: 'user-account', x_embed: 'belongs_to_ref', }
      ],
    };

    const def = deepmerge(definition_extension, rawDefinition);

    super(common, def);

    this.properties.belongs_to_ref.control = 'hidden';
  }
}

const singleton = new EmailAddr();

export default singleton;
