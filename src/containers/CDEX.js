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
import { Input , Checkbox } from 'semantic-ui-react';
import { NotificationContainer, NotificationManager } from 'react-notifications';

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
            communicationRequest: {},
            searchParameter: '',
            observationList: [],
            documentReference: {},
            startDate:'',
            endDate:'',
            recievedDate:'',
            check:false,
            content:[],
            providerOrganization:{},
            payerOrganization:{}
        };
        this.goTo = this.goTo.bind(this);
        this.getCommunicationRequests = this.getCommunicationRequests.bind(this);
        this.displayCommunicataionRequests = this.displayCommunicataionRequests.bind(this);
        this.getPatientDetails = this.getPatientDetails.bind(this);
        this.getSenderDetails = this.getSenderDetails.bind(this);
        this.getSenderResource = this.getSenderResource.bind(this);
        this.startLoading = this.startLoading.bind(this);
        this.updateDocuments = this.updateDocuments.bind(this);
        this.onChangeSearchParameter = this.onChangeSearchParameter.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    goTo(title) {
        window.location = window.location.protocol + "//" + window.location.host +"/" + title;
    }

    componentDidMount() {
        this.displayCommunicataionRequests();
    }

    async getCommunicationRequests() {
        var tempUrl = this.state.config.provider.fhir_url;
        let headers = {
            "Content-Type": "application/json",
        }
        const token = await createToken(sessionStorage.getItem('username'), sessionStorage.getItem('password'));
        console.log(token,'token')
        if(this.props.config.provider.authorized_fhir){
            console.log('The token is : ', token, tempUrl);
            headers['Authorization'] = 'Bearer ' + token
        }
        const fhirResponse = await fetch(tempUrl + "/CommunicationRequest?_count=100000", {
            method: "GET",
            headers: headers
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
        this.setState({ observationList: [] });
        this.setState({ check: false });
        this.setState({ content: [] });

        let f = this.state.files;
        f = null;
        this.setState({ files: f });
        console.log(this.state.files)
        var tempUrl = this.state.config.provider.fhir_url + "/"+patient_id;
        const token= await createToken(sessionStorage.getItem('username'), sessionStorage.getItem('password'));
        let headers={
            "Content-Type": "application/json",
        }
        if(this.props.config.provider.authorized_fhir){
            headers['Authorization'] = 'Bearer ' + token
        }
        let patient = await fetch(tempUrl, {
            method: "GET",
            headers: headers
        }).then(response => {
            return response.json();
        }).then((response) => {
            // console.log("----------response", response);
            let patient = response;
            console.log("patient---", patient);
            if (patient) {
                this.setState({ patient: patient });
                if (patient.hasOwnProperty("name")) {
                    var name = '';
                    if (patient['name'][0].hasOwnProperty('given')) {
                        // patient['name'][0]['given'].map((n) => {
                        //     name += ' ' + n;
                        // });

                        name = patient['name'][0]['given'][0] +" "+ patient['name'][0]['family'];
                        console.log("name---"+name);
                        this.setState({ patient_name: name })
                    }
                }
                console.log("patient name----------", this.state.patient_name,this.state.patient.resourceType+"?identifier="+this.state.patient.identifier[0].value);
            }
        }).catch(reason =>
            console.log("No response recieved from the server", reason)
        );
        // console.log("patient---", patient);
        // if (patient) {
        //     this.setState({ patient: patient });
        //     if (patient.hasOwnProperty("name")) {
        //         var name = '';
        //         if (patient['name'][0].hasOwnProperty('given')) {
        //             // patient['name'][0]['given'].map((n) => {
        //             //     name += ' ' + n;
        //             // });

        //             name = patient['name'][0]['given'][0] + patient['name'][0]['family'];
        //             console.log("name---"+name);
        //             this.setState({ patient_name: name })
        //         }
        //     }
        //     // console.log("patient name----------", this.state.patient_name);
        // }
        // console.log("state patient-------", this.state.patient);
        if (communication_request.hasOwnProperty('sender')) {
            let s = await this.getSenderDetails(communication_request,token);
        }
        if (communication_request.hasOwnProperty('payload')) {
            await this.getDocuments(communication_request['payload']);
        }
        if (communication_request.hasOwnProperty('occurrencePeriod')) {
            // await this.getDocuments(communication_request['payload']);
            this.setState({startDate:communication_request.occurrencePeriod.start})
            this.setState({endDate:communication_request.occurrencePeriod.end})
        }
        if (communication_request.hasOwnProperty('authoredOn')) {
            this.setState({recievedDate:communication_request.authoredOn})
        }
        this.setState({ communicationRequest: communication_request });
        await this.getObservationDetails();
        
        this.setState({ form_load: true });
    }
    randomString() {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 8;
        var randomstring = '';
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
        return randomstring
    }
    async getDocuments(payload) {
        let strings = [];
        payload.map((c) => {
            console.log("ccccccc", c);
            // if (c.hasOwnProperty('contentReference')) {
            //     if (c['contentReference']['reference'].replace('#', '')) {

            //     }
            // }
            // if (c.hasOwnProperty('extension')) {
            //     strings.push(c.extension[0]['valueCodeableConcept']['coding'][0]['display']);
            // }
            if(c.hasOwnProperty('contentString')){
                strings.push(c.contentString)
            }
            this.setState({ contentStrings: strings })
        });


    }
    async getObservationDetails(token) {
        // let searchParameter = this.state.searchParameter;
        // console.log(searchParameter,'search')
        let communicationRequest = this.state.communicationRequest
        let payload=communicationRequest.payload
        let code;
        let patientId = communicationRequest.subject.reference
        let dateParameter;
        payload.map(async (p)=>{
            if(p.hasOwnProperty('extension')){
                code = p.extension[0].valueCodeableConcept.coding[0].code
            }
            if(this.state.endDate !==''){
                dateParameter= "&date=gt"+this.state.startDate+"&date=lt"+this.state.endDate
            }
            else{
                dateParameter= "&date=gt"+this.state.startDate
            }
            console.log(dateParameter,patientId,code,this.state.config.provider.fhir_url)
            var Url  = this.state.config.provider.fhir_url + "/Observation?code:code="+code+"&subject="+patientId+dateParameter;
            console.log(Url,'ttt',Url)
            const token = await createToken(sessionStorage.getItem('username'), sessionStorage.getItem('password'));
            let headers = {
                "Content-Type": "application/json",
            }
            if(this.props.config.provider.authorized_fhir){
                headers['Authorization'] = 'Bearer ' + token
            }
            let observations = await fetch(Url, {
                method: "GET",
                headers: headers
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
            console.log(observations, 'obss')
            let observationList = this.state.observationList
            if(observations !== undefined ){
                if ("entry" in observations) {
                    observations.entry.map((observation) => {
                        if (observationList.indexOf(observation.resource) == -1) {
                            observationList.push(observation.resource)
                        }
                    })
                }
            }
            // observationList.push(observations)
            this.setState({observationList:observationList})
            // console.log(observationList,'ooo')
        })
    }

    startLoading() {
        this.setState({ loading: true }, () => {
            this.submit_info();
        })
    }

    async submit_info() {
        let randomString = this.randomString()
        let communicationRequest = this.state.communicationRequest;
        console.log(this.state.communicationRequest, 'submitted', communicationRequest.sender.reference)
        // let communicationRequestJson = {};
        let doc_ref = {};
        this.setState({ loading: false });
        // var documentReferenceJson = {
        //     "resourceType": "DocumentReference",
        //     "identifier": [
        //         {
        //             "system": "urn:ietf:rfc:3986",
        //             "value": randomString
        //         }
        //     ],
        //     "status": "current",
        //     "docStatus": "preliminary",
        //     "content": [],
        //     "subject": {
        //         "reference": "Patient/" + this.state.patient.id
        //     },
        // }
        console.log(this.state.payerOrganization,this.state.providerOrganization)
        var date = new Date()
        var authoredOn=date.toISOString()
        var fileInputData = {
            "resourceType": "Communication",
            "status": "completed",
            "subject": {
                "reference": this.state.patient.resourceType+"?identifier="+this.state.patient.identifier[0].value
            },
            "recipient": [
                {
                    "reference": this.state.payerOrganization.resourceType+"?identifier="+this.state.payerOrganization.identifier[0].value
                }
            ],
            "sender": {
                "reference": this.state.providerOrganization.resourceType+"?identifier="+this.state.providerOrganization.identifier[0].value                
            },
            "occurrencePeriod": communicationRequest.occurrencePeriod,
            "authoredOn": authoredOn,
            "category": communicationRequest.category,
            // "contained": communicationRequest.contained,
            "basedOn": [
                {
                    'reference': this.state.communicationRequest.resourceType+"?identifier="+this.state.communicationRequest.identifier[0].value
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

        console.log(this.state.patient.id, 'iddd')
        // let content = this.state.content;
        for (var j = 0; j < this.state.content.length; j++) {
            (function (contentString) {
                // let url = observationList[j];
                fileInputData.payload.push({
                    "contentString":contentString})
            })(this.state.content[j])
        }
        console.log(fileInputData,'data')
        // var documentReferenceUrl = this.state.config.provider.fhir_url + "/DocumentReference";
        // let documentReference = await fetch(documentReferenceUrl, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         'Authorization': 'Bearer ' + token
        //     },
        //     body: JSON.stringify(documentReferenceJson)
        // }).then(response => {
        //     return response.json();
        // }).then((response) => {
        //     // console.log("----------response", response);
        //     if (response.hasOwnProperty('entry')) {
        //         return response
        //     }
        //     this.setState({ documentReference: response })
        // }).catch(reason =>
        //     console.log("No response recieved from the server", reason)
        // );
        // console.log(this.state.documentReference, 'opoopods', documentReference)

        // communicationRequestJson["resourceType"] = communicationRequest.resourceType
        // communicationRequestJson["id"] = communicationRequest.id
        // communicationRequestJson["identifier"] = communicationRequest.identifier

        // doc_ref["resourceType"] = this.state.documentReference.resourceType
        // doc_ref["id"] = this.state.documentReference.id
        // doc_ref["identifier"] = this.state.documentReference.identifier
        // fileInputData.payload.push({ "contentReference": { "reference": "#" + this.state.documentReference.id } })

        // fileInputData.contained.push(JSON.stringify(communicationRequest))
        // fileInputData.contained.push(JSON.stringify(this.state.patient))
        // fileInputData.contained.push(doc_ref)

        if (this.state.files != null) {
            for (var i = 0; i < this.state.files.length; i++) {
                (function (file) {
                    let content_type = file.type;
                    let file_name = file.name;
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        // get file content  
                        fileInputData.payload.push({
                            // "cdex-payload-query-string":"",
                            //  "cdex-payload-clinical-note-type":[],
                            "content": {
                                "data": reader.result,
                                "contentType": content_type,
                                "title": file_name
                            }
                        })
                    }
                    reader.readAsBinaryString(file);
                })(this.state.files[i])
            }
        }
        console.log("Resource Json before communication--", fileInputData);
        let headers={
            "Content-Type": "application/json",
        }
        const token = await createToken(sessionStorage.getItem('username'), sessionStorage.getItem('password'));
        if(this.props.config.payer.authorizedPayerFhir){
            headers['Authorization'] = 'Bearer ' + token
        }
        var communicationUrl = this.state.config.payer.fhir_url + "/Communication";
        let Communication = await fetch(communicationUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(fileInputData)
        }).then(response => {
            return response.json();
        }).then((response) => {
            console.log("----------response", response);
            if (response.hasOwnProperty('entry')) {
                return response
            }
            NotificationManager.success('Communication has been posted to payer successfully.', 'Success');
            // this.setState({response})
            console.log(response, 'res')
        }).catch(reason =>
            console.log("No response recieved from the server", reason)
        );
        // this.props.saveDocuments(this.props.files,fileInputData)
        this.setState({communicationJson:fileInputData})
        this.setState({ loading: false });
    }
    onChangeSearchParameter(event) {
        let searchParameter = this.state.searchParameter;
        searchParameter = event.target.value
        this.setState({ searchParameter: searchParameter });
        this.getObservationDetails();
    }
    handleChange(observation,event) {
        let check = this.state.check;
        let value;
        console.log(event.target.checked,"is it true")
        check = event.target.checked
        this.setState({ check: check });
        let content = this.state.content
        value = observation.code.coding[0].display+": "+observation.valueQuantity.value+" "+observation.valueQuantity.unit
        
        // this.state.observationList.map((observation)=>{
        //     value = observation.valueQuantity.value +observation.valueQuantity.unit
        //     if (content.indexOf(value) == -1) {
        //         content.push(value)
        //     }
        // })
        if(content.indexOf(value)==-1 && check == true){
            content.push(value)
        }
        else {
            var index = content.indexOf(value);
            if (index !== -1){
                content.splice(index, 1);
            }
            // content.pop(value)
        }
        console.log(content,'please')
        this.setState({content:content})
        

    }
    updateDocuments(elementName, object) {
        this.setState({ [elementName]: object })
    }
    async getSenderDetails(communication_request,token) {
        let sender_obj;
        let senderreference;
        let recipientReference;
        console.log(communication_request,'comm')
        if(communication_request.hasOwnProperty('sender')){
            senderreference = communication_request.sender.reference
        }
        if(communication_request.hasOwnProperty('recipient')){
            recipientReference = communication_request.recipient[0].reference
        }
        // communication_request['contained'].map((c) => {
        //     if (c['id'] == communication_request['sender']['reference'].replace('#', '')) {
        //         // console.log("------------sender", c);
        //         sender_obj = c;
        //     }
        // });
        var tempUrl = this.state.config.provider.fhir_url;
        // const token = await createToken(sessionStorage.getItem('username'), sessionStorage.getItem('password'));
        let headers={
            "Content-Type": "application/json",
        }
        if(this.props.config.provider.authorized_fhir){
            headers['Authorization'] = 'Bearer ' + token
        }
        const fhirResponse = await fetch(tempUrl +"/"+ senderreference, {
            method: "GET",
            headers: headers
        }).then(response => {
            console.log("Recieved response", response);
            return response.json();
        }).then((response) => {
            console.log("----------response", response);
            return response;
        }).catch(reason =>
            console.log("No response recieved from the server", reason)
        );
        // return fhirResponse;
        console.log(fhirResponse,'respo')
        if (fhirResponse) {
            this.setState({payerOrganization:fhirResponse})
            this.setState({ sender_name:  fhirResponse.name});
            // this.setState({ sender_resource: fhirResponse['resourceType'] });
            // const sender_res = await this.getSenderResource(sender_obj);
            // if (sender_res['resourceType'] == 'Patient' || sender_res['resourceType'] == 'Practitioner') {
            //     if (sender_res.hasOwnProperty("name")) {
            //         var sender_name = '';
            //         if (sender_res['name'][0].hasOwnProperty('given')) {
            //             sender_res['name'][0]['given'].map((n) => {
            //                 sender_name += ' ' + n;
            //             });
            //             this.setState({ sender_name: sender_name });
            //         }
            //     }
            // }
            // else 
            // if (sender_obj['resourceType'] === 'Organization') {
            //     if (sender_obj.hasOwnProperty("identifier")) {
            //         let sender = sender_obj['identifier'][0]['value'];
            //         this.setState({ sender_name:  sender});
            //     }
            // }
            // console.log("sender['name']", this.state.sender_name);
        }
        const recipientResponse = await fetch(tempUrl +"/"+recipientReference, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            console.log("Recieved response", response);
            return response.json();
        }).then((response) => {
            console.log("----------response", response);
            return response;
        }).catch(reason =>
            console.log("No response recieved from the server", reason)
        );
        // return fhirResponse;
        console.log(recipientResponse,'rest')
        if (fhirResponse) {
            this.setState({providerOrganization:recipientResponse})
        }


    }

    async getSenderResource(c) {
        var sender_url = this.state.config.provider.fhir_url + "/" + c['resourceType'] + "?identifier=" + c['identifier'][0]['value'];
        console.log("url---------", sender_url);
        const token = await createToken(sessionStorage.getItem('username'), sessionStorage.getItem('password'));
        let headers={
            "Content-Type": "application/json",
        }
        if(this.props.config.provider.authorized_fhir){
            headers['Authorization'] = 'Bearer ' + token
        }
        let sender = await fetch(sender_url, {
            method: "GET",
            headers: headers
        }).then(response => {
            return response.json();
        }).then((response) => {
            console.log("----------response", response);
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
        console.log( this.state.comm_req,'how may')
        let content = data.map((d, i) => {
            // console.log(d, i);
            let startDate = d["occurrencePeriod"]['start']
            let endDate;
            if(d['occurrencePeriod'].hasOwnProperty("end")){
            endDate = d["occurrencePeriod"]['end']
            }
            else{
                endDate="No End Date"
            }
            let recievedDate = d["authoredOn"]
            console.log(startDate.substring(0,10),'stdate')
            if (d.hasOwnProperty("subject") ) {
                let patientId = d['subject']['reference'];
                // let patient_obj = d['contained'].map((c) => {
                //     if (c.hasOwnProperty('id')) {
                //         if (c['id'] == d['subject']['reference'].replace('#', '')) {
                //             patientId = c['identifier'][0]['value'];
                //         }
                //     }
                // })
                return (
                    <div key={i} className="main-list">
                        {i + 1}.  {d['resourceType']} (#{d['id']}) for {patientId} Start Date ({startDate.substring(0,10)}),End Date({endDate.substring(0,10)}), Recieved On ({recievedDate.substring(0,10)})
                        <button className="btn list-btn" onClick={() => this.getPatientDetails(patientId, d, patientId)}>
                            Review</button>
                    </div>
                )
            }
        });
        let requests = this.state.contentStrings.map((request, key) => {
            if (request) {
                return (
                    <div key={key}>
                        {request}
                    </div>
                )

            }
        });
        let observations = this.state.observationList.map((observation, key) => {
            if (observation) {
                return (
                    <div key={key}>
                        <label for="ui checkbox">  {observation.code.coding[0].display+":"}{observation.valueQuantity.value+" "+observation.valueQuantity.unit}</label>
                        <input 
                            className='ui checkbox'
                            name = {key}
                            type="checkbox"
                            defaultChecked={this.state.check}
                            value={this.state.check}
                            onChange={(e)=>this.handleChange(observation,e)}
                        />
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
                            <div className="menu_conf" onClick={() => this.goTo('provider_request')}>
                                <i style={{ paddingLeft: "5px", paddingRight: "7px" }} className="fa fa-home"></i>
                                Home</div>
                            <div className="menu_conf" onClick={() => this.goTo('configuration')}>
                            <i style={{ paddingLeft: "5px", paddingRight: "7px" }} className="fa fa-cog"></i>
                            Configuration</div>
                            
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
                                   Start Date : <span className="data1">{this.state.startDate}</span>
                                </div>
                                <div className="data-label">
                                   End Date : <span className="data1">{this.state.endDate}</span>
                                </div>
                                <div className="data-label">
                                   Recieved Date : <span className="data1">{this.state.recievedDate}</span>
                                </div>
                                <div className="data-label">
                                    Requested for : <span className="data1">{requests}</span>
                                </div>
                                {this.state.observationList.length >0 &&
                                    <div className="data-label">
                                        Obsersvation : <span className="data1">{observations}</span>
                                    </div>
                                }
                                
                                {/* <div className='data-label'>
                                    <div>Search Observations form FHIR
                                        <small> - Enter a search keyword. (ex: height)</small>
                                    </div>
                                    <Input style={{ width: "100%" }}
                                        icon='search'
                                        placeholder='Search'
                                        className='ui fluid  input' type="text" name="searchParameter"
                                        onChange={this.onChangeSearchParameter}
                                    >
                                    </Input>
                                    // {/* <button style={{ width:"30%", float:"left"}}className="btn list-btn" onClick={() => this.getObservationDetails()}>
                                    //         Search</button> 
                                    {this.state.observationList.length > 0 &&
                                        <div className="data1">Found {this.state.observationList.length} observation(s)</div>
                                    }
                                    {this.state.observationList.length === 0 &&
                                        <div className="data1">When no observations found. Please upload requested documents.</div>
                                    }
                                </div> */}
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
                                <NotificationContainer />
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