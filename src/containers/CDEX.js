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
import { Input } from 'semantic-ui-react';



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
            contentStrings: [],
            communicationRequest:{},
            searchParameter:'',
            observationList:[],
            documentReference:{}
        };
        this.goHome = this.goHome.bind(this);
        this.getCommunicationRequests = this.getCommunicationRequests.bind(this);
        this.displayCommunicataionRequests = this.displayCommunicataionRequests.bind(this);
        this.getPatientDetails = this.getPatientDetails.bind(this);
        this.getSenderDetails = this.getSenderDetails.bind(this);
        this.getSenderResource = this.getSenderResource.bind(this);
        this.startLoading = this.startLoading.bind(this);
        this.updateDocuments = this.updateDocuments.bind(this);
        this.onChangeSearchParameter = this.onChangeSearchParameter.bind(this);

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
        this.setState({communicationRequest:communication_request});
        this.setState({ form_load: true });
    }
    randomString() {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 8;
        var randomstring = '';
        for (var i=0; i<string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum,rnum+1);
        }
        return randomstring
    }
    async getDocuments(payload) {
        let strings = [];
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


    }
    async getObservationDetails(){
        let searchParameter =this.state.searchParameter
        // console.log(searchParameter,'search')
        var tempUrl = this.state.config.provider.fhir_url + "/Observation?code:text=" + searchParameter;
        const token = await createToken(sessionStorage.getItem('username'), sessionStorage.getItem('password'));
        let observations = await fetch(tempUrl, {
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
                return response
            }
            // console.log(response,'res')
        }).catch(reason =>
            console.log("No response recieved from the server", reason)
        );
        console.log(observations,'obss')
        let observationUrls=this.state.observationList
        if(observations!=undefined){
            if("entry" in observations){
                observations.entry.map((observation)=>{
                    if(observationUrls.indexOf(observation.fullUrl)==-1){
                        observationUrls.push(observation.fullUrl)
                    }
                })
            }
        }
        else{
            console.log('enter correct search Parameter')
        }
       
        this.setState({observationList:observationUrls})
        console.log(this.state.observationList)
    }

    startLoading() {
        this.setState({ loading: true }, () => {
            this.submit_info();
        })
    }

    async submit_info() {
        let randomString=this.randomString()
        let communicationRequest= this.state.communicationRequest;
        console.log(this.state.communicationRequest,'submitted',communicationRequest.sender.reference)
        let communicationRequestJson={};
        let doc_ref={};
        this.setState({ loading: false });
        var documentReferenceJson={
            "resourceType" : "DocumentReference",
            "identifier": [
                {
                  "system": "urn:ietf:rfc:3986",
                  "value": randomString
                }
              ],
              "status": "current",
              "docStatus": "preliminary",
              "content": [],
              "subject": {
                "reference": "Patient/"+this.state.patient.id
              },
        }
        
        var fileInputData = {
            "resourceType": "Communication",
            "status": "completed",
            "subject":{
                "reference":communicationRequest.subject.reference
            },
            "recipient": [
                {
                    "reference": communicationRequest.sender.reference
                }
            ],
            "sender": {
                "reference": communicationRequest.recipient[0].reference
            },
            "occurrencePeriod":communicationRequest.occurrencePeriod,
            "authoredOn":communicationRequest.authoredOn,
            "category":communicationRequest.category,
            "contained":communicationRequest.contained,
            "basedOn":[
                {
                    'reference':"#"+communicationRequest.id
                }
            ],
            "identifier": [
                {
                    "system": "http://www.providerco.com/communication",
                    "value": randomString
                }
            ],
            "payload": []
        }
        
        console.log(this.state.patient.id,'iddd')
        let observationList=this.state.observationList;
        for(var j =0;j<this.state.observationList.length;j++){
            (function (file) {
                let url = observationList[j];
                documentReferenceJson.content.push({
                        "attachment": {
                          "contentType": "application/hl7-v3+xml",
                          "language": "en-US",
                          "url": url,
                          "title": "Physical",
                        },
                        "format": {
                          "system": "urn:oid:1.3.6.1.4.1.19376.1.2.3",
                          "code": "urn:ihe:pcc:handp:2008",
                          "display": "History and Physical Specification"
                        }
                })
            })(observationList[j])
        }
        var documentReferenceUrl = this.state.config.provider.fhir_url + "/DocumentReference";
        const token = await createToken(sessionStorage.getItem('username'), sessionStorage.getItem('password'));
        let documentReference = await fetch(documentReferenceUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            body:JSON.stringify(documentReferenceJson)
        }).then(response => {
            return response.json();
        }).then((response) => {
            // console.log("----------response", response);
            if (response.hasOwnProperty('entry')) {
                return response
            }
            this.setState({documentReference:response})
        }).catch(reason =>
            console.log("No response recieved from the server", reason)
        );
        console.log(this.state.documentReference,'opoopods',documentReference)
        
        communicationRequestJson["resourceType"]=communicationRequest.resourceType
        communicationRequestJson["id"]=communicationRequest.id
        communicationRequestJson["identifier"]=communicationRequest.identifier
        
        doc_ref["resourceType"]=this.state.documentReference.resourceType
        doc_ref["id"]=this.state.documentReference.id
        doc_ref["identifier"]=this.state.documentReference.identifier
        fileInputData.payload.push({"contentReference":{"reference":"#"+this.state.documentReference.id}})

        fileInputData.contained.push(communicationRequestJson)
        fileInputData.contained.push(doc_ref)

        if (this.state.files != null) {
            for (var i = 0; i < this.state.files.length; i++) {
                (function (file) {
                    let content_type = file.type;
                    let file_name = file.name;
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        // get file content  
                        fileInputData.payload.push({
                            "contentAttachment": {
                                "data": reader.result,
                                "contentType": content_type,
                                "title": file_name,
                                "language": "en"
                            }
                        })
                    }
                    reader.readAsBinaryString(file);
                })(this.state.files[i])
            }
        }
        console.log("Resource Json before communication--",fileInputData );
        var communicationUrl = this.state.config.payer.fhir_url + "/Communication";
        let Communication = await fetch(communicationUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            body:JSON.stringify(fileInputData)
        }).then(response => {
            return response.json();
        }).then((response) => {
            console.log("----------response", response);
            if (response.hasOwnProperty('entry')) {
                return response
            }
            // this.setState({response})
            console.log(response,'res')
        }).catch(reason =>
            console.log("No response recieved from the server", reason)
        );
        // // this.props.saveDocuments(this.props.files,fileInputData)
        // this.setState({communicationJson:fileInputData})
        this.setState({loading:false});
    }
    onChangeSearchParameter(event) {
        let searchParameter = this.state.searchParameter;
        searchParameter = event.target.value
        this.setState({ searchParameter: searchParameter})
    }
    updateDocuments(elementName, object) {
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
            // console.log(d, i);
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
            if (request ) {
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
                                <div>
                                    <div className='data-label'>Search Parameter</div>
                                        <div className="dropdown">
                                            <Input className='ui fluid  input' type="text" name="searchParameter"
                                                onChange={this.onChangeSearchParameter}
                                                >
                                            </Input>
                                            <button className="btn list-btn" onClick={() => this.getObservationDetails()}>
                                                Search</button>
                                        </div>
                                </div>
                                <div>
                                <DocumentInput
                                    updateCallback={this.updateDocuments}
                                />
                                </div>
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