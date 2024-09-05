import deepmerge from 'deepmerge';
import moment from 'moment';

const SPEC_VERSION = 2.1;

const COMMON_RELS = [
  {
    type: 'created-by', target: 'identity', x_exclusive: true, x_embed: 'created_by_ref',
  },

  {
    type: 'includes', target: 'grouping', x_embed: 'object_refs', x_reverse: true,
  },
  {
    type: 'applies-to', target: 'note', x_embed: 'object_refs', x_reverse: true,
  },
  {
    type: 'applies-to', target: 'opinion', x_embed: 'object_refs', x_reverse: true,
  },
  {
    type: 'references', target: 'report', x_embed: 'object_refs', x_reverse: true,
  },
  {
    type: 'applies-to', target: 'marking-definition', x_embed: 'object_marking_refs', x_reverse: true,
  }
];

export class Base {
  constructor(common, def) {
    const commonProps = common.properties;
    let defProps = {};

    common.required.map((item) => {
      if (commonProps[item]) {
        commonProps[item].required = true;
      }
    });

    if (def.allOf) {
      def.allOf.map((item) => {
        if (item.hasOwnProperty('properties')) {
          defProps = item.properties;
        }
      });
    } else {
      defProps = def.properties;
    }

    if (def.required) {
      def.required.map((item) => {
        if (defProps[item]) {
          defProps[item].required = true;
        }
      });
    }

    for (const item in def) {
      this[item] = def[item];
    }

    for (const rel of COMMON_RELS) {
      def.relationships.push(rel);
    }

    const mergedProps = deepmerge(commonProps, defProps);

    this.handleFields(mergedProps);

    this.properties = mergedProps;
  }

  handleFields(mergedProps) {
    // Start special handling of common object
    // properties.
    for (const prop in mergedProps) {
      // Get (possibly nested) ref
      let ref = mergedProps[prop].$ref;
      for (const a in mergedProps[prop].allOf) {
        if (mergedProps[prop].allOf[a].$ref) {
          ref = mergedProps[prop].allOf[a].$ref;
        }
      }
      ref = ref || '';

      // set type for values with ref
      if (ref.indexOf('timestamp.json') !== -1) {
        mergedProps[prop].type = 'dts';
      } else if (ref.indexOf('identifier.json') !== -1) {
        mergedProps[prop].type = 'string';
      } else if (ref.indexOf('dictionary.json') !== -1) {
        mergedProps[prop].type = 'object';
      }

      // Set default blank values based on the prop
      // type.
      if (mergedProps[prop].type) {
        mergedProps[prop].value = this.defaultValue(mergedProps[prop].type);
      }
    }

    if (mergedProps.type) {
      mergedProps.type.control = 'literal';
      if (mergedProps.type.enum) {
        mergedProps.type.value = mergedProps.type.enum[0];
      }
    }

    if (mergedProps.aliases) {
      mergedProps.aliases.control = 'csv';
    }

    if (mergedProps.kill_chain_phases) {
      mergedProps.kill_chain_phases.control = 'killchain';
      mergedProps.kill_chain_phases.vocab = [
        {
          label: 'Lockheed Kill Chain',
          value: 'lockheed-martin-cyber-kill-chain',
          phases: [
            {
              label: 'Reconnaissance',
              phase_name: 'reconnaissance',
            },
            {
              label: 'Weaponize',
              phase_name: 'weaponization',
            },
            {
              label: 'Delivery',
              phase_name: 'delivery',
            },
            {
              label: 'Exploitation',
              phase_name: 'exploitation',
            },
            {
              label: 'Installation',
              phase_name: 'installation',
            },
            {
              label: 'Command & Control (C2)',
              phase_name: 'command-and-control',
            },
            {
              label: 'Actions On Objectives',
              phase_name: 'actions-on-objectives',
            }
          ],
        }
      ];
    }

    if (mergedProps.external_references) {
      mergedProps.external_references.control = 'externalrefs';
    }

    mergedProps.id.control = 'hidden';

    if (mergedProps.confidence) {
      mergedProps.confidence.control = 'slider';
    }

    if (mergedProps.description) {
      mergedProps.description.control = 'textarea';
    }

    /**
     * These are defaults that are to be set by the TI orchestrator
     */

    mergedProps.spec_version.value = SPEC_VERSION;
    mergedProps.spec_version.control = 'literal';

    if (mergedProps.extensions) {
      mergedProps.extensions.control = 'genericobject';
      mergedProps.extensions.type = 'object';
      mergedProps.extensions.value = {};
    }

    if (mergedProps.created_by_ref) {
      mergedProps.created_by_ref.type = 'literal';
    }

    if (mergedProps.lang) {
      mergedProps.lang.value = 'en';
      mergedProps.lang.control = 'hidden';
    }

    mergedProps.object_marking_refs.control = 'hidden';
    mergedProps.granular_markings.control = 'hidden';
  }

  defaultValue(type) {
    let def;

    // ignores type path
    if (type.includes('.json')) {
      type = type.split('/').slice(-1)[0];
    }

    switch (type) {
      case 'string':
        def = '';
        break;
      case 'dts':
        def = moment().utc(true).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        break;
      case 'integer':
        def = 0;
        break;
      case 'array':
        def = [];
        break;
      case 'object':
        def = {};
        break;
      case 'boolean':
        def = false;
        break;
    }

    return def;
  }

  flattenExtensionProperties(def) {
    const properties = {};
    let tmp = {};
    if ('properties' in def) {
      tmp = this.flattenExtensionProperties(def.properties);
      for (const [key, value] of Object.entries(tmp)) {
        properties[key] = value;
      }
    } else if ('extensions' in def) {
      tmp = this.flattenExtensionProperties(def.extensions);
      for (const [key, value] of Object.entries(tmp)) {
        properties[key] = value;
      }
    } else {
      for (const [key, value] of Object.entries(def)) {
        if (key.includes('extension-definition')) {
          tmp = this.flattenExtensionProperties(value);
          for (const [key, value] of Object.entries(tmp)) {
            properties[key] = value;
          }
        } else {
          properties[key] = value;
        }
      }
    }
    return properties;
  }

  mergeExtension(def, extDef) {
    const { properties, } = this;
    let defProps;
    if (def.allOf) {
      def.allOf.map((item) => {
        if ('properties' in item) {
          defProps = this.flattenExtensionProperties(item.properties);
        }
      });
    } else {
      defProps = this.flattenExtensionProperties(def.properties);
    }

    if ('extension_type' in defProps) {
      delete defProps.extension_type;
    }

    if (!('extensions' in properties)) {
      this.properties.extensions = {};
      this.properties.extensions.value = {};
      this.properties.extensions.type = 'object';
      this.properties.extensions.control = 'hidden';
    }

    const props = { extension_type: 'property-extension', };
    for (const prop in defProps) {
      if ((prop !== 'extension_type') && (defProps[prop].type)) {
        const value = this.defaultValue(defProps[prop].type);
        props[prop] = value;
        defProps[prop].value = value;
      }
    }
    const mergedProps = deepmerge(properties, defProps);
    this.properties = mergedProps;
    this.properties.extensions.value[extDef.id] = props;
  }
}
