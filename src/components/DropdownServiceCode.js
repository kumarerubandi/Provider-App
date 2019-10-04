import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import jsonData from "../procedure_codes.json";


let catList = [];
function icd10Map(object) {
  for (const key in object) {
    catList.push({ 'key': key, 'value': key, 'text': key })
  }
  return catList;
}
export const options = icd10Map(jsonData);
let blackBorder = "blackBorder";

export default class DropdownServiceCode extends Component {
  constructor(props) {
    super(props);
    this.state = { currentValue: "", category: "", code_options: [] }
    this.handleChange = this.handleChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  };

  handleCategoryChange = (e, { value }) => {
    if (jsonData[value] !== undefined) {
      let codesList = []
      for (const key in jsonData[value]) {
        codesList.push({ 'key': key, 'value': key, 'text': key + " - " + jsonData[value][key] })
      }
      this.props.updateCB("category_name", value)
      this.setState({ category: value, code_options: codesList })
    }
  }

  handleChange = (e, { value }) => {
    this.props.updateCB(this.props.elementName, value)
    this.setState({ currentValue: value })
  }

  render() {
    const { currentValue } = this.state
    if (currentValue) {
      blackBorder = "blackBorder";
    } else {
      blackBorder = "";
    }
    return (
        <div className="form-row">
          <div className="form-group col-md-2 offset-2">
            <h4 className="title">Service type*</h4>
          </div>
          <div className="form-group col-md-3">
          <Dropdown
              className={blackBorder}
              options={options}
              placeholder='Category'
              search
              selection
              fluid
              onChange={this.handleCategoryChange}
            />
          </div>
          <div className="form-group col-md-3">
          <Dropdown
              className={blackBorder}
              options={this.state.code_options}
              placeholder='Code'
              search
              selection
              fluid
              onChange={this.handleChange}
            />
          </div>
        </div>
    )
  }
}