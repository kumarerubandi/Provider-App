import React, { Component } from 'react';
import claim_json from '../claim.json';
// import ReactJson from 'react-json-view';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import DropdownMeasure from '../components/DropdownMeasure';


class ReportingScenario extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x12_response: "",
            x12_error: "",
            measure:null,
            claim_json: JSON.stringify(claim_json, undefined, 4),
        };
        this.goHome = this.goHome.bind(this);
        // this.createX12Response = this.createX12Response.bind(this);
        // this.convertJsonToX12 = this.convertJsonToX12.bind(this);
        // this.handleClaimJson = this.handleClaimJson.bind(this);
        console.log(this.state.claim_json);
    }

    goHome() {
        window.location = `${window.location.protocol}//${window.location.host}/provider_request`;
    }

    // async createX12Response() {
    //     var tempURL = this.props.config.xmlx12_url + "xmlx12";
    //     console.log("x12 URL", tempURL);
    //     let req = await fetch(tempURL, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: this.state.claim_json
    //     }).then((response) => {
    //         return response.json();
    //     }).then((response) => {
    //         return response;
    //     }).catch(err => err);
    //     return req;
    // }

    // async convertJsonToX12() {
    //     this.setState({ 'x12_response': "" });
    //     this.setState({ 'x12_error': "" });
    //     let x12_data = await this.createX12Response();
    //     console.log("x12-------", x12_data)
    //     if (x12_data.error == "") {
    //         this.setState({ 'x12_response': x12_data['x12_response'] });
    //     }
    //     else {
    //         this.setState({ 'x12_error': x12_data['error'] });
    //     }
    //     console.log("state------", this.state);
    // }

    // handleClaimJson(event) {
    //     console.log(this.state.claim_json);
    //     this.setState({ claim_json: event.target.value });
    //     console.log(this.state.claim_json);
    // }

    render() {
        return (
            <React.Fragment>
                <div>
                    <div>
                        <div className="main_heading">
                            <span style={{ lineHeight: "35px" }}>PILOT INCUBATOR - Reporting Scenario</span>
                            <div className="menu_conf" onClick={() => this.goHome()}>
                                <i style={{ paddingLeft: "5px", paddingRight: "7px" }} className="fa fa-home"></i>
                                Home</div>
                        </div>
                    </div>
                    <div className="content">
                     <div className="left-form">

                        <div className="header">
                            Measure
                        </div>
                            <div className="dropdown">
                                <DropdownMeasure
                                elementName='measure'
                                updateCB={this.updateStateElement}
                                />
                            </div>
                        </div>
                    </div>
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

export default withRouter(connect(mapStateToProps)(ReportingScenario));