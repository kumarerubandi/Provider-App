import React, {Component} from 'react';
import {Dropdown} from 'semantic-ui-react';
import jsonData from "../procedure_codes.json";


let catList=[];
function icd10Map(object) {
    for(const key in object){
        catList.push({'key':key,'value':key,'text':key})
    }
    return catList;
   }
export const options = icd10Map(jsonData);
let blackBorder = "blackBorder";

export default class DropdownServiceCode extends Component {
  constructor(props){
    super(props);
    this.state = { currentValue: "",category:"",code_options:[]}
    this.handleChange = this.handleChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  };

  handleCategoryChange = (e, { value }) => {
    // console.log(this.props);
    // console.log(options);
    // console.log(value);
    // console.log( jsonData[value]);
      if(jsonData[value] !== undefined){
          let codesList = []
          // console.log( jsonData[value]);
          for(const key in jsonData[value]){
            console.log(key,jsonData[value][key])
              codesList.push({'key':key,'value':key,'text':key+" - "+jsonData[value][key]})
          }
          this.props.updateCB("category_name", value)

          // this.code_options = codesList
          this.setState({ category: value ,code_options:codesList})
  
      }
    }

  handleChange = (e, { value }) => {
    // console.log(this.props);
    // console.log(options);
    // console.log(value);
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
      <div>
        <div>
          <div className="header">
            Service type category
          </div>
          <div className="dropdown">
            <Dropdown
            className={blackBorder}
              options={options}
              placeholder='Service type category'
              search
              selection
              fluid
              onChange={this.handleCategoryChange}
            />
          </div>
        </div>
        <div>
          <div className="header">
            Service type code
          </div>
          <div className="dropdown">
            <Dropdown
            className={blackBorder}
              options={this.state.code_options }
              placeholder='Service type code'
              search
              selection
              fluid
              onChange={this.handleChange}
            />
          </div>
        </div>
      </div>

    )
  }
}