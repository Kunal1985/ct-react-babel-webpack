import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import { getCurrCustomerId, fetchCustomer } from "../../../utils/CommonUtils";
import ProfileTabView from "./ProfileTabView.jsx";

const styles = theme => ({
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  email: {
    width: 300
  },
  addressField: {
    width: 400
  }
});

class ProfileTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.toggleUpdate = this.toggleUpdate.bind(this);
  }

  componentDidMount(){
  }

  toggleUpdate(){
    let currUpdateStatus = this.state.udpateProfile;
    this.setState({
      udpateProfile: !currUpdateStatus
    })
  }
  
  render(){
    const { classes } = this.props;
    let currUser = this.props.currUser;
    let defaultAddress = currUser && currUser.addresses && currUser.addresses[0] ? currUser.addresses[0] : "No Address registered!";
    if(defaultAddress){
      let street = [defaultAddress.streetNumber, defaultAddress.streetName].join(" ");
      let cityRegion = [defaultAddress.city, defaultAddress.region].join(" ");
      let postalCountry = [defaultAddress.country, defaultAddress.postalCode].join(" ");
      defaultAddress = [street, cityRegion, postalCountry].join("\n");
    }
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            {currUser && !this.state.udpateProfile ? (
              <div>
                <ProfileTabView currUser={currUser}/>
                <Button color="primary" onClick={this.toggleUpdate}>Update Profile</Button>
              </div>
            ): (
              <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
                <p className={classes.cardCategoryWhite}>Complete your profile</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={5}>
                    <CustomInput
                      labelText="Company (disabled)"
                      id="company-disabled"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="Username"
                      id="username"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Email address"
                      id="email-address"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="First Name"
                      id="first-name"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Last Name"
                      id="last-name"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="City"
                      id="city"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Country"
                      id="country"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: "US"
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Postal Code"
                      id="postal-code"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <InputLabel style={{ color: "#AAAAAA" }}>About me</InputLabel>
                    <CustomInput
                      labelText="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
                      id="about-me"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        multiline: true,
                        rows: 5
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="primary" onClick={this.toggleUpdate}>Save Profile</Button>
              </CardFooter>
            </Card>
            )}            
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(styles)(ProfileTab);
