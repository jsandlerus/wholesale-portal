import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import loading from "../../resources/images/loading.svg";


class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        hasSigned: false,
        canSign: false,
        loading: false
    }
  }

  componentDidMount() {
      this.setState({
          loading: true
      })
    axios
        .get("/docuSign/userHasSigned")
        .then(res => {
            this.setState({
                hasSigned: res.data,
                loading: false
            })
        })
        .catch((err) => {
            this.setState({
                loading: false
            })
            console.log(err)
        });
      axios
          .get("/docuSign/userCanSign")
          .then(res => {
              if(res.data)
              {
                  this.setState({
                      canSign: true,
                      loading: false
                  })
              }
              else {
                  this.setState({
                      loading: false
                  })
              }
          })
          .catch((err) => {
              this.setState({
                  loading: false
              })
              console.log(err)
          });
  }
    getUserInformation = async () => {
        console.log("getting user information");
        axios.get("/docuSign/userToken")
            .then(res => {
                const authorization = res.data
                console.log(authorization)
                const config = {
                    headers: {
                        Authorization:"Bearer " + authorization
                    }
                }
                axios.post("https://cors-anywhere.herokuapp.com/" + "https://account-d.docusign.com/oauth/userinfo", config)
                    .then(res => {
                        console.log(res.data)
                    })
                    .catch(err => {
                        console.log(err)
                    });
            })
    }

    checkForRedirect = () => {
        console.log("checking for redirect")
        let params = new URLSearchParams(window.location.href);
        if (params.has("http://localhost:3000/account?code"))
        {
            /*needed to get code grant*/
            const code = params.get("http://localhost:3000/account?code")
            /*{!} need that to be stored somewhere else*/
            const integration_key = "bcdf5aa2-ce00-41fd-aa29-310460785082";
            const secret_key = "a9fc7847-5160-4061-850f-30569ed9b3bf";
            const mergedKeys = window.btoa(integration_key + ":" + secret_key)

            const data = {
                grant_type: "authorization_code",
                code: code
            }

            const config = {
                headers: {
                    Authorization: "Basic " + mergedKeys,
                }
            }

         axios.post("https://cors-anywhere.herokuapp.com/" + "https://account-d.docusign.com/oauth/token", data, config)
                 .then(res => {
                     axios.post("/docuSign/confirmUser", res.data)
                         .then(res => {
                             this.setState({
                                 canSign: true,
                                 loading: false
                             })
                         })
                         .catch(err => {
                             console.log(err)
                             this.setState({
                                 loading: false
                             })
                         });
                     this.setState({
                         loading: false
                     })
                 })
                .catch(err => {
                    console.log(err)
                    this.setState({
                        loading: false
                    })
                });
        }
    }

    redirect_url = "https://account-d.docusign.com/oauth/auth?response_type=code " +
                  "&scope=YOUR_REQUESTED_SCOPES" +
                  "&client_id=bcdf5aa2-ce00-41fd-aa29-310460785082" +
                  "&redirect_uri=http://localhost:3000/account"

  render() {
    return (
      <div className="account">
        <h1>account</h1>
        <h2>Confirm DocuSign</h2>
        <div style={{width: "20vw", height: "30vh", border: "1px blue solid"}}>
          PDF TO SIGN
        </div>
          {(() => {
              if (this.state.loading) {
                  return (<img src = {loading} />)
              }
              else if (!this.state.canSign){
                  return (
                      <div>
                          <div onClick= {this.checkForRedirect}>Try</div>
                          <a target="_self" href={this.redirect_url}>Confirm You Can Sign</a>
                      </div>
                  );
              }
              else if (!this.state.hasSigned) {
                  return (<div onClick={this.getUserInformation}>Sign!</div>)
              }
              else {
                  return (<h2>All good! All signed!</h2>)
              }
          })()}

      </div>
    );
  }
}
export default Account;
