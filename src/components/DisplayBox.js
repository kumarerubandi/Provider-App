import React, { Component } from 'react';
//import { connect } from 'react-redux';
import styles from './card-list.css';
import { button } from 'semantic-ui-react'
import Button from 'terra-button';
import TerraCard from 'terra-card';
import Text from 'terra-text';
//import cx from 'classnames';
// import PropTypes from 'prop-types';
import axios from 'axios';
import { createToken } from '../components/Authentication';
import Client from 'fhir-kit-client';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { faLaughWink } from '@fortawesome/free-solid-svg-icons';

// const propTypes = {
/**
 * A boolean to determine if the context of this component is under the Demo Card feature of the Sandbox, or in the actual
 * hook views that render cards themselves. This flag is necessary to make links and suggestions unactionable in the Card Demo view.
 */
//  isDemoCard: PropTypes.bool,
/**
 * The FHIR access token retrieved from the authorization server. Used to retrieve a launch context for a SMART app
 */
// fhirAccessToken: PropTypes.object,
/**
 * Function callback to take a specific suggestion from a card
 */
//takeSuggestion: PropTypes.func.isRequired,
/**
 * Identifier of the Patient resource for the patient in context
 */
//patientId: PropTypes.string,
/**
 * The FHIR server URL in context
 */
// fhirServerUrl: PropTypes.string,
/**
 * JSON response from a CDS service containing potential cards to display
 */
//cardResponses: PropTypes.object,
// };

class DisplayBox extends Component {
  constructor(props) {
    super(props);
    this.launchLink = this.launchLink.bind(this);
    this.launchSource = this.launchSource.bind(this);
    this.renderSource = this.renderSource.bind(this);
    this.modifySmartLaunchUrls = this.modifySmartLaunchUrls.bind(this);
    this.retrieveLaunchContext = this.retrieveLaunchContext.bind(this);

    this.state = {
      config: sessionStorage.getItem('config') !== undefined ? JSON.parse(sessionStorage.getItem('config')) : {},
      accessToken: '',
      messageJson: {
        "resourceType": "MessageDefinition",
        "status": "draft",
        "category": { "code": "notification" },
        "focus": [
          {
            "code": "Patient",
            "profile": {
              "reference": "StructureDefinition/example"
            },
            "min": 2,
            "max": "2"
          }
        ]
      }
    };
  }
  /**
   * Take a suggestion from a CDS service based on action on from a card. Also pings the analytics endpoint (if any) of the
   * CDS service to notify that a suggestion was taken
   * @param {*} suggestion - CDS service-defined suggestion to take based on CDS Hooks specification
   * @param {*} url - CDS service endpoint URL
   */

  takeSuggestion(suggestion, url) {
    if (!this.props.isDemoCard) {
      if (suggestion.label) {
        if (suggestion.uuid) {
          axios({
            method: 'POST',
            url: `${url}/analytics/${suggestion.uuid}`,
            data: {},
          });
        }
        console.log("Take suggestion");
        // console.log(suggestion);
        // console.log(this.props);
        this.props.takeSuggestion(suggestion);
      } else {
        console.error('There was no label on this suggestion', suggestion);
      }
    }
  }

  /**
   * Prevent the source link from opening in the same tab
   * @param {*} e - Event emitted when source link is clicked
   */
  launchSource(e) {
    e.preventDefault();
  }

  /**
   * Open the absolute or SMART link in a new tab and display an error if a SMART link does not have
   * appropriate launch context if used against a secured FHIR endpoint.
   * @param {*} e - Event emitted when link is clicked
   * @param {*} link - Link object that contains the URL and any error state to catch
   */
  launchLink(e, link) {
    if (!this.props.isDemoCard) {
      e.preventDefault();
      if (link.error) {
        // TODO: Create an error modal to display for SMART link that cannot be launched securely
        return;
      }
      window.open(link.url, '_blank');
    }
  }

  /**
   * For SMART links, modify the link URLs as this component processes them according to two scenarios:
   * 1 - Secured: Retrieve a launch context for the link and append a launch and iss parameter for use against secured endpoints
   * 2 - Open: Append a fhirServiceUrl and patientId parameter to the link for use against open endpoints
   * @param {*} card - Card object to process the links for
   */
  modifySmartLaunchUrls(card) {
    console.log("Props---", this.props);
    return card.links.map((link) => {
      let linkCopy = Object.assign({}, link);
      console.log("LInkkk obj", link)
      if (link.type === 'smart') {
        // this.retrieveLaunchContext(
        //   linkCopy, this.props.fhirAccessToken,
        //   this.props.patientId, this.props.fhirServerUrl,
        // ).then((result) => {
        //   linkCopy = result;
        //   console.log("Link after retrieve method---", linkCopy);
        //   return linkCopy;
        // });
        this.retrieveLaunchContext(
          linkCopy, this.props.fhirAccessToken,
          this.props.patientId, this.props.fhirServerUrl,
        ).then((result) => {
          linkCopy = result;
          console.log("Link after retrieve method---", linkCopy);
          return linkCopy;
        });
      }
      console.log("final---", linkCopy);
      return linkCopy;
    });
  }

  /**
 * Retrieves a SMART launch context from an endpoint to append as a "launch" query parameter to a SMART app launch URL (see SMART docs for more about launch context).
 * This applies mainly if a SMART app link on a card is to be launched. The link needs a "launch" query param with some opaque value from the SMART server entity.
 * This function generates the launch context (for HSPC Sandboxes only) for a SMART application by pinging a specific endpoint on the FHIR base URL and returns
 * a Promise to resolve the newly modified link.
 * @param {*} link - The SMART app launch URL
 * @param {*} accessToken - The access token provided to the CDS Hooks Sandbox by the FHIR server
 * @param {*} patientId - The identifier of the patient in context
 * @param {*} fhirBaseUrl - The base URL of the FHIR server in context
 */


  retrieveLaunchContext(link, accessToken, patientId, fhirBaseUrl) {
    return new Promise((resolve, reject) => {
      if (link.url.indexOf('?') < 0) {
        link.url += '?';
      } else {
        link.url += '&';
      }

      link.url += `iss=` + this.state.config.provider_fhir_url;
      if (link.appContext) {
        // link.url += `&launch=` + link.appContext;
        link.url += `&app_context=` + link.appContext;
      }
      link.url += `&client_id=` + this.state.config.provider_client_id;
      //link.url += `client_id=` + this.state.config.provider_client_id;
      console.log("link----", link);
      return resolve(link);
    })

    // return new Promise((resolve, reject) => {
    //   const headers = {
    //     Accept: 'application/json',
    //     Authorization: `Bearer ${accessToken.access_token}`,
    //   };

    //   const launchParameters = {
    //     patient: patientId,
    //   };
    //   let description;

    //   if (link.appContext) {
    //     console.log("Inside app context if")
    //     launchParameters.appContext = link.appContext;
    //     description = "template=" + link.appContext.template + "&request=" + JSON.stringify(link.appContext.request) + "&patient=" + patientId
    //   }
    //   // May change when the launch context creation endpoint becomes a standard endpoint for all EHR providers
    //   let messageJson = this.state.messageJson;
    //   messageJson['description'] = encodeURIComponent(description);
    //   console.log(this.state.config.provider_fhir_url, 'point')
    //   const fhirClient = new Client({ baseUrl: this.state.config.provider_fhir_url });
    //   fhirClient.create({
    //     resourceType: "MessageDefinition",
    //     body: messageJson,
    //     headers: {
    //       "Content-Type": "application/fhir+json",
    //       "Authorization": accessToken
    //     }
    //   }).then((result) => {
    //     console.log("message def result", result);
    //     if (result && Object.prototype.hasOwnProperty.call(result, 'id')) {
    //       if (link.url.indexOf('?') < 0) {
    //         link.url += '?';
    //       } else {
    //         link.url += '&';
    //       }
    //       link.url += `launch=${result.id}`;
    //       link.url += `&iss=` + this.state.config.provider_fhir_url;
    //       return resolve(link);
    //     }
    //     console.error('FHIR server endpoint did not return a launch_id to launch the SMART app. See network calls to the Launch endpoint for more details');
    //     link.error = true;
    //     return reject(link);
    //   }).catch((err) => {
    //     console.error('Cannot grab launch context from the FHIR server endpoint to launch the SMART app. See network calls to the Launch endpoint for more details', err);
    //     link.error = true;
    //     return reject(link);
    //   });
    // });
  }

  /**
   * Helper function to build out the UI for the source of the Card
   * @param {*} source - Object as part of the card to build the UI for
   */
  renderSource(source) {
    if (!source.label) { return null; }
    let icon;
    if (source.icon) {
      icon = <img className={styles['card-icon']} src={source.icon} alt="Could not fetch icon" width="100" height="100" />;
    }
    if (!this.props.isDemoCard) {
      return (
        <p>
          Source: <a className={styles['source-link']} href={source.url || '#'} target="_blank">{source.label}</a>
          {icon}
        </p>
      );
    }
    return (
      <p>

        Source:
            <a // eslint-disable-line jsx-a11y/anchor-is-valid
          className={styles['source-link']}
          href={source.url || '#'}
          onClick={e => this.launchSource(e)}
        >
          {source.label}
        </a>

        {icon}
      </p>
    );
  }
  render() {
    const indicators = {
      info: 0,
      warning: 1,
      'hard-stop': 2,
      error: 3,
    };

    const summaryColors = {
      info: '#0079be',
      warning: '#ffae42',
      'hard-stop': '#c00',
      error: '#333',
    };
    const renderedCards = [];
    // Iterate over each card in the cards array
    if (this.props.response != null) {
      console.log("Resspsp", this.props.response.hasOwnProperty('requirements'), this.props.response);
      // var prior_auth = this.props.response.links[0].appContext.prior_auth
      if (this.props.req_type !== "coverage_determination" && (this.props.response.hasOwnProperty('cards')) && this.props.response.cards != null) {
        this.props.response.cards
          .sort((b, a) => indicators[a.indicator] - indicators[b.indicator])
          .forEach((c, cardInd) => {
            const card = JSON.parse(JSON.stringify(c));

            // -- Summary --
            const summarySection = <h3>{card.summary}</h3>;

            // -- Source --
            const sourceSection = card.source && Object.keys(card.source).length ? this.renderSource(card.source) : '';

            // -- Detail (ReactMarkdown supports Github-flavored markdown) --
            const detailSection = '';


            // -- Suggestions --
            let suggestionsSection;
            if (card.suggestions) {
              suggestionsSection = card.suggestions.map((item, ind) => (
                <Button
                  key={ind}
                  onClick={() => this.takeSuggestion(item, card.serviceUrl)}
                  text={item.label}
                  variant={Button.Opts.Variants.EMPHASIS}
                />
              ));
            }

            // -- Links --
            let linksSection;
            if (card.links) {
              console.log("Smart launch url --1---", this.modifySmartLaunchUrls(card));
              card.links = this.modifySmartLaunchUrls(card) || card.links;
              console.log("Smart launch url -----", card.links);
              linksSection = card.links.map((link, ind) => (
                <div key={ind}>
                  {link !== undefined &&
                    <div className="div-prior-auth">
                      <p>Prior Authorization is  necessary </p>
                      {link.hasOwnProperty('appContext') && link.appContext.hasOwnProperty("prior_auth") &&
                        <ul className="prior_auth_ul">
                          {
                            Object.keys(link.appContext.prior_auth).map(function (code, index) {
                              console.log("in prior auth loop--", code);
                              return <li>
                                {link.appContext.prior_auth[code].value == true &&
                                  <p>Prior Authorization necessary for {code}</p>
                                }
                                {link.appContext.prior_auth[code].value == false &&
                                  <p>No Prior Authorization is Needed for {code} </p>
                                }
                              </li>
                            })
                          }
                        </ul>

                      }

                    </div>
                  }
                  {/* <a className="cta-btn" target="_blank" href={link.url}>{link.label}</a> */}
                  <button className="smart-btn"
                    onClick={e => this.launchLink(e, link)}
                    text={link.label}
                    variant={Button.Opts.Variants['DE-EMPHASIS']}
                  >{link.label}</button>
                </div>
              ));
            }


            const builtCard = (
              <section id="call-to-action" className="call-to-action wow fadeIn" key={cardInd}>
                <div className="container text-center">


                  {detailSection}
                  <div className={styles['suggestions-section']}>
                    {suggestionsSection}
                  </div>
                  <div className={styles['links-section']}>
                    {linksSection}
                  </div>
                </div>
              </section>
              // <TerraCard key={cardInd} className='decision-card alert-info'>
              //   {summarySection}
              //   {sourceSection}
              //   {detailSection}
              //   <div className={styles['suggestions-section']}>
              //     {suggestionsSection}
              //   </div>

              //   <div className={styles['links-section']}>
              //     {linksSection}
              //   </div>
              // </TerraCard>
            );

            renderedCards.push(builtCard);
          });
      }
    }

    // if(this.props.req_type === "coverage_decision" && this.props.response != null && this.props.response.hasOwnProperty("success")){
    //   if(this.props.response.success){
    //       return <div className='decision-card alert-info'><strong>Success : </strong> {this.props.response.message}</div>
    //   }
    //   else{
    //     return <div className='decision-card alert-warning'><strong> Failed : </strong> {this.props.response.message}</div>
    //   }
    // }
    // else if(this.props.req_type === "prior-authorization" && this.props.response != null && this.props.response.hasOwnProperty("PriorAuthorization")){
    //   if(this.props.response.PriorAuthorization){
    //       return <div className='decision-card alert-info'><strong>Prior Authorization : </strong> Yes</div>
    //   }
    //   else{
    //     return <div className='decision-card alert-warning'><strong>Prior Authorization : </strong> No</div>
    //   }
    // }
    if (renderedCards.length === 0) { return <div><div className='decision-card alert-warning'>No Cards</div></div>; }
    else {
      return <div className="col-8 offset-2" style={{ marginTop: "30px", marginBottom: "50px" }}>{renderedCards}</div>;
    }

  }
}

function mapStateToProps(state) {
  console.log(state);
  return {
    config: state.config,
  };
};
export default withRouter(connect(mapStateToProps)(DisplayBox));
