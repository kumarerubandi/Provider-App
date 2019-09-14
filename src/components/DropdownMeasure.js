import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { createToken } from './Authentication';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

let blackBorder = "blackBorder";

export class DropdownMeasure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentValue: "",
            measures: []
        };
        console.log("props------", props);
        this.handleChange = this.handleChange.bind(this);

    };

    async componentDidMount() {
        try {
            let measures = await this.getResources();
            let list = [];
            let i = 0;
            measures.entry.map((item, key) => {
                i = i + 1;
                let res = item.resource;
                let measure_state = { key: '', value: '', text: '' };
                let id ;
                Object.keys(res).map((k, v) => {
                    if (k == 'id') {
                        measure_state.value = res[k];
                        id = res[k];
                        measure_state.key = res[k];
                    }
                    if (k == 'title') {
                        measure_state.text = res[k] + "-"+ id;
                    }
                    
                });
                list.push(measure_state);
            });
            this.setState({measures:list});
        } catch (error) {
            console.log('Measure list', error);
        }

    }

    async getResources() {
        var url = this.props.config.measure.fhir_url+'/Measure';
        let token;
        token = await createToken(this.props.config.provider.grant_type, 'provider', sessionStorage.getItem('username'), sessionStorage.getItem('password'))
        let headers = {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        }

        let measures = await fetch(url, {
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
        console.log(measures, 'sender')
        return measures;
    }

    handleChange = (e, { value }) => {
        // console.log(this.props, value);
        this.props.updateCB(this.props.elementName, value)
        this.setState({ currentValue: value })
    }

    render() {
        // console.log("this.state", this.state);
        const { currentValue } = this.state;
        if (currentValue) {
            blackBorder = "blackBorder";
        } else {
            blackBorder = "";
        }
        return (
            <Dropdown
                className={blackBorder}
                options={this.state.measures}
                placeholder='Select Measure'
                search
                selection
                fluid
                onChange={this.handleChange}
            />
        )
    }
}

function mapStateToProps(state) {
    console.log(state);
    return {
      config: state.config,
    };
  };
export default withRouter(connect(mapStateToProps)(DropdownMeasure));