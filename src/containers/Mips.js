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
        loading:true
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
        loading:true

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
        loading:true

      },
      costMeasures: {
        measure: '',
        measureList: [],
        measureOptions: [],
        weightage: "15",
        loading:true

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
          <main id="main" style={{ marginTop: "92px",marginBottom:"100px" }}>
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

function mapStateToProps(state) {
  return {
    config: state.config,
  };
};

export default withRouter(connect(mapStateToProps)(Mips));
