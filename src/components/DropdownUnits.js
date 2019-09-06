import React, {Component} from 'react';
import {Dropdown} from 'semantic-ui-react';
import jsonData from '../ucum.json'


let allUnitsOptions=[]
function unitsMap(object) {
    console.log('i medications')
    for(const key in object){
        allUnitsOptions.push({'key':key,'value':key,'text':object[key]})
    }
    return allUnitsOptions;
   }    
export const unitsOptions = unitsMap(jsonData)


let blackBorder = "blackBorder";

export default class DropdownUnits extends Component {
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
        options={allUnitsOptions}
        placeholder='Units'
        search
        selection
        fluid
        onChange={this.handleChange}
      />
    )
  }
}
