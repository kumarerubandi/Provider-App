import React, {Component} from 'react';
import {Dropdown} from 'semantic-ui-react';
import jsonData from "../ambulatory-transport.json";


let allCdsOptions=[];
function icd10Map(object) {
    for(const key in object){
        allCdsOptions.push({'key':key,'value':key,'text':key + ' - '+ object[key]})
    }
    return allCdsOptions;
   }
export const cdsOptions = icd10Map(jsonData);
let blackBorder = "blackBorder";

export default class DropdownAmbulanceCodes extends Component {
  constructor(props){
    super(props);
    this.state = { currentValue: ""}
    this.handleChange = this.handleChange.bind(this);
 
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
        options={cdsOptions}
        placeholder='ICD 10 codes'
        search
        selection
        fluid
        multiple
        onChange={this.handleChange}
      />
    )
  }
}
