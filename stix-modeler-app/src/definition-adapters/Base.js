import deepmerge from 'deepmerge';
import moment from 'moment';

const SPEC_VERSION = "2.1";

const COMMON_RELS = [
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

    // Set required common properties
    common.required.map((item) => {
      if (commonProps[item]) {
        commonProps[item].required = true;
      }
    });

    // Get type-specific properties
    if (def.allOf) {
      def.allOf.map((item) => {
        if ('properties' in item) {
          defProps = item.properties;
        }
      });
    } else {
      defProps = def.properties;
    }

    // Set required type-specific properties
    if (def.required) {
      def.required.map((item) => {
        if (defProps[item]) {
          defProps[item].required = true;
        }
      });
    }

    // Set properties for singleton from schema
    for (const item in def) {
      this[item] = def[item];
    }

    // Add common relationships
    for (const rel of COMMON_RELS) {
      def.relationships.push(rel);
    }

    // Only SROs and SCOs may have this property
    if ("created_by_ref" in commonProps) {
      def.relationships.push({
        type: 'created-by', target: 'identity', x_exclusive: true, x_embed: 'created_by_ref',
      }
    )}

    const mergedProps = deepmerge(commonProps, defProps);

    this.handleFields(mergedProps);

    this.properties = mergedProps;
    this.extensions = [];
  }

  /**
   * Set default values and control types for the specified properties
   * @param {object} mergedProps properties (common and sdo-specific)
   */
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

      if (ref.length) {
        mergedProps[prop].type = ref;
      }

      // Set default blank values based on the prop
      // type.
      if (mergedProps[prop].type) {
        mergedProps[prop].value = this.defaultValue(mergedProps[prop]);
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
        },
        {
          label: 'MITRE ATT&CK',
          value: 'mitre-attack',
          phases: [
            {
              label: 'Reconnaissance',
              phase_name: 'reconnaissance',
            },
            {
              label: 'Resource Development',
              phase_name: 'resource-development',
            },
            {
              label: 'Initial Access',
              phase_name: 'initial-access',
            },
            {
              label: 'Execution',
              phase_name: 'execution',
            },
            {
              label: 'Persistence',
              phase_name: 'persistence',
            },
            {
              label: 'Privilege Escalation',
              phase_name: 'privilege-escalation'
            },
            {
              label: 'Defense Evasion',
              phase_name: 'defense-evasion',
            },
            {
              label: 'Credential Access',
              phase_name: 'credential-access',
            },
            {
              label: 'Discovery',
              phase_name: 'discovery',
            },
            {
              label: 'Lateral Movement',
              phase_name: 'lateral-movement',
            },
            {
              label: 'Collection',
              phase_name: 'collection'
            },
            {
              label: 'Command & Control (C2)',
              phase_name: 'command-and-control',
            },
            {
              label: 'Exfiltration',
              phase_name: 'exfiltration',
            },
            {
              label: 'Impact',
              phase_name: 'impact'
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

    if (mergedProps.hashes) {
      mergedProps.hashes.control = 'killchain';
      mergedProps.hashes.vocab = [
        'MD5', 'SHA-1', 'SHA-256', 'SHA-512',
        'SHA3-256', 'SHA3-512', 'SSDEEP'
      ]
      mergedProps.hashes.control = 'genericobject';
      mergedProps.hashes.type = 'object';
      mergedProps.hashes.value = {};
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
      mergedProps.extensions.control = 'hidden';
    }


    if (mergedProps.lang) {
      mergedProps.lang.value = 'en';
      mergedProps.lang.control = 'hidden';
    }

    mergedProps.object_marking_refs.control = 'hidden';
    mergedProps.granular_markings.control = 'hidden';
  }

  /**
   * Get the default empty value for the specified
   * property's type
   * @param {object} def property
   * @returns default value for property
   */
  defaultValue(def) {
    let type = def.type;
    let value;

    type = type.split('/').slice(-1)[0];
    type = type.split('.json')[0];
    def.type = type;
    
    switch (type) {
      case 'boolean':
        value = false;
        break;
      case 'dictionary':
      case 'external-reference':
      case 'hashes':
      case 'hashes-type':
      case 'object':
      case 'observable-container':
        value = {};
        def.type = 'object';
        break;
      case 'float':
      case 'integer':
      case 'number':
        value = 0;
        def.type = 'number';
        break;
      case 'binary':
      case 'hex':
      case 'identifier':
      case 'open-vocab':
      case 'string':
      case 'url-regex':
        value = "";
        def.type = 'string';
        break;
      case 'array':
      case 'list':
        def.type = 'array';
      case 'enum':
      case 'kill-chain-phase':
        value = [];
        break;
      case 'timestamp':
        value = moment().utc(true).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        break;
      default:
        break;
    }

    return value;
  }

  /**
   * Flatten nested extension properties
   * (Enables resiliency for non-standard schema formats)
   * @param {*} schema 
   * @returns dictionary of properties
   */
  flattenExtensionProperties(schema) {
    let extProps = {}
    let properties;
    if (schema.allOf) {
      schema.allOf.map((item) => {
        if ('properties' in item) {
          properties = item.properties
        }
      });
    } else {
      properties = schema.properties;
    }

    // In case of nested property extensions
    let found = true;
    while (found) {
      found = false;
      for (const [key, value] of Object.entries(properties)) {
        if (key == 'properties' || key == 'extensions' || 
            key.includes("extension-definition")) {
              properties = value;
              found = true;
              break;
        }
      }
    }

    for (const [prop, def] of Object.entries(properties)) {
      if (prop != 'extension_type') {
        const value = this.defaultValue(def);
        extProps[prop] = def;
        def.value = value;
      }
    }

    return extProps;
  }


  /**
   * Merge properties from a property-extension schema into the
   * SDO singleton
   * @param {*} def schema of extended properties
   * @param {*} extDef extension definition node
   */
  mergeExtension(def, extDef) {
    const { properties, } = this;

    if (!('extensions' in properties)) {
      this.properties.extensions = {};
      this.properties.extensions.value = {};
    }

    // If this object uses extensions (such as network-traffic),
    // do not allow further editing via gui
    this.properties.extensions.type = 'object';
    this.properties.extensions.control = 'hidden';

    const extProps = this.flattenExtensionProperties(def);
    // Only toplevel-property-extensions can have extension_properties field,
    // but this useful, so hold onto it
    extDef.extension_properties = Object.keys(extProps);
    const mergedProps = deepmerge(properties, extProps);
    this.properties = mergedProps;
    this.extensions.push(extDef.uiid);
  }
}
