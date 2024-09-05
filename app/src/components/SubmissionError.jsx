/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { observer } from 'mobx-react';
import Panel from './ui/panel/Panel';
import Images from '../imgs/Images';

import './SubmissionError.scss';

class SubmissionError extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const errorStructure = {};
    const msg = [];

    this.props.error.map((item, i) => {
      if (!errorStructure.hasOwnProperty(item.node)) {
        errorStructure[item.node] = {};
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
          <div key={item}>
            <div className="header">
              <img src={Images.getImage(errorStructure[item].img)} width="30" />
              {' '}
              {item}
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
        <div className="submission-error">
          {msg}
        </div>
      </Panel>
    );
  }
} export default (observer(SubmissionError));
