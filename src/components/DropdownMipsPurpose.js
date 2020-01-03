import React, {Component} from 'react';
import {Dropdown} from 'semantic-ui-react';

export const stateOptions = [
  { key: 'data', value: 'data', text: 'Data Submission Only' },
  { key: 'mips', value: 'mips', text: 'Score Calculation Only' },
  { key: 'both', value: 'both', text: 'Both' },
]

let blackBorder = "blackBorder";

export default class DropdownMipsPurpose extends Component {
  constructor(props){
    super(props);
    this.state = { currentValue: ""}
  };

  handleChange = (e, { value }) => {
    this.props.updateCB(this.props.elementName, value)
    this.setState({ currentValue: value })
  }

  render() {
    const { currentValue } = this.state
    if(currentValue){
        blackBorder = "blackBorder";
    }else{
        blackBorder = "";
    }
    return (
      <Dropdown
      className={blackBorder}
        options={stateOptions}
        placeholder='Purpose'
        search
        selection
        fluid
        onChange={this.handleChange}
      />
    )
  }
}