import React, { Component } from 'react';
// import config from '../globalConfiguration.json';
import {Input} from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// import { electronEnhancer } from 'redux-electron-store';
import { saveConfiguration } from '../actions/index';


class Configuration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config:{
                tokenExpiresIn : props.config.authorization_service.token_expires_in,
                crdUrl: props.config.crd.crd_url,
                coverageDecisionPath: props.config.crd.coverage_decision_path,
                coverageRequirementPath: props.config.crd.coverage_requirement_path,
                payerFhirUrl: props.onfig.payer.fhir_url,
                providerFhirUrl: props.config.provider.fhir_url,
                clientSecret: props.config.provider.client_secret,
                clientId: props.config.provider.client_id,
                authTokenUrl: props.config.authorization_service.auth_token_url,
                tokenVerificationUurl: props.config.authorization_service.token_verification_url,
                tokenType: props.config.authorization_service.token_type,
            },
            resetFlag:false
            
        }
        this.onChangeTokenExpiry = this.onChangeTokenExpiry.bind(this);
        this.onChangeCrdUrl = this.onChangeCrdUrl.bind(this);
        this.onChangeCoverageDecisionPath = this.onChangeCoverageDecisionPath.bind(this);
        this.onChangeCoverageRequirementPath = this.onChangeCoverageRequirementPath.bind(this);
        this.onChangePayerFhirUrl = this.onChangePayerFhirUrl.bind(this);
        this.onChangeProviderFhirUrl = this.onChangeProviderFhirUrl.bind(this);
        this.onChangeClientSecret = this.onChangeClientSecret.bind(this);
        this.onChangeClientId = this.onChangeClientId.bind(this);
        this.onChangeAuthTokenUrl = this.onChangeAuthTokenUrl.bind(this);
        this.onChangeTokenVerificationUrl = this.onChangeTokenVerificationUrl.bind(this);
        this.onChangeTokenType = this.onChangeTokenType.bind(this);
        this.onSaveConfiguration=this.onSaveConfiguration.bind(this);

    }

    onChangeTokenExpiry(event){
        let config = this.state.config;
        config.tokenExpiresIn=event.target.value
        this.setState({config})
    }
    onChangeCrdUrl(event){
        let config = this.state.config;
        config.crdUrl=event.target.value
        // this.setState({crdUrl:event.target.value})
        this.setState({config})
    }
    onChangeCoverageDecisionPath(event){
        let config = this.state.config;
        config.coverageDecisionPath = event.target.value
        // this.setState({coverageDecisionPath:event.target.value})
        this.setState({config})
    }
    onChangeCoverageRequirementPath(event){
        let config = this.state.config;
        config.coverageRequirementPath= event.target.value
        // this.setState({coverageRequirementPath:event.target.value})
        this.setState({config})
    }
    onChangePayerFhirUrl(event){
        let config = this.state.config;
        config.payerFhirUrl = event.target.value
        // this.setState({payerFhirUrl:event.target.value})
        this.setState({config})
    }
    onChangeProviderFhirUrl(event){
        let config = this.state.config;
        config.providerFhirUrl = event.target.value
        // this.setState({providerFhirUrl:event.target.value})
        this.setState({config})
    }
    onChangeClientId(event){
        config.clientId = event.target.value
        // this.setState({clientId:event.target.value})
        this.setState({config})

    }
    onChangeClientSecret(event){
        config.clientSecret = event.target.value
        // this.setState({clientSecret:event.target.value})
        this.setState({config})
    }
    onChangeAuthTokenUrl(event){
        config.authTokenUrl = event.target.value
        // this.setState({authTokenUrl:event.target.value})
        this.setState({config})
    }
    onChangeTokenVerificationUrl(event){
        config.tokenVerificationUurl = event.target.value
        // this.setState({tokenVerificationUurl:event.target.value})
        this.setState({config})
    }
    onChangeTokenType(event){
        config.tokenType = event.target.value
        this.setState({config})
    }
    onSaveConfiguration(){
        console.log('saved')
        this.props.saveConfiguration(this.state.config);

    }
    renderConfiguration() {
        return (
          <React.Fragment>
            <div>
              <div className="main_heading">Configuration </div>
              <div className="content">
                <div className="left-form">
                    
                    {/* {config.user_profiles.map(function(user_profile, index){
                        if(user_profile.username=='john'){
                            return(<div>
                                <div className='header'>User Profile {index+1}</div>
                            <div className="leftStateInput"><div className='header-child'>Username</div>
                            <div className="dropdown"><Input className='ui input' type="text" name="username" value={user_profile.username}></Input></div></div>
                            <div className="rightStateInput"><div className='header-child'>Name</div>
                            <div className="dropdown"><Input className='ui input' type="text" name="name" value={user_profile.name}></Input></div></div>
                            <div className='header-child'>NPI</div>
                            <div className="dropdown"><Input className='ui fluid input' type="text" name="npi" fluid value={user_profile.npi}></Input></div>
                            </div>
                            )
                        }
                        else if(user_profile.username==='mary'){
                            return(<div>
                                <div className='header'>User Profile {index+1}</div>
                               <div className="leftStateInput"> <div className='header-child'>Username</div>
                               <div className="dropdown"><Input className='ui input' type="text" name="username" value={user_profile.username}></Input></div></div>
                            <div className="rightStateInput"><div className='header-child'>Name</div>
                            <div className="dropdown"><Input className='ui input' type="text" name="name" value={user_profile.name}></Input></div></div>
                            <div className='header-child'>NPI</div>
                            <div className="dropdown"><Input className='ui fluid input' type="text" name="npi" fluid value={user_profile.npi}></Input></div>
                            </div>
                            )
                        }
                        
                    })} */}
                    <div className='header'>CRD</div>
                    <div className='header-child'>CRD URL</div>
                    <div className="dropdown"><Input className='ui fluid input' type="text" fluid name="crd_url" onChange={this.onChangeCrdUrl} value={this.state.config.crdUrl}></Input></div>
                    <div className='header-child'>Coverage Decision Path</div>
                    <div className="dropdown"> <Input className='ui fluid input' type="text" name="coverage_decision_path" fluid onChange={this.onChangeCoverageDecisionPath} value={this.state.config.coverageDecisionPath}></Input></div>
                    <div className='header-child'>Coverage Requirement Path</div>
                    <div className="dropdown"><Input className='ui fluid input' type="text" name="coverage_requirement_path" fluid onChange={this.onChangeCoverageRequirementPath} value={this.state.config.coverageRequirementPath}></Input></div>

                    <div className='header'>Payer FHIR URL</div>
                    <div className="dropdown"><Input className='ui fluid input' type="text" fluid name="payer_fhir_url" onChange={this.onChangePayerFhirUrl} value={this.state.config.payerFhirUrl}></Input></div>
                    
                    {/* <div className='header'>CDS Service</div>
                    <div className="leftStateInput"><div className='header-child'>VSAC Username</div>
                    <div className="dropdown"><Input className='ui  input' type="text" name="vsac_user"  value={config.cds_service.vsac_user}></Input></div></div>
                    <div className="rightStateInput"><div className='header-child'>VSAC Password</div>
                    <div className="dropdown"><Input className='ui  input' type="text" name="vsac_password"  value={config.cds_service.vsac_password}></Input></div></div> */}
                    <div className='header'>Authorization Service</div>
                    <div className='header-child'>Authorization Token URL</div>
                    <div className="dropdown"><Input className='ui fluid input' type="text" fluid name="auth_token_url" onChange={this.onChangeAuthTokenUrl} value={this.state.config.authTokenUrl}></Input></div>
                    <div className='header-child'>Token Verification URL</div>
                    <div className="dropdown"><Input className='ui fluid input' type="text" name="token_verification_url" fluid onChange={this.onChangeTokenVerificationUrl} value={this.state.config.tokenVerificationUurl}></Input></div>
                    <div className="leftStateInput"><div className='header-child'>Token Type</div>
                    <div className="dropdown"><Input className='ui  input' type="text" name="token_type" onChange={this.onChangeTokenType}  value={this.state.config.tokenType}></Input></div></div>
                    <div className="rightStateInput"><div className='header-child'>Token Expires In</div>
                    <div className="dropdown"><Input className='ui  input' type="text" name="token_expires_in" onChange={this.onChangeTokenExpiry} value={this.state.config.tokenExpiresIn}></Input></div></div>
                </div>
                <div className="right-form">
                <div className='header'>Provider</div>
                    <div className='header-child'>Provider FHIR URL</div>
                    <div className="dropdown"><Input className='ui fluid input' type="text" fluid name="provider_fhir_url" onChange={this.onChangeProviderFhirUrl} value={this.state.config.providerFhirUrl}></Input></div>
                    <div className='header-child'>Client Secret</div>
                    <div className="dropdown"><Input className='ui fluid input' type="text" name="provider_client_secret" onChange={this.onChangeClientSecret} fluid value={this.state.config.clientSecret}></Input></div>
                    <div className='header-child'>Client ID</div>
                    <div className="dropdown"><Input className='ui fluid input' type="text" name="provider_client_id" fluid onChange={this.onChangeClientId} value={this.state.config.clientId}></Input></div>
                    <button className="submit-btn btn btn-class button-ready" onClick={this.onSaveConfiguration}>Save</button>   
                </div>
            </div>
            </div>
            </React.Fragment>
        )

    }
    
    render() {
        return (
          <div className="attributes mdl-grid">
              {this.renderConfiguration()}
          </div>)
      }

}
function mapStateToProps(state) {
    console.log(state)
    return {
      config:state.config,
    };
  };
  
  function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        saveConfiguration
    }, dispatch);
  };
  
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Configuration));
// export default Configuration;