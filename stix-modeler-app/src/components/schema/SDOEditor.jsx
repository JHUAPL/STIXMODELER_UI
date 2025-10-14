import React from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Tooltip } from 'react-tooltip';
import Panel from '../ui/panel/Panel';
import FileSelector from '../ui/inputs/FileSelector';
import Images from '../../imgs/Images';

import '../details.scss';

class SDOEditor extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  onChangeHandler(event) {
    if (event.target.files && event.target.files[0]) {
      const value = URL.createObjectURL(event.target.files[0]);

      const mutatedEvent = {
        currentTarget: {
          name: 'customImg',
          value,
        },
      };
      this.props.onChangeSDOHandler(mutatedEvent);
      this.forceUpdate();
    }
  }

  render() {
    const sdo = toJS(this.props.sdo);
    let props = {};
    let img;
    const details = [];

    const deleteIcon = <span className="material-icons">delete_forever</span>;

    if (sdo.properties) {
      props = sdo.properties;
      if (sdo.customImg !== undefined) {
        img = <img src={sdo.customImg} alt="Custom" width="30" />;
      } else {
        img = <img src={Images.getImage(sdo.img)} alt="Custom" width="30" />;
      }
    }

    let header = (
      <div className="item-header">
        Update Icon
        <span
          data-tooltip-id="icon-tooltip"
          className="material-icons"
          data-tooltip-content="Set SDO icon to a local image"
        >
          info
        </span>
        <Tooltip id="icon-tooltip" />
      </div>
    );

    let control = (
      <div className="item" key="icon">
        {header}
        <FileSelector
          name="image"
          type="image/*"
          multiple={false}
          onChange={this.onChangeHandler}
        />
      </div>
    );

    details.push(control);

    for (const prop in props) {
      header = (
        <div className="item-header">
          {prop}
        </div>
      );

      control = (
        <div className="item" key={prop}>
          {header}
          <div className="item-value">{props[prop].description}</div>
        </div>
      );
      details.push(control);
    }

    return (
      <Panel
        show={this.props.show}
        onClickHideHandler={this.props.onClickHideHandler}
      >
        <div className="details">
          <div className="header">
            <div className="title">
              {img}
              {' '}
              {sdo.title}
            </div>
            <div className="delete" onClick={this.props.onClickDeleteHandler}>
              {deleteIcon}
              {' '}
              <span className="text">Delete</span>
            </div>
          </div>
          <div className="body">{details}</div>

          <div className="footer" />
        </div>
      </Panel>
    );
  }
} export default (observer(SDOEditor));
