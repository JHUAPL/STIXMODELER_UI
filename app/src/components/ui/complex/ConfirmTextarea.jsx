import React from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from 'react-tooltip';
import TextArea from '../inputs/TextArea';

import './confirmtextarea.scss';

class ConfirmTextarea extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeInputHandler = this.onChangeInputHandler.bind(this);
    this.onClickAddObjectHandler = this.onClickAddObjectHandler.bind(this);
    this.onClickDeleteHandler = this.onClickDeleteHandler.bind(this);

    this.state = {
      value: '',
    };
  }

  componentDidMount() {

  }

  onChangeInputHandler(event) {
    event.preventDefault();

    this.setState({
      value: event.currentTarget.value,
    });
  }

  onClickDeleteHandler(select, idx) {
    this.props.onClickDeletePropertyHandler(select, idx);
  }

  onClickAddObjectHandler() {
    this.props.onClickAddTextHandler(this.props.field, this.state.value);
  }

  render() {
    const { field, } = this.props;
    const value = this.props.value ? this.props.value : [];
    const { description, } = this.props;

    return (
      <div className="ct-container">
        <div className="ct-header">
          {field}
          <span
            data-tooltip-id={`${field}-tooltip`}
            className="material-icons"
            data-tooltip-content={description}
          >
            info
          </span>
          <Tooltip id={`${field}-tooltip`} />
        </div>
        <div className="ct-body">
          <div className="ct-block-input">
            <div className="input">
              <TextArea
                value={this.state.value}
                name={field}
                onChange={this.onChangeInputHandler}
              />
            </div>
            <div className="add-container">
              <span onClick={this.onClickAddObjectHandler} className="add material-icons">control_point</span>
            </div>
          </div>

          <div className="ct-output">
            {value}
          </div>
        </div>
      </div>
    );
  }
} export default observer(ConfirmTextarea);
