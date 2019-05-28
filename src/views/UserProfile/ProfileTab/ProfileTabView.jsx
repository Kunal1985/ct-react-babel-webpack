import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import avatar from "assets/img/profile-pic.jpg";
import { getCurrCustomerId, fetchCustomer } from "../../../utils/CommonUtils";

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
  },
  marginTopStyle: {
    marginTop: theme.spacing.unit * 10
  }
});

class ProfileTabView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
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
      <Card profile className={classes.marginTopStyle}>
        <CardAvatar profile>
          <a href="#pablo" onClick={e => e.preventDefault()}>
            <img src={avatar} alt="..." />
          </a>
        </CardAvatar>
        <CardBody profile>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <TextField
                id="standard-name"
                label="Email ddress"
                className={classNames(classes.textField, classes.email)}
                value={currUser.email}
                margin="normal"
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <TextField
                id="standard-name"
                label="First Name"
                className={classes.textField}
                value={currUser.firstName}
                margin="normal"
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <TextField
                id="standard-name"
                label="First Name"
                className={classes.textField}
                value={currUser.lastName}
                margin="normal"
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={4}>
              <TextField
                id="outlined-multiline-static"
                label="Address"
                multiline
                rows="4"
                value={defaultAddress}
                className={classNames(classes.textField, classes.addressField)}
                margin="normal"
                variant="outlined"
              />
            </GridItem>
          </GridContainer>
        </CardBody>
      </Card>      
    );
  }
}

export default withStyles(styles)(ProfileTabView);
