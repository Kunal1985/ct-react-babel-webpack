import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import { getModalStyle, updateCustomer } from "../../../utils/CommonUtils";

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

class ProfileDetailsEdit extends React.Component {
  constructor(props) {
    super(props);
    let { currUser } = props;
    this.state = {
      currUser,
      modalStyle: getModalStyle()
    };
    this.saveDetails = this.saveDetails.bind(this);
    this.cancelSaveDetails = this.cancelSaveDetails.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async saveDetails() {
    let { parent } = this.props;
    let { currUser } = this.state;
    let { firstName, lastName } = currUser;
    console.log("saveDetails", firstName, lastName);
    let requestBody = {
      version: currUser.version,
      actions: [{
        action: "setFirstName",
        firstName
      },{
        action: "setLastName",
        lastName
      }]
    }
    let currParent = parent.props.parent.props.parent;
    console.log(currParent);
    let response = await updateCustomer(requestBody);
    if(response.body){
      currParent.fetchCustomerDetails(response.body.id);
      parent.handlePDModalClose();
    } else{
      // Display some error message.
    }
  }

  cancelSaveDetails() {
    let { parent } = this.props;
    parent.handlePDModalClose();
    console.log("cancelSaveDetails");
  }

  handleChange = name => event => {
    let currUser = this.state.currUser;
    currUser[name] = event.target.value;
    this.setState({ currUser: currUser });
  }

  render() {
    const { classes } = this.props;
    const { currUser } = this.state;
    let modalStyle = this.state.modalStyle;
    return (
      <div style={modalStyle} className={classes.paper}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <TextField
              id="firstName"
              label="First Name"
              className={classes.textField}
              defaultValue={currUser.firstName}
              margin="normal"
              onChange={this.handleChange('firstName')}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <TextField
              id="lastName"
              label="Last Name"
              className={classes.textField}
              defaultValue={currUser.lastName}
              margin="normal"
              onChange={this.handleChange('lastName')}
            />
          </GridItem>
          <GridItem xs={6} sm={6} md={6}>
            <Button variant="contained" size="small" color="primary" onClick={() => this.saveDetails()}>
              Save
            </Button>
          </GridItem>
          <GridItem xs={6} sm={6} md={6}>
            <Button variant="contained" size="small" color="secondary" onClick={() => this.cancelSaveDetails()}>
              Cancel
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(styles)(ProfileDetailsEdit);
