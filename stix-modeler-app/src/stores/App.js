import { makeAutoObservable, toJS } from "mobx";
import _cloneDeep from "lodash/cloneDeep";
import _merge from "lodash/merge";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import Proxy from "./Proxy";

import ap from "../definition-adapters/AttackPattern.js";
import indicator from "../definition-adapters/Indicator.js";
import malware from "../definition-adapters/Malware.js";
import ma from "../definition-adapters/MalwareAnalysis.js";
import sighting from "../definition-adapters/Sighting.js";
import coa from "../definition-adapters/CourseOfAction.js";
import campaign from "../definition-adapters/Campaign.js";
import od from "../definition-adapters/ObservedData.js";
import identity from "../definition-adapters/Identity.js";
import tool from "../definition-adapters/Tool.js";
import report from "../definition-adapters/Report.js";
import vuln from "../definition-adapters/Vulnerability.js";
import grouping from "../definition-adapters/Grouping.js";
import infra from "../definition-adapters/Infrastructure.js";
import is from "../definition-adapters/IntrusionSet.js";
import location from "../definition-adapters/Location.js";
import ta from "../definition-adapters/ThreatActor.js";
import note from "../definition-adapters/Note.js";
import opinion from "../definition-adapters/Opinion.js";
import tlpred from "../definition-adapters/MarkingDefinitionRed.js";
import tlpamber from "../definition-adapters/MarkingDefinitionAmber.js";
import tlpgreen from "../definition-adapters/MarkingDefinitionGreen.js";
import tlpwhite from "../definition-adapters/MarkingDefinitionWhite.js";
import md from "../definition-adapters/MarkingDefinitionStatement.js";

import obs from "../definition-adapters/Observable.js";
import artifact from "../definition-adapters/Artifact.js";
import software from "../definition-adapters/Software.js";
import ipv4 from "../definition-adapters/IPv4Addr.js";
import ipv6 from "../definition-adapters/IPv6Addr.js";
import autosys from "../definition-adapters/AutonomousSystem.js";
import dir from "../definition-adapters/Directory.js";
import domain from "../definition-adapters/DomainName.js";
import emailaddr from "../definition-adapters/EmailAddr.js";
import emailmsg from "../definition-adapters/EmailMessage.js";
import file from "../definition-adapters/File.js";
import mac from "../definition-adapters/MacAddr.js";
import mutex from "../definition-adapters/Mutex.js";
import network from "../definition-adapters/NetworkTraffic.js";
import process from "../definition-adapters/Process.js";
import url from "../definition-adapters/Url.js";
import ua from "../definition-adapters/UserAccount.js";
import winregkey from "../definition-adapters/WindowsRegistryKey.js";
import cert from "../definition-adapters/Certificate.js";

import sro from "../definition-adapters/Relationship.js";

import extDef from "../definition-adapters/ExtensionDefinition.js";
import custom from "../definition-adapters/Custom.js";
import unknown from "../definition-adapters/Unknown.js";

import * as Config from "../util/Config.js";

const SPEC_VERSION = "2.1";

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
  showExtensionPicker = false;
  showLayoutPanel = false;
  showGrowl = false;
  showSubmissionError = false;
  showSubmissionErrorBadge = false;

  updateFlow = false;

  groupMode = false;

  growlMessage = "";

  bundleJSON = "";

  relationships = [];
  customRelationships = {};

  dragging = {};
  selected = {};
  hovered = {};
  selectedExt = {};
  selectedRel = {};
  selectedGroup = [];

  bundle = {};

  pasteBundle;
  pasteSchema;

  nodes = [];
  edges = [];

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
    extDef,
  ];

  nodeTypes = {}
  
  layoutConfig = {
    layoutMethod: "Hierarchy", // Default layout method (can be 'GRID', 'HIERARCHY')
    horizontalSpacing: 100, // Example horizontal spacing
    verticalSpacing: 100, // Example vertical spacing
    nodeTypes: {},
    showRelationships: true, // Global boolean toggle for show/hide relationships
    orientation: "Row View"
  };

  
  mousePosition = {
    clientX: 0,
    clientY: 0,
  };

  constructor() {
    makeAutoObservable(this, { autoBind: true });
    this.bundle.spec_version = SPEC_VERSION;
    this.bundle.id = this.generateNodeID("bundle--");
    this.bundle.type = "bundle";
    this.bundle.objects = [];
    this.loadConfigurations();
  }

  /*------------------------------------------------------------
   *
   *                 General Functions
   *
   *------------------------------------------------------------
   */

  /**
   * Generate current moment.
   * @returns current moment
   */
  generateMoment() {
    return moment().utc(true).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
  }

  /**
   * Generate current timestamp.
   * @param {*} time
   * @returns
   */
  generateTimestamp(time) {
    return moment(time).utc(true).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
  }

  /**
   * Get the creator ID.
   * @returns Creator ID for the STIX UI
   */
  getCreatorID() {
    return this.creatorID;
  }

  /**
   * Check if a value is empty and/or undefined.
   * @param {*} value
   * @returns
   */
  isEmpty(value) {
    switch (typeof value) {
      case "number":
      case "bigint":
      case "boolean":
        return false;
      case "object":
        if (Array.isArray(value)) {
          return !value.length;
        } else {
          return !Object.keys(value).length;
        }
      default:
        return !value;
    }
  }

  /**
   * Calculate the standard deviation for a list of numbers.
   * @param {list} numbers 
   * @returns standard deviation
   */
  calculateStandardDeviation(numbers) {
    if (!Array.isArray(numbers) || numbers.length === 0) {
        throw new Error("Please provide a non-empty array of numbers.");
    }
    const mean = numbers.reduce((acc, val) => acc + val, 0) / numbers.length;
    // Calculate the squared differences from the mean
    const squaredDifferences = numbers.map(val => Math.pow(val - mean, 2));

    // Calculate the mean of the squared differences
    const meanSquaredDifference = squaredDifferences.reduce((acc, val) => acc + val, 0) / numbers.length;

    const standardDeviation = Math.sqrt(meanSquaredDifference)
    // Return the square root of the mean squared difference (standard deviation)
    return (standardDeviation + mean);
  } 

   /*------------------------------------------------------------
   *
   *                 Config Functions
   *
   *------------------------------------------------------------
   */

  /**
   * Import configurations
   */
  async loadConfigurations() {
    this.creatorID = Config.CREATOR_ID;
    const schemas = await Config.importSchemas();
    schemas.map((schema) => {
      this.addSchema(schema);
    });
  }

  /*------------------------------------------------------------
   *
   *                 Canvas and UI Functions
   *
   *------------------------------------------------------------
   */

  /**
   * Set the bundle being pasted from the Json Paste panel.
   * @param {object} bundle
   */
  setPasteBundle(bundle) {
    this.pasteBundle = bundle;
  }

  setNodeTypes(nodeTypesList) {
    if (Array.isArray(nodeTypesList) && nodeTypesList.every(item => typeof item === 'string')) {
      this.nodeTypes = nodeTypesList;
    } else {
      console.error('nodeTypesList should be an array of strings');
    }
  }

  getNodeTypes() {
    return this.nodeTypes
  }
  setLayoutMethod(newMethod) {    
    this.layoutConfig.layoutMethod = newMethod;    
  }
  getLayoutMethod() {
    return this.layoutConfig.layoutMethod
  }
  setOrientation(newOrientation) {    
    this.layoutConfig.orientation = newOrientation;    
  }

  getOrientation() {
    return this.layoutConfig.orientation
  }

  /**
   * Set the schema being pasted from the Schema Paste panel.
   * @param {object} schema
   */
  setPasteSchema(schema) {
    this.pasteSchema = schema;
  }

  /**
   * Set the x and y position of the mouse.
   * @param {number} x
   * @param {number} y
   */
  setMousePosition(x, y) {
    this.mousePosition.clientX = x;
    this.mousePosition.clientY = y;
  }

  /**
   * Set flag to update React Flow canvas.
   * @param {boolean} update
   */
  setUpdateFlow(update) {
    this.updateFlow = update;
  }

  /**
   * Set the growl message.
   * @param {string} message
   */
  setGrowlMessage(message) {
    this.growlMessage = message;
  }

  /**
   * Set whether to show the growl message.
   * @param {boolean} show
   */
  setShowGrowl(show) {
    this.showGrowl = show;
  }

  /**
   * Show modal.
   */
  showModal() {
    this.modal = true;
  }

  /**
   * Hide modal.
   */
  hideModal() {
    this.modal = false;
  }

  /**
   * Set whether to show the Details panel.
   * @param {boolean} show
   */
  setShowDetails(show) {
    this.showDetails = show;
  }

  /**
   * Set whether to show the Relationship Details panel,
   * for use creating new custom relationships.
   * @param {boolean} show
   */
  setShowRelDetails(show) {
    this.showRelDetails = show;
  }

  /**
   * Set whether to show the Relationship Editor panel,
   * for use editing existing relationships.
   * @param {boolean} show
   */
  setShowRelEditor(show) {
    this.showRelEditor = show;
  }

  /**
   * Set whether to show the Extension Editor panel.
   * @param {boolean} show
   */
  setShowEditor(show) {
    this.showEditor = show;
  }

  /**
   * Set whether to show the Json Viewer panel.
   * @param {boolean} show
   */
  setShowJSON(show) {
    this.showJSON = show;
  }

  /**
   * Set whether to show the Json Paste panel.
   * @param {boolean} show
   */
  setShowJSONPaste(show) {
    this.showJSONPaste = show;
  }

  /**
   * Set whether to show the Schema Paste panel.
   * @param {boolean} show
   */
  setShowSchemaPaste(show) {
    this.showSchemaPaste = show;
  }

  /**
   * Set whether to show the File Importer panel,
   * for use importing schemas and bundles.
   * @param {boolean} show
   */
  setShowImporter(show) {
    this.showImporter = show;
  }

  /**
   * Set whether to show the Relationship Picker panel,
   * for use creating a new relationship.
   * @param {boolean} show
   */
  setShowRelPicker(show) {
    this.showRelPicker = show;
  }

  /**
   * Set whether to show the Extension Picker panle,
   * for use editing extension definitions.
   * @param {boolean} show
   */
  setShowExtensionPicker(show) {
    this.showExtensionPicker = show;
  }

  /**
   * Set whether to show the Submission Error panel.
   * @param {boolean} show
   */
  setShowSubmissionError(show) {
    this.showSubmissionError = show;
  }

  /**
   * Set whether nodes are being selected for group creation.
   * @param {boolean} mode
   */
  setGroupMode(mode) {
    this.groupMode = mode;
  }

  /**
   * Set whether to show the Layout panel
   * @param {boolean} show 
   */
  setShowLayoutPanel(show) {
    this.showLayoutPanel = show;
  }

  /*------------------------------------------------------------
   *
   *                 Layout UI Functions
   *
   *------------------------------------------------------------
   */


  setNodeLayout() {
    const vertSpacer = this.layoutConfig.verticalSpacing;
    const horzSpacer = this.layoutConfig.horizontalSpacing;    
    var allNodes = [...this.nodes.filter(n => n.title !== 'extension-definition')]; // Creates a standalone copy of the array
    var allEdges = [...this.edges]; // Creates a standalone copy of the array
    var nodeMetaData = {}    
    var selectedLayoutMethod = this.layoutConfig.layoutMethod;    
    var orientation = this.layoutConfig.orientation;  

    switch (selectedLayoutMethod.toUpperCase()) {
      case "GRID":                
        for (let i = 0; i < allNodes.length; i++) {
          let node = allNodes[i];
          let currentNodeTypeName = this.getType(node);
          if (currentNodeTypeName in nodeMetaData) {
            nodeMetaData[currentNodeTypeName].push(node);            
          } else {
            nodeMetaData[currentNodeTypeName] = [node];
          }          
        }
        let groupCount = 0;
        for (const type in nodeMetaData) {
          nodeMetaData[type].sort(function(a, b) {
            if (a.properties && a.properties.name && a.properties.name.value &&
              b.properties && b.properties.name && b.properties.name.value) {
              if (a.properties.name.value < b.properties.name.value) {
                  return -1;
              }
              if (a.properties.name.value > b.properties.name.value) {
                  return 1;
              }
              return 0;
            }     
          });
          let nodeCount = 0;        
          nodeMetaData[type].forEach(node => {
            if (orientation == "Row View") {
              node.position = {x: (nodeCount * vertSpacer), y: (groupCount * horzSpacer)};
            } else if (orientation == "Column View") {
              node.position = {x: (groupCount * horzSpacer), y: (nodeCount * vertSpacer)};
            }            
            nodeCount +=1;
          });
          groupCount += 1;
        }        
        break;
      case "HIERARCHY":        
        allNodes.forEach(node => {
          let srcEdges = allEdges.filter(edge => edge.source_ref == node.properties.id.value);
          if (srcEdges.length > 0) {
            let tgtEdges = allEdges.filter(edge => edge.target_ref == node.properties.id.value);
            if (srcEdges.length > 0 && tgtEdges.length == 0) {          
              if ("layer1" in nodeMetaData) {
                nodeMetaData["layer1"].push(node);
              } else { 
                nodeMetaData["layer1"] = [node];
              }
            }
          }        
        });
        if ("layer1" in nodeMetaData) {
          nodeMetaData["layer1"].forEach(node => {
            let index = allNodes.indexOf(node);
            if (index !== -1) {
              allNodes.splice(index, 1);
            }
          });
        } else {
          // No top level elements, Hierarchy won't work
          console.log("There are no top level elements, Hierarchy mode isn't possible.")
        }
        allNodes.forEach(node => {
          let tgtEdges = allEdges.filter(edge => edge.target_ref == node.properties.id.value);
          let layerName = "layer" + (tgtEdges.length + 1).toString();          
          if (layerName in nodeMetaData) {
            nodeMetaData[layerName].push(node);
          } else { 
            nodeMetaData[layerName] = [node];
          }           
        });        
        for (const layer in nodeMetaData) {
          nodeMetaData[layer].sort(function(a, b) {
            if (a.properties && a.properties.type && a.properties.type.value &&
              b.properties && b.properties.type && b.properties.type.value) {
              if (a.properties.type.value < b.properties.type.value) {
                  return -1;
              }
              if (a.properties.type.value > b.properties.type.value) {
                  return 1;
              }
              return 0;
            }     
            
          });
        }
        let layerCount = 0;
        for (const layer in nodeMetaData) {
          let nodeCount = 0;
          if (layer.length > 0) {       
            nodeMetaData[layer].forEach(node => {
              try {
                if (orientation == "Row View") {
                  node.position = {x: (nodeCount * vertSpacer), y: (layerCount * horzSpacer)};
                } else if (orientation == "Column View") {
                  node.position = {x: (layerCount * horzSpacer), y: (nodeCount * vertSpacer)};
                }            
                nodeCount +=1;
              } catch {

              }
              
            });
            layerCount += 1;
          }
        }                      
        break;
      default:
        // pass
    }
    this.setUpdateFlow(true);
  }

  getHorizontalSpacing() {
    return this.layoutConfig.horizontalSpacing
  }

  setHorizontalSpacing(value) {    
    this.layoutConfig.horizontalSpacing = value;    
  }

  getVerticalSpacing() {
    return this.layoutConfig.verticalSpacing
  }

  setVerticalSpacing(value) {    
    this.layoutConfig.verticalSpacing = value;    
  }

  setAlignmentOrDistribution(action) {
    console.log(action)
    var nodes = this.printSelectedNodes()
    console.log(nodes)
    switch (action) {
      case 'alignLeft':

        break;
      case 'alignHorizontal':
      
        break;
      case 'alignRight':
 
        break;
      case 'alignTop':
      
        break;
      case 'alignVertical':
      
        break;
      case 'alignBottom':
 
        break;
      case 'distributeHorizontal':
 
        break;
      case 'distributeVertical':
 
        break;
      default: 
    }
  }

  printSelectedNodes() {
    console.log(this.selectedGroup);
    this.selectedGroup.forEach(obj => {
      console.log(obj);
    });
  }

  /*------------------------------------------------------------
   *
   *                 Object Parsing Functions
   *
   *------------------------------------------------------------
   */

  /**
   * Extract the nested type from an object.
   * @param {*} object
   * @returns object type
   */
  getType(object) {
    let type;
    if (object.allOf) {
      object.allOf.map((item) => {
        if ("properties" in item) {
          type = item.properties.type.enum[0];
        }
      });
    } else {
      type = object.properties.type.enum[0];
    }
    return type;
  }

  /**
   * Extract the nested type from a schema object.
   * @param {object} object
   * @returns object type
   */
  getTypeFromJson(object) {
    let typeName;
    let ref;
    if (object.allOf) {
      object.allOf.map((item) => {
        if ("$ref" in item) {
          ref = item.$ref;
        }
      });
    }
    if (ref === undefined) {
      typeName = object.type;
    } else if (ref.includes("common/core.json")) {
      typeName = this.getType(object);
    } else {
      try {
        // Assumes the reference json has the same name as its original type name
        const schemaFile = ref.split("/").slice(-1)[0];
        typeName = schemaFile.split(".")[0];
      } catch {
        return typeName;
      }
    }
    return typeName;
  }

  /*------------------------------------------------------------
   *
   *                 SDO Functions
   *
   *------------------------------------------------------------
   */

  /**
   * Retrieve an SDO by its type.
   * @param {*} type
   * @returns type of sdo
   */
  getTypeSDO(type) {
    return (
      this.objects.find((o) => {
        const t = this.getType(o);
        return t === type;
      }) ?? unknown
    );
  }

  /**
   * Get a specific marking definition SDO
   * (Amber, Green, Red, Statement, or White)
   * @param {*} definition_type
   * @param {*} definition
   * @returns
   */
  getMarkingDefinitionSDO(definition_type, definition) {
    return (
      this.objects.find((o) => {
        if (this.getType(o) === "marking-definition") {
          if (definition_type === "statement") {
            return o.properties.definition_type.value === definition_type;
          } else {
            return (
              JSON.stringify(o.properties.definition.value) ===
              JSON.stringify(definition)
            );
          }
        }
      }) ?? {}
    );
  }

  /*------------------------------------------------------------
   *
   *                 Schema and Extension Functions
   *
   *------------------------------------------------------------
   */

  /**
   * Add schema for a new SDO/SCO extension.
   *
   * @param {object} json representation of schema
   */
  addSchema(json) {
    const type = this.getTypeFromJson(json);
    const sdo = this.getTypeSDO(type);

    if (sdo.properties.type.value === "unknown") {
      this.createSDOExtension(type, json);
    } else {
      this.createPropertyExtension(type, sdo, json);
    }
  }

  /**
   * Import and add a schema from file.
   * @param {object} file json
   */
  loadSchemaFromFile(file) {
    try {
      const schema = JSON.parse(file);
      this.addSchema(schema);
      this.growlMessage = "Successfully Imported Extension(s)";
      this.showGrowl = true;
    } catch (e) {
      this.growlMessage = "Incorrect JSON Syntax.";
      console.error(e);
      this.showGrowl = true;
    }
  }

  /**
   * Import and add a schema from the Schema Paste panel.
   */
  loadSchemaFromPaste() {
    try {
      const schema = JSON.parse(this.pasteSchema);
      this.addSchema(schema);
      this.pasteSchema = "";
      this.showSchemaPaste = false;
    } catch (e) {
      this.growlMessage = "Incorrect JSON Syntax.";
      console.error(e);
      this.showGrowl = true;
    }
  }

  /**
   * Create a new extension definition node for the
   * specified node type.
   * @param {string} type being extended
   * @returns new extension definition node
   */
  createExtensionNode(type) {
    const newNode = this.createNodeByType("extension-definition");
    newNode.id = this.generateNodeID("extension-definition--");
    newNode.properties.name.value = `${type} Extension Definition`;
    newNode.properties.created_by_ref.value = this.creatorID;
    newNode.schemaName = type;
    newNode.uiid = this.generateNodeID("stix-ui-element--");
    return newNode;
  }

  /**
   * Create an extension definition and type singleton
   * for a new SDO/SCO type.
   *
   * @param {String} type of new SDO/SCO
   * @param {Object} schema for new type
   */
  createSDOExtension(type, schema) {
    const newNode = this.createExtensionNode(type);
    newNode.properties.schema.value = schema["$id"] ?? "";
    newNode.properties.version.value = "1.0.0";
    newNode.properties.extension_types.value = ["new-sdo"];
    const sdo = custom(schema, newNode);
    this.objects.push(sdo);
    newNode.img = sdo.img;
    this.persistNode(newNode);
  }

  /**
   * Create an extension definition for an existing type,
   * and merge extended properties into existing type singleton.
   *
   * @param {string} type of existing SDO/SCO
   * @param {object} sdo type singleton
   * @param {object} schema for extended properties
   */
  createPropertyExtension(type, sdo, schema) {
    const newNode = this.createExtensionNode(type);
    newNode.properties.schema.value = schema["$id"] ?? "";
    newNode.properties.version.value = "1.0.0";
    newNode.properties.extension_types.value = ["property-extension"];
    newNode.img = sdo.img;
    try {
      sdo.mergeExtension(schema, newNode);
    } catch (e) {
      this.growlMessage = "Incorrect JSON Syntax.";
      console.error(e);
      this.showGrowl = true;
    }
    this.persistNode(newNode);
  }

  /**
   * Get all extension definition nodes.
   * @returns extension definition nodes
   */
  getExtensions() {
    return this.getNodesByType("extension-definition");
  }

  /**
   * Get all property extension definition nodes.
   * @returns property extension definition nodes
   */
  getPropertyExtensions() {
    return this.nodes.filter(
      (node) =>
        node.title == "extension-definition" &&
        "property-extension" in node.properties.extension_types.value
    );
  }

  /**
   * Get all new-sdo extension definition nodes
   * @returns new-sdo extension definition nodes
   */
  getSDOExtensions() {
    return this.nodes.filter(
      (node) =>
        node.title === "extension-definition" &&
        "new-sdo" in node.properties.extension_types.value
    );
  }

  /**
   * Get all extension definition nodes associated with the specified type.
   * @param {string} type
   * @returns list of extensions associated with type
   */
  getExtensionsByType(type) {
    return this.nodes.filter(
      (node) =>
        node.title === "extension-definition" && node.schemaName === type
    );
  }

  /**
   * Get the property extension definition node for the specified type
   * with the specified properties, if one exists.
   *
   * @param {string} type
   * @param {list} properties
   * @returns
   */
  getExtensionByProperties(type, properties) {
    return (
      this.getExtensionsByType(type).find((ext) =>
        properties.every((prop) => ext.extension_properties.includes(prop))
      ) ?? {}
    );
  }

  /**
   * Edit an extension property.
   *
   * @param {object} event
   */
  editExtensionValues(event) {
    const props = this.selectedExt;
    const updateProps = {
      id: this.selectedExt.id,
      value: event.currentTarget.value,
      name: event.currentTarget.name,
    };
    props[updateProps.name] = updateProps.value;

    const sdo = this.getTypeSDO(props.schemaName);
    sdo[updateProps.name] = updateProps.value;

    this.getNodesByType(props.schemaName).map((node) => {
      node[updateProps.name] = updateProps.value;
    });
  }

  /**
   * Select the extension.
   * @param {object} ext
   */
  setSelectedExt(ext) {
    this.selectedExt = ext;
    this.selected = ext;
  }

  /**
   * Delete the selected extension definition node,
   * any extended properties, and extension type singleton, if one exists.
   */
  deleteSelectedExt() {
    const extension = this.selectedExt;
    const sdo = this.getTypeSDO(extension.schemaName);
    const nodes = this.getNodesByType(extension.schemaName);

    if (extension.properties.extension_types.value.includes("new-sdo")) {
      // delete all nodes of extension type
      nodes.map( node => {
        this.selected = node;
        this.deleteSelectedNode();
      })
      // delete SDO singleton
      const sdoIdx = this.objects.indexOf(sdo);
      this.objects.splice(sdoIdx, 1);

    } else if (extension.properties.extension_types.value.includes("property-extension")) {
      
      // Delete extension from SDO singleton extensions list
      const idx = sdo.extensions.indexOf(extension.uiid);
      sdo.extensions.splice(idx, 1);

      // delete all extension properties from all nodes
      const props = extension.extension_properties;
      nodes.map( node => {
        node.extensions.splice(idx, 1);
        props.map( prop => {
          delete node.properties[prop];
        })
      })
    }

    // delete node representation of ext
    this.selected = extension;
    this.deleteSelectedNode();

    this.showEditor = false;
  }

  /*------------------------------------------------------------
   *
   *                 Bundle Functions
   *
   *------------------------------------------------------------
   */

  /**
   * Create a bundle from an imported file.
   * @param {object} file json
   */
  loadBundleFromFile(file) {
    this.pasteBundle = file;
    this.loadBundleFromPaste();
    this.growlMessage = this.growlMessage.length ? this.growlMessage : "Successfully Imported Bundle";
    this.showGrowl = true;
  }

  /**
   * Create a bundle from the store pasteBundle value.
   */
  loadBundleFromPaste() {
    this.reset();
    this.bundle.objects = [];
    try {
      const bundle = JSON.parse(this.pasteBundle);
      this.bundle.id = bundle.id;
      const unknownObjects = new Set();
      const unknownExtensions = new Set();
      for (const object of bundle.objects) {
        const type = this.getTypeFromJson(object);
        if (type !== "relationship" && type !== "extension-definition") {
          // create node
          let newNode;
          if (type == "marking-definition") {
            newNode = this.createNodeByDefinition(
              object.definition_type,
              object.definition
            );
          } else {
            newNode = this.createNodeByType(type);
          }

          // Deal with unknown SDOs
          if (newNode.type == "unknown") {
            unknownObjects.add(type);

            if ("extensions" in object) {
              Object.keys(object["extensions"]).forEach((key) => {
                unknownExtensions.add(key);
              });
            }
            this.growlMessage = `${unknownObjects.size} Unknown STIX Domain Object Type(s)`;
            this.showGrowl = true;
          }

          // Copy properties to node
          newNode.id = object.id;
          for (const key of Object.keys(object)) {
            if (key === 'extensions') {
              continue;
            } else if (key in newNode.properties) {
              newNode.properties[key].value = object[key];
            } else {
              newNode.properties[key] = {
                value: object[key],
                type: "unknown",
                control: "hidden",
                description: `Import extension schema(s) to see description.`,
              };
              delete object[key];
            }
          }

          // Do manipulation for extension management
          if ("extensions" in object) {
            for (const [key, extension] of Object.entries(object.extensions)) {
              switch (extension.extension_type) {
                case "new-sdo":
                  const defs = this.getExtensionsByType(type);
                  if (defs.length) {
                    defs[0].id = key;
                  } else {
                    newNode.properties.extensions.value[key] = extension;
                  }
                  break;
                case "property-extension":
                  const props = Object.keys(extension).filter(prop => prop != "extension_type");
                  const def = this.getExtensionByProperties(type, props);
                  if (Object.keys(def).length) {
                    def.id = key;
                    props.map(prop => newNode.properties[prop].value = extension[prop]);
                  } else {
                    unknownExtensions.add(key);
                    newNode.unknownProperties = newNode.unknownProperties ?? {};
                    props.map( prop => newNode.unknownProperties[prop] = { value: extension[prop]});
                    newNode.properties.extensions.value[key] = extension;
                  }
                  break;
                default:
                  newNode.properties.extensions.value[key] = extension;
                  break;
              }
            }
          }
          this.persistNode(newNode);
        }
      }

      // Update sdo fields
      const extensions = bundle.objects.filter(
        (o) => o.type === "extension-definition"
      );
      const extNodes = this.getExtensions();
      extensions.map((obj) => {
        const extNode =
          extNodes.find((node) => obj.id === node.id);
        if (extNode) {
          for (const [prop, value] of Object.entries(obj)) {
            extNode.properties[prop].value = value;
          }
        } else {
          unknownExtensions.add(obj.id);
        }
      });

      // add unknown extensions (only to bundle, not as nodes)
      unknownExtensions.forEach((id) => {
        const obj = bundle.objects.find((o) => o.id == id);
        if (obj) {
          this.bundle.objects.push(obj);
        }
      });

      // Handle SRO's and synthetic relationships
      // after SDO's have been loaded.
      bundle.objects.map((o) => {
        if (o.type === "relationship") {
          const sourceExists = this.getNodeById(o.source_ref);
          if (sourceExists) {
            this.edges.push(o);
          } else {
            this.bundle.objects.push(o);
          }
        }

        if (o.type !== "relationship") {
          for (const key in o) {
            if (
              key.indexOf("_ref") > -1 &&
              o[key].length &&
              key !== "external_references"
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

      this.pasteBundle = "";
      this.showJSONPaste = false;
    } catch (e) {
      this.growlMessage = "Incorrect JSON Syntax.";
      console.error(e);
      this.showGrowl = true;
    }
  }

  /*------------------------------------------------------------
   *
   *                 Node Functions
   *
   *------------------------------------------------------------
   */

  /**
   * Generate a uuid with specified prefix.
   * @param {string} prefix
   * @returns
   */
  generateNodeID(prefix) {
    return `${prefix}${uuidv4()}`;
  }

  /**
   * Create a node of type
   * @param {string} type
   * @returns new Node
   */
  createNodeByType(type) {
    let node = {};
    const object = this.getTypeSDO(type);
    if (object) {
      node = structuredClone(object);
    }
    return node;
  }

  /**
   * Create a marking definition Node of the specified type
   * (Amber, Green, Red, Statement, or White)
   * @param {*} definition_type
   * @param {*} definition
   * @returns new marking definition Node
   */
  createNodeByDefinition(definition_type, definition) {
    let node = {};
    const object = this.getMarkingDefinitionSDO(definition_type, definition);
    if (object) {
      node = structuredClone(object);
    }
    return node;
  }

  /**
   * Observables are dragged onto other SDOs as a generic object
   * and transformed after the user selects the specified, targeted observable.
   *
   * i.e. Create a new observable target for the specified relationship.
   * @param {object} relationship
   * @returns modified relationship, now targeting a new observable node
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
   * If not already present, add node to nodes.
   * @param {object} node
   * @returns node successfully added to nodes
   */
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
      }
      return !nodeExists;
    }
  }

  /**
   * Create a new SCO relating to the nodeOnScreen 
   * (i.e. where the OBS icon is being dragged)
   * If multiple possible observables, manually select.
   * 
   * @param {*} nodeOnScreen
   * @returns
   */
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
        if (relationship.targetObjectType === "observable") {
          if (nodeOnScreen.type === "observable") {
            relationship = this.handleGenericObservable(relationship);
          }
        } else {
          this.edges.push(relationship);
          this.persistNode(nodeToPersist);
        }

        return relationship;
      }
      this.persistNode(nodeToPersist);
      return relationship;
    }
  }

  /**
   * Get the node with specified id
   * @param {string} id
   * @returns node, if exists, else empty object
   */
  getNodeById(id) {
    return this.nodes.find((n) => n.id === id) ?? {};
  }

  /**
   * Get the extension definition with specified uiid
   * @param {string} uiid 
   * @returns ext def node, if exists, else empty object
   */
  getExtensionByUIID(uiid) {
    return this.nodes.find( (n) => n.uiid === uiid) ?? {};
  };

  /**
   * Get the node closest to the specified coordinates
   * @param {number} x
   * @param {number} y
   * @returns
   */
  getNodeByPosition(x, y) {
    let node;
    let distance = Infinity;

    this.nodes
      .filter((n) => "position" in n)
      .map((n) => {
        const dx = n.position.x - x;
        const dy = n.position.y - y;
        const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        if (d < distance) {
          node = n;
          distance = d;
        }
      });
    return node;
  }
  

  /**
   * Get all nodes of type
   * @param {string} type
   * @returns all nodes of type
   */
  getNodesByType(type) {
    return this.nodes.filter((node) => node.properties.type.value === type);
  }

  /**
   * Edit a node value.
   * @param {object} event
   */
  editNodeValues(event) {
    const props = this.selected.properties;
    const updateProps = {
      id: this.selected.id,
      value: event.currentTarget.value,
      name: event.currentTarget.name,
    };

    // Array's clearly need different treatment than strings.
    if (
      props[updateProps.name].type === "array" &&
      props[updateProps.name].vocab
    ) {
      let idx = -1;
      // We need to see if this is a push or
      // a splice.
      props[updateProps.name].value.map((item, i) => {
        if (item === updateProps.value) {
          idx = i;
        }
      });
      // If the value exists, we know this is a splice or,
      // remove operation. Otherwise, the user is trying
      // to add a value.
      if (idx > -1) {
        props[updateProps.name].value.splice(idx, 1);
      } else {
        props[updateProps.name].value.push(updateProps.value);
      }
    // We need to see if this is a select or select.
    } else if (
      props[updateProps.name].type === "string" &&
      props[updateProps.name].vocab &&
      props[updateProps.name].value === updateProps.value
    ) {
      props[updateProps.name].value = "";
    } else if (props[updateProps.name].type === "object") {
      props[updateProps.name].value = updateProps.value;

      try {
        updateProps.value = JSON.parse(updateProps.value);
      } catch (error) {
        console.warn("not a valid object");
      }
    } else {
      props[updateProps.name].value = updateProps.value;
    }
  }

  addGenericObject(field, value) {
    let v = this.selected.properties[field].value;
    v = _merge(v, value);
  }

  deleteGenericObject(field, key) {
    const v = this.selected.properties[field].value;

    delete v[key];
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

    updateProps.value = updateProps.value.replace(/, /g, ",");
    updateProps.value = updateProps.value.replace(/ ,/g, ",");

    let newArray = updateProps.value.split(",");

    if (!updateProps.value.length) {
      newArray = [];
    }

    newArray.map((item) => {
      props[updateProps.name].value.push(item);
    });
  }

  /**
   * Add an object to a property list of objects.
   * @param {string} field
   * @param {list} requiredFields
   */
  addDefaultObject(field, requiredFields) {
    const def = {};
    for (const f in requiredFields) {
      const field = requiredFields[f];
      def[field] = "";
    }
    this.selected.properties[field].value.push(def);
  }

  /**
   * Update an external reference property.
   * @param {*} input
   * @param {*} select
   * @param {*} idx
   */
  changeERValue(input, select, idx) {
    const nodeProp = this.selected.properties.external_references.value;

    try {
      if (typeof JSON.parse(input) === "object") {
        input = JSON.parse(input);
      }
    } catch (e) {}

    nodeProp[idx][select] = input;
  }

  /**
   * Delete an external reference property.
   * @param {*} select
   * @param {*} idx
   */
  deleteERObjectProperty(select, idx) {
    const nodeProp = this.selected.properties.external_references.value;

    delete nodeProp[idx][select];
  }

  /**
   * Delete an external reference.
   * @param {*} idx
   */
  deleteERObject(idx) {
    const nodeProp = this.selected.properties.external_references.value;

    nodeProp.splice(idx, 1);
  }

  /**
   * Update the value of an array property element.
   * @param {*} input
   * @param {*} select
   * @param {*} idx
   * @param {*} property
   */
  changeArrayObjectValue(input, select, idx, property) {
    const nodeProp = this.selected.properties[property].value;

    try {
      if (typeof JSON.parse(input) === "object") {
        input = JSON.parse(input);
      }
    } catch (e) {}

    nodeProp[idx][select] = input;
  }

  /**
   * Delete an element from an array property.
   * @param {*} field
   * @param {*} idx
   * @param {*} property
   */
  deleteArrayObjectProperty(field, idx, property) {
    const nodeProp = this.selected.properties[property].value;

    delete nodeProp[idx][field];
  }

  /**
   * Delete an entire array property.
   * @param {*} idx
   * @param {*} property
   */
  deleteArrayObject(idx, property) {
    const nodeProp = this.selected.properties[property].value;
    nodeProp.splice(idx, 1);
  }

  /**
   * Delete an object property.
   * @param {*} idx
   * @param {*} property
   */
  deleteObject(idx, property) {
    const nodeProp = this.selected.properties[property].value;

    nodeProp.splice(idx, 1);
  }

  /**
   * Add the STIX UI creator ID to the node.
   * @param {object} node
   */
  addCreatorID(node) {
    // Set created_by_ref to creator id
    if ("created_by_ref" in node.properties) {
      node.properties.created_by_ref.value = this.creatorID;
    }
  }

  /**
   * Update the creator ID for the STIX UI.
   * @param {string} id
   */
  updateCreatorID(id) {
    const oldID = this.creatorID;
    this.nodes.map((node) => {
      if (node.properties.created_by_ref.value === oldID) {
        node.properties.created_by_ref.value = id;
      }
    });
    this.creatorID = id;
  }

  /**
   * Set the node being dragged.
   * @param {object} dragging
   */
  setDragging(dragging) {
    this.dragging = dragging;
  }

  /**
   * Select the node.
   * @param {object} node
   */
  setSelected(node) {
    this.selected = node;
  }

  /**
   * Set whether the node is being hovered in
   * the Submission Error panel.
   * @param {string} nodeId id of node
   * @param {boolean} hovered is being hovered
   */
  setHovered(nodeId, hovered) {
    const node = this.getNodeById(nodeId);
    node.hovered = hovered;
  }

  /**
   * Delete the selected node and any related relationships.
   */
  deleteSelectedNode() {
    const nodeToDelete = this.selected;

    // Handle the edges that may be impacted by
    // removing a node.
    for (let i = 0; i < this.edges.length; i++) {
      const rel = this.edges[i];
      if (rel.source_ref === nodeToDelete.id) {
        this.deleteRelationship(rel, i);
        i--;
      } else if (rel.target_ref === nodeToDelete.id) {
        this.deleteRelationship(rel, i);
        i--;
      }
    }

    // Remove the selected node from the nodes object.
    this.nodes.map((node, i) => {
      if (node.id === nodeToDelete.id) {
        this.nodes.splice(i, 1);
      }
    });
    this.showDetails = false;
  }

  /*------------------------------------------------------------
   *
   *                 Relationship Functions
   *
   *------------------------------------------------------------
   */

  /**
   * Create an internal relationship object for use by the UI,
   * inferring relationship name to display on edge, relationship exclusivity,
   * and whether the relationship is embedded in the source node.
   *
   * @param {string} key property of source node
   * @param {object} node source node
   * @param {string} id target node id
   * @returns
   */
  createRelationshipFromPaste(key, node, id) {
    const def = this.getTypeSDO(node.type);
    let sourceExists = false;
    let targetExists = false;
    let rel;
    let targetType;
    let relationshipType = "references";
    let exclusiveRelationship = false;
    let embeddedRelationship = true;

    const src = node.id;
    const target = id || node[key];

    if (id) {
      targetType = id.split("--")[0];
    } else {
      targetType = node[key].split("--")[0];
    }

    this.nodes.map((n) => {
      if (node[key] === n.id || id === n.id) {
        targetExists = true;
      } else if (n.id == node.id) {
        sourceExists = true;
      }
    });

    if (!sourceExists || !targetExists) {
      return rel;
    }

    // get reverse embedded relationship
    const targetDef = this.getTypeSDO(targetType);
    if (targetDef.relationships) {
      def.relationships.map((relationship) => {
        if (
          relationship.x_embed &&
          relationship.x_embed === key &&
          relationship.target === node.type &&
          relationship.x_reverse
        ) {
          relationshipType = relationship.type;
          exclusiveRelationship = relationship.x_exclusive;
          embeddedRelationship = true;
        }
      });
    }

    // get embedded relationship
    if (def.relationships) {
      def.relationships.map((relationship) => {
        if (
          relationship.x_embed &&
          relationship.x_embed === key &&
          relationship.target === targetType
        ) {
          relationshipType = relationship.type;
          exclusiveRelationship = relationship.x_exclusive;
          embeddedRelationship = true;
        }
      });
    }

    rel = {
      source_ref: src,
      target_ref: target,
      relationship_type: relationshipType,
      x_exclusive: exclusiveRelationship,
      type: "relationship",
      created: this.generateMoment(),
      modified: this.generateMoment(),
      id: this.generateNodeID("relationship--"),
    };

    if (embeddedRelationship) {
      rel.x_embed = key;
    }

    return rel;
  }

  /**
   * Create a new relationship.
   * @param {*} source
   * @param {*} target
   * @param {*} relationship
   * @returns
   */
  makeRelationship(source, target, relationship) {
    let rel;
    let exclusiveRelationshipDefined = false;
    if (target == undefined) {
      target = { id: "" };
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
          edge.source_ref === source.id &&
          relationship.type === edge.relationship_type
        ) {
          exclusiveRelationshipDefined = true;
        }
      });
    }

    if (!alreadyRelated && !exclusiveRelationshipDefined) {
      const srcImg = source.customImg ?? source.img;
      const targetImg = target.customImg ??
        target.img ?? `${relationship.target}.png`;
      rel = {
        source_ref: source.id,
        target_ref: target.id,
        relationship_type: relationship.type,
        type: "relationship",
        spec_version: "2.1",
        created: this.generateMoment(),
        modified: this.generateMoment(),
        id: this.generateNodeID("relationship--"),
        targetObjectType: relationship.target,
        srcImg: srcImg,
        targetImg: targetImg,

      };

      if (relationship.x_reverse) {
        rel.source_ref = target.id,
        rel.target_ref = source.id;
        rel.srcImg = targetImg;
        rel.targetImg = srcImg;
      }

      if (relationship["sub-target"]) {
        rel.subTarget = relationship["sub-target"];
      }

      if (relationship.x_embed) {
        rel.x_embed = relationship.x_embed;
      }
    }
    return rel;
  }

  /**
   * Get possible relationships between source and target.
   * @param {*} source
   * @param {*} target
   * @returns
   */
  canRelate(source, target) {
    const sourceType = source.properties.type.enum[0];
    const targetType = target.properties.type.enum[0];
    const rel = [];

    if (source.id === target.id) {
      return rel;
    }

    const alredyPushed = (rel, relationship) => {
      let found = false;
      const t = relationship["sub-target"] ?? relationship.target;

      rel.map((r) => {
        if (
          r.targetObjectType === t &&
          r.relationship_type === relationship.type
        ) {
          found = true;
        }
      });
      return found;
    };

    let sourceRels = source.relationships;
    if (sourceType in this.customRelationships) {
      sourceRels = sourceRels.concat(this.customRelationships[sourceType]);
    }
    sourceRels.map((relationship) => {
      if (relationship.target === targetType || relationship["sub-target"] === targetType) {
        const madeRel = this.makeRelationship(source, target, relationship);
        if (madeRel && !alredyPushed(rel, relationship)) {
          rel.push(madeRel);
        }
      }
    });

    let targetRels = target.relationships;
    if (targetType in this.customRelationships) {
      targetRels = targetRels.concat(this.customRelationships[targetType]);
    }
    targetRels.map((relationship) => {
      if (relationship.target === sourceType || relationship["sub-target"] === sourceType) {
        const madeRel = this.makeRelationship(target, source, relationship);
        if (madeRel && !alredyPushed(rel, relationship)) {
          rel.push(madeRel);
        }
      }
    });
    return rel;
  }

  /**
   * Add the manually selected relationship (from Relationship Picker panel),
   * either as an embedded relationship for the source node, as an SCO, or
   * as an SRO and edge.
   *
   * @param {source} relationship
   * @returns relationship
   */
  manuallySelectRelationship(relationship) {
    this.dragging = {};
    if (relationship.targetObjectType === "observable" && !relationship.target_ref) {
      relationship = this.handleGenericObservable(relationship);
    } else {
      this.edges.push(relationship);
    }

    // update node value
    if (relationship.x_embed) {
      this.updateEmbeddedNodeRel(relationship);
    }

    this.relationships = [];
    this.showRelPicker = false;

    return relationship;
  }

  /**
   * Prevent the creation of same relationship between same source and target.
   * @param {*} source
   * @param {*} target
   * @param {*} relationship
   * @returns relationship already exists
   */
  blockDuplicateRelationships(source, target, relationship) {
    let alreadyRelated = false;
    this.edges.map((edge) => {
      if (
        edge.source_ref === source &&
        edge.target_ref === target &&
        edge.relationship_type === relationship
      ) {
        alreadyRelated = true;
      }
    });

    return alreadyRelated;
  }

  /**
   * Add a new relationship type to the source type's dictionary
   * of custom relationships.
   * @param {object} relationship
   * @param {string} src_id
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
      rel["sub-target"] = relationship.subTarget;
    }

    const relEquals = (r, o) =>
      r.type === o.type &&
      r.target === o.target &&
      r["sub-target"] === o["sub-target"];

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
   * Get a relationship by its id.
   * @param {string} id
   * @returns
   */
  getRelById(id) {
    let rel;

    this.edges.map((e) => {
      if (e.id === id) {
        rel = e;
      }
    });

    return rel;
  }

  /**
   * Get the type of the embedded property associated with the relation.
   * @param {object} relationship
   * @returns
   */
  getEmbeddedType(relationship) {
    let type;
    if (relationship.x_embed.includes("refs")) {
      type = "array";
    } else {
      type = "string";
    }
    return type;
  }

  /**
   * Edit an existing relationship
   * @param {object} rel
   */
  editRelationship(rel) {
    this.edges.map((edge) => {
      if (edge.id === this.selectedRel.id) {
        edge.relationship_type = rel.type;
      }
    });
  }

  /**
   * Update the embedded property of the source node
   * associated with relationship.
   * @param {object} relationship
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
    if (props[key].type === "array") {
      if (!props[key].value.includes(target)) {
        props[key].value.push(target);
      }
    } else {
      props[key].value = target;
    }
  }

  /**
   * Select the relationships.
   * @param {list} relationships
   */
  setRelationships(relationships) {
    this.relationships = relationships;
  }

  /**
   * Select the relationship to edit.
   * @param {object} r
   */
  setSelectedRel(r) {
    this.selectedRel = r;
  }

  /**
   * Delete the selected relationship.
   */
  deleteSelectedRelationship() {
    this.edges.map((rel, i) => {
      if (rel.id === this.selectedRel.id) {
        this.deleteRelationship(rel, i);
      }
    });
    this.selectedRel = {};
    this.showRelEditor = false;
  }

  /**
   * Delete a relationship
   * @param {object} rel
   * @param {number} i index in embedded property array, if applicable
   */
  deleteRelationship(rel, i) {
    const sourceNode = this.getNodeById(rel.source_ref);
    const targetNode = this.getNodeById(rel.target_ref);

    if (rel.x_embed) {
      if (Array.isArray(sourceNode.properties[rel.x_embed].value)) {
        sourceNode.properties[rel.x_embed].value.map((o, i) => {
          if (o === targetNode.id) {
            sourceNode.properties[rel.x_embed].value.splice(i, 1);
          }
        });
      } else {
        sourceNode.properties[rel.x_embed].value = "";
      }
    }

    if (i > -1) {
      this.edges.splice(i, 1);
    }
  }

  /*------------------------------------------------------------
   *
   *                 Group Functions
   *
   *------------------------------------------------------------
   */

  /**
   * Create a new group node from the selected nodes.
   * @param {string} id of new group Node
   */
  createGroup(id) {
    const newNode = this.createNodeByType("grouping");
    newNode.id = id;
    this.persistNode(newNode);
    this.addCreatorID(newNode);

    const src = { id };
    this.selectedGroup.map((n) => {
      const rel = {
        type: "includes",
        x_embed: "object_refs",
      };
      const target = { id: n };
      const relationship = this.makeRelationship(src, target, rel);
      this.manuallySelectRelationship(relationship);
    });

    this.resetGroup();
  }

  /**
   * Add or remove a node from the selection for group creation.
   * @param {string} id of node
   */
  modifyGroup(id) {
    const idx = this.selectedGroup.indexOf(id);
    if (idx < 0) {
      this.addToGroup(id);
    } else {
      this.removeFromGroup(id, idx);
    }
  }

  /**
   * Add a node to the selection for group creation.
   * @param {string} id
   */
  addToGroup(id) {
    this.selectedGroup.push(id);
    const node = this.getNodeById(id);
    node.selected = true;
  }

  /**
   * Remove a node to the selection for group creation.
   * @param {string} id of node
   * @param {number} idx in selectedGroup
   */
  removeFromGroup(id, idx) {
    const node = this.getNodeById(id);
    node.selected = false;
    this.selectedGroup.splice(idx, 1);
  }

  /**
   * Reset the node selection for group creation.
   */
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

  /*------------------------------------------------------------
   *
   *                 Validation and Exporting Functions
   *
   *------------------------------------------------------------
   */

  /**
   * Export the bundle to a local file.
   */
  async export() {
    const blob = new Blob([this.bundleJSON], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = "bundle.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Convert the bundle, including nodes and edges,
   * into a JSON.
   */
  stringifyBundle() {
    const json = {};

    // Validate Bundle
    this.failedCollection = [];
    this.validateSubmission();
    if (this.failedCollection.length) {
      this.growlMessage = `Missing ${this.failedCollection.length} required fields`;
      this.showGrowl = true;
      this.showSubmissionErrorBadge = true;
    }

    // Handle non-object fields
    for (const [key, value] of Object.entries(this.bundle)) {
      if (key !== "objects") {
        json[key] = value;
      }
    }

    json.objects = [];
    // Add nodes to bundle
    for (const node of this.nodes) {
      const obj = { id: node.id };
      for (const [field, property] of Object.entries(node.properties)) {
        if (!this.isEmpty(property.value)) {
          obj[field] = toJS(property.value);
        }
      }

      // Update extension fields in node
      if (node.extensions.length) {
        for (const uiid of node.extensions) {
          const extension = this.getExtensionByUIID(uiid);
          obj.extensions = obj.extensions ?? {};
          obj.extensions[extension.id] = {
            extension_type: extension.properties.extension_types.value[0]
          };
          if (extension.extension_properties) {
            extension.extension_properties.map( prop => {
              if (prop in obj) {
                obj.extensions[extension.id][prop] = obj[prop];
                delete obj[prop];
              }
            }
            );
          }
        }
      }
      json.objects.push(obj);
    }

    // add any unknown objects
    json.objects.push(...this.bundle.objects);

    // Add relationships to bundle
    for (const edge of this.edges) {
      if (edge.x_embed) { continue }; // do not add embedded properties as sros
      const obj = { id: edge.id };
      for (const [field, property] of Object.entries(edge)) {
        if (!this.isEmpty(property) && field in sro.properties) {
          obj[field] = toJS(property);
        }
      }
      json.objects.push(obj);
    }

    // add any unknown objects
    json.objects.push(...this.bundle.objects);

    this.bundleJSON = JSON.stringify(json, null, 2);
  }

  /**
   * Validate that all nodes have all required properties.
   */
  validateSubmission() {
    this.failedCollection = [];
    const { nodes } = this;

    nodes.map((node) => {
      for (const [key, prop] of Object.entries(node.properties)) {
        if (node.required && node.required.indexOf(key) > -1) {
          // For required refs check the bundle
          // instead of the node.
          if ("value" in prop) {
            if (this.isEmpty(prop.value)) {
              const img = (node.customImg && node.customImg.length)?
                node.customImg : node.img;
              const name = (node.properties.name && node.properties.name.value.length)?
                node.properties.name.value : node.id;

              let msg = "Required field, value must be provided.";
              if (key.includes("_ref")) {
                const rel = node.relationships.find( r => r.x_embed === key);
                if (rel) {
                  msg = "Required relationship, value must be provided.";
                }
              }

              this.failedCollection.push({
                node: node.id,
                name: name,
                type: node.type,
                img: img,
                property: key,
                msg: msg,
              });
            }
          }
        }
      }
    });
  }

  /**
   * Submit the bundle.
   */
  submit() {
    this.validateSubmission();

    if (!this.failedCollection.length) {
      let bundle = _cloneDeep(this.bundle);

      bundle.objects.map((o) => {
        for (const key in o) {
          if (Array.isArray(o[key])) {
            if (!o[key].length) {
              delete o[key];
            }
          } else if (typeof o[key] === "object") {
            if (!Object.keys(o[key]).length) {
              delete o[key];
            }
          } else if (o[key] && !o[key].length) {
            delete o[key];
          }
        }
      });
      
      Proxy.submit(bundle);
    } else {
      this.showSubmissionError = true;
    }
  }

  /**
   * Hide the Submisison Error Panel and reset
   * the failed collection of invalid nodes.
   */
  resetSubmissionError() {
    this.showSubmissionError = false;
    this.failedCollection = [];
  }

  /**
   * Reset the STIX UI.
   *
   * NOTE: Imported extensions are maintained.
   */
  reset() {
    this.showDetails = false;
    this.showJSON = false;
    this.showRelPicker = false;
    this.showRelDetails = false;
    this.showRelEditor = false;
    this.groupMode = false;
    this.updateFlow = true;
    this.showGrowl = false;
    this.growlMessage = "";
    this.bundleJSON = "";
    this.relationships = [];
    this.customRelationships = {};
    this.dragging = {};
    this.selected = {};
    this.selectedExt = {};
    this.selectedRel = {};
    this.selectedGroup = [];
    this.bundle = {};
    this.nodes = this.getExtensions(); // remove everything but extensions
    this.edges = [];

    this.bundle.spec_version = SPEC_VERSION;
    this.bundle.id = this.generateNodeID("bundle--");
    this.bundle.type = "bundle";
    this.bundle.objects = [];
  }
  
}