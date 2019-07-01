import React from "react";
import { connect } from 'react-redux';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
// Application Components
import AddressSectionEdit from "./AddressSectionEdit.jsx";
// Importing redux-custom-actions
import { updateUserAction } from '../../../../actions/userActions';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  console.log("getModalStyle")
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  addressField: {
    width: 400
  },
  fabMargin: {
    margin: theme.spacing.unit,
  },
  displayBlock: {
    display: "block"
  },
  floatBtnRight: {
    float: "right"
  },
  floatBtnLeft: {
    float: "left"
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows.unit * 5,
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
  card: {
    margin: theme.spacing.unit * 3,
  }
});

class AddressSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false, openDialog: false, openDialog2: false };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangeDefault = this.handleChangeDefault.bind(this);
    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDeleteAddress = this.handleDeleteAddress.bind(this);
  }

  handleOpen() {
    this.setState({ modalOpen: true });
  }

  handleClose() {
    this.setState({ modalOpen: false });
  }

  handleOpenDialog() {
    const { address, currUser } = this.props;
    if ((currUser.defaultShippingAddressId === address.id) || (currUser.defaultBillingAddressId === address.id)) {
      this.setState({
        openDialog2: true
      })
    } else {
      this.setState({
        openDialog: true
      })
    }
  }

  handleDialogClose() {
    this.setState({
      openDialog2: false,
      openDialog: false
    })
  }

  async handleChangeDefault(name, event) {
    const { address, currUser, parent } = this.props;
    let checkedAction = event.target.checked;
    if (!checkedAction) {
      return;
    }
    console.log("handleChangeDefault", name);
    let currParent = {};
    if (parent.name === "AddressForm") {
      currParent = parent.props.parent;
    } else {
      currParent = parent.props.parent.props.parent;
    }
    let requestBody = {
      "version": currUser.version,
      "actions": [{
        "action": (name === 'shipping') ? "setDefaultShippingAddress" : "setDefaultBillingAddress",
        "addressId": address.id
      }]
    }
    this.props.updateUserAction(requestBody);
  }

  async handleDeleteAddress() {
    const { address, currUser, parent } = this.props;
    let currParent = {};
    if (parent.name === "AddressForm") {
      currParent = parent.props.parent;
    } else {
      currParent = parent.props.parent.props.parent;
    }
    let requestBody = {
      "version": currUser.version,
      "actions": [{
        "action": "removeAddress",
        "addressId": address.id
      }]
    }
    this.props.updateUserAction(requestBody);
  }

  componentWillReceiveProps(nextProps) {
    let { userFromReducer, errorFromReducer, parent } = nextProps;
    if (errorFromReducer) {
      // Display some error popup.
      return;
    }
    if (userFromReducer.id) {
      return;
    }
  }

  render() {
    const { classes, address, currUser, parent, selectedValue } = this.props;
    let { openDialog, openDialog2 } = this.state;
    let checkedDefaultShipping = false;
    if (currUser.defaultShippingAddressId === address.id) {
      checkedDefaultShipping = true;
    }
    let checkedDefaultBilling = false;
    if (currUser.defaultBillingAddressId === address.id) {
      checkedDefaultBilling = true;
    }
    let fullName = [address.firstName, address.lastName].join(" ");
    let street = [address.streetNumber, address.streetName].join(" ");
    let cityRegion = [address.city, address.region].join(" ");
    let postalCountry = [address.country, address.postalCode].join(" ");
    let modalOpen = this.state && this.state.modalOpen ? this.state.modalOpen : false;
    return (
      <Card className={classes.card}>
        <CardActions className={classes.displayBlock}>
          {parent.name === "AddressForm" && (
            <Radio
              checked={selectedValue === address.id}
              onChange={() => parent.handleAddressSelect(address)}
              value="a"
              name="radio-button-demo"
              inputProps={{ 'aria-label': 'A' }}
              className={classes.floatBtnLeft}
            />
          )}
          <Button size="medium" color="primary" className={classes.floatBtnLeft}>
            {address.id}
          </Button>
          <Button size="small" color="primary" variant="contained" className={classes.floatBtnRight} onClick={this.handleOpenDialog}>
            Delete
          </Button>
          <Button size="small" color="primary" variant="contained" className={classes.floatBtnRight} onClick={this.handleOpen}>
            Edit
          </Button>
        </CardActions>
        <CardActionArea>
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {fullName}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {street}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {cityRegion}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {postalCountry}
            </Typography>
            <FormControlLabel
              value="start"
              control={
                <Switch
                  checked={checkedDefaultShipping}
                  onChange={() => this.handleChangeDefault('shipping', event)}
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              }
              label="Default Shipping"
              labelPlacement="start"
            />
            <FormControlLabel
              value="start"
              control={
                <Switch
                  checked={checkedDefaultBilling}
                  onChange={() => this.handleChangeDefault('billing', event)}
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              }
              label="Default Billing"
              labelPlacement="start"
            />
          </CardContent>
        </CardActionArea>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={modalOpen}
          onClose={() => this.handleClose()}
        >
          <AddressSectionEdit currUser={currUser} address={address} parent={this} />
        </Modal>
        <Dialog
          open={openDialog}
          onClose={this.handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Are you sure, you want to delete this address?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Performing this action will delete the address from the database, there will be no backup for recovery.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} variant="contained" color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleDeleteAddress} variant="contained" color="secondary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDialog2}
          onClose={this.handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">You cannot delete this address!</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Performing this action is allowed, since this address has been marked as default for SHIPPING or BILLING or BOTH.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} variant="contained" color="secondary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    );
  }
}

const mapStatesToProps = state => ({
  userFromReducer: state.user.currUser,
  errorFromReducer: state.user.error
})

export default withStyles(styles)(connect(mapStatesToProps, { updateUserAction })(AddressSection));
