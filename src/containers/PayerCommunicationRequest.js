import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';
// import { DateInput } from 'semantic-ui-calendar-react';
import { withRouter } from 'react-router-dom';
import Client from 'fhir-kit-client';
import 'font-awesome/css/font-awesome.min.css';
import "react-datepicker/dist/react-datepicker.css";
// import DisplayBox from '../components/DisplayBox';
import 'font-awesome/css/font-awesome.min.css';
import '../index.css';
import '../components/consoleBox.css';
import Loader from 'react-loader-spinner';
import config from '../globalConfiguration.json';
import { KEYUTIL } from 'jsrsasign';
import { createToken } from '../components/Authentication';
import { SelectPayer } from '../components/SelectPayer';
import { connect } from 'react-redux';
import moment from "moment";
import { SelectPatient } from '../components/SelectPatient';
import { DropdownPurpose } from '../components/DropdownPurpose';


let now = new Date();
let occurenceStartDate = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0, 0, 0)).toISOString();
let occurenceEndDate = moment(occurenceStartDate).add(8, "days").subtract(1, "seconds").toISOString();
let yesterday = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0, 0, 0));
let payloadStartDate = moment(yesterday).subtract(8, "days").toISOString();
let payloadEndDate = moment(payloadStartDate).add(8, "days").subtract(1, "seconds").toISOString();


var requesterPayerFhir = "http://localhost:8080/hapi-fhir-jpaserver/fhir"
// var senderPayerFhir = this.props.config.payer.fhir_url

const types = {
  error: "errorClass",
  info: "infoClass",
  debug: "debugClass",
  warning: "warningClass"
}

class CommunicationRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patient: null,
      fhirUrl: (sessionStorage.getItem('username') === 'john') ? this.props.config.provider.fhir_url : 'https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca',
      accessToken: '',
      scope: '',
      payer: '',
      patientId: sessionStorage.getItem('patientId'),
      payerId: "6677829",
      practitionerId: "9941339229",
      resourceType: null,
      resourceTypeLT: null,
      encounterId: '',
      coverageId: '',
      encounter: null,
      request: "coverage-requirement",
      response: null,
      token: null,
      oauth: false,
      treating: null,
      loading: false,
      logs: [],
      cards: [],
      medicationInput: null,
      medication: null,
      medicationStartDate: '',
      medicationEndDate: '',
      hook: null,
      resource_records: {},
      keypair: KEYUTIL.generateKeypair('RSA', 2048),
      prior_auth: false,
      dosageAmount: null,
      color: 'grey',
      validatePatient: false,
      validateFhirUrl: false,
      validateAccessToken: false,
      validateIcdCode: false,
      req_active: 'active',
      auth_active: '',
      prefetchData: {},
      prefetch: false,
      frequency: null,
      loadCards: false,
      showMenu: false,
      service_code: "",
      category_name: "",
      communicationList: [],
      documents: [],
      reqId: '',
      vitalSigns: [],
      reasons: '',
      docType: '',
      timePeriod: '',
      payloadtimePeriod: '',
      occurenceStartDate: occurenceStartDate,
      occurenceEndDate: occurenceEndDate,
      payloadStartDate: payloadStartDate,
      payloadEndDate: payloadEndDate,
      isDocument: true,
      queries: [{ query: "", searchString: "", resource: "" }],
      requirementSteps: [{ 'step_no': 1, 'step_str': 'Communicating with CRD system.', 'step_status': 'step_loading' },
      {
        'step_no': 2, 'step_str': 'Retrieving the required 4 FHIR resources on crd side.', 'step_status': 'step_not_started'
      },
      { 'step_no': 3, 'step_str': 'Executing HyperbaricOxygenTherapy.cql on cds server and generating requirements', 'step_status': 'step_not_started', 'step_link': 'https://github.com/mettlesolutions/coverage_determinations/blob/master/src/data/Misc/Home%20Oxygen%20Therapy/homeOxygenTherapy.cql', 'cql_name': 'homeOxygenTheraphy.cql' },
      { 'step_no': 4, 'step_str': 'Generating cards based on requirements .', 'step_status': 'step_not_started' },
      { 'step_no': 5, 'step_str': 'Retrieving Smart App', 'step_status': 'step_not_started' }],
      errors: {},
      loadingSteps: false,
      dataLoaded: false,
      isClinicalNote: true,
      isDataElement: false,
      patientResource: '',
      senderOrganizationIdentifier: '',
      senderOrganizationResource: '',
      communicationRequestIdentifier: this.getGUID(),
      payer: '',
      requesterOrganizationIdentifier: "b1ddf812-1fdd-3adf-b1d5-32cc8bd07ebb",
      requesterCommRequest: '',
      purpose:'',
      note:''
        }


    this.requirementSteps = [
      { 'step_no': 1, 'step_str': 'Communicating with CRD system.', 'step_status': 'step_loading' },
      { 'step_no': 2, 'step_str': 'Fetching required FHIR resources at CRD', 'step_status': 'step_not_started' },
      { 'step_no': 3, 'step_str': 'Executing CQL at CDS and generating requirements', 'step_status': 'step_not_started', 'step_link': 'https://github.com/mettlesolutions/coverage_determinations/blob/master/src/data/Misc/Home%20Oxygen%20Therapy/homeOxygenTherapy.cql', 'cql_name': 'homeOxygenTheraphy.cql' },
      { 'step_no': 4, 'step_str': 'Generating cards based on requirements .', 'step_status': 'step_not_started' },
      { 'step_no': 5, 'step_str': 'Retrieving Smart App', 'step_status': 'step_not_started' }];
    this.currentstep = 0;
    this.validateMap = {
      status: (foo => { return foo !== "draft" && foo !== "open" }),
      code: (foo => { return !foo.match(/^[a-z0-9]+$/i) })
    };
    this.startLoading = this.startLoading.bind(this);
    this.submit_info = this.submit_info.bind(this);

    this.onClickLogout = this.onClickLogout.bind(this);
    this.consoleLog = this.consoleLog.bind(this);
    // this.readFHIR = this.readFHIR.bind(this);
    this.onClickMenu = this.onClickMenu.bind(this);
    this.redirectTo = this.redirectTo.bind(this);
    this.updateStateElement = this.updateStateElement.bind(this);
    this.getToken = this.getToken.bind(this);
    this.onChangeNote = this.onChangeNote.bind(this);
    this.onChangeOrganizationIdentifier = this.onChangeOrganizationIdentifier.bind(this);

  }
  consoleLog(content, type) {
    let jsonContent = {
      content: content,
      type: type
    }
    this.setState(prevState => ({
      logs: [...prevState.logs, jsonContent]
    }))
  }

  //   let queries = this.state.queries;
  //   console.log("queries--",queries)
  //   queries= queries.push({query:"", searchString:"",resource:""});
  //   this.setState({queries:queries})
  //   console.log("qState queries--,",this.state.queries)
  updateStateElement = (elementName, value) => {
    console.log("event----------", value, elementName)
    this.setState({ [elementName]: value })
    // console.log(this.state.vitalSigns, 'yooopo')
    // if (value.hasOwnProperty('value')) {
    //   // this.setState({ docType: event });
    // }
    // this.set 
  }


  async getToken(grant_type, client_id, client_secret) {
    let params = {}
    const tokenUrl = config.token_url;
    params['grant_type'] = grant_type
    params['client_id'] = client_id
    params['client_secret'] = client_secret
    const searchParams = Object.keys(params).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: searchParams
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        const token = response ? response.access_token : null;
        if (token) {
          console.log("Successfully retrieved token", types.info);
        } else {
          console.log("Failed to get token", types.warning);
          if (response.error_description) {
            console.log(response.error_description, types.error);
          }
        }
        return token;

      })
      .catch(reason => {
        console.log("Failed to get token", types.error, reason);
        console.log("Bad request");
      });
    //    let t = await tokenResponse
    // console.log("tokenResponse:",t)
    return tokenResponse;
  }

  validateForm() {
    let formValidate = true;
    if (this.state.patientId === '') {
      formValidate = false;
      this.setState({ validatePatient: true });
    }

    if (this.state.practitionerId === '') {
      formValidate = false;
      this.setState({ validatePractitioner: true });
    }

    if (this.state.payerId === '') {
      formValidate = false;
      this.setState({ validatePayer: true });
    }

    return formValidate;
  }

  startLoading() {
    // if (this.validateForm()) {
    this.setState({ loading: true }, () => {
      this.submit_info();
    })
    // }
  }

  async componentDidMount() {

    let token = await this.getToken(config.payerA.grant_type, config.payerA.client_id, config.payerA.client_secret);
    token = "Bearer " + token;
    var myHeaders = new Headers({
      "Content-Type": "application/json",
      "authorization": token,
    });
    // var url = this.props.config.provider.fhir_url + '/' + 'Patient' + "/" + this.state.patientId;
    var url = config.payerA.fhir_url + "/Organization/2"
    let organization = await fetch(url, {
      method: "GET",
      headers: myHeaders
    }).then(response => {
      // console.log("response----------",response);
      return response.json();
    }).then((response) => {
      // console.log("----------response", response);
      this.setState({ senderOrganizationIdentifier: response.identifier[0].value })
      this.setState({ senderOrganizationResource: response })
      this.setState({ prefetchloading: false });
      return response;
    }).catch(reason =>
      console.log("No response recieved from the server", reason)
    );


  }

  onClickMenu() {
    var showMenu = this.state.showMenu;
    this.setState({ showMenu: !showMenu });
  }

  async getResources(resource, identifier) {
    var url = config.payerA.fhir_url + "/" + resource + "?identifier=" + identifier;
    let token;
    let headers = {
      "Content-Type": "application/json",
    }
    token = await this.getToken(config.payerA.grant_type, config.payerA.client_id, config.payerA.client_secret);
    if (config.payerA.authorizedPayerFhir) {
      headers['Authorization'] = 'Bearer ' + token
    }
    let sender = await fetch(url, {
      method: "GET",
      headers: headers
    }).then(response => {
      return response.json();
    }).then((response) => {
      // console.log("----------response", response);
      return response;
    }).catch(reason =>
      console.log("No response recieved from the server", reason)
    );
    // console.log(sender, 'sender')
    return sender;
  }


  redirectTo(path) {
    window.location = `${window.location.protocol}//${window.location.host}/` + path;
  }
  onClickLogout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('fhir_url');
    this.props.history.push('/login');
  }



  async createFhirResource(json, resourceName, url, user, claim = false) {
    //  console.log("this.state.procedure_code")
    // console.log(this.state.procedure_code)
    this.setState({ loading: true });

    try {
      // if (claim == true) {
      //   json.about = [{
      //     "reference": "Claim?identifier=" + this.state.claimid
      //   }];
      // }
      const fhirClient = new Client({ baseUrl: url });
      let token;
      // if (user == 'provider') {
      //   console.log('using Provider Client Credentials')

      //   if (this.props.config.provider.grant_type == 'client_credentials') {
      //     token = await createToken(this.props.config.provider.grant_type, user, this.props.config.provider.username, this.props.config.provider.password);
      //   }
      //   else {
      //     token = await createToken(this.props.config.provider.grant_type, user, this.props.config.provider.username, this.props.config.provider.password);

      //   }
      //   if (this.props.config.provider.authorized_fhir) {
      //     fhirClient.bearerToken = token;
      //   }
      // }
      // else if (user == 'payer') {
      //   console.log('using payer Client Credentials')
      //   if (this.props.config.payer.grant_type == 'client_credentials') {
      //     token = await createToken(this.props.config.payer.grant_type, user, sessionStorage.getItem('username'), sessionStorage.getItem('password'));
      //   }
      //   else {
      //     token = await createToken(this.props.config.payer.grant_type, user, sessionStorage.getItem('username'), sessionStorage.getItem('password'));
      //   }
      //   if (this.props.config.payer.authorizedPayerFhir) {
      //     fhirClient.bearerToken = token;
      //   }
      // }
      token = await this.getToken(config.payerA.grant_type, config.payerA.client_id, config.payerA.client_secret);
      fhirClient.bearerToken = token;

      console.log('The json is : ', json);
      let data = fhirClient.create({
        resourceType: resourceName,
        body: json,
        headers: { "Content-Type": "application/fhir+json" }
      }).then((data) => {
        console.log("Data::", data);
        this.setState({ requesterCommRequest: data })
        if (user == 'otherPayer') {
          this.setState({ dataLoaded: true })
          var commReqId = data.entry[0].response.location.split('/')[1]
          this.setState({ reqId: commReqId })
        }
        this.setState({ loading: false });
        return data;
      }).catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      })
      return data
    } catch (error) {
      console.error('Unable to create resource', error.message);
      this.setState({ loading: false });
      this.setState({ dataLoaded: false })
    }
  }

  getGUID = () => {
    let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    return 'mettles-' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }


  async submit_info() {

    try {
      let requesterOrganizationBundle = await this.getResources('Organization', this.state.requesterOrganizationIdentifier)
      let requesterOrganization = ''
      if (requesterOrganizationBundle.hasOwnProperty('entry')) {
        requesterOrganization = requesterOrganizationBundle.entry[0].resource
      }
      console.log(requesterOrganization, 'pleasssssssss', requesterOrganization.id)
      // var request_identifier = 
      this.setState({ dataLoaded: false, reqId: '' })
      // let request_identifier = await this.getGUID();
      // this.setState({communicationRequestIdentifier:request_identifier})
      let communicationRequestBundle = {
        "resourceType": "Bundle",
        "id": 'bundle-transaction',
        "type": "transaction",
        "entry": []
      }
      var date = new Date()
      var currentDateTime = date.toISOString()
      let commRequest = {
        "resourceType": "CommunicationRequest",
        "id": "1",
        "status": "active",
        "subject": {
          "reference": "Patient/" + this.state.patientResource.id
        },
        "identifier": [
          {
            "system": "http://www.jurisdiction.com/insurer/123456",
            "value": this.state.communicationRequestIdentifier
          }
        ],
        "authoredOn": currentDateTime,
        "payload": [
          {
            "extension": [
              {
                "url": "http://hl7.org/fhir/us/davinci-cdex/StructureDefinition/cdex-payload-clinical-note-type",
                "valueCodeableConcept": {
                  "coding": [
                    {
                      "system": "http://hl7.org/fhir/us/davinci-pcde/CodeSystem/PCDEDocumentCode",
                      "code": "pcde"
                    }
                  ]
                }
              }
            ],
            "contentString": "Please send previous coverage information."
          }
        ],
        "requester": {
          "reference": "Organization/" + requesterOrganization.id
        },
        "recipient": [
          {
            "reference": "Organization/" + requesterOrganization.id
          }
        ],
        "sender": {
          "reference": "Organization/" + this.state.senderOrganizationResource.id
        }
      }
      communicationRequestBundle.entry.push({
        resource: commRequest,
        'request': {
          "method": "POST",
          "url": "CommunicationRequest",
          "ifNoneExist": "identifier=" + this.state.communicationRequestIdentifier
        }

      })


      let requesterCommRequest = await this.createFhirResource(commRequest, 'CommunicationRequest', config.payerA.fhir_url, 'payer', true)
      console.log()

      let bundle = {
        "resourceType": "Bundle",
        "id": 'bundle-transaction',
        "type": "transaction",
        "entry": []
      }
      bundle.entry.push({
        'resource': requesterCommRequest,
        'request': {
          "method": "POST",
          "url": "CommunicationRequest",
          "ifNoneExist": "identifier=" + this.state.communicationRequestIdentifier
        }
      })
      bundle.entry.push({
        'resource': this.state.patientResource,
        'request': {
          "method": "POST",
          "url": "Patient",
          "ifNoneExist": "identifier=" + this.state.patientResource.identifier[0].value
        }
      })
      bundle.entry.push({
        'resource': requesterOrganization,
        'request': {
          "method": "POST",
          "url": "Organization",
          "ifNoneExist": "identifier=" + requesterOrganization.identifier[0].value
        }
      })
      bundle.entry.push({
        'resource': this.state.senderOrganizationResource,
        'request': {
          "method": "POST",
          "url": "Organization",
          "ifNoneExist": "identifier=" + this.state.senderOrganizationResource.identifier[0].value
        }
      })


      let response = await this.createFhirResource(bundle, '', config.payerB.fhir_url, 'otherPayer', true)
      console.log(response, 'comm request created')
      // let res_json = {}
      // this.setState({ dataLoaded: false, reqId: '' })







      // let communication = await this.createFhirResource(provider_req_json, 'CommunicationRequest', this.props.config.payer.fhir_url, 'payer', true)

      // console.log(commRequest, 'yess')
      // console.log(communication, 'yess plese')
      // sessionStorage.setItem('patientId', this.state.patientId)
      // sessionStorage.setItem('practitionerId', this.state.practitionerId)
      // sessionStorage.setItem('payerId', this.state.payerId)
      // this.setState({ response: res_json });

    }
    catch (error) {
      console.log(error)
      this.setState({ response: error });
      this.setState({ loading: false });
      if (error instanceof TypeError) {
        this.consoleLog(error.name + ": " + error.message);
      }
      this.setState({ dataLoaded: false })
    }
  }
  onChangeOrganizationIdentifier(event) {
    this.setState({ requesterOrganizationIdentifier: event.target.value });
  }
  onChangeNote(event) {
    console.log(event.target.value,'note')
    this.setState({ note: event.target.value });
  }


  renderForm() {
    let local = {
      "format": "DD-MM-YYYY HH:mm",
      "sundayFirst": false
    }
    return (
      <React.Fragment>
        <div>
          <header id="inpageheader">
            <div className="container">

              <div id="logo" className="pull-left">
                <h1><a href="#intro" className="scrollto">Payer A</a></h1>
                {/* <a href="#intro"><img src={process.env.PUBLIC_URL + "/assets/img/logo.png"} alt="" title="" /></a> */}
              </div>

              <nav id="nav-menu-container">
                <ul className="nav-menu">
                  <li><a href={window.location.protocol + "//" + window.location.host + "/home"}>List Of Communication</a></li>
                  {/* <li><a href={window.location.protocol + "//" + window.location.host + "/pdex"}>PDEX</a></li> */}
                  {/* <li className="menu-active menu-has-children"><a href="">Services</a>
                    <ul>
                      <li className="menu-active"><a href={window.location.protocol + "//" + window.location.host + "/provider_request"}>Prior Auth Submit</a></li>
                      <li><a href={window.location.protocol + "//" + window.location.host + "/mips"}>MIPS Score</a></li>
                    </ul>
                  </li> */}
                  {/* <li><a href={window.location.protocol + "//" + window.location.host + "/configuration"}>Configuration</a></li> */}
                  {/* <li className="menu-has-children"><a href="">{sessionStorage.getItem('username')}</a>
                    <ul>
                      <li><a href="" onClick={this.onClickLogout}>Logout</a></li>
                    </ul>
                  </li> */}
                </ul>
              </nav>
            </div>
          </header>
          <main id="main" style={{ marginTop: "92px" }}>
            <div className="form">
              <div className="container">
                <div className="section-header">
                  <h3>Request for Coverage Transition Document
                  <div className="sub-heading"></div>
                  </h3>

                </div>
                <div>
                  <div className="form-row">
                    <div className="form-group col-3 offset-1">
                      {/* <span className="title-small">Beneficiary*</span> */}
                      <h4 className="title">Beneficiary*</h4>

                    </div>
                    <div className="form-group col-8">
                      <SelectPatient elementName="patientResource" updateCB={this.updateStateElement} />
                    </div>
                   




                  </div>
                  {this.state.patientResource !== '' &&
                      <div >
                        <div className="form-row">
                          <div className="form-group col-md-3 offset-1">
                            <h4 className="title">Patient Info*</h4>
                          </div>
                          
                          <div className="form-group col-md-4">
                            <input type="text" name="firstName" className="form-control" id="name" placeholder="First Name"
                              value={this.state.patientResource.name[0].given} disabled=""
                            />

                          </div>
                          <div className="form-group col-md-4">
                            <input type="text" name="lastName" className="form-control" id="lastname" placeholder="Last Name"
                              value={this.state.patientResource.name[0].family} disabled=""
                            />
                            
                          </div>
                        
                        </div>
                        <div className="form-row">
                          <div className="form-group col-md-3 offset-1">
                            {/* <h4 className="title">Gender</h4> */}
                          </div>
                          {this.state.patientResource.hasOwnProperty('gender') &&
                            <div className="form-group col-md-4">
                              <input type="text" name="gender" className="form-control" id="gender" placeholder="Gender"
                                value={this.state.patientResource.gender} disabled=""
                              />
                              {/* <Dropdown
                               className={"blackBorder"}
                               options={this.state.genderOptions}
                               placeholder='Gender'
                               search
                               selection
                               fluid
                               value={this.state.gender}
                               onChange={this.handleGenderChange}
                             /> */}
                            </div>
                          }
                          {this.state.patientResource.hasOwnProperty('birthDate') &&
                            <div className="form-group col-md-4">
                              <input type="text" name="birthDate" className="form-control" id="birthDate" placeholder="Birth Date"
                                value={this.state.patientResource.birthDate} disabled=""
                              />
                              {/* <DateInput
                                name="birthDate"
                                placeholder="Birth Date"
                                dateFormat="MM/DD/YYYY"
                                fluid
                                value={this.state.birthDate}
                                iconPosition="left"
                                onChange={this.changebirthDate}
                              /> */}
                            </div>
                          }
                        </div>
                        {this.state.patientResource.hasOwnProperty('address') &&
                          <div className="form-row">
                            <div className="form-group col-md-3 offset-1">
                              <h4 className="title"></h4>
                            </div>
                            {this.state.patientResource.address[0].hasOwnProperty('state') &&
                              <div className="form-group col-md-4">
                                <input type="text" name="state" className="form-control" id="state" placeholder="State"
                                value={this.state.patientResource.address[0].state} disabled=""
                              />
                                {/* <Dropdown
                                  className={"blackBorder"}
                                  options={this.state.stateOptions}
                                  placeholder='State'
                                  search
                                  selection
                                  fluid
                                  value={this.state.patientState}
                                  onChange={this.handlePatientStateChange}
                                /> */}
                              </div>
                            }
                            <div className="form-group col-md-4">
                              <input type="text" name="patientPostalCoade" className="form-control" id="patientPostalCoade" placeholder="Postal Code"
                                value={this.state.patientResource.address[0].postalCode} 
                                />
                              
                            </div>
                          </div>
                        }
                      </div>
                    }
                  <SelectPayer elementName='payer' updateCB={this.updateStateElement} />
                  <div className="form-row">
                    <div className="form-group col-3 offset-1">
                      <h4 className="title">Purpose</h4>
                    </div>
                    <div className="form-group col-8">
                    <DropdownPurpose elementName="purpose" updateCB={this.updateStateElement} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-3 offset-1">
                      <h4 className="title">Note</h4>
                    </div>
                    <div className="form-group col-8">
                      <input type="text" name="note" className="form-control" id="note" placeholder="Note"
                        value={this.state.note} onChange={this.onChangeNote}
                         />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-3 offset-1">
                      <h4 className="title">Identifier</h4>
                    </div>
                    <div className="form-group col-8">
                      <input type="text" name="practitioner" className="form-control" id="name" placeholder="Identifier"
                        value={this.state.requesterOrganizationIdentifier} onChange={this.onChangeOrganizationIdentifier}
                        data-rule="minlen:4" data-msg="Please enter at least 4 chars" />
                      <div className="validation"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <button type="button" onClick={this.startLoading}>Submit
                    <div id="fse" className={"spinner " + (this.state.loading ? "visible" : "invisible")}>
                        <Loader
                          type="Oval"
                          color="#fff"
                          height="15"
                          width="15"
                        />
                      </div>
                    </button>
                    {this.state.dataLoaded &&
                      <div style={{ textAlign: "center", paddingTop: "5%" }}>
                        <p style={{ color: "green" }}>{"Communication Request has been created successfully with id : " + this.state.reqId + "."}</p>
                      </div>
                    }


                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </React.Fragment>);
  };


  render() {
    return (
      <div className="attributes mdl-grid">
        {this.renderForm()}
      </div>)
  }
}


function mapStateToProps(state) {
  console.log(state);
  return {
    config: state.config,
  };
};
export default withRouter(connect(mapStateToProps)(CommunicationRequest));


