import React from 'react';
import { observer } from 'mobx-react';
import Panel from '../ui/panel/Panel';
import Images from '../../util/Images';

import '../relationship/RelationshipPicker.scss';

class ExtensionPicker extends React.Component {
  constructor(props) {
    super(props);
  }

  onClickSelectExtHandler(sdo) {
    this.props.onClickHideHandler();
    this.props.onClickSelectExtHandler(sdo);
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
            this.props.extensions.map((ext) => {
              let img = Images.getImage(ext.img);
              if (ext.customImg) {
                img = ext.customImg;
              }
            
              return (
                <div
                  className="item"
                  key={ext.id}
                  onClick={() => this.onClickSelectExtHandler(ext)}
                >
                  <img className="src-image" src={img} width="20" />
                  {' '}
                  {ext.properties.name.value.length > 0 ? ext.properties.name.value : ext.id}
                </div>
              );
            })
          }
          </div>
        </div>
      </Panel>
    );
  }
} export default (observer(ExtensionPicker));
