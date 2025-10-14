import React from 'react';
import { observer } from 'mobx-react';
import Panel from '../ui/panel/Panel';
import Images from '../../imgs/Images';

import '../relationship/RelationshipPicker.scss';

class SDOPicker extends React.Component {
  constructor(props) {
    super(props);
  }

  onClickSelectSDOHandler(sdo) {
    this.props.onClickHideHandler();
    this.props.onClickSelectSDOHandler(sdo);
  }

  render() {
    return (
      <Panel
        show={this.props.show}
        onClickHideHandler={this.props.onClickHideHandler}
      >
        <div className="relationship-picker">
          <div className="header">STIX Domain Object (SDO) Extensions</div>
          <div className="content">
            {
                                this.props.sdos.map((sdo) => {
                                  let img = Images.getImage(sdo.img);
                                  if (sdo.customImg) {
                                    img = sdo.customImg;
                                  }

                                  return (
                                    <div
                                      className="item"
                                      key={sdo.title}
                                      onClick={() => this.onClickSelectSDOHandler(sdo)}
                                    >
                                      <img className="src-image" src={img} width="20" />
                                      {' '}
                                      {sdo.title}
                                    </div>
                                  );
                                })
                            }
          </div>
        </div>
      </Panel>
    );
  }
} export default (observer(SDOPicker));
