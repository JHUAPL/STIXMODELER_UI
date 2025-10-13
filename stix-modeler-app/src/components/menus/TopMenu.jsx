import React from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from 'react-tooltip';

import LabeledText from '../ui/inputs/LabeledText';

import './TopMenu.scss';

class TopMenu extends React.Component {
  constructor(props) {
    super(props);
    this.updateCreatorID = this.updateCreatorID.bind(this);
    this.flipGroupMode = this.flipGroupMode.bind(this);
    this.submitGroup = this.submitGroup.bind(this);
  }

  updateCreatorID(event) {
    const creatorID = event.currentTarget.value;
    this.props.onChangeCreatorIDHandler(creatorID);
  }

  flipGroupMode() {
    const curr = this.props.groupMode;
    this.props.onClickGroupModeHandler(!curr);
  }

  submitGroup() {
    this.props.onClickSubmitGroupingHandler();
  }

  render() {
    let groupLabel = 'Group';
    let groupClass = '';
    let items;

    if (this.props.groupMode) {
      groupLabel = 'Cancel';
      groupClass = 'cancel-btn';
      items = (
        <div id="myDropdown" className="dropdown-content">
          <a onClick={this.submitGroup}>Create Group
          </a>
        </div>
      );
    }

    const group = (
      <div className="dropdown">
        <div
          data-tooltip-id="select-tooltip"
          data-tooltip-content="Select Nodes"
          className={`grouping-btn menu-btn menu-item ${groupClass}`}
          onClick={this.flipGroupMode}
        >
          {groupLabel}
          {items}
        </div>
      </div>
    );

    const badge = this.props.errors ? (<span className="badge"></span>) : undefined;

    return (
      <div className="top-menu">
        <div className="row">
          <div
            data-tooltip-id="creator-tooltip"
            data-tooltip-content="Creator ID"
            className="ctr-input"
          >
            <LabeledText
              name="creator-input"
              label="Creator ID"
              value={this.props.creatorID}
              placeholder="Creator ID"
              onChange={this.updateCreatorID}
            />
          </div>
          <div
            data-tooltip-id="view-tooltip"
            data-tooltip-content="View Bundle"
            className="menu-btn menu-item"
            onClick={this.props.onClickShowJsonHandler}
          >
            <i className="material-icons">description</i>
          </div>

          <div
            data-tooltip-id="paste-tooltip"
            data-tooltip-content="Paste Bundle"
            className="menu-btn menu-item"
            onClick={this.props.onClickShowJsonPasteHandler}
          >
            <i className="material-icons">note_add</i>
          </div>

          <div
            data-tooltip-id="schema-tooltip"
            data-tooltip-content="Paste Schema"
            className="menu-btn menu-item"
            onClick={this.props.onClickShowSchemaPasteHandler}
          >
            <i className="material-icons">add_box</i>
          </div>

          <div
            data-tooltip-id="layout"
            data-tooltip-content="Graph Layout and Filtering"
            className="sdos-btn menu-item"
            onClick={this.props.onClickShowLayoutPanelHandler}
          >
            Layout
          </div>

          <div
            data-tooltip-id="import-tooltip"
            data-tooltip-content="Import Data from File"
            className="menu-btn menu-item"
            onClick={this.props.onClickShowImporterHandler}
          >
            <i className="material-icons">folder</i>
          </div>
          <div
            data-tooltip-id="sdo-tooltip"
            data-tooltip-content="SDO Extensions"
            className="menu-btn menu-item"
            onClick={this.props.onClickShowExtensionPickerHandler}
          >
              EXT
          </div>
          {group}
          <div
            data-tooltip-id="clear-tooltip"
            data-tooltip-content="Reset Bundle"
            className="reset-btn menu-btn menu-item"
            onClick={this.props.onClickResetHandler}
          >
            <span className="material-icons">refresh</span>
          </div>

          <div
            data-tooltip-id="submit-tooltip"
            data-tooltip-content="Export JSON"
            className="menu-btn menu-item"
            onClick={this.props.onClickExportHandler}
          >
            <i className="material-icons">save</i>
            {' '}
          </div>

          <div
            data-tooltip-id="error-tooltip"
            data-tooltip-content="Bundle Errors"
            className="menu-btn menu-item"
            onClick={this.props.onClickShowErrorHandler}
          >
            <span className="material-icons">error</span>
            {badge}
          </div>

          <Tooltip id="creator-tooltip" />
          <Tooltip id="paste-tooltip" />
          <Tooltip id="view-tooltip" />
          <Tooltip id="schema-tooltip" />
          <Tooltip id="sdo-tooltip" />
          <Tooltip id="import-tooltip" />
          <Tooltip id="clear-tooltip" />
          <Tooltip id="submit-tooltip" />
          <Tooltip id="error-tooltip" />
        </div>
      </div>
    );
  }
} export default (observer(TopMenu));
