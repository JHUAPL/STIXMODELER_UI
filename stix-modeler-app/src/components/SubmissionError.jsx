import React from 'react';
import { observer } from 'mobx-react';
import Panel from './ui/panel/Panel';
import Images from '../util/Images';

import './SubmissionError.scss';

class SubmissionError extends React.Component {
  constructor(props) {
    super(props);
  
  }
  
  render() {
    const errorStructure = {};
    const msg = [];

    this.props.error.map((item, i) => {
      if (!(item.node in errorStructure)){
        errorStructure[item.node] = {};
        errorStructure[item.node].name = item.name;
        errorStructure[item.node].details = [];
        errorStructure[item.node].img = item.img;
        errorStructure[item.node].details.push({
          msg: item.msg,
          property: item.property,
        });
      } else {
        errorStructure[item.node].details.push({
          msg: item.msg,
          property: item.property,
        });
      }
    });

    for (const item in errorStructure) {
      const details = [];
      const name = errorStructure[item].name;
      if (errorStructure[item].details) {
        errorStructure[item].details.map((detail) => {
          details.push(
            <div key={detail.property} className="row">
              <span>
                {detail.property}
                :
              </span>
              {' '}
              {detail.msg}
            </div>
          );
        });

        msg.push(
          <div className='submission-item' key={item} onClick={() => this.props.onClickNodeHandler(item)}>
            <div className="container-header">
              <img src={Images.getImage(errorStructure[item].img)} width="30" />
              {' '}
              {name}
            </div>
            <div className="rows-container">
              {details}
            </div>
          </div>
        );
      }
    }

    return (
      <Panel
        show={this.props.show}
        onClickHideHandler={this.props.onClickHideHandler}
      >
        <div className="header">
          Errors
        </div>
        <div className="submission-error">
          {msg}
        </div>
      </Panel>
    );
  }
} export default (observer(SubmissionError));
