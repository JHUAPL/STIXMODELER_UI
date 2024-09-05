import { makeAutoObservable, toJS } from 'mobx';
import _cloneDeep from 'lodash/cloneDeep';
import _merge from 'lodash/merge';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import Proxy from './Proxy';

import ap from '../definition-adapters/AttackPattern.js';
import indicator from '../definition-adapters/Indicator.js';
import malware from '../definition-adapters/Malware.js';
import ma from '../definition-adapters/MalwareAnalysis.js';
import sighting from '../definition-adapters/Sighting.js';
import coa from '../definition-adapters/CourseOfAction.js';
import campaign from '../definition-adapters/Campaign.js';
import od from '../definition-adapters/ObservedData.js';
import identity from '../definition-adapters/Identity.js';
import tool from '../definition-adapters/Tool.js';
import report from '../definition-adapters/Report.js';
import vuln from '../definition-adapters/Vulnerability.js';
import grouping from '../definition-adapters/Grouping.js';
import infra from '../definition-adapters/Infrastructure.js';
import is from '../definition-adapters/IntrusionSet.js';
import location from '../definition-adapters/Location.js';
import ta from '../definition-adapters/ThreatActor.js';
import note from '../definition-adapters/Note.js';
import opinion from '../definition-adapters/Opinion.js';
import tlpred from '../definition-adapters/MarkingDefinitionRed.js';
import tlpamber from '../definition-adapters/MarkingDefinitionAmber.js';
import tlpgreen from '../definition-adapters/MarkingDefinitionGreen.js';
import tlpwhite from '../definition-adapters/MarkingDefinitionWhite.js';
import md from '../definition-adapters/MarkingDefinitionStatement.js';

import obs from '../definition-adapters/Observable.js';
import artifact from '../definition-adapters/Artifact.js';
import software from '../definition-adapters/Software.js';
import ipv4 from '../definition-adapters/IPv4Addr.js';
import ipv6 from '../definition-adapters/IPv6Addr.js';
import autosys from '../definition-adapters/AutonomousSystem.js';
import dir from '../definition-adapters/Directory.js';
import domain from '../definition-adapters/DomainName.js';
import emailaddr from '../definition-adapters/EmailAddr.js';
import emailmsg from '../definition-adapters/EmailMessage.js';
import file from '../definition-adapters/File.js';
import mac from '../definition-adapters/MacAddr.js';
import mutex from '../definition-adapters/Mutex.js';
import network from '../definition-adapters/NetworkTraffic.js';
import process from '../definition-adapters/Process.js';
import url from '../definition-adapters/Url.js';
import ua from '../definition-adapters/UserAccount.js';
import winregkey from '../definition-adapters/WindowsRegistryKey.js';
import cert from '../definition-adapters/Certificate.js';

import extDef from '../definition-adapters/ExtensionDefinition.js';
import custom from '../definition-adapters/Custom.js';

const SPEC_VERSION = '2.1';

export default class App {
  creatorID = `identity--${uuidv4()}`;

  showDetails = false;

  showRelDetails = false;

  showRelEditor = false;

  showEditor = false;

  showJSON = false;

  showJSONPaste = false;

  showSchemaPaste = false;

  showImporter = false;

  showRelPicker = false;

  showSDOPicker = false;

  showGrowl = false;

  showSubmissionError = false;

  updateFlow = false;

  groupMode = false;

  growlMessage = '';

  mutatedBundle = '';

  relationships = [];

  customRelationships = {};

  dragging = {};

  selected = {};

  selectedRel = {};

  selectedSDO = {};

  selectedGroup = [];

  bundle = {};

  pasteBundle;

  pasteSchema;

  nodes = [];

  edges = [];

  schemas = [];

  extendedSDOs = {};

  extensionDefs = {};

  failedCollection = [];

  objects = [
    sighting,
    malware,
    ma,
    indicator,
    coa,
    ap,
    od,
    campaign,
    identity,
    tool,
    report,
    vuln,
    grouping,
    infra,
    is,
    location,
    ta,
    note,
    opinion,
    tlpred,
    tlpamber,
    tlpgreen,
    tlpwhite,
    md,
    artifact,
    obs,
    software,
    ipv4,
    ipv6,
    autosys,
    dir,
    domain,
    emailaddr,
    emailmsg,
    file,
    mac,
    mutex,
    network,
    process,
    url,
    ua,
    winregkey,
    cert,
    extDef
  ];

  mousePosition = {
    clientX: 0,
    clientY: 0,
  };

  constructor() {
    makeAutoObservable(this, { autoBind: true, });

    this.bundle.spec_version = SPEC_VERSION;
    this.bundle.id = this.generateNodeID('bundle--');
    this.bundle.type = 'bundle';
    this.bundle.objects = [];
  }

  setMousePosition(x, y) {
    this.mousePosition.clientX = x;
    this.mousePosition.clientY = y;
  }

  setUpdateFlow(update) {
    this.updateFlow = update;
  }

  setSelected(o) {
    this.selected = o;
  }

  setSelectedRel(r) {
    this.selectedRel = r;
  }

  setSelectedSDO(sdo) {
    this.selectedSDO = sdo;
  }

  setDragging(dragging) {
    this.dragging = dragging;
  }

  setRelationships(relationships) {
    this.relationships = relationships;
  }

  showModal() {
    this.modal = true;
  }

  hideModal() {
    this.modal = false;
  }

  getCreatorID() {
    return this.creatorID;
  }

  updateCreatorID(id) {
    const oldID = this.creatorID;
    this.bundle.objects.map((object) => {
      if (object.created_by_ref === oldID) {
        object.created_by_ref = id;
      }
    });
    this.nodes.map((node) => {
      if (node.properties.created_by_ref.value === oldID) {
        node.properties.created_by_ref.value = id;
      }
    });
    this.creatorID = id;
  }

  generateNodeID(prefix) {
    return `${prefix}${uuidv4()}`;
  }

  generateMoment() {
    return moment().utc(true).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
  }

  generateTimestamp(time) {
    return moment(time).utc(true).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
  }

  addNodeToBundle(node) {
    const props = node.properties;

    const newProps = {
      id: node.id,
    };
    for (const prop in props) {
      if (props[prop].type !== undefined && prop !== 'id') {
        newProps[prop] = props[prop].value;
      }

      if (prop === 'definition') {
        newProps[prop] = props[prop];
      }
    }

    this.bundle.objects.push(newProps);
  }

  getEmbeddedType(relationship) {
    let type;
    if (relationship.x_embed.includes('refs')) {
      type = 'array';
    } else {
      type = 'string';
    }
    return type;
  }

  addEmbeddedRelationship(relationship) {
    const key = relationship.x_embed;
    const type = this.getEmbeddedType(relationship);
    this.bundle.objects.map((object) => {
      if (relationship.x_reverse) {
        if (object.id === relationship.target_ref) {
          if (type === 'string') {
            object[key] = relationship.source_ref;
          } else if (type == 'array') {
            object[key].push(relationship.source_ref);
          }
        }
      } else if (object.id === relationship.source_ref) {
        if (Array.isArray(key)) {
          key.map((k) => {
            for (const item in object) {
              if (item === k) {
                if (typeof object[k] === 'string') {
                  object[k] = relationship.target_ref;
                } else if (Array.isArray(object[k])) {
                  object[k].push(relationship.target_ref);
                } else {
                  console.warn(
                    'No type for relating in addRelationshipToBundle() in App.js'
                  );
                }
              }
            }
          });
        } else if (type === 'string') {
          object[key] = relationship.target_ref;
        } else if (type === 'array') {
          object[key].push(relationship.target_ref);
        }
      }
    });
  }

  addRelationshipToBundle(relationship) {
    if (relationship.x_embed) {
      this.addEmbeddedRelationship(relationship);
    } else {
      this.bundle.objects.push(relationship);
    }
  }

  addCreatorID(node) {
    // Set created_by_ref to creator id
    if ('created_by_ref' in node.properties) {
      node.properties.created_by_ref.value = this.creatorID;
    }
  }

  persistNode(node) {
    let nodeExists = false;
    // This will block generic observables
    // from persisting.
    if (node.type) {
      this.nodes.map((n) => {
        if (node.id === n.id) {
          nodeExists = true;
        }
      });

      if (!nodeExists) {
        this.nodes.push(node);
        this.addNodeToBundle(node);
      }
      return !nodeExists;
    }
  }

  removeKillChainPhase(value) {
    let removeIdx = -1;

    this.bundle.objects.map((object) => {
      removeIdx = -1;

      if (object.id === this.selected.id) {
        object.kill_chain_phases.map((phase, idx) => {
          if (
            phase.kill_chain_name === value.kill_chain_name
            && phase.phase_name === value.phase_name
          ) {
            removeIdx = idx;
          }
        });

        if (removeIdx > -1) {
          object.kill_chain_phases.splice(removeIdx, 1);
        }
      }
    });
  }

  editSDOValues(event) {
    const sdo = this.selectedSDO;
    const { value, } = event.currentTarget;
    const { name, } = event.currentTarget;

    this.selectedSDO[name] = value;

    this.nodes.map((node) => {
      if (node.title === sdo.title) {
        node[name] = value;
      }
    });
  }

  editNodeValues(event) {
    const props = this.selected.properties;
    const updateProps = {
      id: this.selected.id,
      value: event.currentTarget.value,
      name: event.currentTarget.name,
    };

    // Array's clearly need different treatment than strings.
    if (
      props[updateProps.name].type === 'array'
      && props[updateProps.name].vocab
    ) {
      let idx;
      // We need to see if this is a push or
      // a splice.
      props[updateProps.name].value.map((prop, i) => {
        if (prop === updateProps.value) {
          idx = i;
        }
      });
      // If the value exists, we know this is a splice or,
      // remove operation. Otherwise, the user is trying
      // to add a value.
      if (idx > -1) {
        props[updateProps.name].value.splice(idx, 1);
        this.removeNodeArrayValuesInBundle(updateProps);
      } else {
        this.updateNodeArrayValuesInBundle(updateProps);
      }
    } else if (props[updateProps.name].type === 'object') {
      props[updateProps.name].value = updateProps.value;

      try {
        updateProps.value = JSON.parse(updateProps.value);
        this.updateNodeValuesInBundle(updateProps);
      } catch (error) {
        console.warn('not a valid object');
      }
    } else {
      props[updateProps.name].value = updateProps.value;
      this.updateNodeValuesInBundle(updateProps);
    }
  }

  updateNodeValuesInBundle(props) {
    this.bundle.objects.map((object) => {
      if (object.id === props.id) {
        object[props.name] = props.value;
      }
    });
  }

  updateNodeArrayValuesInBundle(props) {
    this.bundle.objects.map((object) => {
      if (object.id === props.id) {
        object[props.name].push(props.value);
      }
    });
  }

  addGenericObject(field, value) {
    let v = this.selected.properties[field].value;
    v = _merge(v, value);
    this.bundle.objects.map((object) => {
      if (object.id === this.selected.id) {
        object[field] = v;
      }
    });
  }

  deleteGenericObject(field, key) {
    const v = this.selected.properties[field].value;

    delete v[key];

    this.bundle.objects.map((object) => {
      if (object.id === this.selected.id) {
        object[field] = v;
      }
    });
  }

  /**
   * For editing CSV values we will do both the property
   * and the bundle updates in one function since they
   * are unique in how both are updated.
   */
  editCSVInput(event) {
    const props = this.selected.properties;
    const updateProps = {
      id: this.selected.id,
      value: event.currentTarget.value,
      name: event.currentTarget.name,
    };

    props[updateProps.name].value = [];

    updateProps.value = updateProps.value.replace(/, /g, ',');
    updateProps.value = updateProps.value.replace(/ ,/g, ',');

    let newArray = updateProps.value.split(',');

    if (!updateProps.value.length) {
      newArray = [];
    }

    newArray.map((item) => {
      props[updateProps.name].value.push(item);
    });

    if (newArray.length > 0) {
      this.bundle.objects.map((object) => {
        if (object.id === updateProps.id) {
          object[updateProps.name] = [];
          newArray.map((item) => {
            object[updateProps.name].push(item);
          });
        }
      });
    } else {
      this.bundle.objects.map((object) => {
        if (object.id === updateProps.id) {
          object[updateProps.name] = [];
        }
      });
    }
  }

  removeNodeArrayValuesInBundle(props) {
    let idx;

    this.bundle.objects.map((object) => {
      if (object.id === props.id) {
        object[props.name].map((item, i) => {
          if (item === props.value) {
            idx = i;
          }
        });
      }

      if (idx > -1) {
        object[props.name].splice(idx, 1);
      }
    });
  }

  addDefaultObject(field, requiredFields) {
    const def = {};
    for (const f in requiredFields) {
      const field = requiredFields[f];
      def[field] = '';
    }

    this.bundle.objects.map((object) => {
      if (object.id === this.selected.id) {
        object[field].push(def);
      }
    });
  }

  changeERValue(input, select, idx) {
    const nodeProp = this.selected.properties.external_references.value;

    try {
      if (typeof JSON.parse(input) === 'object') {
        input = JSON.parse(input);
      }
    } catch (e) {}

    nodeProp[idx][select] = input;

    this.bundle.objects.map((object) => {
      if (object.id === this.selected.id) {
        object.external_references[idx][select] = input;
      }
    });
  }

  deleteERObjectProperty(select, idx) {
    const nodeProp = this.selected.properties.external_references.value;

    delete nodeProp[idx][select];

    this.bundle.objects.map((object) => {
      if (object.id === this.selected.id) {
        delete object.external_references[idx][select];
      }
    });
  }

  deleteERObject(idx) {
    const nodeProp = this.selected.properties.external_references.value;

    nodeProp.splice(idx, 1);
    this.bundle.objects.map((object) => {
      if (object.id === this.selected.id) {
        object.external_references.splice(idx, 1);
      }
    });
  }

  changeArrayObjectValue(input, select, idx, property) {
    const nodeProp = this.selected.properties[property].value;

    try {
      if (typeof JSON.parse(input) === 'object') {
        input = JSON.parse(input);
      }
    } catch (e) {}

    nodeProp[idx][select] = input;

    this.bundle.objects.map((object) => {
      if (object.id === this.selected.id) {
        object[property][idx][select] = input;
      }
    });
  }

  deleteArrayObjectProperty(field, idx, property) {
    const nodeProp = this.selected.properties[property].value;

    delete nodeProp[idx][field];

    this.bundle.objects.map((object) => {
      if (object.id === this.selected.id) {
        delete object[property][idx][field];
      }
    });
  }

  deleteArrayObject(idx, property) {
    const nodeProp = this.selected.properties[property].value;
    nodeProp.splice(idx, 1);
    this.bundle.objects.map((object) => {
      if (object.id === this.selected.id) {
        object[property].splice(idx, 1);
      }
    });
  }

  deleteObject(idx, property) {
    const nodeProp = this.selected.properties[property].value;

    nodeProp.splice(idx, 1);
    this.bundle.objects.map((object) => {
      if (object.id === this.selected.id) {
        object[property].splice(idx, 1);
      }
    });
  }

  blockDuplicateRelationships(source, target, relationship) {
    let alreadyRelated = false;
    this.edges.map((edge) => {
      if (
        edge.source_ref === source
        && edge.target_ref === target
        && edge.relationship_type === relationship
      ) {
        alreadyRelated = true;
      }
    });

    return alreadyRelated;
  }

  makeRelationship(source, target, relationship) {
    let rel;
    let exclusiveRelationshipDefined = false;
    if (target == undefined) {
      target = { id: '', };
    }
    const alreadyRelated = this.blockDuplicateRelationships(
      source.id,
      target.id,
      relationship.type
    );
    // Some relationships are exclusive by nature.
    // This bit of code will protect that exclusivity.
    if (relationship.x_exclusive) {
      this.edges.map((edge) => {
        if (
          edge.source_ref === source.id
          && relationship.type === edge.relationship_type
        ) {
          exclusiveRelationshipDefined = true;
        }
      });
    }

    if (!alreadyRelated && !exclusiveRelationshipDefined) {
      rel = {
        source_ref: source.id,
        target_ref: target.id,
        relationship_type: relationship.type,
        type: 'relationship',
        spec_version: '2.1',
        created: this.generateMoment(),
        modified: this.generateMoment(),
        id: this.generateNodeID('relationship--'),
        targetObjectType: relationship.target,
      };

      if (relationship['sub-target']) {
        rel.subTarget = relationship['sub-target'];
      }

      // x_reverse should never occur when targetobjectype is non-null
      if (relationship.x_reverse) {
        rel.source_ref = target.id;
        rel.target_ref = source.id;
      }

      if (relationship.x_embed) {
        rel.x_embed = relationship.x_embed;
      }
    }
    return rel;
  }

  canRelate(source, target) {
    const targetType = target.properties.type.enum[0];
    const sourceType = source.properties.type.enum[0];

    const alredyPushed = (rel, relationship) => {
      let found = false;

      rel.map((r) => {
        const t = relationship['sub-target']
          ? relationship['sub-target']
          : relationship.target;

        if (
          r.targetObjectType === t
          && r.relationship_type === relationship.type
        ) {
          found = true;
        }
      });

      return found;
    };

    const rel = [];

    if (target.id !== source.id) {
      target.relationships.map((relationship) => {
        if (relationship.target === sourceType) {
          const madeRel = this.makeRelationship(target, source, relationship);
          if (madeRel && !alredyPushed(rel, relationship)) {
            rel.push(madeRel);
          }
        }
      });

      source.relationships.map((relationship) => {
        if (relationship.target === targetType) {
          const madeRel = this.makeRelationship(source, target, relationship);
          if (madeRel && !alredyPushed(rel, relationship)) {
            rel.push(madeRel);
          }
        }
      });

      if (sourceType in this.customRelationships) {
        this.customRelationships[sourceType].map((relationship) => {
          if (relationship.target === targetType) {
            const madeRel = this.makeRelationship(source, target, relationship);
            if (madeRel && !alredyPushed(rel, relationship)) {
              rel.push(madeRel);
            }
          }
        });
      }
    }
    return rel;
  }

  addNodeWithRelationship(nodeOnScreen) {
    let relationship = this.canRelate(nodeOnScreen);
    const dragging = toJS(this.dragging);

    if (Array.isArray(relationship)) {
      this.relationships = relationship;
      this.showRelPicker = true;
    } else {
      const nodeToPersist = dragging;

      if (relationship) {
        // if the relationship is an observable, we need to swap
        // it out for the specific sub type.
        if (relationship.targetObjectType === 'observable') {
          if (nodeOnScreen.type === 'observable') {
            relationship = this.handleGenericObservable(relationship);
          }
        } else {
          this.edges.push(relationship);
          this.persistNode(nodeToPersist);
        }

        this.addRelationshipToBundle(relationship);
        return relationship;
      }
      this.persistNode(nodeToPersist);
      return relationship;
    }
  }

  getRelById(id) {
    let rel;

    this.edges.map((e) => {
      if (e.id === id) {
        rel = e;
      }
    });

    return rel;
  }

  getTypeNameFromJson(object) {
    let typeName;
    let ref;
    if (object.allOf) {
      object.allOf.map((item) => {
        if ('$ref' in item) {
          ref = item.$ref;
        }
      });
    }
    if (ref === undefined) {
      typeName = object.type;
    } else if (ref.includes('common/core.json')) {
      typeName = this.getTypeName(object);
    } else {
      try {
        // Assumes the reference json has the same name as its original type name
        const schemaFile = ref.split('/').slice(-1)[0];
        typeName = schemaFile.split('.')[0];
      } catch {
        return typeName;
      }
    }
    return typeName;
  }

  getTypeName(object) {
    let type;
    if (object.allOf) {
      object.allOf.map((item) => {
        if ('properties' in item) {
          type = item.properties.type.enum[0];
        }
      });
    } else {
      type = object.properties.type.enum[0];
    }
    return type;
  }

  getTypeObject(typeName) {
    let sdo;
    this.objects.map((o) => {
      const objType = this.getTypeName(o);
      if (objType == typeName) {
        sdo = o;
      }
    });
    return sdo;
  }

  createNodeByType(type) {
    let node = {};
    const object = this.getTypeObject(type);
    if (object) {
      node = structuredClone(object);
    }
    return node;
  }

  getObjectsByType(type) {
    return this.bundle.objects.filter(
      (object) => this.getTypeNameFromJson(object) === type
    );
  }

  getObjectById(id) {
    let object;

    this.bundle.objects.map((o) => {
      if (o.id === id) {
        object = o;
      }
    });

    return object;
  }

  getNodeById(id) {
    let node;

    this.nodes.map((n) => {
      if (n.id === id) {
        node = n;
      }
    });

    return node;
  }

  // get the nearest node to position
  getNodeByPosition(x, y) {
    let node;
    let distance
    this.nodes.map( n => {
      const dx = n.position.x - x;
      const dy = n.position.y - y;
      const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      
      if (distance) {
        if (d < distance) {
          node = n;
          distance = d;
        }
      } else {
        distance = d;
        node = n;
      }
    })
    return node;
  }

  getExtensions() {
    const extNames = Object.keys(this.extensionDefs);
    const exts = this.objects.filter((o) => extNames.includes(o.properties.type.enum[0]));
    return exts;
  }

  getCustomSDOs() {
    const sdos = this.objects.filter((o) => this.schemas.includes(o.properties.type.enum[0]));
    return sdos;
  }

  isExtended(type) {
    return type in this.extendedSDOs;
  }

  getExtendedSDOs() {
    const sdos = this.objects.filter((o) => {
      const type = this.getTypeName(o);
      return this.isExtended(type);
    });
    return sdos;
  }

  /**
   * Observables are dragged onto other SDO's as a
   * generic object and transformed after the user selects
   * the specific, targeted observable.
   */
  handleGenericObservable(relationship) {
    const newNode = this.createNodeByType(relationship.subTarget);
    newNode.id = this.generateNodeID(newNode.prefix);
    relationship.target_ref = newNode.id;
    const nodeToPersist = newNode;

    this.edges.push(relationship);
    this.persistNode(nodeToPersist);
    this.dragging = nodeToPersist;

    return relationship;
  }

  /**
   * Add a custom relationship to the customRelationship dictionary
   * for its respective object
   * @param {*} relationship
   */
  addCustomRelationship(relationship, src_id) {
    const src = this.getNodeById(src_id);
    const src_type = src.properties.type.value;
    const rel = {
      type: relationship.type,
      target: relationship.targetObjectType,
      x_exclusive: relationship.x_exclusive,
    };

    if (relationship.subTarget) {
      rel['sub-target'] = relationship.subTarget;
    }

    const relEquals = ((r, o) => (r.type === o.type) && (r.target === o.target)
      && (r['sub-target'] === o['sub-target'])
    );

    if (src) {
      let rels;
      if (src_type in this.customRelationships) {
        rels = this.customRelationships[src_type];
        let relExists = false;
        rels.map((r) => {
          if (relEquals(r, rel)) {
            relExists = true;
          }
        });
        if (!relExists) {
          rels.push(rel);
        }
      } else {
        rels = [rel];
      }
      this.customRelationships[src_type] = rels;
    }
  }

  /**
   * If node already exists, update its embedded relationship value
   */
  updateEmbeddedNodeRel(relationship) {
    const key = relationship.x_embed;

    let source = relationship.source_ref;
    let target = relationship.target_ref;

    if (relationship.x_reverse) {
      source = relationship.target_ref;
      target = relationship.source_ref;
    }

    const props = this.getNodeById(source).properties;
    // Array's clearly need different treatment than strings.
    if (
      props[key].type === 'array'
    ) {
        if (!props[key].value.includes(target)) {
          props[key].value.push(target);
        }
    } else {
      props[key].value = target;
    }
  }

  /**
   * When an SDO or Observable can relate to another
   * SDO in more than one way, the user will need to select
   * manually.
   */
  manuallySelectRelationship(relationship) {
    this.dragging = {};
    if (relationship.targetObjectType === 'observable') {
      relationship = this.handleGenericObservable(relationship);
    } else {
      this.edges.push(relationship);
    }

    this.addRelationshipToBundle(relationship);

    // update node value
    if (relationship.x_embed) {
      this.updateEmbeddedNodeRel(relationship);
    }

    this.relationships = [];
    this.showRelPicker = false;

    return relationship;
  }

  createRelationshipFromPaste(key, node, id) {
    const def = this.getTypeObject(node.type);
    let targetExists = false;
    let r;
    let targetType;
    let relationshipType = 'references';

    const src = node.id;
    const target = id || node[key];

    if (id) {
      targetType = id.split('--')[0];
    } else {
      targetType = node[key].split('--')[0];
    }

    this.nodes.map((n) => {
      if (node[key] === n.id || id === n.id) {
        targetExists = true;
      }
    });

    // get reverse embedded relationship
    const targetDef = this.getTypeObject(targetType);
    if (targetDef.relationships) {
      targetDef.relationships.forEach((relationship) => {
        if (relationship.target === node.type && relationship.x_reverse) {
          relationshipType = relationship.type;
        }
      });
    }

    // get embedded relationship
    if (def.relationships && targetExists) {
      def.relationships.map((relationship) => {
        if (
          relationship.x_embed
          && relationship.x_embed === key
          && relationship.target === targetType
        ) {
          relationshipType = relationship.type;
        }
      });
    }

    if (targetExists) {
      r = {
        source_ref: src,
        target_ref: target,
        relationship_type: relationshipType,
        type: 'relationship',
        created: this.generateMoment(),
        modified: this.generateMoment(),
        id: this.generateNodeID('relationship--'),
      };
    }
    return r;
  }

  setGrowlMessage(message) {
    this.growlMessage = message;
  }

  setShowGrowl(show) {
    this.showGrowl = show;
  }

  setShowDetails(show) {
    this.showDetails = show;
  }

  setShowRelDetails(show) {
    this.showRelDetails = show;
  }

  setShowRelEditor(show) {
    this.showRelEditor = show;
  }

  setShowEditor(show) {
    this.showEditor = show;
  }

  setShowJSON(show) {
    this.showJSON = show;
  }

  setShowJSONPaste(show) {
    this.showJSONPaste = show;
  }

  setShowSchemaPaste(show) {
    this.showSchemaPaste = show;
  }

  setShowImporter(show) {
    this.showImporter = show;
  }

  setShowRelPicker(show) {
    this.showRelPicker = show;
  }

  setShowSDOPicker(show) {
    this.showSDOPicker = show;
  }

  setShowSubmissionError(show) {
    this.showSubmissionError = show;
  }

  setGroupMode(mode) {
    this.groupMode = mode;
  }

  setPasteBundle(bundle) {
    this.pasteBundle = bundle;
  }

  setPasteSchema(schema) {
    this.pasteSchema = schema;
  }

  loadBundleFromFile(file) {
    this.pasteBundle = file;
    this.loadBundleFromPaste();
    this.growlMessage = 'Successfully Imported Bundle';
    this.showGrowl = true;
  }

  getExtensionProperty(object, field) {
    let property;
    if (this.isExtended(object.type)) {
      for (const ext in object.extensions) {
        if (field in object.extensions[ext]) {
          property = object.extensions[ext][field];
          break;
        }
      }
    }
    return property;
  }

  loadBundleFromPaste() {
    this.reset();
    const missing = new Set();
    const newExts = {};
    try {
      const bundle = JSON.parse(this.pasteBundle);
      bundle.objects.map((o) => {
        const type = this.getTypeNameFromJson(o);
        if (type !== 'relationship') {
          const newNode = this.createNodeByType(type);
          newNode.id = o.id;
          for (const key in newNode.properties) {
            const extProp = this.getExtensionProperty(o, key);
            if (extProp) {
              newNode.properties[key].value = extProp;
            } else if (key in o) {
              newNode.properties[key].value = o[key];
            }
          }
          if (type !== 'extension-definition') {
            this.persistNode(newNode);
          } else {
            this.addNodeToBundle(newNode);
          }

          if (this.isExtended(type)) {
            // do extension schema mapping
            const extensions = this.getExtensionsFromSchema(type, newExts);
            for (const ext in newNode.properties.extensions.value) {
              extensions.add(ext);
            }
            newExts[type] = extensions;

            if (Object.keys(newNode).length === 0) {
              missing.add(type);
            }
          }
        }
      });

      // Handle SRO's and synthetic relationships
      // after SDO's have been loaded.
      bundle.objects.map((o) => {
        if (o.type === 'relationship') {
          this.edges.push(o);
          this.bundle.objects.push(o);
        }

        if (o.type !== 'relationship') {
          for (const key in o) {
            if (
              key.indexOf('_ref') > -1
              && o[key].length
              && key !== 'external_references'
            ) {
              if (Array.isArray(o[key])) {
                o[key].map((id) => {
                  const rel = this.createRelationshipFromPaste(key, o, id);

                  if (rel) {
                    this.edges.push(rel);
                  }
                });
              } else {
                const rel = this.createRelationshipFromPaste(key, o);

                if (rel) {
                  this.edges.push(rel);
                }
              }
            }
          }
        }
      });

      // Update imported schemas to use imported definitions, if any exist
      this.updateExtensions(newExts);

      this.pasteBundle = '';
      this.showJSONPaste = false;

      if (missing.size > 0) {
        if (missing.size === 1) {
          this.growlMessage = `Missing SDO schema ${toJS(missing.values().next().value)}`;
        } else {
          this.growlMessage = `Missing ${missing.size} SDO schemas`;
        }
        this.showGrowl = true;
      }
    } catch (e) {
      this.growlMessage = 'Incorrect JSON Syntax.';
      this.showGrowl = true;
    }
  }

  extendObject(schema, extDef) {
    const extType = this.getTypeNameFromJson(schema);
    const sdo = this.getTypeObject(extType);
    try {
      sdo.mergeExtension(schema, extDef);
      let extProps = new Set();
      if (extType in this.extendedSDOs) {
        extProps = this.extendedSDOs[extType];
      }
      const props = sdo.properties.extensions.value[extDef.id];
      for (const prop in props) {
        if (prop !== 'extension_type') {
          extProps.add(prop);
        }
      }
      this.extendedSDOs[extType] = extProps;
    } catch (e) {
      this.growlMessage = 'Incorrect JSON Syntax.';
      this.showGrowl = true;
    }
  }

  getExtensionsFromSchema(schema, ext = this.extensionDefs) {
    let extensions;
    if (schema in ext) {
      extensions = ext[schema];
    } else {
      extensions = new Set();
    }
    return extensions;
  }

  createExtProperty(extObj, schema, extProp = {}) {
    const extType = extObj.extension_types[0];
    const ext = { extension_type: extType, };
    if (this.isExtended(schema)) {
      const props = toJS(this.extendedSDOs[schema]);
      for (const prop of props) {
        ext[prop] = props[prop];
      }
    }
    extProp[extObj.id] = ext;
    return extProp;
  }

  updateExtensions(newExts) {
    for (const schema in newExts) {
      const schemaType = this.getTypeObject(schema);
      if (schemaType) {
        // Remove old extensions from bundle
        const oldExts = this.extensionDefs[schema];
        for (const ext of oldExts) {
          this.removeExtension(ext);
          // remove old ext if exists in newExts
          newExts[schema].delete(ext);
        }
        // Update schema-to-def mapping
        this.extensionDefs[schema] = newExts[schema];
        // Create new extension SDOs
        let extensions = {};
        for (const ext of newExts[schema]) {
          const extObj = this.getObjectById(ext);
          extensions = this.createExtProperty(extObj, schema, extensions);
        }

        // update extensions for future objects
        schemaType.properties.extensions.value = extensions;
      }
    }
  }

  generateExtensions() {
    let extObj;
    let extId;
    for (const schema of this.getCustomSDOs()) {
      const schemaType = schema.properties.type.enum[0];
      extId = this.makeExtension('new-sdo', schemaType);
      extObj = this.getObjectById(extId);
      schema.properties.extensions.value = this.createExtProperty(extObj, schemaType);
    }

    for (const sdo of this.getExtendedSDOs()) {
      const sdoType = sdo.properties.type.enum[0];
      extId = this.makeExtension('property-extension', sdoType);
      extObj = this.getObjectById(extId);
      sdo.properties.extensions.value = this.createExtProperty(extObj, sdoType);
    }
  }

  makeExtension(extType, schema) {
    const ext = this.createNodeByType('extension-definition');
    const id = this.generateNodeID('extension-definition--');
    ext.properties.extension_types.value = [extType];
    ext.id = id;
    this.addNodeToBundle(ext);
    this.addExtension(schema, id);
    return id;
  }

  removeExtension(id) {
    this.bundle.objects.map((ext, i) => {
      if (ext.id === id) {
        this.bundle.objects.splice(i, 1);
      }
    });
  }

  addExtension(schema, id) {
    const extensions = this.getExtensionsFromSchema(schema);
    extensions.add(id);
    this.extensionDefs[schema] = extensions;
  }

  addSchema(json) {
    let exists = false;
    let extType = 'new-sdo';

    const schemaType = this.getTypeNameFromJson(json);

    this.objects.map((o) => {
      if (o.properties.type.enum[0] === schemaType) {
        exists = true;
        extType = 'property-extension';
      }
    });

    const extId = this.makeExtension(extType, schemaType);
    const ext = this.getObjectById(extId);
    if (!exists) {
      const schema = custom(json, ext);
      this.schemas.push(schemaType);
      this.objects.push(schema);
    } else {
      this.extendObject(json, ext);
    }
  }

  loadSchemaFromFile(file) {
    try {
      const schema = JSON.parse(file);
      this.addSchema(schema);
      this.growlMessage = 'Successfully Imported Extension(s)';
      this.showGrowl = true;
    } catch (e) {
      this.growlMessage = 'Incorrect JSON Syntax.';
      this.showGrowl = true;
    }
  }

  loadSchemaFromPaste() {
    try {
      const schema = JSON.parse(this.pasteSchema);
      this.addSchema(schema);
      this.pasteSchema = '';
      this.showSchemaPaste = false;
    } catch (e) {
      this.growlMessage = 'Incorrect JSON Syntax.';
      this.showGrowl = true;
    }
  }

  deleteSelectedSDO() {
    const sdo = this.selectedSDO;
    this.objects.map((o, i) => {
      if (o.title === sdo.title) {
        this.objects.splice(i, 1);
      }
    });

    Object.keys(this.extensionDefs).map((title, i) => {
      if (title === sdo.title) {
        this.extensionDefs.splice(i, 1);
      }
    });

    this.showEditor = false;
  }

  removeExternalRelFromBundle(id) {
    this.bundle.objects.map((rel, i) => {
      if (rel.id === id) {
        this.bundle.objects.splice(i, 1);
      }
    });
  }

  removeEmbeddedRelFromBundle(rel, source, target) {
    const spliceValue = (o, id) => {
      o[rel.x_embed].map((r, i) => {
        if (r === id) {
          o[rel.x_embed].splice(i, 1);
        }
      });
    };

    this.bundle.objects.map((o) => {
      if (o.id === source.id) {
        if (Array.isArray(o[rel.x_embed])) {
          spliceValue(o, target.id);
        } else if (o[rel.x_embed]) {
          o[rel.x_embed] = '';
        }
      }
    });
  }

  deleteSelectedNode() {
    const nodeToDelete = this.selected;

    // Handle the edges that may be impacted by
    // removing a node.
    this.edges.map((rel, i) => {
      if (rel.source_ref === nodeToDelete.id) {
        this.deleteRelationship(rel, i);
      } else if (rel.target_ref === nodeToDelete.id) {
        this.deleteRelationship(rel, i);
      }
    });

    this.bundle.objects.map((o, i) => {
      if (o.id === nodeToDelete.id) {
        this.bundle.objects.splice(i, 1);
      }
    });

    // Remove the selected node from the nodes object.
    this.nodes.map((node, i) => {
      if (node.id === nodeToDelete.id) {
        this.nodes.splice(i, 1);
      }
    });
    this.showDetails = false;
  }

  editRelationship(rel) {
    this.bundle.objects.map((object) => {
      if (object.id === this.selectedRel.id) {
        object.relationship_type = rel.type;
      }
    });

    this.edges.map((edge) => {
      if (edge.id === this.selectedRel.id) {
        edge.relationship_type = rel.type;
      }
    });
  }

  deleteSelectedRelationship() {
    this.edges.map((rel, i) => {
      if (rel.id === this.selectedRel.id) {
        this.deleteRelationship(rel, i);
      }
    });
    this.selectedRel = {};
    this.showRelEditor = false;
  }

  deleteRelationship(rel, i) {
    const sourceNode = this.getNodeById(rel.source_ref);
    const targetNode = this.getNodeById(rel.target_ref);

    if (rel.x_embed) {
      if (Array.isArray(sourceNode.properties[rel.x_embed])) {
        sourceNode.properties[rel.x_embed].map((o, i) => {
          if (o.id === targetNode) {
            sourceNode.properties[rel.x_embed].splice(i, 1);
          }
        });
      } else {
        sourceNode.properties[rel.x_embed].value = '';
      }
      this.removeEmbeddedRelFromBundle(rel, sourceNode, targetNode);
    }

    this.removeExternalRelFromBundle(rel.id);

    if (i > -1) {
      this.edges.splice(i, 1);
    }
  }

  modifyGroup(id) {
    const idx = this.selectedGroup.indexOf(id);
    if (idx < 0) {
      this.addToGroup(id);
    } else {
      this.removeFromGroup(id, idx);
    }
  }

  addToGroup(id) {
    this.selectedGroup.push(id);
    const node = this.getNodeById(id);
    node.selected = true;
  }

  removeFromGroup(id, idx) {
    const node = this.getNodeById(id);
    node.selected = false;
    this.selectedGroup.splice(idx, 1);
  }

  resetGroup() {
    this.selectedGroup.map((n) => {
      const node = this.getNodeById(n);
      if (node) {
        node.selected = false;
      }
    });
    this.selectedGroup = [];
    this.groupMode = false;
  }

  createGroup(id) {
    const newNode = this.createNodeByType('grouping');
    newNode.id = id;
    this.persistNode(newNode);
    this.addCreatorID(newNode);

    const src = { id, };
    this.selectedGroup.map((n) => {
      const rel = {
        type: 'includes',
        x_embed: 'object_refs',
      };
      const target = { id: n, };
      const relationship = this.makeRelationship(src, target, rel);
      this.manuallySelectRelationship(relationship);
    });

    this.resetGroup();
  }

  // Unflatten extension properties for correct STIX formatting
  mutateBundle() {
    const mutated = {};
    for (const [key, value] of Object.entries(this.bundle)) {
      if (key !== 'objects') {
        mutated[key] = value;
      }
    }
    mutated.objects = [];
    this.bundle.objects.map((object) => {
      if (this.isExtended(object.type)) {
        const obj = {};
        for (const [field, value] of Object.entries(object)) {
          if (field !== 'extensions') {
            obj[field] = value;
          }
        }
        obj.extensions = {};
        const extId = this.extensionDefs[object.type].values().next().value;
        const ext = { extension_type: 'property-extension', };
        const fields = this.extendedSDOs[object.type];
        for (const field of fields) {
          ext[field] = object[field];
          delete obj[field];
        }
        obj.extensions[extId] = ext;
        mutated.objects.push(obj);
      } else {
        mutated.objects.push(object);
      }
    });
    this.mutatedBundle = JSON.stringify(mutated, null, 2);
  }

  validateSubmission() {
    const { nodes, } = this;

    nodes.map((node) => {
      for (const key in node.properties) {
        if (node.required && node.required.indexOf(key) > -1) {
          // For required refs check the bundle
          // instead of the node.
          if (key.indexOf('_refs') > -1) {
            this.bundle.objects.map((o) => {
              for (const item in o) {
                if (item === key) {
                  if (!o[item].length) {
                    this.failedCollection.push({
                      node: node.id,
                      type: node.type,
                      img: node.img,
                      property: key,
                      msg: 'Required field, value must be provided.',
                    });
                  }
                }
              }
            });
          } else if (node.properties[key].hasOwnProperty('value')) {
            if (Array.isArray(node.properties[key].value)) {
              if (!node.properties[key].value.length) {
                this.failedCollection.push({
                  node: node.id,
                  type: node.type,
                  img: node.img,
                  property: key,
                  msg: 'Required field, value must be provided.',
                });
              }
            } else if (typeof node.properties[key].value === 'object') {
              if (!Object.keys(node.properties[key].value).length) {
                this.failedCollection.push({
                  node: node.id,
                  type: node.type,
                  img: node.img,
                  property: key,
                  msg: 'Required field, value must be provided.',
                });
              }
            } else if (!node.properties[key].value.length) {
              this.failedCollection.push({
                node: node.id,
                type: node.type,
                img: node.img,
                property: key,
                msg: 'Required field, value must be provided.',
              });
            }
          }
        }
      }
    });
  }

  submit() {
    this.validateSubmission();

    const pruneRelationshipObjectProperties = (bundle) => {
      const pruneList = ['targetObjectType', 'subTarget'];

      bundle.objects.map((o) => {
        if (o.type === 'relationship') {
          for (const key in o) {
            if (pruneList.indexOf(key) > -1) {
              delete o[key];
            }
          }
        }
      });

      return bundle;
    };

    if (!this.failedCollection.length) {
      let bundle = _cloneDeep(this.bundle);

      bundle.objects.map((o) => {
        for (const key in o) {
          if (Array.isArray(o[key])) {
            if (!o[key].length) {
              delete o[key];
            }
          } else if (typeof o[key] === 'object') {
            if (!Object.keys(o[key]).length) {
              delete o[key];
            }
          } else if (o[key] && !o[key].length) {
            delete o[key];
          }
        }
      });

      bundle = pruneRelationshipObjectProperties(bundle);

      /** *
            TODO plumb in your API call
            * */
      Proxy.submit(bundle);
    } else {
      this.showSubmissionError = true;
    }
  }

  resetSubmissionError() {
    this.showSubmissionError = false;
    this.failedCollection = [];
  }

  reset() {
    this.showDetails = false;
    this.showJSON = false;
    this.showRelPicker = false;
    this.showRelDetails = false;
    this.showRelEditor = false;
    this.groupMode = false;
    this.updateFlow = true;
    this.showGrowl = false;
    this.growlMessage = '';
    this.mutatedBundle = '';
    this.relationships = [];
    this.customRelationships = {};
    this.dragging = {};
    this.selected = {};
    this.selectedRel = {};
    this.selectedSDO = {};
    this.selectedGroup = [];
    this.bundle = {};
    this.nodes = [];
    this.edges = [];
    this.extensionDefs = {};

    this.bundle.spec_version = SPEC_VERSION;
    this.bundle.id = this.generateNodeID('bundle--');
    this.bundle.type = 'bundle';
    this.bundle.objects = [];
    this.generateExtensions();
  }
}
