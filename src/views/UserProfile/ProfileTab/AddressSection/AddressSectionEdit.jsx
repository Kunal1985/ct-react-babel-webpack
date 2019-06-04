import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import { updateCustomer } from "../../../../utils/CommonUtils";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows.unit * 5,
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
});

class AddressSectionEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: props.address ? props.address : {},
      modalStyle: getModalStyle()
    };
    this.saveAddress = this.saveAddress.bind(this);
    this.cancelSaveAddress = this.cancelSaveAddress.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async saveAddress(){
    let { currUser, parent, ancestor } = this.props;
    let currAddress = this.props.address;
    let { address } = this.state;
    let requestBody;
    let currParent;
    if(currAddress){
      requestBody = {
        version: currUser.version,
        actions: [{
          action: "changeAddress",
          addressId: address.id,
          address: address
        }]
      }
      currParent = parent.props.parent.props.parent.props.parent;
    } else{
      requestBody = {
        version: currUser.version,
        actions: [{
          action: "addAddress",
          address: address
        }]
      }
      currParent = parent.props.parent.props.parent;
    }
    console.log(currParent);
    let response = await updateCustomer(requestBody);
    if(response.body){
      currParent.fetchCustomerDetails(response.body.id);
      parent.handleClose();
    } else{
      // Display some error message.
    }
    console.log("saveAddress", address);
  }

  cancelSaveAddress(){
    let {parent} = this.props;
    parent.handleClose();
    console.log("cancelSaveAddress");
  }

  handleChange = name => event => {
    let address = this.state.address;
    address[name] = event.target.value;
    this.setState({address: address});
  }

  render() {
    const { classes, currUser, parent } = this.props;
    const { address } = this.state;
    let modalStyle = this.state.modalStyle;
    return (
      <div style={modalStyle} className={classes.paper}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <TextField
              id="firstName"
              label="First Name"
              className={classes.textField}
              defaultValue={address.firstName}
              margin="normal"
              onChange={this.handleChange('firstName')}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <TextField
              id="lastName"
              label="Last Name"
              className={classes.textField}
              defaultValue={address.lastName}
              margin="normal"
              onChange={this.handleChange('lastName')}
            />
          </GridItem>  
          <GridItem xs={12} sm={12} md={6}>
            <TextField
              id="streetNumber"
              label="Street Number"
              className={classes.textField}
              defaultValue={address.streetNumber}
              margin="normal"
              onChange={this.handleChange('streetNumber')}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <TextField
              id="streetName"
              label="Street Name"
              className={classes.textField}
              defaultValue={address.streetName}
              margin="normal"
              onChange={this.handleChange('streetName')}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <TextField
              id="city"
              label="City"
              className={classes.textField}
              defaultValue={address.city}
              margin="normal"
              onChange={this.handleChange('city')}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <TextField
              id="region"
              label="Region"
              className={classes.textField}
              defaultValue={address.region}
              margin="normal"
              onChange={this.handleChange('region')}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <TextField
              id="postalCode"
              label="PostalCode"
              className={classes.textField}
              defaultValue={address.postalCode}
              margin="normal"
              onChange={this.handleChange('postalCode')}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <TextField
              id="country"
              label="Country"
              className={classes.textField}
              defaultValue={address.country}
              margin="normal"
              onChange={this.handleChange('country')}
            />
          </GridItem>
          <GridItem xs={6} sm={6} md={6}>
            <Button variant="contained" size="small" color="primary" onClick={() => this.saveAddress()}>
              Save
            </Button>
          </GridItem>
          <GridItem xs={6} sm={6} md={6}>
            <Button variant="contained" size="small" color="secondary" onClick={() => this.cancelSaveAddress()}>
              Cancel
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(styles)(AddressSectionEdit);
