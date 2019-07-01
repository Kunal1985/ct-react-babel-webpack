import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import { getModalStyle, updateCustomer } from "../../../utils/CommonUtils";
import { connect } from 'react-redux';
import { updateUserAction } from '../../../actions/userActions'

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

  handleChange = name => event => {
    let currUser = this.state.currUser;
    currUser[name] = event.target.value;
    this.setState({ currUser: currUser });
  }

  cancelSaveDetails() {
    let { parent } = this.props;
    parent.handlePDModalClose();
  }

  async saveDetails() {
    let { parent } = this.props;
    let { currUser } = this.state;
    let { firstName, lastName } = currUser;
    let requestBody = {
      version: currUser.version,
      actions: [{
        action: "setFirstName",
        firstName
      }, {
        action: "setLastName",
        lastName
      }]
    }
    this.props.updateUserAction(requestBody);
  }

  componentWillReceiveProps(nextProps){
    let { userFromReducer, errorFromReducer, parent } = nextProps;
    if (errorFromReducer) {
      // Display some error popup.
      return;
    }
    if (userFromReducer.id) {
      parent.handlePDModalClose();
    }
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

const mapStatesToProps = state => ({
  userFromReducer: state.user.currUser,
  errorFromReducer: state.user.error
})

export default withStyles(styles)(connect(mapStatesToProps, { updateUserAction })(ProfileDetailsEdit));
