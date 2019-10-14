import React, { Component } from 'react';
import claim_json from '../claim.json';
// import ReactJson from 'react-json-view';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dropdown,Input } from 'semantic-ui-react';
import DropdownMeasure from '../components/DropdownMeasure';
import Loader from 'react-loader-spinner';
import { createToken } from '../components/Authentication';
import moment from "moment";
import StepZilla from "react-stepzilla";
import QualityImprovement from "../components/QualityImprovement"
import PromotingInteroperability from "../components/PromotingInteroperability"
import ImprovementActivities from "../components/ImprovementActivities"
import Cost from "../components/Cost"





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
            measure:null,
            validatePatient: false,
            logs: [],
            measureTypeOptions : [
                {key:'individual', value: 'individual', text:"Individual"} ,
                {key:'summary', value: 'summary', text:"Summary"}],
            measureType:'',
            patientId:'',
            reqId: '',

            dataLoaded: false

        };
      }

      getStore() {
        return this.sampleStore;
      }
    
      updateStore(update) {
        this.sampleStore = {
          ...this.sampleStore,
          ...update,
        }
      }


    render() {
      const steps =
          [
            {name: 'Quality Improvement', component: <QualityImprovement getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
            {name: 'PI', component: <PromotingInteroperability />},
            {name: 'IA', component: <ImprovementActivities />},
            {name: 'Cost', component: <Cost />},
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
                        <h1><a href="#intro" className="scrollto">PilotIncubator</a></h1>
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
                          <li className="menu-has-children"><a href="">{sessionStorage.getItem('name')}</a>
                            <ul>
                              <li><a href="" onClick={this.onClickLogout}>Logout</a></li>
                            </ul>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </header>
                  <main id="main" style={{ marginTop: "92px" }}>
                    <div className="form">
                     <div className="container">
                       <div className ="section-header">
                       <h3>MIPS Score</h3>
                       </div>
                      <div className='step-progress'>
                            <StepZilla steps={steps}
                            preventEnterSubmission={true}
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
    console.log(state);
    return {
        config: state.config,
    };
};

export default withRouter(connect(mapStateToProps)(Mips));