import React, { Component } from 'react';
// import ReactJson from 'react-json-view';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Client from 'fhir-kit-client';
import { createToken } from '../components/Authentication';
import { Link } from 'react-router-dom';

class CDEX extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: this.props.config,
            comm_req: [],
            patient: {},
            form_load: false,
            patient_name:"",
            docs_required:""
        };
        this.goHome = this.goHome.bind(this);
        this.getCommunicationRequests = this.getCommunicationRequests.bind(this);
        this.displayCommunicataionRequests = this.displayCommunicataionRequests.bind(this);
        this.getPatientDetails = this.getPatientDetails.bind(this);
    }

    goHome() {
        window.location = `${window.location.protocol}//${window.location.host}/provider_request`;
    }

    componentDidMount() {
        this.displayCommunicataionRequests();
    }

    async getCommunicationRequests() {
        var tempUrl = this.state.config.provider.fhir_url;
        const token = await createToken(sessionStorage.getItem('username'), sessionStorage.getItem('password'));
        // console.log('The token is : ', token, tempUrl);
        const fhirResponse = await fetch(tempUrl + "CommunicationRequest", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            // console.log("Recieved response", response);
            return response.json();
        }).then((response) => {
            // console.log("----------response", response);
            return response;
        }).catch(reason =>
            console.log("No response recieved from the server", reason)
        );
        return fhirResponse;
    }

    async displayCommunicataionRequests() {
        let resources = [];
        let resp = await this.getCommunicationRequests();
        // console.log("resp------", resp);
        if (resp.entry != undefined) {
            Object.keys(resp.entry).forEach((key) => {
                if (resp.entry[key].resource != undefined) {
                    resources.push(resp.entry[key].resource);
                }
            });
        }
        // console.log("-------", resources);
        this.setState({ comm_req: resources });
    }

    async getPatientDetails(patient_id, communication_request) {
        var tempUrl = this.state.config.provider.fhir_url + "Patient/" + patient_id.replace('#', '');
        const token = await createToken(sessionStorage.getItem('username'), sessionStorage.getItem('password'));
        let patient = await fetch(tempUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            return response.json();
        }).then((response) => {
            console.log("----------response", response);
            return response;
        }).catch(reason =>
            console.log("No response recieved from the server", reason)
        );
        console.log("patient---", patient);
        if (patient) {
            this.setState({ patient: patient });
            // if (patient.hasOwnProperty("name")){

            // }
            this.setState({ form_load: true });
        }
    }

    render() {
        let data = this.state.comm_req;
        let i = 0;
        let content = data.map((d) => {
            console.log(d);
            if (d.hasOwnProperty("category") && d.hasOwnProperty("subject")) {
                if (d['category'][0]['coding'][0].hasOwnProperty('code') && d['subject'].hasOwnProperty('reference')) {
                    return (
                        <div>
                            <button onClick={() => this.getPatientDetails(d['subject']['reference'], d)}>
                                {d['category'][0]['coding'][0]['code']} for the patient with id {d['subject']['reference']}
                            </button>
                        </div>
                    )
                }
            }
        });
        return (
            <React.Fragment>
                <div>
                    <div>
                        <div className="main_heading">
                            <span style={{ lineHeight: "35px" }}>PILOT INCUBATOR - CDEX</span>
                            <div className="menu_conf" onClick={() => this.goHome()}>
                                <i style={{ paddingLeft: "5px", paddingRight: "7px" }} className="fa fa-home"></i>
                                Home</div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="l-form" style={{ paddingLeft: "2%", paddingTop: "1%" }}>
                            <div style={{ paddingTop: "10px", color: "#8a6d3b", marginBottom: "10px" }}><strong> Communication Requests </strong></div>
                            <div>{content}</div>
                        </div>
                        <div className="middle-form">
                            
                        </div>
                        {this.state.form_load &&
                            <div className="r-form" style={{ paddingTop: "1%" }} >
                                <div style={{ paddingTop: "10px", color: "#8a6d3b", marginLeft: "10px" }}></div>
                                <strong>Communication Request for the patient {this.state}</strong>

                            </div>}
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

export default withRouter(connect(mapStateToProps)(CDEX));