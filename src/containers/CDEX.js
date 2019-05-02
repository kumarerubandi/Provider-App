import React, { Component } from 'react';
// import ReactJson from 'react-json-view';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Client from 'fhir-kit-client';
import { createToken } from '../components/Authentication';
import { Link } from 'react-router-dom';
import { send } from 'q';
import DocumentInput from '../components/DocumentInput';
import Loader from 'react-loader-spinner';


class CDEX extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: this.props.config,
            comm_req: [],
            patient: {},
            form_load: false,
            loading: false,
            patient_name: "",
            docs_required: [],
            sender_resource: '',
            sender_name: '',
            files: [],
            contentStrings: []
        };
        this.goHome = this.goHome.bind(this);
        this.getCommunicationRequests = this.getCommunicationRequests.bind(this);
        this.displayCommunicataionRequests = this.displayCommunicataionRequests.bind(this);
        this.getPatientDetails = this.getPatientDetails.bind(this);
        this.getSenderDetails = this.getSenderDetails.bind(this);
        this.getSenderResource = this.getSenderResource.bind(this);
        this.startLoading = this.startLoading.bind(this);
        this.updateDocuments = this.updateDocuments.bind(this);

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
        const fhirResponse = await fetch(tempUrl + "/CommunicationRequest", {
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

    async getPatientDetails(patient_id, communication_request, identifier) {
        this.setState({ patient_name: "" });
        this.setState({ sender_resource: "" });
        this.setState({ sender_name: "" });
        var tempUrl = this.state.config.provider.fhir_url + "/Patient?identifier=" + identifier;
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
            // console.log("----------response", response);
            if (response.hasOwnProperty('entry')) {
                if (response['entry'][0].hasOwnProperty('resource')) {
                    return response['entry'][0]['resource'];
                }
            }
        }).catch(reason =>
            console.log("No response recieved from the server", reason)
        );
        // console.log("patient---", patient);
        if (patient) {
            this.setState({ patient: patient });
            if (patient.hasOwnProperty("name")) {
                var name = '';
                if (patient['name'][0].hasOwnProperty('given')) {
                    patient['name'][0]['given'].map((n) => {
                        name += ' ' + n;
                    });
                    this.setState({ patient_name: name })
                }
            }
            // console.log("patient name----------", this.state.patient_name);
        }
        // console.log("state patient-------", this.state.patient);
        if (communication_request.hasOwnProperty('sender')) {
            let s = await this.getSenderDetails(communication_request);
        }
        if (communication_request.hasOwnProperty('payload')) {
            await this.getDocuments(communication_request['payload']);
        }
        this.setState({ form_load: true });
    }

    async getDocuments(payload) {
        let strings = this.state.contentStrings;
        payload.map((c) => {
            console.log("ccccccc", c);
            if (c.hasOwnProperty('contentReference')) {
                if (c['contentReference']['reference'].replace('#', '')) {

                }
            }
            if (c.hasOwnProperty('contentString')) {
                strings.push(c.contentString)
            }
            this.setState({ contentStrings: strings })
        });
        console.log(this.state.contentStrings)

    }

    // async getDocumentResources(){

    // }
    startLoading() {
        this.setState({ loading: true }, () => {
            this.submit_info();
        })
    }

    async submit_info() {
        let comm_request = await this.getCommunicationRequests();
        console.log(comm_request, 'submitted')
        // var fileInputData = {
        //     "resourceType": "Communication",
        //     "status": "complete",
        //     "identifier": [
        //         {
        //             "use": "official"
        //         }
        //     ],
        //     "payload": [],
        // }
        // if (this.state.files != null) {
        //     for (var i = 0; i < this.state.files.length; i++) {
        //         (function (file) {
        //             let content_type = file.type;
        //             let file_name = file.name;
        //             var reader = new FileReader();
        //             reader.onload = function (e) {
        //                 // get file content  
        //                 fileInputData.payload.push({
        //                     "contentAttachment": {
        //                         "data": reader.result,
        //                         "contentType": content_type,
        //                         "title": file_name,
        //                         "language": "en"
        //                     }
        //                 })
        //             }
        //             reader.readAsBinaryString(file);
        //         })(this.state.files[i])
        //     }
        // }
        // console.log("Resource Json before communication--",fileInputData );
        // // this.props.saveDocuments(this.props.files,fileInputData)
        // this.setState({communicationJson:fileInputData})
        this.setState({loading:false});
    }
    updateDocuments(elementName, object) {
        console.log(elementName, object, 'is it workinggg')
        this.setState({ [elementName]: object })
    }
    async getSenderDetails(communication_request) {
        let sender_obj;
        communication_request['contained'].map((c) => {
            if (c['id'] == communication_request['sender']['reference'].replace('#', '')) {
                // console.log("------------sender", c);
                sender_obj = c;
            }
        });
        if (sender_obj) {
            this.setState({ sender_resource: sender_obj['resourceType'] });
            const sender_res = await this.getSenderResource(sender_obj);
            if (sender_res['resourceType'] == 'Patient' || sender_res['resourceType'] == 'Practitioner') {
                if (sender_res.hasOwnProperty("name")) {
                    var sender_name = '';
                    if (sender_res['name'][0].hasOwnProperty('given')) {
                        sender_res['name'][0]['given'].map((n) => {
                            sender_name += ' ' + n;
                        });
                        this.setState({ sender_name: sender_name });
                    }
                }
            }
            else if (sender_res['resourceType'] == 'Organization') {
                if (sender_res.hasOwnProperty("name")) {
                    this.setState({ sender_name: sender_res['name'] });
                }
            }
            // console.log("sender['name']", this.state.sender_name);
        }
    }

    async getSenderResource(c) {
        var sender_url = this.state.config.provider.fhir_url + "/" + c['resourceType'] + "?identifier=" + c['identifier'][0]['value'];
        console.log("url---------", sender_url);
        const token = await createToken(sessionStorage.getItem('username'), sessionStorage.getItem('password'));
        let sender = await fetch(sender_url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            return response.json();
        }).then((response) => {
            // console.log("----------response", response);
            if (response.hasOwnProperty('entry')) {
                if (response['entry'][0].hasOwnProperty('resource')) {
                    return response['entry'][0]['resource'];
                }
            }
        }).catch(reason =>
            console.log("No response recieved from the server", reason)
        );
        return sender;
    }

    render() {
        let data = this.state.comm_req;
        let content = data.map((d, i) => {
            console.log(d, i);
            if (d.hasOwnProperty("category") && d.hasOwnProperty("subject") && d.hasOwnProperty("contained")) {
                if (d['category'][0]['coding'][0].hasOwnProperty('code') && d['subject'].hasOwnProperty('reference')) {
                    let identifier = '';
                    let patient_obj = d['contained'].map((c) => {
                        if (c.hasOwnProperty('id')) {
                            if (c['id'] == d['subject']['reference'].replace('#', '')) {
                                identifier = c['identifier'][0]['value'];
                            }
                        }
                    })
                    if (identifier) {
                        return (
                            <div key={i} className="main-list">
                                {i + 1}.  {d['category'][0]['coding'][0]['code']} - {identifier}
                                <button className="btn list-btn" onClick={() => this.getPatientDetails(identifier, d, identifier)}>
                                    Review</button>
                            </div>
                        )
                    }
                }
            }
        });
        let requests = this.state.contentStrings.map((request) => {
            if (request) {
                return (
                    <div>
                        {request}
                    </div>
                )
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
                        <div className="left-form" style={{ paddingLeft: "2%", paddingTop: "1%" }}>
                            <div style={{ paddingTop: "10px", color: "#8a6d3b", marginBottom: "10px" }}><strong> Communication Requests </strong></div>
                            <div>{content}</div>
                        </div>
                        {this.state.form_load &&
                            <div className="right-form" style={{ paddingTop: "1%" }} >
                                <div className="data-label">
                                    Patient : <span className="data1">{this.state.patient_name}</span>
                                </div>
                                <div className="data-label">
                                    Sender {this.state.sender_resource} : <span className="data1">{this.state.sender_name}</span>
                                </div>
                                <div className="data-label">
                                    Requested for : <span className="data1">{requests}</span>
                                </div>

                                <DocumentInput
                                    updateCallback={this.updateDocuments}
                                />
                                <button className="submit-btn btn btn-class button-ready" onClick={this.startLoading}>Submit
                                        <div id="fse" className={"spinner " + (this.state.loading ? "visible" : "invisible")}>
                                        <Loader
                                            type="Oval"
                                            color="#fff"
                                            height="15"
                                            width="15"
                                        />
                                    </div>
                                </button>
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