/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { observer } from 'mobx-react';

import MenuItem from './MenuItem';
import Images from '../../imgs/Images';

import './BottomMenu.scss';

class BottomMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="menu">
        <div className="row">
          {
                        this.props.objects.map((object, i) => {
                          if (object.active) {
                            return (
                              <MenuItem
                                key={i}
                                object={object}
                                image={object.customImg ? object.customImg : Images.getImage(object.img)}
                                onDragStartHandler={this.props.onDragStartHandler}
                                generateNodeID={this.props.generateNodeID}
                              />
                            );
                          }
                        })
                    }
        </div>
      </div>
    );
  }
} export default (observer(BottomMenu));
