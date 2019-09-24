import React, {Component} from 'react';
import {Dropdown} from 'semantic-ui-react';
import { createToken } from './Authentication';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';



export const payerOptions = [
  { key: 'medicare-fee-for-service', value: 'medicare-fee-for-service', text: 'Medicare Fee for service' },
  { key: 'humana', value: 'humana', text: ' Humana' },
  { key: 'cigna', value: 'cigna', text: 'Cigna' },
  { key: 'uhc', value: 'uhc', text: 'UHC' },
]

let blackBorder = "blackBorder";

export  class DropdownPayer extends Component {
  constructor(props){
    super(props);
    this.state = { 
      currentValue: "",
      organizations: []
    }
    this.handleChange = this.handleChange.bind(this);
 
  };
  async componentDidMount() {
    try {
        let organizations = await this.getResources();
        let list = [];
        let i = 0;
        organizations.entry.map((item, key) => {
            i = i + 1;
            let res = item.resource;
            let organization_state = { key: '', value: '', text: '' };
            let id ;
            Object.keys(res).map((k, v) => {
                if (k == 'id') {
                    organization_state.value = res[k];
                    organization_state.key = res[k];
                }
                if (k == 'name') {
                  organization_state.text = res[k] ;
                }
                
            });
            list.push(organization_state);
        });
        this.setState({organizations:list});
    } catch (error) {
        console.log('Organization list', error);
    }


}
async getResources() {
  var url = this.props.config.provider.fhir_url+'/Organization';
  console.log(this.props.config.provider.fhir_url)
  let token;
  token = await createToken(this.props.config.provider.grant_type, 'provider', sessionStorage.getItem('username'), sessionStorage.getItem('password'))
  let headers = {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + token
  }

  let organizations = await fetch(url, {
      method: "GET",
      headers: headers
  }).then(response => {
      return response.json();
  }).then((response) => {
      // console.log("----------response", response);
      return response;
  }).catch(reason =>
      console.log("No response recieved from the server", reason)
  );
  console.log(organizations, 'sender')
  return organizations;
}

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
        options={this.state.organizations}
        placeholder='Payer'
        // value={'medicare-fee-for-service'}
        search
        selection
        fluid
        
        onChange={this.handleChange}
      />
    )
  }
}

function mapStateToProps(state) {
  console.log(state);
  return {
    config: state.config,
  }
}

export default withRouter(connect(mapStateToProps)(DropdownPayer));