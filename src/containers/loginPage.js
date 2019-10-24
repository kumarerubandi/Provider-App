import React from 'react';
import $ from 'jquery';
import { createToken } from '../components/Authentication';
// import config from '../globalConfiguration.json';
import { Input } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';
import adminClient from 'keycloak-admin-client'
import properties from '../properties.json';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: '',
      fhir_url: '',
      login_error_msg: '',
      success_msg:'',
      loading: false,
      mode:'login',
      confirmPassword:'',
      firstName: "",
      lastName: "",
      user_created:false
    }
    this.handleName = this.handleName.bind(this);
    this.handlepassword = this.handlepassword.bind(this);
    this.handleDataBase = this.handleDataBase.bind(this);
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
    this.handleFirstName = this.handleFirstName.bind(this);
    this.handleLastName = this.handleLastName.bind(this);
    this.submit = this.submit.bind(this);
    this.onClickLoginSubmit = this.onClickLoginSubmit.bind(this);
    this.switchMode = this.switchMode.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }

  

  registerUser(e){
      console.log("register");
      this.setState({ loading: true, login_error_msg: '' });
      if(this.state.name == null || this.state.name == undefined || this.state.name == ""){
        this.setState({ loading: false, login_error_msg: "Username is required !!" });
        return false      
      }
      if(this.state.password == null || this.state.password == undefined || this.state.password == ""){
        this.setState({ loading: false, login_error_msg: "Password is required !!" });
        return false
      }
      if(this.state.firstName == null || this.state.firstName == undefined || this.state.firstName == ""){
        this.setState({ loading: false, login_error_msg: "First Name is required !!" });
        return false
      }
      if(this.state.lastName == null || this.state.lastName == undefined || this.state.lastName == ""){
        this.setState({ lastName: "" });
      }

      if(this.state.password != this.state.confirmPassword){
        this.setState({ loading: false, login_error_msg: "Passwords are not matching!" });
        return false
      }

      let userJson = { "username": this.state.name,
                       "credentials": [
                           {
                               "type": "password",
                               "value": this.state.password,
                               "temporary": false
                           }
                       ], 
                       "enabled": true,
                       "firstName":this.state.firstName,
                       "lastName":this.state.lastName
                      }

      adminClient(properties.keycloak_admin_settings).then((client) => {
        console.log('client', client);
        client.realms.find()
          .then((realms) => {
          console.log('realms', realms);
          });
        client.users.create(properties.realm,userJson)
          .then((msg) => {
          console.log('create msg', msg);
          if(msg.hasOwnProperty("id")){
            this.setState({ loading: false, success_msg : "User Created Sucessfully",user_created:true });
          }

        });
        // client.users.find("ProviderCredentials")
        //   .then((users) => {
        //   console.log('users', users);
        //   });
      })
      .catch((err) => {
        console.log('Error', err);
        this.setState({ loading: false, login_error_msg: "Internal Error !!" });
      });

      this.setState({ loading: false, login_error_msg: "" });

  }

  switchMode(mode){

    this.setState({ mode: mode,user_created:false,"success_msg":"","login_error_msg":""});
  }

  componentDidMount() {
    $('input[type="password"]').on('focus', () => {
      $('*').addClass('password');
    }).on('focusout', () => {
      $('*').removeClass('password');
    });
  }

  handleName(event) {
    this.setState({ name: event.target.value });
  }

  handlepassword(event) {
    this.setState({ password: event.target.value });
  }

  handleDataBase(event) {
    this.setState({ dataBase: event.target.value });
  }

  handleConfirmPassword(event) {
    this.setState({ confirmPassword: event.target.value });
  }
  handleFirstName(event) {
    this.setState({ firstName: event.target.value });
  }
  handleLastName(event) {
    this.setState({ lastName: event.target.value });
  }


  submit() {
    if (this.props.isLoggedIn && this.props.sessionID) {
      this.props.getModels(this.props.sessionID);
    }
  }

  async onClickLoginSubmit() {
    this.setState({ loading: true, login_error_msg: '' });
    let tokenResponse = await createToken('password', 'app-login', this.state.name, this.state.password, true);
    if (tokenResponse !== null && tokenResponse !== undefined) {
      sessionStorage.setItem('username', this.state.name);
      sessionStorage.setItem('password', this.state.password);
      console.log(this.props.config.user_profiles, 'user profiles')
      for (var key in this.props.config.user_profiles) {
        if (this.state.name === this.props.config.user_profiles[key].username) {
          sessionStorage.setItem('npi', this.props.config.user_profiles[key].npi);
          sessionStorage.setItem('name', this.props.config.user_profiles[key].name);
        }
      }
      sessionStorage.setItem('isLoggedIn', true);
      this.props.history.push('/provider_request');
    }
    this.setState({ loading: false, login_error_msg: "Unable to login !! Please try again." });
  }
  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.onClickLoginSubmit();
    }
  };
  render() {
    return (
      <div className="main">
        <div className="form">
          <div className="container">
            <div className="col-5 offset-7">
              { this.state.mode == "login" &&
              <div className="section-header">
                <h3 style={{ paddingTop: "25%" }}>Login</h3>
                <p>to the provider application</p>
              </div>
              }
              { this.state.mode == "register" &&
              <div className="section-header">
                <h3 style={{ paddingTop: "25%" }}>Register User</h3>
                <p>to the provider application</p>
              </div>
              }
            </div>
            {this.state.login_error_msg !== "" &&
              <div className="col-5 offset-7 loginerrormessage">{this.state.login_error_msg}</div>
            }
            {this.state.success_msg !== "" &&
              <div className="col-5 offset-7 success_msg">{this.state.success_msg}</div>
            }
            <div className="col-5 offset-7">
              <div className="form-group">
                <Input
                  icon='user' iconPosition='left'
                  placeholder='User'
                  // label="User name"
                  type='text'
                  className='ui fluid   input'
                  onChange={this.handleName.bind(this)}
                  defaultValue={this.state.name}
                  fluid
                  inputprops={{
                    maxLength: 50,
                  }}
                />
              </div>
            </div>
            <div className="col-5 offset-7">
              <div className="form-group">
                <Input
                  placeholder='Password'
                  icon='key' iconPosition='left'
                  // label="Password"
                  type="password"
                  className='ui fluid   input'
                  onChange={this.handlepassword.bind(this)}
                  defaultValue={this.state.password}
                  fluid
                  inputprops={{
                    maxLength: 50,
                  }}
                />
              </div>
            </div>
            { this.state.mode == "register" &&
            <div className="col-5 offset-7">
              <div className="form-group">
                <Input
                  placeholder='Confirm Password'
                  icon='key' iconPosition='left'
                  // label="Password"
                  type="password"
                  className='ui fluid   input'
                  onChange={this.handleConfirmPassword.bind(this)}
                  defaultValue={this.state.confirmPassword}
                  fluid
                  inputprops={{
                    maxLength: 50,
                  }}
                />
              </div>
            </div>

             }
             { this.state.mode == "register" &&
                <div className="col-5 offset-7">
                  <div className="form-group">
                    <Input
                      placeholder='First Name'
                      // label="Password"
                      type="text"
                      className='ui fluid   input'
                      onChange={this.handleFirstName.bind(this)}
                      defaultValue={this.state.firstName}
                      fluid
                      inputprops={{
                        maxLength: 50,
                      }}
                    />
                  </div>
                </div>
            }
            { 
              this.state.mode == "register" &&
              <div className="col-5 offset-7">
                <div className="form-group">
                  <Input
                    placeholder='Last Name'
                    // label="Password"
                    type="text"
                    className='ui fluid   input'
                    onChange={this.handleLastName.bind(this)}
                    defaultValue={this.state.lastName}
                    fluid
                    inputprops={{
                      maxLength: 50,
                    }}
                  />
                </div>
              </div>
            }
            

            <div className="col-5 offset-7">
              <div>
                {this.state.mode == "login" &&
                <button type="button" onClick={this.onClickLoginSubmit}>
                  Login
                <div id="fse" className={"spinner " + (this.state.loading ? "visible" : "invisible")}>
                    <Loader
                      type="Oval"
                      color="#fff"
                      height="15"
                      width="15"
                    />
                  </div>
                </button>
              }
                {this.state.mode == "login" &&
                <button type="button" onClick={e => this.switchMode("register")}>
                  Register
                <div id="fse" className={"spinner " + (this.state.loading ? "visible" : "invisible")}>
                    <Loader
                      type="Oval"
                      color="#fff"
                      height="15"
                      width="15"
                    />
                  </div>
                </button>
              }
                 {this.state.mode == "register" &&
                 <button type="button" onClick={this.registerUser}>
                  Register
                <div id="fse" className={"spinner " + (this.state.loading ? "visible" : "invisible")}>
                    <Loader
                      type="Oval"
                      color="#fff"
                      height="15"
                      width="15"
                    />
                  </div>
                </button>
                 }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log(state);
  return {
    config: state.config,
  };
};
export default withRouter(connect(mapStateToProps)(LoginPage));

