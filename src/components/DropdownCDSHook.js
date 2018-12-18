import React, {Component} from 'react';
import {Dropdown} from 'semantic-ui-react';

export const cdsOptions = [
  { key: 'order-review', value: 'order-review', text: 'Order Review' },
  { key: 'medication-prescribe', value: 'medication-prescribe', text: 'Medication Prescribe' },
  { key: 'patient-review', value: 'patient-review', text: 'Patient Review' },
  { key: 'liver-transplant', value: 'liver-transplant', text: 'Liver Transplant' },
]
// export const options = [];


let blackBorder = "blackBorder";

export default class DropdownResourceType extends Component {
  constructor(props){
    super(props);
    this.state = { currentValue: ""}
    this.handleChange = this.handleChange.bind(this);
 
  };

  handleChange = (e, { value }) => {
    console.log(this.props);
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
        options={cdsOptions}
        placeholder='Choose ResourceType'
        search
        selection
        fluid
        onChange={this.handleChange}
      />
    )
  }
}