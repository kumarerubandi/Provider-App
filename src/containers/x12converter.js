import React, { Component } from 'react';
import claim_json from '../claim.json';
// import ReactJson from 'react-json-view';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class X12Converter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x12_response: "",
            x12_error: "",
            claim_json: JSON.stringify({ claim_json }, undefined, 4),
        };
        this.goHome = this.goHome.bind(this);
        this.createX12Response = this.createX12Response.bind(this);
        this.convertJsonToX12 = this.convertJsonToX12.bind(this);
        this.handleClaimJson = this.handleClaimJson.bind(this);
    }

    goHome() {
        window.location = `${window.location.protocol}//${window.location.host}/provider_request`;
    }

    async createX12Response() {
        var tempURL = this.props.config.xmlx12_url + "xmlx12";
        console.log("x12 URL", tempURL);
        let req = await fetch(tempURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: this.state.claim_json
        }).then((response) => {
            return response.json();
        }).then((response) => {
            return response;
        }).catch(err => err);
        return req;
    }

    async convertJsonToX12() {
        this.setState({ 'x12_response': "" });
        this.setState({ 'x12_error': "" });
        let x12_data = await this.createX12Response();
        console.log("x12-------", x12_data)
        if (x12_data.error == "") {
            this.setState({ 'x12_response': x12_data['x12_response'] });
        }
        else {
            this.setState({ 'x12_error': x12_data['error'] });
        }
        console.log("state------", this.state);
    }

    handleClaimJson(event) {
        this.setState({ claim_json: event.target.value });
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <div>
                        <div className="main_heading">
                            <span style={{ lineHeight: "35px" }}>PILOT INCUBATOR - Configuration</span>
                            <div className="menu_conf" onClick={() => this.goHome()}>
                                <i style={{ paddingLeft: "5px", paddingRight: "7px" }} className="fa fa-home"></i>
                                Home</div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="l-form" style={{ paddingLeft: "2%", paddingTop: "1%" }}>
                            <div style={{ paddingTop: "10px", color: "#8a6d3b", marginBottom: "10px" }}><strong> FHIR Claim resource : </strong></div>
                            <textarea value={this.state.claim_json}
                                onChange={this.handleClaimJson} cols={75} rows={32} />
                            {/* <ReactJson src={claim_json} enableClipboard={false}
                                collapsed={false}
                                indentWidth={4}
                                theme="shapeshifter:inverted"
                                name={false}
                                iconStyle="triangle"
                                displayObjectSize={false}
                                displayDataTypes={false} /> */}
                        </div>
                        <div className="middle-form">
                            <button className="submit-btn btn btn-class button-ready" onClick={this.convertJsonToX12}>
                                Generate X12
                            </button>
                        </div>
                        <div className="r-form" style={{ paddingTop: "1%" }} >
                            <div style={{ paddingTop: "10px", color: "#8a6d3b", marginLeft: "10px" }}><strong> X12 278 : </strong></div>

                            <div className='decision-card alert-warning' style={{ height: "520px", overflowX: "scroll" }}>
                                {(this.state.x12_response && this.state.x12_response.length > 0) &&
                                    <div>
                                        {this.state.x12_response.split("~").map((i, key) => {
                                            return <pre key={key} className="x12-pre">{i}~</pre>;
                                        })}
                                    </div>
                                }
                                {(this.state.x12_error && this.state.x12_error.length > 0) &&
                                    <div> Invalid FHIR resource !!
                                        <div>
                                            {this.state.x12_error.split(".").map((i, key) => {
                                                return <pre key={key} className="x12-pre">{i}~</pre>;
                                            })}
                                        </div>
                                    </div>
                                }
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

export default withRouter(connect(mapStateToProps)(X12Converter));