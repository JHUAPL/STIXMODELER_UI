import React from 'react';
import { inject, observer } from 'mobx-react';
import BottomMenu from './menus/BottomMenu';
import TopMenu from './menus/TopMenu';
import Details from './Details';
import SDOEditor from './schema/SDOEditor';
import FileImporter from './FileImporter';
import JsonViewer from './bundle/JsonViewer';
import JsonPaste from './bundle/JsonPaste';
import SchemaPaste from './schema/SchemaPaste';
import RelationshipPicker from './relationship/RelationshipPicker';
import RelationshipDetails from './relationship/RelationshipDetails';
import RelationshipEditor from './relationship/RelationshipEditor';
import SDOPicker from './schema/SDOPicker';
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
    this.onClickShowSDOPickerHandler = this.onClickShowSDOPickerHandler.bind(
      this
    );
    this.onClickHideSDOPickerHandler = this.onClickHideSDOPickerHandler.bind(
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
    this.onClickSelectSDOHandler = this.onClickSelectSDOHandler.bind(this);
    this.onClickShowGrowlHandler = this.onClickShowGrowlHandler.bind(this);
    this.onClickGroupNodeHandler = this.onClickGroupNodeHandler.bind(this);
    this.onClickGroupModeHandler = this.onClickGroupModeHandler.bind(this);
    this.onClickSubmitGroupingHandler = this.onClickSubmitGroupingHandler.bind(this);
    this.onChangeNodeHandler = this.onChangeNodeHandler.bind(this);
    this.onChangeSDOHandler = this.onChangeSDOHandler.bind(this);
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
    this.onClickDeleteSDOHandler = this.onClickDeleteSDOHandler.bind(this);
    this.onClickDeleteRelHandler = this.onClickDeleteRelHandler.bind(this);
    this.onClickSubmitHandler = this.onClickSubmitHandler.bind(this);
    this.onClickHideSubmissionErrorHandler = this.onClickHideSubmissionErrorHandler.bind(
      this
    );
  }

  componentWillUnmount() {
    document.removeEventListener('dragover', () => {}, false);
  }

  onClickHandler(nodeId) {
    const node = this.store.getNodeById(nodeId);
    this.store.setShowDetails(true);
    this.store.setSelected(node);
  }

  onClickGroupModeHandler(isGrouping) {
    this.store.setGroupMode(isGrouping);
    if (!isGrouping) {
      this.store.resetGroup();
      this.setUpdateFlow(true);
    }
  }

  onClickGroupNodeHandler(id) {
    this.store.modifyGroup(id);
    this.setUpdateFlow(true);
  }

  onClickSubmitGroupingHandler() {
    const id = this.generateNodeID('grouping--');
    this.store.createGroup(id);
    this.transition(id, true);
    this.setUpdateFlow(true);
  }

  onClickRelHandler(relId) {
    const rel = this.store.getRelById(relId);
    this.store.setShowRelEditor(true);
    this.store.setSelectedRel(rel);
  }

  onClickHideDetailsHandler() {
    this.store.setShowDetails(false);
  }

  onClickHideEditorHandler() {
    this.store.setShowEditor(false);
  }

  onClickHideJsonPasteHandler() {
    this.store.setShowJSONPaste(false);
  }

  onClickShowJsonPasteHandler() {
    this.store.setShowJSONPaste(true);
  }

  onClickHideSchemaPasteHandler() {
    this.store.setShowSchemaPaste(false);
  }

  onClickShowSchemaPasteHandler() {
    this.store.setShowSchemaPaste(true);
  }

  onClickShowGrowlHandler(message) {
    this.store.setGrowlMessage(message);
    this.store.setShowGrowl(true);
  }

  onClickHideSubmissionErrorHandler() {
    this.store.resetSubmissionError();
  }

  onClickDeleteHandler() {
    this.store.deleteSelectedNode();
    this.setUpdateFlow(true);
  }

  onClickDeleteSDOHandler() {
    this.store.deleteSelectedSDO();
  }

  onClickDeleteRelHandler() {
    this.store.deleteSelectedRelationship();
    this.setUpdateFlow(true);
  }

  onChangeNodeHandler(event) {
    this.store.editNodeValues(event);
    this.setUpdateFlow(true);
  }

  onChangeSDOHandler(event) {
    this.store.editSDOValues(event);
    this.forceUpdate();
  }

  onChangeSchemaHandler(file) {
    this.store.loadSchemaFromFile(file);
  }

  onChangeBundleHandler(file) {
    this.store.loadBundleFromFile(file);
    this.store.nodes.map((n) => {
      this.transition(n.id, true);
    });
    this.setUpdateFlow(true);
  }

  onChangeCreatorIDHandler(id) {
    this.store.updateCreatorID(id);
  }

  onChangeDateHandler(property, datetime) {
    const value = this.store.generateTimestamp(datetime);
    this.mutateOnEvent(property, value);
  }

  onClickArrayHandler(property, value) {
    this.mutateOnEvent(property, value);
  }

  onChangeSliderHandler(property, value) {
    this.mutateOnEvent(property, value);
  }

  onClickBooleanHandler(property, value) {
    this.mutateOnEvent(property, value);
  }

  onChangePhaseHandler(property, value) {
    this.mutateOnEvent(property, value);
  }

  onClickAddTextHandler(property, value) {
    this.mutateOnEvent(property, value);
  }

  onChangeListHandler(property, value) {
    this.mutateOnEvent(property, value);
  }

  onChangeGenericObjectHandler(property, event) {
    this.mutateOnEvent(property, event.currentTarget.value);
  }

  onClickRemovePhaseHander(property, value) {
    this.store.removeKillChainPhase(value);
  }

  onChangeCSVHandler(event) {
    this.store.editCSVInput(event);
  }

  onClickCreateRelHandler(srcId, targetId, rel) {
    const src = { id: srcId, };
    const target = { id: targetId, };
    const relationship = this.store.makeRelationship(src, target, rel);
    if (relationship) {
      this.onClickSelectRelHandler(relationship);
      this.store.addCustomRelationship(rel, srcId, targetId);
      this.setUpdateFlow(true);
    } else {
      this.store.setGrowlMessage('Could not create relationship');
      this.store.setShowGrowl(true);
    }
  }

  onClickEditRelHandler(rel) {
    this.store.editRelationship(rel);
    this.store.setShowRelEditor(false);
    this.setUpdateFlow(true);
  }

  onClickSelectRelHandler(relationship) {
    this.store.setShowRelDetails(false);
    this.store.manuallySelectRelationship(relationship);
    this.transition(this.store.dragging.id, true);
    this.setUpdateFlow(true);
  }

  onClickSelectSDOHandler(sdo) {
    this.store.setSelectedSDO(sdo);
    this.store.setShowEditor(true);
  }

  onClickAddObjectHandler(field, requiredFields) {
    this.store.addDefaultObject(field, requiredFields);
  }

  onClickDeletePropertyHandler(select, idx) {
    this.store.deleteERObjectProperty(select, idx);
  }

  onClickDeleteArrayObjectPropertyHandler(select, idx, property) {
    this.store.deleteArrayObjectProperty(select, idx, property);
  }

  onClickDeleteERHandler(idx) {
    this.store.deleteERObject(idx);
  }

  onClickDeleteArrayObjectHandler(idx, property) {
    this.store.deleteArrayObject(idx, property);
  }

  onChangeERHandler(input, select, idx) {
    this.store.changeERValue(input, select, idx);
  }

  onChangeArrayObjectHandler(input, field, idx, property) {
    this.store.changeArrayObjectValue(input, field, idx, property);
  }

  onClickShowJsonHandler() {
    this.store.mutateBundle();
    this.store.setShowJSON(true);
  }

  onClickHideJsonHandler() {
    this.store.setShowJSON(false);
  }

  onChangeJSONPasteHandler(event) {
    this.store.setPasteBundle(event.currentTarget.value);
  }

  onClickJSONPasteHandler() {
    this.store.loadBundleFromPaste();

    this.store.nodes.map((n) => {
      this.transition(n.id, true);
    });
    this.setUpdateFlow(true);
  }

  onChangeSchemaPasteHandler(event) {
    this.store.setPasteSchema(event.currentTarget.value);
  }

  onClickSchemaPasteHandler() {
    this.store.loadSchemaFromPaste();
  }

  onClickShowRelDetailsHandler() {
    this.store.setShowRelDetails(true);
    this.store.setShowRelPicker(false);
  }

  onClickHideRelDetailsHandler() {
    this.store.setShowRelDetails(false);
    this.store.setShowRelPicker(true);
  }

  onClickHideRelEditorHandler() {
    this.store.setShowRelEditor(false);
  }

  onClickHideRelPickerHandler() {
    this.store.setShowRelPicker(false);
  }

  onClickShowSDOPickerHandler() {
    this.store.setShowSDOPicker(true);
  }

  onClickHideSDOPickerHandler() {
    this.store.setShowSDOPicker(false);
  }

  onClickHideImporterHandler() {
    this.store.setShowImporter(false);
  }

  onClickShowImporterHandler() {
    this.store.setShowImporter(true);
  }

  onDragOverHandler(event) {
    event.preventDefault();
  }

  onDragStartHandler(event) {
    const node = JSON.parse(event.dataTransfer.getData('node'));
    this.store.setDragging(node);
  }

  onMessageTimerHandler() {
    setTimeout(() => {
      this.store.setShowGrowl(false);
    }, 2500);
  }

  // Drop on canvas
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

  // Connect two nodes via a new relationship
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

  // Update store position from React Flow
  onDragStopNodeHandler(node) {
    const n = this.store.getNodeById(node.id);
    if (n) {
      n.position = node.position;
    }
  }

  onClickAddGenericObjectHandler(field, o) {
    this.store.addGenericObject(field, o);
  }

  onClickDeleteGenericObjectHandler(field, key) {
    this.store.deleteGenericObject(field, key);
  }

  onClickResetHandler() {
    this.store.reset();
  }

  onClickSubmitHandler() {
    this.store.submit();
  }

  setUpdateFlow(update) {
    this.store.setUpdateFlow(update);
  }

  setMousePosition(x, y) {
    this.store.setMousePosition(x, y);
  }

  generateNodeID(prefix) {
    return this.store.generateNodeID(prefix);
  }

  mutateOnEvent(property, value) {
    const event = {
      currentTarget: {
        name: property,
        value,
      },
    };

    this.onChangeNodeHandler(event);
  }

  transition(id, random) {
    const canvas = document.getElementById('canvas');
    const node = this.store.getNodeById(id);

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
    const sdos = this.store.getCustomSDOs();

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
          onClickSubmitHandler={this.onClickSubmitHandler}
          onClickShowSDOPickerHandler={this.onClickShowSDOPickerHandler}
          onClickShowImporterHandler={this.onClickShowImporterHandler}
          onChangeCreatorIDHandler={this.onChangeCreatorIDHandler}
          onClickGroupModeHandler={this.onClickGroupModeHandler}
          onClickSubmitGroupingHandler={this.onClickSubmitGroupingHandler}
          creatorID={this.store.creatorID}
          groupMode={this.store.groupMode}
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

        <SDOEditor
          show={this.store.showEditor}
          sdo={this.store.selectedSDO}
          onClickHideHandler={this.onClickHideEditorHandler}
          onChangeSDOHandler={this.onChangeSDOHandler}
          onClickDeleteHandler={this.onClickDeleteSDOHandler}
        />

        <FileImporter
          show={this.store.showImporter}
          onClickHideHandler={this.onClickHideImporterHandler}
          onChangeSchemaHandler={this.onChangeSchemaHandler}
          onChangeBundleHandler={this.onChangeBundleHandler}
        />

        <JsonViewer
          show={this.store.showJSON}
          json={this.store.mutatedBundle}
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

        <SDOPicker
          id="sdo-picker"
          show={this.store.showSDOPicker}
          sdos={sdos}
          onClickHideHandler={this.onClickHideSDOPickerHandler}
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
        />
      </div>
    );
  }
} export default inject('store')(observer(Canvas));
