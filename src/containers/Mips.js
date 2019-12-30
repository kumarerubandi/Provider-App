import React, { Component } from 'react';
import claim_json from '../claim.json';
// import ReactJson from 'react-json-view';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dropdown, Input } from 'semantic-ui-react';
import DropdownMeasure from '../components/DropdownMeasure';
import Loader from 'react-loader-spinner';
import { createToken } from '../components/Authentication';
import moment from "moment";
import StepZilla from "react-stepzilla";
import QualityImprovement from "../components/QualityImprovement"
import PromotingInteroperability from "../components/PromotingInteroperability"
import ImprovementActivities from "../components/ImprovementActivities"
import Cost from "../components/CostMeasures"
import FinalPage from "../components/FinalPage"
import InitialPage from "../components/InitialPage"
import queryString from 'query-string';
import simpleOauthModule from 'simple-oauth2';
import Client from 'fhir-kit-client';

let blackBorder = "blackBorder";

const types = {
  error: "errorClass",
  info: "infoClass",
  debug: "debugClass",
  warning: "warningClass"
}

class Mips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: queryString.parse(this.props.location.search, { ignoreQueryPrefix: true }).code,
      loading: false,
      measure: null,
      validatePatient: false,
      logs: [],
      measureTypeOptions: [
        { key: 'individual', value: 'individual', text: "Individual" },
        { key: 'summary', value: 'summary', text: "Summary" }],
      measureType: '',
      patientId: '',
      reqId: '',
      dataLoaded: false
    };
    this.store = {
      initialPage: {
        reporting: '',
        practice: ''
      },
      qualityImprovement: {
        collectionType: 'all',
        measureType: 'all',
        specialtyMeasureSet: 'all',
        measure: '',
        measureList: [],
        measureOptions: [],
        reporting: "",
        practice: "",
        submissionType: "",
        weightage: "45",
        loading: true,
        group: false,
        identifiers: [],
        measureObj: {},

      },
      promotingInteroperability: {
        objectiveName: 'all',
        scoreWeight: 'all',
        measure: '',
        measureList: [],
        measureOptions: [],
        Q1: false,
        Q2: false,
        Q3: false,
        Q4: false,
        Q5: false,
        Q6: false,
        Q7: false,
        Q8: false,
        Q9: false,
        weightage: "25",
        loading: true,
        group: false,
        measureObj: {}


      },
      improvementActivity: {
        subCategoryName: 'all',
        activityWeight: 'all',
        measure: '',
        measureList: [],
        measureOptions: [],
        hpsa: false,
        tin: false,
        practice: false,
        npf: false,
        weightage: "15",
        loading: true,
        group: false,
        measureObj: {}


      },
      costMeasures: {
        measure: '',
        measureList: [],
        measureOptions: [],
        weightage: "15",
        loading: true,
        measureObj: {}


      },
      savedToCloud: false
    };
  }

  componentDidMount() {
    if (!sessionStorage.getItem('isLoggedIn')) {
      sessionStorage.setItem('redirectTo', "/mips");
      this.props.history.push("/login");
    }
  }

  getStore() {
    return this.store;
  }

  updateStore(update) {
    this.store = {
      ...this.store,
      ...update,
    }
  }

  hasAuthToken() {
    return sessionStorage.getItem("tokenResponse") !== undefined;
  }
  async authorize() {
    this.setState({ loading: true });
    var settings = this.getSettings();
    try {
      console.log(settings.api_server_uri, 'server uri')
      const fhirClient = new Client({ baseUrl: settings.api_server_uri });
      console.log(this.props.config.provider, 'please tell me it works')
      if (this.props.config.provider.authorized_fhir) {
        var { authorizeUrl, tokenUrl } = await fhirClient.smartAuthMetadata();
        if (settings.api_server_uri.search('cex.mettles.com') > 0) {
          authorizeUrl = { protocol: "https://", host: "auth.mettles.com/", pathname: "auth/realms/ProviderCredentials/protocol/openid-connect/auth" }
          tokenUrl = { protocol: "https:", host: "auth.mettles.com/", pathname: "auth/realms/ProviderCredentials/protocol/openid-connect/token" }
        }

        const oauth2 = simpleOauthModule.create({
          client: {
            id: settings.client_id
          },
          auth: {
            tokenHost: `${tokenUrl.protocol}//${tokenUrl.host}`,
            tokenPath: tokenUrl.pathname,
            authorizeHost: `${authorizeUrl.protocol}//${authorizeUrl.host}`,
            authorizePath: authorizeUrl.pathname,
          },
        });
        const options = { code: this.state.code, redirect_uri: `${window.location.protocol}//${window.location.host}/index`, client_id: settings.client_id };
        console.log(oauth2, 'oauth2', options)
        const result = await oauth2.authorizationCode.getToken(options);
        console.log('oooo')
        const { token } = oauth2.accessToken.create(result);
        sessionStorage.setItem("tokenResponse", token.access_token);
        console.log('The token is : ', token);
        fhirClient.bearerToken = token.access_token;
      }
    } catch (error) {
      // console.error('Access Token Error', error.message);
      console.log('Authentication failed');
      // this.setState({ token_error: true });
    }

  }
  render() {
    const steps =
      [
        // {name: 'Step 1', component: <InitialPage getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
        { name: 'Step 1', component: <ImprovementActivities getStore={() => (this.getStore())} updateStore={(u) => { this.updateStore(u) }} /> },
        { name: 'Step 2', component: <Cost getStore={() => (this.getStore())} updateStore={(u) => { this.updateStore(u) }} /> },
        { name: 'Step 3', component: <PromotingInteroperability getStore={() => (this.getStore())} updateStore={(u) => { this.updateStore(u) }} /> },
        { name: 'Step 4', component: <QualityImprovement getStore={() => (this.getStore())} updateStore={(u) => { this.updateStore(u) }} /> },
        { name: 'Final', component: <FinalPage getStore={() => (this.getStore())} updateStore={(u) => { this.updateStore(u) }} /> },
      ]
    if (!this.hasAuthToken()) {
      if (this.state.code) {
        this.authorize();
      } else {
        return (
          <div>
            <div>Not yet authorized</div>
            <div><input type="submit" value="Sign In" onClick={this.authorize} /></div>
          </div>
        )
      }
    } else {
      return (
        <React.Fragment>
          <div>
            {/* <div>
                        <div className="main_heading">
                            <span style={{ lineHeight: "35px" }}>PILOT INCUBATOR - MIPS</span>
                            <div className="menu_conf" onClick={() => this.goHome()}>
                                <i style={{ paddingLeft: "5px", paddingRight: "7px" }} className="fa fa-home"></i>
                                Home</div>
                        </div>
                    </div> */}
            <header id="inpageheader">
              <div className="container">

                <div id="logo" className="pull-left">
                  <h1><a href="#intro" className="scrollto">Beryllium</a></h1>
                  {/* <a href="#intro"><img src={process.env.PUBLIC_URL + "/assets/img/logo.png"} alt="" title="" /></a> */}
                </div>

                <nav id="nav-menu-container">
                  <ul className="nav-menu">
                    <li><a href={window.location.protocol + "//" + window.location.host + "/home"}>Home</a></li>
                    <li className="menu-active menu-has-children"><a href="">Services</a>
                      <ul>
                        <li className="menu-active"><a href={window.location.protocol + "//" + window.location.host + "/provider_request"}>Prior Auth Submit</a></li>
                        <li><a href={window.location.protocol + "//" + window.location.host + "/mips"}>MIPS Score</a></li>
                      </ul>
                    </li>
                    <li><a href={window.location.protocol + "//" + window.location.host + "/configuration"}>Configuration</a></li>
                    <li className="menu-has-children"><a href="">{sessionStorage.getItem('username')}</a>
                      <ul>
                        <li><a href="" onClick={this.onClickLogout}>Logout</a></li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </header>
            <main id="main" style={{ marginTop: "92px", marginBottom: "100px" }}>
              <div className="form">
                <div className="container">
                  <div className="section-header">
                    <h3>MIPS Score Calculator
                  <div className="sub-heading">Calculates MIPS Score on a 100 points scale based on the Quality, Promoting Interoperability and Improvement Activities.</div>
                    </h3>
                  </div>
                  <div className='step-progress'>
                    <StepZilla steps={steps}
                      preventEnterSubmission={true}
                      nextTextOnFinalActionStep={"Save"}
                      startAtStep={
                        window.sessionStorage.getItem("step")
                          ? parseFloat(window.sessionStorage.getItem("step"))
                          : 0
                      }
                      onStepChange={step =>
                        window.sessionStorage.setItem("step", step)
                      }
                    />
                  </div>

                </div>
              </div>
            </main>
          </div>
        </React.Fragment >
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    config: state.config,
  };
};

export default withRouter(connect(mapStateToProps)(Mips));
