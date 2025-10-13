import React from 'react';
import { inject, observer } from 'mobx-react';
import BottomMenu from './menus/BottomMenu';
import TopMenu from './menus/TopMenu';
import Details from './Details';
import ExtensionEditor from './schema/ExtensionEditor';
import FileImporter from './FileImporter';
import JsonViewer from './bundle/JsonViewer';
import JsonPaste from './bundle/JsonPaste';
import SchemaPaste from './schema/SchemaPaste';
import RelationshipPicker from './relationship/RelationshipPicker';
import RelationshipDetails from './relationship/RelationshipDetails';
import RelationshipEditor from './relationship/RelationshipEditor';
import ExtensionPicker from './schema/ExtensionPicker';
import LayoutPanel from './layout/LayoutPanel';
import Growl from './ui/growl/Growl';
import SubmissionError from './SubmissionError';
import Flow from './Flow/Flow';

import './canvas.scss';

class Canvas extends React.Component {
  constructor(props) {
    super(props);    
    this.store = this.props.store.appStore;

    this.generateNodeID = this.generateNodeID.bind(this);
    this.setUpdateFlow = this.setUpdateFlow.bind(this);
    this.onDragStartHandler = this.onDragStartHandler.bind(this);
    this.onDragOverHandler = this.onDragOverHandler.bind(this);
    this.onDropHandler = this.onDropHandler.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onClickRelHandler = this.onClickRelHandler.bind(this);
    this.setMousePosition = this.setMousePosition.bind(this);
    this.onConnectNodeHandler = this.onConnectNodeHandler.bind(this);
    this.onDragStopNodeHandler = this.onDragStopNodeHandler.bind(this);
    this.onClickShowJsonHandler = this.onClickShowJsonHandler.bind(this);
    this.onClickHideJsonHandler = this.onClickHideJsonHandler.bind(this);
    this.onClickHideRelPickerHandler = this.onClickHideRelPickerHandler.bind(
      this
    );
    this.onClickHideRelDetailsHandler = this.onClickHideRelDetailsHandler.bind(
      this
    );
    this.onClickHideRelEditorHandler = this.onClickHideRelEditorHandler.bind(
      this
    );
    this.onClickShowRelDetailsHandler = this.onClickShowRelDetailsHandler.bind(
      this
    );
    this.onClickShowExtensionPickerHandler = this.onClickShowExtensionPickerHandler.bind(
      this
    );
    this.onClickHideExtensionPickerHandler = this.onClickHideExtensionPickerHandler.bind(
      this
    );
    this.onClickShowLayoutPanelHandler = this.onClickShowLayoutPanelHandler.bind(
      this
    );
    this.onClickHideLayoutPanelHandler = this.onClickHideLayoutPanelHandler.bind(
      this
    );
    this.onClickShowImporterHandler = this.onClickShowImporterHandler.bind(
      this
    );
    this.onClickHideImporterHandler = this.onClickHideImporterHandler.bind(
      this
    );
    this.onClickHideDetailsHandler = this.onClickHideDetailsHandler.bind(this);
    this.onClickHideEditorHandler = this.onClickHideEditorHandler.bind(this);
    this.onClickCreateRelHandler = this.onClickCreateRelHandler.bind(this);
    this.onClickEditRelHandler = this.onClickEditRelHandler.bind(this);
    this.onClickSelectRelHandler = this.onClickSelectRelHandler.bind(this);
    this.onClickSelectExtHandler = this.onClickSelectExtHandler.bind(this);
    this.onClickShowGrowlHandler = this.onClickShowGrowlHandler.bind(this);
    this.onClickGroupNodeHandler = this.onClickGroupNodeHandler.bind(this);
    this.onClickGroupModeHandler = this.onClickGroupModeHandler.bind(this);
    this.onClickSubmitGroupingHandler = this.onClickSubmitGroupingHandler.bind(this);
    this.onChangeNodeHandler = this.onChangeNodeHandler.bind(this);
    this.onChangeExtHandler = this.onChangeExtHandler.bind(this);
    this.onChangeSchemaHandler = this.onChangeSchemaHandler.bind(this);
    this.onChangeBundleHandler = this.onChangeBundleHandler.bind(this);
    this.onChangeDateHandler = this.onChangeDateHandler.bind(this);
    this.onMessageTimerHandler = this.onMessageTimerHandler.bind(this);
    this.onClickArrayHandler = this.onClickArrayHandler.bind(this);
    this.onChangeListHandler = this.onChangeListHandler.bind(this);
    this.onChangeSliderHandler = this.onChangeSliderHandler.bind(this);
    this.onChangeCSVHandler = this.onChangeCSVHandler.bind(this);
    this.onChangeCreatorIDHandler = this.onChangeCreatorIDHandler.bind(this);
    this.onClickBooleanHandler = this.onClickBooleanHandler.bind(this);
    this.onChangePhaseHandler = this.onChangePhaseHandler.bind(this);
    this.onClickRemovePhaseHander = this.onClickRemovePhaseHander.bind(this);
    this.onClickAddObjectHandler = this.onClickAddObjectHandler.bind(this);
    this.onClickDeletePropertyHandler = this.onClickDeletePropertyHandler.bind(
      this
    );
    this.onClickResetHandler = this.onClickResetHandler.bind(this);
    this.onChangeERHandler = this.onChangeERHandler.bind(this);
    this.onClickDeleteERHandler = this.onClickDeleteERHandler.bind(this);
    this.onChangeArrayObjectHandler = this.onChangeArrayObjectHandler.bind(
      this
    );
    this.onClickDeleteArrayObjectHandler = this.onClickDeleteArrayObjectHandler.bind(
      this
    );
    this.onClickDeleteArrayObjectPropertyHandler = this.onClickDeleteArrayObjectPropertyHandler.bind(
      this
    );
    this.onChangeGenericObjectHandler = this.onChangeGenericObjectHandler.bind(
      this
    );
    this.onClickAddGenericObjectHandler = this.onClickAddGenericObjectHandler.bind(
      this
    );
    this.onClickDeleteGenericObjectHandler = this.onClickDeleteGenericObjectHandler.bind(
      this
    );
    this.onClickAddTextHandler = this.onClickAddTextHandler.bind(this);
    this.onClickHideJsonPasteHandler = this.onClickHideJsonPasteHandler.bind(
      this
    );
    this.onClickShowJsonPasteHandler = this.onClickShowJsonPasteHandler.bind(
      this
    );
    this.onClickHideSchemaPasteHandler = this.onClickHideSchemaPasteHandler.bind(
      this
    );
    this.onClickShowSchemaPasteHandler = this.onClickShowSchemaPasteHandler.bind(
      this
    );
    this.onChangeJSONPasteHandler = this.onChangeJSONPasteHandler.bind(this);
    this.onClickJSONPasteHandler = this.onClickJSONPasteHandler.bind(this);
    this.onChangeSchemaPasteHandler = this.onChangeSchemaPasteHandler.bind(
      this
    );
    this.onClickSchemaPasteHandler = this.onClickSchemaPasteHandler.bind(this);
    this.onClickDeleteHandler = this.onClickDeleteHandler.bind(this);
    this.onClickDeleteExtHandler = this.onClickDeleteExtHandler.bind(this);
    this.onClickDeleteRelHandler = this.onClickDeleteRelHandler.bind(this);
    this.onClickExportHandler = this.onClickExportHandler.bind(this);
    this.onClickShowSubmissionErrorHandler = this.onClickShowSubmissionErrorHandler.bind(this);
    this.onClickHideSubmissionErrorHandler = this.onClickHideSubmissionErrorHandler.bind(
      this
    );
    this.onClickErrorHandler = this.onClickErrorHandler.bind(this);
    

  }

  /**
   * Select the node with specified id.
   * @param {string} nodeId id of node
   */
  onClickHandler(nodeId) {
    const node = this.store.getNodeById(nodeId);
    this.store.setShowDetails(true);
    this.store.setSelected(node);
  }

  /**
   * Select the node associated with the specified id,
   * from the Submission Errors panel.
   * @param {string} nodeId
   */
  onClickErrorHandler(nodeId) {
    this.store.setShowSubmissionError(false);
    this.store.showSubmissionErrorBadge = false;
    const node = this.store.getNodeById(nodeId);
    this.store.setShowDetails(true);
    this.store.setSelected(node);
  }

  /**
   * Activate or deactivate grouping selection.
   * @param {boolean} isGrouping whether currently selecting group
   */
  onClickGroupModeHandler(isGrouping) {
    this.store.setGroupMode(isGrouping);
    if (!isGrouping) {
      this.store.resetGroup();
      this.setUpdateFlow(true);
    }
  }

  /**
   * Add or remove the node with specified node from
   * grouping selection.
   * @param {string} id node id 
   */
  onClickGroupNodeHandler(id) {
    this.store.modifyGroup(id);
    this.setUpdateFlow(true);
  }

  /**
   * Create a new Grouping SDO, including all nodes
   * from the grouping selection.
   */
  onClickSubmitGroupingHandler() {
    const id = this.generateNodeID('grouping--');
    this.store.createGroup(id);
    this.transition(id, true);
    this.setUpdateFlow(true);
  }

  /**
   * Select the relationship with the specified ID
   * to edit via the Relationship Editor panel.
   * @param {*} relId relationship id
   */
  onClickRelHandler(relId) {
    const rel = this.store.getRelById(relId);
    this.store.setShowRelEditor(true);
    this.store.setSelectedRel(rel);
  }

  /**
   * Hide the details panel.
   */
  onClickHideDetailsHandler() {
    this.store.setShowDetails(false);
  }

  /**
   * Hide the Extension Editor panel.
   */
  onClickHideEditorHandler() {
    this.store.setShowEditor(false);
  }

  /**
   * Hide the Json Paste panel.
   */
  onClickHideJsonPasteHandler() {
    this.store.setShowJSONPaste(false);
  }

  /**
   * Show the Json Paste panel.
   */
  onClickShowJsonPasteHandler() {
    this.store.setShowJSONPaste(true);
  }

  /**
   * Hide the Schema Paste panel.
   */
  onClickHideSchemaPasteHandler() {
    this.store.setShowSchemaPaste(false);
  }

  /**
   * Show the Schema Paste panel.
   */
  onClickShowSchemaPasteHandler() {
    this.store.setShowSchemaPaste(true);
  }

  /**
   * Display the growl message.
   * @param {string} message growl message
   */
  onClickShowGrowlHandler(message) {
    this.store.setGrowlMessage(message);
    this.store.setShowGrowl(true);
  }

  /**
   * Hide the Submission Error panel.
   */
  onClickShowSubmissionErrorHandler() {
    this.store.setShowSubmissionError(true);
    this.store.validateSubmission();
  }

  /**
   * Hide the Submission Error panel.
   */
  onClickHideSubmissionErrorHandler() {
    this.store.showSubmissionErrorBadge = false;
    this.store.setShowSubmissionError(false);
  }

  /**
   * Delete the selected node.
   */
  onClickDeleteHandler() {
    this.store.deleteSelectedNode();
    this.setUpdateFlow(true);
  }

  /**
   * Delete the selected extension.
   */
  onClickDeleteExtHandler() {
    this.store.deleteSelectedExt();
    this.setUpdateFlow(true);
  }

  /**
   * Delete the selected relationship.
   */
  onClickDeleteRelHandler() {
    this.store.deleteSelectedRelationship();
    this.setUpdateFlow(true);
  }
  

  /**
   * Update the specified property value for
   * the selected node.
   * @param {*} event 
   */
  onChangeNodeHandler(event) {
    this.store.editNodeValues(event);
    this.setUpdateFlow(true);
  }

  /**
   * Update the specified property value for
   * the selected extension.
   * @param {*} event 
   */
  onChangeExtHandler(event) {
    this.store.editExtensionValues(event);
  }

  /**
   * Import a schema from a file.
   * @param {object} file schema json
   */
  onChangeSchemaHandler(file) {
    this.store.loadSchemaFromFile(file);
  }

  /**
   * Import a bundle from a file.
   * @param {*} file bundle json
   */
  onChangeBundleHandler(file) {
    this.store.loadBundleFromFile(file);
    this.store.nodes.map((n) => {
      this.transition(n.id, true);
    });
    this.setUpdateFlow(true);
  }

  /**
   * Update the Creator ID for SDO, SCO, and SROs created
   * via the STIX UI.
   * @param {string} id 
   */
  onChangeCreatorIDHandler(id) {
    this.store.updateCreatorID(id);
  }

  /**
   * Update the specified date property for the
   * selected node.
   * @param {string} property
   * @param {*} datetime
   */
  onChangeDateHandler(property, datetime) {
    const value = this.store.generateTimestamp(datetime);
    this.mutateOnEvent(property, value);
  }

  /**
   * Update the specified array property for 
   * the selected node.
   * @param {string} property 
   * @param {*} value 
   */
  onClickArrayHandler(property, value) {
    this.mutateOnEvent(property, value);
  }

  /**
   * Update the specified property for
   * the selected node (for Slider inputs).
   * @param {string} property 
   * @param {*} value 
   */
  onChangeSliderHandler(property, value) {
    this.mutateOnEvent(property, value);
  }

  /**
   * Update the specified boolean property
   * for the selected node.
   * @param {string} property 
   * @param {boolean} value 
   */
  onClickBooleanHandler(property, value) {
    this.mutateOnEvent(property, value);
  }

  /**
   * Update the specified kill chain property
   * for the selected node.
   * @param {string} property 
   * @param {*} value 
   */
  onChangePhaseHandler(property, value) {
    this.mutateOnEvent(property, value);
  }

  /**
   * Update the specified property for the
   * selected node (for Confirm Text Area inputs).
   * @param {string} property 
   * @param {string} value 
   */
  onClickAddTextHandler(property, value) {
    this.mutateOnEvent(property, value);
  }

  /**
   * Update the specified list property for the
   * selected node.
   * @param {string} property 
   * @param {*} value 
   */
  onChangeListHandler(property, value) {
    this.mutateOnEvent(property, value);
  }

  /**
   * Update the object property for the selected node.
   * @param {string} property 
   * @param {*} event 
   */
  onChangeGenericObjectHandler(property, event) {
    this.mutateOnEvent(property, event.currentTarget.value);
  }

  /**
   * Remove the specified kill chain phase property
   * for the selected node.
   * @param {string} property 
   * @param {number} idx index of phase in kill chain
   */
  onClickRemovePhaseHander(property, idx) {
    this.store.deleteArrayObject(idx, property);
  }

  /**
   * Update the specified array property for the selected value 
   * (for use with Comma Seperated Value inputs).
   * @param {*} event 
   */
  onChangeCSVHandler(event) {
    this.store.editCSVInput(event);
  }

  /**
   * Create a new relationship between the specified
   * source and target.
   * @param {string} srcId id of source
   * @param {string} targetId id of target
   * @param {object} rel relationship object
   */
  onClickCreateRelHandler(srcId, targetId, rel) {
    const src = { id: srcId, };
    const target = { id: targetId, };
    const relationship = this.store.makeRelationship(src, target, rel);
    if (relationship) {
      this.onClickSelectRelHandler(relationship);
      // this.store.addCustomRelationship(rel, srcId, targetId);
      this.store.addCustomRelationship(rel, srcId);
      this.setUpdateFlow(true);
    } else {
      this.store.setGrowlMessage('Could not create relationship');
      this.store.setShowGrowl(true);
    }
  }

  /**
   * Edit the specified relationship.
   * @param {object} rel 
   */
  onClickEditRelHandler(rel) {
    this.store.editRelationship(rel);
    this.store.setShowRelEditor(false);
    this.setUpdateFlow(true);
  }

  /**
   * Select the specified relationship.
   * @param {object} relationship 
   */
  onClickSelectRelHandler(relationship) {
    this.store.setShowRelDetails(false);
    this.store.manuallySelectRelationship(relationship);
    this.transition(this.store.dragging.id, true);
    this.setUpdateFlow(true);
  }

  /**
   * Select the specified extension.
   * @param {object} extension 
   */
  onClickSelectExtHandler(extension) {
    this.store.setSelectedExt(extension)
    this.store.setShowEditor(true);
  }

  /**
   * Add an object to the specified object array
   * property for the selected node.
   * @param {string} field 
   * @param {list} requiredFields 
   */
  onClickAddObjectHandler(field, requiredFields) {
    this.store.addDefaultObject(field, requiredFields);
  }

  /**
   * Delete the specified property from an external reference
   * for the selected node.
   * @param {object} select property to delete
   * @param {number} idx index of external reference in external references
   */
  onClickDeletePropertyHandler(select, idx) {
    this.store.deleteERObjectProperty(select, idx);
  }

  /**
   * Delete the specified field for an object in the specified
   * property array for the selected node.
   * @param {string} select object property
   * @param {number} idx index of object in node property
   * @param {string} property node property
   */
  onClickDeleteArrayObjectPropertyHandler(select, idx, property) {
    this.store.deleteArrayObjectProperty(select, idx, property);
  }

  /**
   * Delete the specified external reference from the
   * external references property for the selected node.
   * @param {number} idx external reference index
   */
  onClickDeleteERHandler(idx) {
    this.store.deleteERObject(idx);
  }

  /**
   * Delete the specified object from the specified
   * array property for the selected node.
   * @param {number} idx index of object in node property
   * @param {string} property node property
   */
  onClickDeleteArrayObjectHandler(idx, property) {
    this.store.deleteArrayObject(idx, property);
  }

  /**
   * Update the specified field for an object in the specified
   * property array for the selected node.
   * @param {string} select object property
   * @param {number} idx index of object in node property
   * @param {string} property node property
   */
  onChangeERHandler(input, select, idx) {
    this.store.changeERValue(input, select, idx);
  }

  /**
   * Update the specified object from the specified
   * array property for the selected node.
   * @param {number} idx index of object in node property
   * @param {string} property node property
   */
  onChangeArrayObjectHandler(input, field, idx, property) {
    this.store.changeArrayObjectValue(input, field, idx, property);
  }

  /**
   * Show the JSON Viewer panel.
   */
  onClickShowJsonHandler() {
    this.store.stringifyBundle();
    this.store.setShowJSON(true);
  }

  /**
   * Hide the JSON Viewer panel.
   */
  onClickHideJsonHandler() {
    this.store.setShowJSON(false);
  }

  /**
   * Update the store pasteBundle value to 
   * the specified value.
   * @param {*} event 
   */
  onChangeJSONPasteHandler(event) {
    this.store.setPasteBundle(event.currentTarget.value);
  }

  /**
   * Import a bundle from the Json Paste panel.
   */
  onClickJSONPasteHandler() {
    this.store.loadBundleFromPaste();      
    this.store.nodes.map((n) => {
      this.transition(n.id, true);
    });
    this.setUpdateFlow(true);
  }

  /**
   * Update the store pasteSchema value to 
   * the specified value.
   * @param {*} event 
   */
  onChangeSchemaPasteHandler(event) {
    this.store.setPasteSchema(event.currentTarget.value);
  }

  /**
   * Import a schema from the Schema Paste panel.
   */
  onClickSchemaPasteHandler() {
    this.store.loadSchemaFromPaste();
  }

  /**
   * Show the Relationship Details panel.
   */
  onClickShowRelDetailsHandler() {
    this.store.setShowRelDetails(true);
    this.store.setShowRelPicker(false);
  }

  /**
   * Hide the Relationship Details panel.
   */
  onClickHideRelDetailsHandler() {
    this.store.setShowRelDetails(false);
    this.store.setShowRelPicker(true);
  }

  /**
   * Hide the Relationship Editor panel.
   */
  onClickHideRelEditorHandler() {
    this.store.setShowRelEditor(false);
  }

  /**
   * Hide the Relationship Picker panel.
   */
  onClickHideRelPickerHandler() {
    this.store.setShowRelPicker(false);
  }

  /**
   * Show the Extension Picker panel.
   */
  onClickShowExtensionPickerHandler() {
    this.store.setShowExtensionPicker(true);
  }

  /**
   * Hide the Extension Picker panel.
   */
  onClickHideExtensionPickerHandler() {
    this.store.setShowExtensionPicker(false);
  }

  onClickShowLayoutPanelHandler() {
    this.store.setShowLayoutPanel(true);
  }
  onClickHideLayoutPanelHandler() {
    this.store.setShowLayoutPanel(false);
  }

  /**
   * Hide the File Importer panel.
   */
  onClickHideImporterHandler() {
    this.store.setShowImporter(false);
  }

  /**
   * Show the File Importer panel.
   */
  onClickShowImporterHandler() {
    this.store.setShowImporter(true);
  }

  // Prevent event propagation.
  onDragOverHandler(event) {
    event.preventDefault();
  }

  /**
   * Set the dragged source node to the specified node.
   * @param {*} event 
   */
  onDragStartHandler(event) {
    const node = JSON.parse(event.dataTransfer.getData('node'));
    this.store.setDragging(node);
  }

  onMessageTimerHandler() {
    setTimeout(() => {
      this.store.setShowGrowl(false);
    }, 2500);
  }

  /**
   * Create a new node of the dropped icon type, either 
   * directly or as an observable for the drop target.
   * @param {*} event 
   */
  onDropHandler(event) {
    event.preventDefault();
    const node = this.store.dragging;
    if (node.properties.type.enum[0] === 'observable') {
      const source = this.store.getNodeByPosition(
        this.store.mousePosition.clientX,
        this.store.mousePosition.clientY
      );
      if (source) {
        const genericTarget = {
          id: '',
          relationships: [],
          properties: { type: { enum: ['observable'], }, },
        };

        const canRelate = this.store.canRelate(source, genericTarget);
        if (canRelate.length > 1) {
          this.store.setRelationships(canRelate);
          this.store.setShowRelPicker(true);
        } else if (canRelate.length === 1) {
          this.store.manuallySelectRelationship(canRelate[0]);
          this.transition(this.store.dragging.id, true);
          this.setUpdateFlow(true);
        } else {
          const sourceType = source.properties.type.enum[0];
          this.store.setShowGrowl(true);
          this.store.setGrowlMessage(`${sourceType} has no possible observables.`);
        }
      } else {
        this.store.setGrowlMessage('Observables can only be dropped onto existing STIX objects.');
        this.store.setShowGrowl(true);
      }
    } else {
      this.store.addCreatorID(node);
      const persisted = this.store.persistNode(node);
      // if the node was persisted, we will want to set
      // its position on the screen
      if (persisted) {
        this.transition(node.id);
        this.setUpdateFlow(true);
      }
    }
  }

  /**
   * Create a relationship between the source and target nodes.
   * @param {string} sourceId source id
   * @param {string} targetId target id
   */
  onConnectNodeHandler(sourceId, targetId) {
    const sourceNode = this.store.getNodeById(sourceId);
    const targetNode = this.store.getNodeById(targetId);
    const canRelate = this.store.canRelate(sourceNode, targetNode);

    if (targetNode.id !== sourceNode.id) {
      const genericRel = {
        source_ref: sourceId,
        target_ref: targetId,
        target: targetNode.properties.type.enum[0],
      };
      this.store.setRelationships(canRelate);
      this.store.relationships.unshift(genericRel);
      this.store.setShowRelPicker(true);
    }

  }

  /**
   * Update the store node position to its respective
   * Flow node position.
   * @param {object} flowNode React Flow node
   */
  onDragStopNodeHandler(flowNode) {
    const node = this.store.getNodeById(flowNode.id);
    if (node) {
      node.position = flowNode.position;
    }
  }

  /**
   * Add an object to the specified object property
   * for the selected node.
   * @param {string} field node property
   * @param {object} o object to add
   */
  onClickAddGenericObjectHandler(field, o) {
    this.store.addGenericObject(field, o);
  }

  /**
   * Delete an object from the specified object property
   * for the selected node.
   * @param {string} field node property
   * @param {string} key key of object to delete
   */
  onClickDeleteGenericObjectHandler(field, key) {
    this.store.deleteGenericObject(field, key);
  }

  /**
   * Reset the STIX UI.
   */
  onClickResetHandler() {
    this.store.reset();
  }

  /**
   * Export the STIX bundle.
   */
  onClickExportHandler() {
    this.store.stringifyBundle();
    this.store.export();
  }

  /**
   * Force React Flow to rerender.
   * @param {boolean} update whether to rerender
   */
  setUpdateFlow(update) {
    this.store.setUpdateFlow(update);
  }

  /**
   * Set the mouse position
   * @param {number} x 
   * @param {number} y 
   */
  setMousePosition(x, y) {
    this.store.setMousePosition(x, y);
  }

  /**
   * Generate a new node id.
   * @param {string} prefix prefix of id
   * @returns new node id
   */
  generateNodeID(prefix) {
    return this.store.generateNodeID(prefix);
  }

  /**
   * Convert a node property and value into an event object.
   * @param {string} property node property
   * @param {*} value node value
   */
  mutateOnEvent(property, value) {
    const event = {
      currentTarget: {
        name: property,
        value,
      },
    };

    this.onChangeNodeHandler(event);
  }

  /**
   * Set the position of the specified node.
   * @param {string} id node id
   * @param {boolean} random whether to set at random or mouse position
   * @returns 
   */
  transition(id, random) {
    const canvas = document.getElementById('canvas');
    const node = this.store.getNodeById(id);

    if (node.title == 'extension-definition') return;

    const calculate = (min, max) => Math.random() * (max - 100 - min) + min;

    const bounds = {
      top: canvas.offsetTop + 25,
      bottom: canvas.offsetTop - 25 + canvas.clientHeight,
      left: canvas.offsetLeft + 25,
      right: canvas.offsetLeft - 25 + canvas.clientWidth,
    };

    if (node) {
      // Initialize position
      node.position = { x: 0, y: 0, };

      const { clientX, } = this.store.mousePosition;
      const { clientY, } = this.store.mousePosition;

      if (random) {
        node.position.x = calculate(bounds.left, bounds.right);
        node.position.y = calculate(bounds.top, bounds.bottom);
      } else {
        node.position.x = clientX - 50;
        node.position.y = clientY - 50;
      }
    }
  }

  
  render() {
    const { nodes, } = this.store;
    const { edges, } = this.store;
    const extensions = this.store.getExtensions();

    return (
      <div
        id="canvas"
        className="canvas"
        onDragOver={this.onDragOverHandler}
        onDrop={this.onDropHandler}
      >
        <Flow
          nodes={nodes}
          edges={edges}
          groupMode={this.store.groupMode}
          updateFlow={this.store.updateFlow}
          setUpdateFlow={this.setUpdateFlow}
          onClickHandler={this.onClickHandler}
          onClickGroupNodeHandler={this.onClickGroupNodeHandler}
          onClickRelHandler={this.onClickRelHandler}
          onDragStopNodeHandler={this.onDragStopNodeHandler}
          setMousePosition={this.setMousePosition}
          onConnectNodeHandler={this.onConnectNodeHandler}
        />

        <TopMenu
          onClickShowJsonHandler={this.onClickShowJsonHandler}
          onClickShowJsonPasteHandler={this.onClickShowJsonPasteHandler}
          onClickShowSchemaPasteHandler={this.onClickShowSchemaPasteHandler}
          onClickHideJsonHandler={this.onClickHideJsonHandler}
          onClickResetHandler={this.onClickResetHandler}
          onClickExportHandler={this.onClickExportHandler}
          onClickShowExtensionPickerHandler={this.onClickShowExtensionPickerHandler}
          onClickShowLayoutPanelHandler={this.onClickShowLayoutPanelHandler}
          onClickShowImporterHandler={this.onClickShowImporterHandler}
          onChangeCreatorIDHandler={this.onChangeCreatorIDHandler}
          onClickGroupModeHandler={this.onClickGroupModeHandler}
          onClickSubmitGroupingHandler={this.onClickSubmitGroupingHandler}
          onClickShowErrorHandler={this.onClickShowSubmissionErrorHandler}
          creatorID={this.store.creatorID}
          groupMode={this.store.groupMode}
          errors={this.store.showSubmissionErrorBadge}
        />

        <BottomMenu
          objects={this.store.objects}
          imgs={this.store.objects.map((o) => o.customImg)}
          onDragStartHandler={this.onDragStartHandler}
          generateNodeID={this.generateNodeID}
        />

        <Details
          show={this.store.showDetails}
          node={this.store.selected}
          onClickHideHandler={this.onClickHideDetailsHandler}
          onChangeNodeHandler={this.onChangeNodeHandler}
          onChangeDateHandler={this.onChangeDateHandler}
          onClickArrayHandler={this.onClickArrayHandler}
          onChangeListHandler={this.onChangeListHandler}
          onChangeSliderHandler={this.onChangeSliderHandler}
          onChangeCSVHandler={this.onChangeCSVHandler}
          onClickBooleanHandler={this.onClickBooleanHandler}
          onChangePhaseHandler={this.onChangePhaseHandler}
          onClickRemovePhaseHander={this.onClickRemovePhaseHander}
          onClickAddObjectHandler={this.onClickAddObjectHandler}
          onClickDeleteERHandler={this.onClickDeleteERHandler}
          onChangeERHandler={this.onChangeERHandler}
          onClickDeletePropertyHandler={this.onClickDeletePropertyHandler}
          onClickDeleteArrayObjectHandler={this.onClickDeleteArrayObjectHandler}
          onChangeArrayObjectHandler={this.onChangeArrayObjectHandler}
          onClickDeleteArrayObjectPropertyHandler={
            this.onClickDeleteArrayObjectPropertyHandler
          }
          onChangeGenericObjectHandler={this.onChangeGenericObjectHandler}
          onClickAddGenericObjectHandler={this.onClickAddGenericObjectHandler}
          onClickDeleteGenericObjectHandler={
            this.onClickDeleteGenericObjectHandler
          }
          onClickAddTextHandler={this.onClickAddTextHandler}
          onClickDeleteHandler={this.onClickDeleteHandler}
        />

        <RelationshipDetails
          show={this.store.showRelDetails}
          relationships={this.store.relationships}
          node={this.store.selected}
          onClickHideHandler={this.onClickHideRelDetailsHandler}
          onClickCreateRelHandler={this.onClickCreateRelHandler}
        />

        <RelationshipEditor
          show={this.store.showRelEditor}
          relationship={this.store.selectedRel}
          key={this.store.selectedRel.relationship_type}
          onClickHideHandler={this.onClickHideRelEditorHandler}
          onClickEditRelHandler={this.onClickEditRelHandler}
          onClickDeleteRelHandler={this.onClickDeleteRelHandler}
        />

        <ExtensionEditor
          show={this.store.showEditor}
          extension={this.store.selectedExt}
          onClickHideHandler={this.onClickHideEditorHandler}
          onChangeExtHandler={this.onChangeExtHandler}
          
          onChangeNodeHandler={this.onChangeNodeHandler}
          onChangeDateHandler={this.onChangeDateHandler}
          onClickArrayHandler={this.onClickArrayHandler}
          onChangeListHandler={this.onChangeListHandler}
          onChangeSliderHandler={this.onChangeSliderHandler}
          onChangeCSVHandler={this.onChangeCSVHandler}
          onClickBooleanHandler={this.onClickBooleanHandler}
          onChangePhaseHandler={this.onChangePhaseHandler}
          onClickRemovePhaseHander={this.onClickRemovePhaseHander}
          onClickAddObjectHandler={this.onClickAddObjectHandler}
          onClickDeleteERHandler={this.onClickDeleteERHandler}
          onChangeERHandler={this.onChangeERHandler}
          onClickDeletePropertyHandler={this.onClickDeletePropertyHandler}
          onClickDeleteArrayObjectHandler={this.onClickDeleteArrayObjectHandler}
          onChangeArrayObjectHandler={this.onChangeArrayObjectHandler}
          onClickDeleteArrayObjectPropertyHandler={
            this.onClickDeleteArrayObjectPropertyHandler
          }
          onChangeGenericObjectHandler={this.onChangeGenericObjectHandler}
          onClickAddGenericObjectHandler={this.onClickAddGenericObjectHandler}
          onClickDeleteGenericObjectHandler={
            this.onClickDeleteGenericObjectHandler
          }
          onClickAddTextHandler={this.onClickAddTextHandler}
          onClickDeleteHandler={this.onClickDeleteExtHandler}
        />

        <FileImporter
          show={this.store.showImporter}
          onClickHideHandler={this.onClickHideImporterHandler}
          onChangeSchemaHandler={this.onChangeSchemaHandler}
          onChangeBundleHandler={this.onChangeBundleHandler}
        />

        <JsonViewer
          show={this.store.showJSON}
          json={this.store.bundleJSON}
          onClickHideHandler={this.onClickHideJsonHandler}
          onClickShowGrowlHandler={this.onClickShowGrowlHandler}
        />

        <JsonPaste
          show={this.store.showJSONPaste}
          json={this.store.pasteBundle}
          onClickHideHandler={this.onClickHideJsonPasteHandler}
          onChangeJSONPasteHandler={this.onChangeJSONPasteHandler}
          onClickJSONPasteHandler={this.onClickJSONPasteHandler}
          value={this.store.pasteBundle}
        />

        <SchemaPaste
          show={this.store.showSchemaPaste}
          json={this.store.pasteSchema}
          onClickHideHandler={this.onClickHideSchemaPasteHandler}
          onChangeSchemaPasteHandler={this.onChangeSchemaPasteHandler}
          onClickSchemaPasteHandler={this.onClickSchemaPasteHandler}
          value={this.store.pasteSchema}
        />

        <RelationshipPicker
          show={this.store.showRelPicker}
          relationships={this.store.relationships}
          onClickHideHandler={this.onClickHideRelPickerHandler}
          onClickSelectRelHandler={this.onClickSelectRelHandler}
          onClickShowRelDetailsHandler={this.onClickShowRelDetailsHandler}
        />

        <ExtensionPicker
          id="extension-picker"
          extensions={extensions}
          show={this.store.showExtensionPicker}
          onClickHideHandler={this.onClickHideExtensionPickerHandler}
          onClickSelectExtHandler={this.onClickSelectExtHandler}
        />

        <LayoutPanel
          id="layout-panel"
          show={this.store.showLayoutPanel}          
          onClickHideHandler={this.onClickHideLayoutPanelHandler}
          onClickSelectSDOHandler={this.onClickSelectSDOHandler}
        />

        <Growl
          message={this.store.growlMessage}
          show={this.store.showGrowl}
          timer={this.onMessageTimerHandler}
        />

        <SubmissionError
          error={this.store.failedCollection}
          show={this.store.showSubmissionError}
          onClickHideHandler={this.onClickHideSubmissionErrorHandler}
          onClickNodeHandler={this.onClickErrorHandler}
        />
      </div>
    );
  }
} export default inject('store')(observer(Canvas));
