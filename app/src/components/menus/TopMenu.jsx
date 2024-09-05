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
    let groupLabel = 'Select';
    let groupClass = '';
    let items;

    if (this.props.groupMode) {
      groupLabel = 'Cancel';
      groupClass = 'cancel-btn';
      items = (
        <div id="myDropdown" className="dropdown-content">
          <a onClick={this.submitGroup}>Create Group</a>
        </div>
      );
    }

    const group = (
      <div className="dropdown">
        <div
          data-tooltip-id="select-tooltip"
          data-tooltip-content="Select Nodes"
          className={`grouping-btn menu-item ${groupClass}`}
          onClick={this.flipGroupMode}
        >
          {groupLabel}
          {items}
        </div>
      </div>
    );

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
            data-tooltip-id="paste-tooltip"
            data-tooltip-content="Paste JSON"
            className="json-paste-btn menu-item-medium"
            onClick={this.props.onClickShowJsonPasteHandler}
          >
            {'{ + }'}
          </div>

          <div
            data-tooltip-id="view-tooltip"
            data-tooltip-content="View JSON"
            className="json-btn menu-item-small"
            onClick={this.props.onClickShowJsonHandler}
          >
            {'{ }'}
          </div>

          <div
            data-tooltip-id="schema-tooltip"
            data-tooltip-content="Paste Schema"
            className="schema-paste-btn menu-item-medium"
            onClick={this.props.onClickShowSchemaPasteHandler}
          >
            {'{ * }'}
          </div>
          <div
            data-tooltip-id="sdo-tooltip"
            data-tooltip-content="SDO Extensions"
            className="sdos-btn menu-item"
            onClick={this.props.onClickShowSDOPickerHandler}
          >
            Exts
          </div>

          <div
            data-tooltip-id="import-tooltip"
            data-tooltip-content="Import Data from File"
            className="reset-btn menu-item"
            onClick={this.props.onClickShowImporterHandler}
          >
            Import
          </div>
          {group}
          <div
            data-tooltip-id="clear-tooltip"
            data-tooltip-content="Clear JSON"
            className="reset-btn menu-item"
            onClick={this.props.onClickResetHandler}
          >
            <span className="i material-icons">refresh</span>
            {' '}
            Reset
          </div>

          <div
            data-tooltip-id="submit-tooltip"
            data-tooltip-content="Submit JSON"
            className="reset-btn menu-item"
            onClick={this.props.onClickSubmitHandler}
          >
            <span className="i material-icons">add</span>
            {' '}
            Submit
          </div>

          <Tooltip id="creator-tooltip" />
          <Tooltip id="paste-tooltip" />
          <Tooltip id="view-tooltip" />
          <Tooltip id="schema-tooltip" />
          <Tooltip id="sdo-tooltip" />
          <Tooltip id="import-tooltip" />
          <Tooltip id="clear-tooltip" />
          <Tooltip id="submit-tooltip" />
        </div>
      </div>
    );
  }
} export default (observer(TopMenu));
