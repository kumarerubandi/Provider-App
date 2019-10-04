import React, { Component } from 'react';
import DropdownCDSHook from '../components/DropdownCDSHook';
import DropdownHealthcareCodes from '../components/DropdownHealthcareCodes';
import DropdownAmbulanceCodes from '../components/DropdownAmbulanceCodes';
import DropdownFrequency from '../components/DropdownFrequency';
import DropdownState from '../components/DropdownState';
import DropdownDiagnosis from '../components/DropdownDiagnosis';
import DropdownPayer from '../components/DropdownPayer';
import DropdownMedicationList from '../components/DropdownMedicationList';
import DropdownUnits from '../components/DropdownUnits';
import DropdownServiceCode from '../components/DropdownServiceCode';
import { Input } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';
import { withRouter } from 'react-router-dom';
import orderReview from "../Order-Review.json";
import liverTransplant from "../liver-transplant.json";
import homeHealthService from "../HomeHealthServices.json";
import homeOxygen from "../home-oxygen.json";
import ambulatoryTransport from "../ambulatory-transport.json";
import Client from 'fhir-kit-client';
import 'font-awesome/css/font-awesome.min.css';
import "react-datepicker/dist/react-datepicker.css";
import DisplayBox from '../components/DisplayBox';
import 'font-awesome/css/font-awesome.min.css';
import '../index.css';
import '../components/consoleBox.css';
import Loader from 'react-loader-spinner';
import { KEYUTIL } from 'jsrsasign';
import { createToken } from '../components/Authentication';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import stateOptions from '../stateOptions'


const types = {
  error: "errorClass",
  info: "infoClass",
  debug: "debugClass",
  warning: "warningClass"
}


class ProviderRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patient: null,
      fhirUrl: (sessionStorage.getItem('username') === 'john') ? this.props.config.provider.fhir_url : 'https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca',
      accessToken: '',
      dtr_fhir: (this.props.config.dtr !== undefined) ? this.props.config.dtr.dtr_fhir : "http://54.227.218.17:8280/ehr-server/stu3",
      scope: '',
      payer: '',
      patientId: '',
      practitionerId: (sessionStorage.getItem('npi') !== null) ? sessionStorage.getItem('npi') : "",
      resourceType: null,
      resourceTypeLT: null,
      encounterId: '',
      coverageId: '',
      encounter: null,
      request: "coverage-requirement",
      response: null,
      token: null,
      oauth: false,
      diagnosis: null,
      loading: false,
      logs: [],
      cards: [],
      medicationInput: null,
      medication: null,
      medicationStartDate: '',
      medicationEndDate: '',
      hook: null,
      icdCode: [],
      hookName: 'order-review',
      healthcareCode: null,
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
      // prefetch: false,
      frequency: null,
      loadCards: false,
      showMenu: false,
      service_code: "",
      category_name: "",
      device_code: "",
      device_text: "",
      // quantity:'',
      unit: null,
      birthDate: '',
      patientState: '',
      patientPostalCode: '',
      prefetch: false,
      patientResource: '',
      gender: '',
      firstName: '',
      lastName: '',
      prefetchloading: false,
      genderOptions: [{ key: 'male', text: 'Male', value: 'male' },
      { key: 'female', text: 'Female', value: 'female' },
      { key: 'other', text: 'Other', value: 'other' },
      { key: 'unknown', text: 'Unknown', value: 'unknown' },
      ],
      stateOptions: stateOptions,
      requirementSteps: [{ 'step_no': 1, 'step_str': 'Communicating with CRD system.', 'step_status': 'step_loading' },
      {
        'step_no': 2, 'step_str': 'Retrieving the required 4 FHIR resources on crd side.', 'step_status': 'step_not_started'
      },
      { 'step_no': 3, 'step_str': 'Executing HyperbaricOxygenTherapy.cql on cds server and generating requirements', 'step_status': 'step_not_started', 'step_link': 'https://github.com/mettlesolutions/coverage_determinations/blob/master/src/data/Misc/Home%20Oxygen%20Therapy/homeOxygenTherapy.cql', 'cql_name': 'homeOxygenTheraphy.cql' },
      { 'step_no': 4, 'step_str': 'Generating cards based on requirements .', 'step_status': 'step_not_started' },
      { 'step_no': 5, 'step_str': 'Retrieving Smart App', 'step_status': 'step_not_started' }],
      errors: {},
      loadingSteps: false
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
    this.medication_prescribe = false;
    this.startLoading = this.startLoading.bind(this);
    this.submit_info = this.submit_info.bind(this);
    this.onFhirUrlChange = this.onFhirUrlChange.bind(this);
    this.onAccessTokenChange = this.onAccessTokenChange.bind(this);
    this.onScopeChange = this.onScopeChange.bind(this);
    this.onEncounterChange = this.onEncounterChange.bind(this);
    this.onPatientChange = this.onPatientChange.bind(this);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.orderReviewButton = this.orderReviewButton.bind(this);
    this.medicationButton = this.medicationButton.bind(this);
    // this.onQuantityChange = this.onQuantityChange.bind(this);
    this.onPractitionerChange = this.onPractitionerChange.bind(this);
    this.changeDosageAmount = this.changeDosageAmount.bind(this);
    this.changefrequency = this.changefrequency.bind(this);
    this.changeMedicationInput = this.changeMedicationInput.bind(this);
    this.onCoverageChange = this.onCoverageChange.bind(this);
    this.changeMedicationStDate = this.changeMedicationStDate.bind(this);
    this.changeMedicationEndDate = this.changeMedicationEndDate.bind(this);
    this.onClickLogout = this.onClickLogout.bind(this);
    this.redirectByType = this.redirectByType.bind(this);
    this.consoleLog = this.consoleLog.bind(this);
    this.getPrefetchData = this.getPrefetchData.bind(this);
    this.readFHIR = this.readFHIR.bind(this);
    this.onClickMenu = this.onClickMenu.bind(this);
    this.getUrlParameter = this.getUrlParameter.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handlePatientStateChange = this.handlePatientStateChange.bind(this);
    this.changebirthDate = this.changebirthDate.bind(this);
    this.onPatientPostalChange = this.onPatientPostalChange.bind(this);
    this.getIcdDescription = this.getIcdDescription.bind(this);
    this.getHookFromCategory = this.getHookFromCategory.bind(this);
  }

  getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split("&");
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split("=");
      if (sParameterName[0] === sParam) {
        var res = sParameterName[1].replace(/\+/g, "%20");
        return decodeURIComponent(res);
      }
    }
  }
  componentDidMount() {
    if (!sessionStorage.getItem('isLoggedIn')) {
      this.props.history.push("/login");
    }
    let reqType = this.getUrlParameter("req_type");
    if (reqType == "medication_prescribe") {
      this.medication_prescribe = true
      this.medicationButton();
    }

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
  handleGenderChange = (event) => {
    this.setState({ gender: event.target.value })
  }
  handlePatientStateChange = (event, data) => {
    this.setState({ patientState: data.value })
  }
  handlePrefetch = async () => {
    console.log(this.state.prefetch, 'here kya')

    if (this.state.prefetch === false) {
      this.setState({ prefetchloading: true });
      let token = await createToken(this.props.config.provider.grant_type, 'provider', sessionStorage.getItem('username'), sessionStorage.getItem('password'));
      token = "Bearer " + token;
      var myHeaders = new Headers({
        "Content-Type": "application/json",
        "authorization": token,
      });
      var url = this.props.config.provider.fhir_url + '/' + 'Patient' + "/" + this.state.patientId;
      let sender = await fetch(url, {
        method: "GET",
        headers: myHeaders
      }).then(response => {
        // console.log("response----------",response);
        return response.json();
      }).then((response) => {
        // console.log("----------response", response);
        this.setState({ prefetchloading: false });
        return response;
      }).catch(reason =>
        console.log("No response recieved from the server", reason)
      );
      console.log(sender, 'sender')
      if (sender.resourceType === 'Patient') {
        this.setState((prevState) => ({ prefetch: !prevState.prefetch }))
        this.setState({ patientResource: sender })
        this.setState({ firstName: sender.name[0].given })
        this.setState({ lastName: sender.name[0].family })
        this.setState({ gender: sender.gender })
        this.setState({ birthDate: sender.birthDate })
        this.setState({ patientState: sender.address[0].state })
        this.setState({ patientPostalCode: sender.address[0].postalCode })
        console.log(sender.address[0].state, 'patientState')
      }
      else {
        this.setState({ gender: '' })
        this.setState({ birthDate: '' })
        this.setState({ patientState: '' })
        this.setState({ patientPostalCode: '' })
        this.setState({ firstName: '' })
        this.setState({ lastName: '' })
      }
    }


  }

  updateStateElement = (elementName, text) => {
    // console.log("in update state----", elementName, text);
    this.setState({ [elementName]: text });
    this.setState({ validateIcdCode: false })
  }
  async getHookFromCategory(){
    let category_name = this.state.category_name;
      let hook = this.state.hook;
      if (category_name === "Healthcare") {
        hook = "home-health-service";
      } else if (category_name === "Ambulate or other medical transport services") {
        hook = "ambulatory-transport";
      } else if (category_name === "Durable Medical Equipment") {
        hook = "home-oxygen-therapy";
      }
      this.setState({ hook: hook });
      console.log("hook ----", this.state.hook);
      return hook;
  }
  getIcdDescription(code) {
    let hook = this.getHookFromCategory();
    console.log("hook in description----", this.state.hook);
    // let hook = this.state.hook;
    if (hook === "home-oxygen-therapy") {
      console.log("ij home oxygen---", homeOxygen);
      return homeOxygen[code];
    } else if (hook === "home-health-service") {
      console.log("ij home health---", homeHealthService);
      return homeHealthService[code];
    } else if (hook === "ambulatory-transport") {
      console.log("in ambulatory--", ambulatoryTransport);
      return ambulatoryTransport[code];
    } else if (hook === "order-review") {
      console.log("in order review--", orderReview);
      return orderReview[code];
    } else if (hook === "liver-transplant") {
      console.log("in liver transplant--", liverTransplant);
      return liverTransplant[code];
    }
  }

  validateForm() {
    let formValidate = true;
    if (this.state.patientId === '') {
      formValidate = false;
      this.setState({ validatePatient: true });
    }
    // if ((this.state.hook === '' || this.state.hook === null) ) {
    //   formValidate = false;
    //   this.setState({ validateIcdCode: true });
    // }
    return formValidate;
  }

  startLoading() {
    if (this.validateForm()) {
      this.setState({ loading: true }, () => {
        this.submit_info();
      })
    }
  }

  onClickMenu() {
    var showMenu = this.state.showMenu;
    this.setState({ showMenu: !showMenu });
  }

  async readFHIR(resourceType, resourceId) {
    const fhirClient = new Client({ baseUrl: this.state.fhirUrl });
    fhirClient.bearerToken = this.state.accessToken;
    let readResponse = await fhirClient.read({ resourceType: resourceType, id: resourceId });
    // console.log('Read Rsponse', readResponse)
    return readResponse;
  }

  async getPrefetchData() {
    // console.log(this.state.hook);
    var docs = [];
    if (this.state.hook === "patient-view") {
      var prefectInput = { "Patient": this.state.patientId };
    }
    else if (this.state.hook === "liver-transplant") {
      prefectInput = {
        "Patient": this.state.patientId,
        "Practitioner": this.state.practitionerId
      }
    }
    else if (this.state.hook === "order-review") {
      prefectInput = {
        "Patient": this.state.patientId,
        "Encounter": this.state.encounterId,
        "Practitioner": this.state.practitionerId,
        "Coverage": this.state.coverageId
      };
    } else if (this.state.hook === "order-select") {
      prefectInput = {
        "Patient": this.state.patientId,
        "Practitioner": this.state.practitionerId
      };
    }
    var self = this;
    docs.push(prefectInput);

    var prefetchData = {};
    for (var key in docs[0]) {
      var val = docs[0][key]
      if (key === 'patientId') {
        key = 'Patient';
      }
      if (val !== '') {
        prefetchData[key.toLowerCase()] = await self.readFHIR(key, val);
      }
    }
    return prefetchData;
  }

  async getResourceData(token, prefectInput) {
    let headers = {
      "Content-Type": "application/json",
      'Authorization': "Bearer " + token
    }
    // console.log("Prefetch input--", JSON.stringify(prefectInput));
    const url = this.props.config.crd.crd_url + "prefetch";
    await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(prefectInput),
    }).then((response) => {
      return response.json();
    }).then((response) => {
      this.setState({ prefetchData: response });
    })
  }
  orderReviewButton() {
    console.log('order Reiqew')
    this.setState({ hookName: 'order-review' })
    this.setState({ diagnosis: null })
    this.setState({ medication: null })
    this.setState({ dosageAmount: null })
    this.setState({ unit: null })
    this.setState({ frequency: null })
    this.setState({ medicationStartDate: '' })
    this.setState({ medicationEndDate: '' })
  }
  medicationButton() {
    console.log('Medication')
    this.setState({ hookName: 'order-select' })
    this.setState({ validateIcdCode: false })
    // this.setState({patientId : ''})
    this.setState({ hook: null })
    // this.setState({quantity : ''})
    this.setState({ service_code: "" })
    // this.setState({quantity : ''})

  }

  setRequestType(req) {
    this.setState({ request: req });
    if (req === "coverage-requirement") {
      this.setState({ auth_active: "" });
      this.setState({ req_active: "active" });
      this.setState({ hook: "" })
    }
    if (req === "patient-view") {
      this.setState({ auth_active: "active" });
      this.setState({ req_active: "" });
      this.setState({ request: "coverage-requirement" });
      this.setState({ hook: "patient-view" });
    }
    if (req === "config-view") {
      window.location = `${window.location.protocol}//${window.location.host}/configuration`;
    }
    if (req === "x12-converter") {
      window.location = `${window.location.protocol}//${window.location.host}/x12converter`;
    }
    if (req === "reporting-scenario") {
      window.location = `${window.location.protocol}//${window.location.host}/reportingScenario`;
    }
    if (req === "cdex-view") {
      window.location = `${window.location.protocol}//${window.location.host}/cdex`;
    }
  }

  setPatientView(req, res) {
    this.setState({ request: req });
    this.setState({ hook: res });
    this.setState({ auth_active: "active" });
    this.setState({ req_active: "" });
  }
  onFhirUrlChange(event) {
    this.setState({ fhirUrl: event.target.value });
    this.setState({ validateFhirUrl: false });
  }
  onAccessTokenChange(event) {
    this.setState({ accessToken: event.target.value });
    this.setState({ validateAccessToken: false });
  }
  onScopeChange(event) {
    this.setState({ scope: event.target.value });
  }
  onEncounterChange(event) {
    this.setState({ encounterId: event.target.value });
  }
  onPatientChange(event) {
    this.setState({ patientId: event.target.value });
    this.setState({ validatePatient: false });
  }
  onChangeFirstName(event) {
    this.setState({ firstName: event.target.value });
  }
  onChangeLastName(event) {
    this.setState({ lastName: event.target.value });
  }
  // onQuantityChange(event) {
  //   this.setState({ quantity: event.target.value });
  // }
  onPractitionerChange(event) {
    this.setState({ practitionerId: event.target.value });
  }
  onCoverageChange(event) {
    this.setState({ coverageId: event.target.value });
  }
  changeMedicationInput(event) {
    this.setState({ medicationInput: event.target.value });
  }
  changeMedicationStDate = (event, { name, value }) => {

    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }
  changeMedicationEndDate = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name))
      this.setState({ [name]: value });

  }
  changebirthDate = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }

  onPatientPostalChange(event) {
    this.setState({ patientPostalCode: event.target.value })
  }

  changeDosageAmount(event) {
    if (event.target.value !== undefined) {
      let transformedNumber = Number(event.target.value) || 1;
      if (transformedNumber > 5) { transformedNumber = 5; }
      if (transformedNumber < 1) { transformedNumber = 1; }
      this.setState({ dosageAmount: transformedNumber });
    }

  }
  changefrequency(event) {
    if (event.target.value !== undefined) {
      let transformedNumber = Number(event.target.value) || 1;
      // if (transformedNumber > 5) { transformedNumber = 5; }
      if (transformedNumber < 1) { transformedNumber = 1; }
      this.setState({ frequency: transformedNumber });
    }

  }
  onClickLogout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('fhir_url');
    this.props.history.push('/home');
  }

  redirectByType(redirect_value) {
    console.log("Redirect by tyyoe", redirect_value)
    if (redirect_value == "medication_prescribe") {
      // this.props.history.push("/provider_request?req_type=medication_prescribe")
      window.location.href = window.location.origin + "/provider_request?req_type=medication_prescribe"
    }
    else {
      window.location.href = window.location.origin + "/provider_request"
    }
    // else if(redirect_value == "measure_report"){

    // }
  }

  setSteps(index) {
    console.log('werd')
    var steps = this.requirementSteps;
    if (this.state.hook === "home-oxygen-theraphy") {
      this.requirementSteps[2].step_link = 'https://github.com/mettlesolutions/coverage_determinations/blob/master/src/data/Misc/Home%20Oxygen%20Therapy/homeOxygenTherapy.cql'
      this.requirementSteps[2].cql_name = "homeOxygenTheraphy.cql"
    }
    else if (this.state.hook === "order-review") {
      this.requirementSteps[2].cql_name = "HyperbaricOxygenTherapy.cql"
      this.requirementSteps[2].step_link = "https://github.com/mettlesolutions/coverage_determinations/blob/master/src/data/NCD/Cat1/HyperbaricOxygenTherapy/HyperbaricOxygenTherapy.cql"
    }
    if (index <= steps.length) {
      var self = this;
      setTimeout(function () {
        if (index !== 0) {
          steps[index - 1].step_status = "step_done"
        }
        // console.log(index, steps[index])
        if (index !== steps.length) {
          steps[index].step_status = "step_loading"
        }
        for (var i = index + 1; i < steps.length; i++) {
          steps[i].step_status = "step_not_started"
        }
        self.setState({ requirementSteps: steps });
        if (index < steps.length) {
          if (!(self.state.patientId === 37555 && index >= 1)) {
            self.setSteps(index + 1);
            steps[index].hideLoader = false;
          }
          else {
            setTimeout(function () {
              steps[index].hideLoader = true;
              self.setState({ stepsErrorString: "Unable to generate requirements.", requirementSteps: steps });
            }, 5000)
          }
        }
        if (index === steps.length) {
          self.setState({ "loadCards": true })
        }

      }, 3000)
    }
  }

  resetSteps() {
    var steps = this.requirementSteps;
    steps[0].step_status = "step_loading"
    for (var i = 1; i < steps.length; i++) {
      steps[i].step_status = "step_not_started"
    }
    this.setState({ requirementSteps: steps, loadCards: false });
  }

  async submit_info() {
    // this.setState({ loadingSteps: false, stepsErrorString: undefined });
    // this.resetSteps();
    let token = await createToken(this.props.config.provider.grant_type, 'provider', sessionStorage.getItem('username'), sessionStorage.getItem('password'));
    token = "Bearer " + token;
    var myHeaders = new Headers({
      "Content-Type": "application/json",
      "authorization": token,
    });
    let accessToken = this.state.accessToken;
    accessToken = token;
    console.log(accessToken, 'accesstoken')
    this.setState({ accessToken });
    let json_request = await this.getJson();

    let url = '';
    if (this.state.request === 'coverage-requirement' && this.state.hook !== 'patient-view') {
      url = this.props.config.crd.crd_url + '' + this.props.config.crd.coverage_requirement_path;
    }
    if (this.state.hook === 'patient-view') {
      url = this.props.config.crd.crd_url + '' + this.props.config.crd.patient_view_path;
    }

    let dtr_url = this.props.config.dtr.dtr_fhir + "/Patient"
    // console.log("Fetching response from " + url + ",types.info")
    console.log("json_request", json_request)
    let patientId;
    try {

      if (this.state.prefetch === false) {
        let patientResource = this.state.patientResource
        console.log(patientResource, JSON.stringify(patientResource))
        const patientResponse = await fetch(dtr_url, {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(patientResource)
        })
        console.log("fhir-----------", patientResponse);
        const patientResoponseJson = await patientResponse.json();
        // this.setState({ response: res_json });
        // patientId=patientResoponseJson.id
        // json_request.entry[0].resource.id = patientId
        // json_request.context.patientId = patientId
        console.log(patientResoponseJson, 'yes its working')
      }
      const fhirResponse = await fetch(url, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(json_request)
      })
      console.log("fhir-----------", fhirResponse);
      const res_json = await fhirResponse.json();
      this.setState({ response: res_json });
      // console.log("------response json",res_json);

      if (fhirResponse && fhirResponse.status) {
        this.consoleLog("Server returned status "
          + fhirResponse.status + ": "
          + fhirResponse.error, types.error);
        this.consoleLog(fhirResponse.message, types.error);
      } else {
        this.setState({ response: res_json });
      }
      this.setState({ loading: false });
      this.setState({ "loadCards": true });
      window.scrollTo(0, document.body.scrollHeight)
    } catch (error) {
      var res_json = {
        "cards": [{
          "source": {
            "label": "CMS Medicare coverage database",
            "url": "https://www.cms.gov/medicare-coverage-database/details/ncd-details.aspx?NCDId=70&ncdver=3&bc=AAAAgAAAAAAA&\n",
          },
          "suggestions": [],
          "summary": "Requirements for Home Oxygen Theraphy",
          "indicator": "info",
          "detail": "The requested procedure needs more documentation to process further",
          "links": [{
            "url": "/index?npi=" + this.state.practitionerId,
            "type": "smart",
            "label": "SMART App"
          }]

        }]
      }
      this.setState({ response: res_json });
      this.setState({ loading: false });
      this.consoleLog("Unexpected error occured", types.error)
      if (error instanceof TypeError) {
        this.consoleLog(error.name + ": " + error.message, types.error);
      }
    }
  }
  renderClaimSubmit() {
    const { prefetch } = this.state
    return (
      <React.Fragment>
        <div>
          {/*<div className="main_heading">
            <span style={{ lineHeight: "35px" }}>PILOT INCUBATOR </span>
            {this.medication_prescribe &&
              <div className="menu_conf" onClick={() => this.redirectByType("default")}>
                <i style={{ paddingLeft: "5px", paddingRight: "7px" }} className="fa fa-home"></i>
                Home</div>
            }
            <div className="menu">
              <button className="menubtn"><i style={{ paddingLeft: "3px", paddingRight: "7px" }} className="fa fa-user-circle" aria-hidden="true"></i>
                {sessionStorage.getItem('name')}<i style={{ paddingLeft: "7px", paddingRight: "3px" }} className="fa fa-caret-down"></i>
              </button>
              <div className="menu-content">
                <button className="logout-btn" onClick={this.onClickLogout}>
                  <i style={{ paddingLeft: "3px", paddingRight: "7px" }} className="fa fa-sign-out" aria-hidden="true"></i>Logout</button>
              </div>
            </div>

            <div className="menu_conf" onClick={() => this.setRequestType('config-view')}>
              <i style={{ paddingLeft: "5px", paddingRight: "7px" }} className="fa fa-cog"></i>
              Configuration</div>
            <div className="menu_conf" onClick={() => this.setRequestType('x12-converter')}>
              <i style={{ paddingLeft: "5px", paddingRight: "7px" }} className="fa fa-exchange"></i>
              X12 Converter</div>
            <div className="menu">
              <button className="menubtn"><i style={{ paddingLeft: "3px", paddingRight: "7px" }} className="fa fa-list" aria-hidden="true"></i>
                Clinical Reasoning<i style={{ paddingLeft: "7px", paddingRight: "3px" }} className="fa fa-caret-down"></i>
              </button>
              <div className="menu-content submenu">

                <button className="submenu-item" onClick={() => this.redirectByType("medication_prescribe")}>
                  <i style={{ paddingLeft: "3px", paddingRight: "7px" }} aria-hidden="true"></i>Medication Prescribe</button>
                <button className="submenu-item" onClick={() => this.setRequestType('reporting-scenario')}>
                  <i style={{ paddingLeft: "3px", paddingRight: "7px" }} aria-hidden="true"></i>Measure Report </button>
              </div>
            </div>
            <div className="menu_conf" onClick={() => this.setRequestType('cdex-view')}>
              <i style={{ paddingLeft: "5px", paddingRight: "7px" }} className="fa fa-exchange"></i>
              CDEX</div>
          </div>*/}
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
                      <li><a href="#">MIPS Score</a></li>
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
                <div className="section-header">
                  <h3>Prior Authorization</h3>
                  <p>Submit your request to check for prior authorization.</p>
                </div>
                {(this.state.hookName === 'order-review' || this.state.hookName === 'order-select') &&
                  <div>
                    {/* <div>
                      <div className="header">
                            Your Fhir URL*
                    </div>
                    <div className="dropdown">
                        <Input className='ui fluid input' type="text" name="fhirUrl" fluid value={this.state.fhirUrl} onChange={this.onFhirUrlChange}></Input>
                      </div>
                      {this.state.validateFhirUrl === true  &&
                      <div className='errorMsg dropdown'>{config.errorMsg}</div>
                    }
                    </div>
                  <div>
                    <div className="header">
                            Bearer Access Token*
                    </div>
                    <div className="dropdown">
                        <Input className='ui fluid input' type="text" name="accessToken" fluid value={this.state.accessToken} onChange={this.onAccessTokenChange}></Input>
                    </div>
                    {this.state.validateAccessToken === true  &&
                      <div className='errorMsg dropdown'>{config.errorMsg}</div>
                    }
                  </div>*/}

                    <div className="form-row">
                      <div className="form-group col-md-2 offset-2">
                        <h4 className="title">Payer</h4>
                      </div>
                      <div className="form-group col-md-6">
                        <DropdownPayer
                          elementName='payer'
                          updateCB={this.updateStateElement}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group col-md-2 offset-2">
                        <h4 className="title">Beneficiary Id*</h4>
                      </div>
                      <div className="form-group col-md-3">
                        <input type="text" name="patient" className="form-control" id="name" placeholder="Beneficiary Id"
                          value={this.state.patientId} onChange={this.onPatientChange}
                          data-rule="minlen:4" data-msg="Please enter at least 4 chars" />
                        <div className="validation"></div>
                      </div>
                      <div className="form-group col-md-3">
                        <button type="button" onClick={this.handlePrefetch}>Prefetch
                        <div id="fse" className={"spinner " + (this.state.prefetchloading ? "visible" : "invisible")}>
                            <Loader
                              type="Oval"
                              color="#fff"
                              height="15"
                              width="15"
                            />
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-2 offset-2">
                        <h4 className="title">Patient Info</h4>
                      </div>
                      <div className="form-group col-md-3">
                        <input type="text" name="firstName" className="form-control" id="name" placeholder="First Name"
                          value={this.state.firstName} onChange={this.onChangeFirstName}
                          data-rule="minlen:4" data-msg="Please enter at least 4 chars" />
                        <div className="validation"></div>
                      </div>
                      <div className="form-group col-md-3">
                        <input type="text" name="lastName" className="form-control" id="name" placeholder="Last Name"
                          value={this.state.lastName} onChange={this.onChangeLastName}
                          data-rule="minlen:4" data-msg="Please enter at least 4 chars" />
                        <div className="validation"></div>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-2 offset-2">
                        <h4 className="title"></h4>
                      </div>
                      <div className="form-group col-md-3">
                        <Dropdown
                          className={"blackBorder"}
                          options={this.state.genderOptions}
                          placeholder='Gender'
                          search
                          selection
                          fluid
                          value={this.state.gender}
                          onChange={this.handleGenderChange}
                        />
                      </div>
                      <div className="form-group col-md-3">
                        <DateInput
                          name="birthDate"
                          placeholder="Birth Date"
                          dateFormat="MM/DD/YYYY"
                          fluid
                          value={this.state.birthDate}
                          iconPosition="left"
                          onChange={this.changebirthDate}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-2 offset-2">
                        <h4 className="title"></h4>
                      </div>
                      <div className="form-group col-md-3">
                        <Dropdown
                          className={"blackBorder"}
                          options={this.state.stateOptions}
                          placeholder='State'
                          search
                          selection
                          fluid
                          value={this.state.patientState}
                          onChange={this.handlePatientStateChange}
                        />
                      </div>
                      <div className="form-group col-md-3">
                        <input type="text" name="patientPostalCoade" className="form-control" id="name" placeholder="Postal Code"
                          value={this.state.patientPostalCode} onChange={this.onPatientPostalChange}
                          data-rule="minlen:4" data-msg="Please enter at least 4 chars" />
                        <div className="validation"></div>
                      </div>
                    </div>

                    {this.state.validatePatient === true &&
                      <div className='errorMsg dropdown'>{this.props.config.errorMsg}</div>
                    }
                  </div>}
                {this.state.hookName === 'order-review' &&
                  <div>
                    <DropdownServiceCode elementName="service_code" updateCB={this.updateStateElement} />
                  </div>}
                {this.state.auth_active !== 'active' &&
                  <div>
                    {this.state.category_name === 'Durable Medical Equipment' &&
                      <div className="form-row">
                        <div className="form-group col-md-2 offset-2">
                          <h4 className="title">ICD 10 / HCPCS Codes*</h4>
                        </div>
                        <div className="form-group col-md-6">
                          <DropdownCDSHook
                            elementName="icdCode"
                            updateCB={this.updateStateElement}
                          />
                        </div>
                      </div>
                    }
                    {this.state.category_name === 'Healthcare' &&
                      <div className="form-row">
                        <div className="form-group col-md-2 offset-2">
                          <h4 className="title">ICD 10 / HCPCS Codes*</h4>
                        </div>
                        <div className="form-group col-md-6">
                          <DropdownHealthcareCodes
                            elementName="icdCode"
                            updateCB={this.updateStateElement}
                          />
                        </div>
                      </div>
                    }
                    {this.state.category_name === 'Ambulate or other medical transport services' &&
                      <div className="form-row">
                        <div className="form-group col-md-2 offset-2">
                          <h4 className="title">ICD 10 / HCPCS Codes*</h4>
                        </div>
                        <div className="form-group col-md-6">
                          <DropdownAmbulanceCodes
                            elementName="icdCode"
                            updateCB={this.updateStateElement}
                          />
                        </div>
                      </div>
                    }

                    {this.state.validateIcdCode === true &&
                      <div className='errorMsg dropdown'>{this.props.config.errorMsg}</div>
                    }
                  </div>}

                {this.state.hookName === 'order-select' &&
                  <div>
                    <div className="header">
                      Diagnosis
                      </div>
                    <div className="dropdown">
                      <DropdownDiagnosis
                        elementName='diagnosis'
                        updateCB={this.updateStateElement}
                      />
                    </div>
                    <div>
                      <div className="header">
                        Medication Input
                      </div>
                      <div className="dropdown">
                        <DropdownMedicationList
                          elementName="medication"
                          updateCB={this.updateStateElement}
                        />
                      </div>
                    </div>
                    <div className='stateInputRow'>
                      <div className='stateInputColumn'>
                        <div className='header' >
                          Value
                    </div>
                        <div>
                          <Input
                            type="number"
                            value={this.state.dosageAmount}
                            onChange={this.changeDosageAmount}
                            placeholder="Value" /></div>
                      </div>
                      <div className='stateInputColumn'>
                        <div className="header" >
                          Unit
                      </div>
                        <div >
                          <DropdownUnits
                            elementName='unit'
                            updateCB={this.updateStateElement}
                          />
                        </div>
                      </div>
                      <div className='stateInputColumn'>
                        <div className="header" >
                          Frequency
                      </div>
                        <div >
                          {/* <DropdownFrequency
                          elementName='frequency'
                          updateCB={this.updateStateElement}
                        /> */}
                          <Input
                            type="number"
                            value={this.state.frequency}
                            onChange={this.changefrequency}
                            placeholder="Frequency" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className='leftStateInput'>
                        <div className="header" >
                          Start Date
                    </div>
                        <div >
                          <DateInput
                            localization='es'
                            name="medicationStartDate"
                            placeholder="Start Date"
                            dateFormat="MM/DD/YYYY"
                            value={this.state.medicationStartDate}
                            iconPosition="left"
                            onChange={this.changeMedicationStDate}
                          />
                        </div>
                      </div>
                      <div className='rightStateInput'>
                        <div className="header" >
                          End Date
                    </div>
                        <div >
                          <DateInput
                            name="medicationEndDate"
                            placeholder="End Date"
                            dateFormat="MM/DD/YYYY"
                            value={this.state.medicationEndDate}
                            iconPosition="left"
                            onChange={this.changeMedicationEndDate}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                }
                <div className="form-row">
                  <div className="form-group col-md-2 offset-2">
                    <h4 className="title">NPI</h4>
                  </div>
                  <div className="form-group col-md-6">
                    <input type="text" name="practitioner" className="form-control" id="name" placeholder="Practitioner NPI"
                      value={this.state.practitionerId} onChange={this.onPractitionerChange}
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
                </div>
                {this.state.loadingSteps &&
                  <div className="right-form" style={{ paddingLeft: "2%", listStyle: "none", paddingTop: "3%" }} >
                    <ol style={{ listStyle: "none" }}>
                      {this.state.requirementSteps.map((key, i) => {
                        return (
                          <li key={i}>
                            <div>
                              {this.state.requirementSteps[i].step_status === 'step_done' &&
                                <div>
                                  <div style={{ color: "green" }} id="fse" className="visible">
                                    <span style={{ float: "left" }}  >{this.state.requirementSteps[i].step_no + ". " + this.state.requirementSteps[i].step_str + "   "} <i style={{ color: "green" }} className="fa fa-check" aria-hidden="true"></i></span>
                                  </div>
                                  <div style={{ paddingLeft: "25px" }} >
                                    {
                                      this.state.requirementSteps[i].step_no === 2 &&
                                      <span style={{ float: "left", paddingBottom: "20px", color: "gray" }}  >Successfully fetched 4 FHIR resources.</span>

                                    }
                                    {
                                      this.state.requirementSteps[i].step_no === 3 &&
                                      <span style={{ float: "left", paddingBottom: "20px", color: "gray" }}>Successfully executed <a target="_blank" href={this.state.requirementSteps[i].step_link}>{this.state.requirementSteps[i].cql_name}</a> on CDS.</span>

                                    }
                                  </div>
                                </div>
                              }
                              {this.state.requirementSteps[i].step_status === 'step_loading' &&
                                <div style={{ color: "brown" }} id="fse" className="visible">
                                  <span style={{ float: "left" }}  >{this.state.requirementSteps[i].step_no + ". " + this.state.requirementSteps[i].step_str + "   "}</span>
                                  {
                                    (this.state.requirementSteps[i].hideLoader === false || this.state.requirementSteps[i].hideLoader === undefined) &&
                                    <div style={{ float: "right" }} >
                                      <Loader
                                        style={{ float: "right" }}
                                        type="ThreeDots"
                                        color="brown"
                                        height="6"
                                        width="30"
                                      />
                                    </div>
                                  }
                                </div>
                              }
                              {this.state.requirementSteps[i].step_status === 'step_not_started' &&
                                <div id="fse" className="visible">
                                  <span style={{ float: "left" }}  >{this.state.requirementSteps[i].step_no + ". " + this.state.requirementSteps[i].step_str + "   "}</span>
                                </div>
                              }
                            </div>
                          </li>
                        )
                      })}
                    </ol>
                    <div style={{ paddingLeft: "6%", }}>
                      {this.state.stepsErrorString !== undefined &&
                        <span style={{ color: "red", marginBottom: "20px" }}>{this.state.stepsErrorString}</span>
                      }
                    </div>
                  </div>
                }

                {(this.state.loading === false && this.state.loadCards && this.state.request === 'coverage-requirement') &&
                  <div className="row">
                    <DisplayBox
                      response={this.state.response}
                      req_type="coverage_requirement"
                      userId={this.state.practitionerId}
                      fhirAccessToken={this.state.accessToken}
                      fhirServerUrl={this.props.config.provider.fhir_url}
                      patientId={this.state.patientId} hook={this.state.hook} />

                  </div>
                }
                {/* {this.state.request === 'prior-authorization' &&
                <div className="right-form">
                <DisplayBox
                response = {this.state.response} req_type="prior-authorization"  userId={this.state.practitionerId}  patientId={this.state.patientId} hook={this.state.hook}  />

                </div>
                } */}
                {this.state.loading === false && this.state.loadCards && this.state.request !== 'coverage-requirement' && this.state.request !== 'prior-authorization' &&
                  <div className="right-form">
                    <DisplayBox
                      response={this.state.response} req_type="coverage_determination"
                      userId={this.state.practitionerId} patientId={this.state.patient}
                      hook={this.state.hook}
                      fhirAccessToken={this.state.accessToken}
                      fhirServerUrl={this.props.config.provider.fhir_url} />
                  </div>
                }
              </div>
            </div>
          </main>
        </div>
      </React.Fragment >);
  };

  async getRequestID(token) {

    const min = 1;
    const max = 1000000000;
    const num = parseInt(min + Math.random() * (max - min));
    // console.log("num----------", num);
    let req_check = await this.getResources(token, "DeviceRequest", num);
    // console.log("random------------", req_check);
    if (req_check.hasOwnProperty('total')) {
      if (req_check.total > 0) {
        await this.getRequestID(token);
      }
      else {
        return num;
      }
    }
  }

  async getResources(token, resource, identifier) {
    var url = this.props.config.payer.fhir_url + '/' + resource + "?identifier=" + identifier;
    // console.log("url-------",url,token);
    let headers = {
      "Content-Type": "application/json",
    }
    if (this.props.config.payer.authorizedPayerFhir) {
      headers['Authorization'] = "Bearer " + token
    }
    let sender = await fetch(url, {
      method: "GET",
      headers: headers
    }).then(response => {
      // console.log("response----------",response);
      return response.json();
    }).then((response) => {
      // console.log("----------response", response);
      return response;
    }).catch(reason =>
      console.log("No response recieved from the server", reason)
    );
    return sender;
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
  async getJson() {
    var patientId = null;
    patientId = this.state.patientId;
    let token = await createToken(this.props.config.provider.grant_type, 'provider', sessionStorage.getItem('username'), sessionStorage.getItem('password'));
    let coverage = {
      resource: {
        resourceType: "Coverage",
        id: this.state.coverageId,
        class: [
          {
            type: {
              system: "http://hl7.org/fhir/coverage-class",
              code: "plan"
            },
            value: "Medicare Part D"
          }
        ],
        payor: [
          {
            reference: "Organization/6"
          }
        ]
      }
    };
    let deviceRequest = {
      "resourceType": "DeviceRequest",
      "identifier": [
        {
          "value": await this.getRequestID(token)
        }
      ],
      "status": "active",
      "intent": "instance-order",
      "priority": "routine",
      "parameter": [],
      "subject": {
        "reference": "Patient?identifier=" + patientId
      },
      // "encounter": {
      //   "reference": "Encounter/"+this.state.encounterId
      // },
      // "occurrenceDateTime": "2013-05-08T09:33:27+07:00",
      // "authoredOn": "2013-05-08T09:33:27+07:00",
      "requester": {
        "reference": "Practitioner?identifier=" + this.state.practitionerId
      }
    }
    let selectedCodes = this.state.icdCode
    for (var i = 0; i < selectedCodes.length; i++) {
      let IcdDescription = this.getIcdDescription(selectedCodes[i]);
      let obj = {
        "code": {
          "coding": [
            {
              "system": "http://loinc.org",
              "code": selectedCodes[i],
              "display": IcdDescription
            }
          ],
          "text": IcdDescription
        }
      }
      deviceRequest.parameter.push(obj)
    }


    // token = "Bearer " + token;
    // var myHeaders = new Headers({
    //   "Content-Type": "application/json",
    //   "authorization": token,
    // });
    // var url = this.props.config.provider.fhir_url +'/Encounter&subject='+patientId+'&peroid'
    // const fhirResponse = await fetch(url, {
    //   method: "GET",
    //   headers: myHeaders,
    //   body: JSON.stringify(json_request)
    // })
    // console.log("fhir-----------",fhirResponse);
    // const res_json = await fhirResponse.json();
    // this.setState({ response: res_json });

    // let medicationJson = {
    //   resourceType: "MedicationOrder",
    //   dosageInstruction: [
    //     {
    //       doseQuantity: {
    //         value: this.state.dosageAmount,
    //         system: "http://unitsofmeasure.org",
    //         code: "{pill}"
    //       },
    //       timing: {
    //         repeat: {
    //           frequency: this.state.frequency,
    //           boundsPeriod: {
    //             start: this.state.medicationStartDate,
    //             end: this.state.medicationEndDate,
    //           }
    //         }
    //       }
    //     }
    //   ],

    //   medicationCodeableConcept: {
    //     text: "Pimozide 2 MG Oral Tablet [Orap]",
    //     coding: [
    //       {
    //         display: "Pimozide 2 MG Oral Tablet [Orap]",
    //         system: "http://www.nlm.nih.gov/research/umls/rxnorm",
    //         code: this.state.medication,
    //       }
    //     ]
    //   },
    //   reasonCodeableConcept: {
    //     coding: [
    //       {
    //         system: "http://snomed.info/sct",
    //         code: this.state.diagnosis,
    //       }
    //     ],
    //     text: "Alzheimer's disease"
    //   }

    // };
    var date1 = new Date(this.state.medicationStartDate);
    var date2 = new Date(this.state.medicationEndDate);
    var Difference_In_Time = Math.abs(date2.getTime() - date1.getTime());
    var days = Math.ceil(Difference_In_Time / (1000 * 60 * 60 * 24))
    var dosageInstructionText = this.state.dosageAmount + " " + this.state.unit + " bid x " + days + " days"
    let key;
    let text;
    if (this.state.medication !== null) {
      key = this.state.medication.key
      text = this.state.medication.text
    }
    let medicationRequestJson = {
      "resource": {
        "resourceType": "MedicationRequest",
        "id": "smart-MedicationRequest-103",
        "status": "draft",
        "intent": "order",
        "medicationCodeableConcept": {
          "coding": [
            {
              "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
              "code": key,
              "display": text
            }
          ],
          "text": text
        },
        "subject": {
          "reference": "Patient/" + this.state.patientId
        },
        "dosageInstruction": [
          {
            "text": dosageInstructionText,
            "timing": {

              "frequency": this.state.frequency,

            },

            "doseAndRate": {
              "doseQuantity": {
                "value": this.state.dosageAmount,
                "unit": this.state.unit,
                "system": "http://unitsofmeasure.org",
                "code": this.state.unit
              }
            }
          }
        ],
        "dispenseRequest": {
          "numberOfRepeatsAllowed": 1,
          "quantity": {
            "value": 1,
            "unit": "mL",
            "system": "http://unitsofmeasure.org",
            "code": "mL"
          },
          "expectedSupplyDuration": {
            "value": days,
            "unit": "days",
            "system": "http://unitsofmeasure.org",
            "code": "d"
          }
        }
      }
    }
    // "99183": "Physician attendance and supervision of hyperbaric oxygen therapy, per session",
    // console.log("------------final device request", deviceRequest)
    console.log(this.state.dtr_fhir, 'wedding')
    let request = {
      hookInstance: "d1577c69-dfbe-44ad-ba6d-3e05e953b2ea",
      fhirServer: this.state.dtr_fhir,
      payerName: this.state.payer,
      service_code: this.state.service_code,
      fhirAuthorization: {
        "access_token": this.state.accessToken,
        "token_type": this.props.config.authorization_service.token_type, // json
        "expires_in": this.props.config.authorization_service.expires_in, // json
        "scope": this.props.config.authorization_service.scope,
        "subject": this.props.config.authorization_service.subject,
      },
      userId: this.state.practitionerId,
      patientId: patientId,
      context: {
        userId: this.state.practitionerId,
        patientId: '',
        coverageId: this.state.coverageId,
        encounterId: this.state.encounterId,
        patient: ''
      }
    };
    let patientResource;
    if (this.state.prefetch === true) {

      patientResource = this.state.patientResource
      request.context.patientId = patientResource.id
      request.context.patient = patientResource
    }
    else {
      // var birthDate = new Date(this.state.birthDate); 
      patientResource = {
        resourceType: "Patient",
        id: patientId,
        gender: this.state.gender,
        "birthDate": this.state.birthDate,
        "address": [
          {
            "use": "home",
            "city": "Thornton",
            "state": this.state.patientState,
            "postalCode": this.state.patientPostalCode,
            "country": "USA"
          }
        ],
        "active": true,
        "name": [
          {
            "use": "official",
            "family": this.state.lastName,
            "given": [
              this.state.firstName
            ]
          }
        ],
        "identifier": [
          {
            "use": "usual",
            "type": {
              "coding": [
                {
                  "system": "http://hl7.org/fhir/v2/0203",
                  "code": "MR",
                  "display": "Medical record number"
                }
              ]
            },
            "system": "http://hospital.davinci.org",
            "value": this.randomString()
          }
        ],
      }
      this.setState({ patientResource: patientResource })

    }
    if (this.state.hookName === 'order-review') {
      request.hook = this.state.hook
      request.context.orders = {
        resourceType: "Bundle",
        entry: [
          {
            resource: deviceRequest
          }
        ]
      }
    }
    else if (this.state.hookName === 'order-select') {
      request.hook = this.state.hook
      request.context.orders = {
        resourceType: "Bundle",
        entry: [
          {
            resource: medicationRequestJson
          }
        ]
      }
    }
    // if (this.state.hook === 'order-review') {
    //   request.context.encounterId = this.state.encounterId
    //   request.context.orders.entry.push(coverage);
    // }
    // if (this.state.hook === 'order-select') {
    //   request.context.orders.entry.push(medicationJson);
    // }


    if (this.state.prefetch) {
      var prefetchData = await this.getPrefetchData()
      this.setState({ prefetchData: prefetchData })
      request.prefetch = this.state.prefetchData;
    }
    return request;

  }
  render() {
    return (
      <div className="attributes mdl-grid">
        {this.renderClaimSubmit()}
      </div>)
  }
}


function mapStateToProps(state) {
  return {
    config: state.config,
  };
};
export default withRouter(connect(mapStateToProps)(ProviderRequest));


