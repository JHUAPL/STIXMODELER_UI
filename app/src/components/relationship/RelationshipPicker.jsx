import React from 'react';
import { observer } from 'mobx-react';
import Panel from '../ui/panel/Panel';
import Images from '../../imgs/Images';

import './RelationshipPicker.scss';

class RelationshipPicker extends React.Component {
  constructor(props) {
    super(props);
  }

  onClickSelectRelHandler(relationship) {
    this.props.onClickSelectRelHandler(relationship);
  }

  render() {
    // Do not allow relationship defininition for generic observables
    let create;
    if (this.props.relationships.length == 0 || this.props.relationships[0].target_ref) {
      create = (
        <div
          className="item"
          key="new-relationship"
          onClick={this.props.onClickShowRelDetailsHandler}
        >
          <img className="src-image" src={Images.getImage('add.png')} width="20" />
          <span className="rel-type"> Create New Relationship </span>
        </div>
      );
    }

    return (
      <Panel
        show={this.props.show}
        onClickHideHandler={this.props.onClickHideHandler}
      >
        <div className="relationship-picker">
          <div className="header">
            <img src={Images.getImage('relationship.png')} width="20" />
            {' '}
            Possible Relationships
          </div>
          <div className="content">
            {create}
            {
                                this.props.relationships.slice(1).map((relationship) => {
                                  let src = relationship.source_ref.split('--')[0];
                                  let target = relationship.target_ref.split('--')[0];

                                  if (relationship.subTarget) {
                                    target = relationship.subTarget;
                                  }

                                  if (relationship.x_reverse) {
                                    const tmp = src;
                                    src = target;
                                    target = tmp;
                                  }

                                  const srcImg = Images.getImage(`${src}.png`);
                                  const targetImg = Images.getImage(`${target}.png`);

                                  return (
                                    <div
                                      className="item"
                                      key={relationship.id}
                                      onClick={() => this.onClickSelectRelHandler(relationship)}
                                    >
                                      <img className="src-image" src={srcImg} width="20" />
                                      {' '}
                                      {src}
                                      <span className="rel-type">
                                        {' '}
                                        {relationship.relationship_type}
                                        {' '}
                                      </span>
                                      {target}
                                      {' '}
                                      <img className="target-image" src={targetImg} width="20" />
                                    </div>
                                  );
                                })
                            }
          </div>
        </div>
      </Panel>
    );
  }
} export default (observer(RelationshipPicker));
