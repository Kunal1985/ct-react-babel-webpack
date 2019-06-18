import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddressForm from './AddressForm.jsx';
import PaymentForm from './PaymentForm.jsx';
import Review from './Review.jsx';
import { getOrderNumber, getCurrCustomerId, fetchCustomer } from '../../utils/CommonUtils.js';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3,
    },
  },
  stepper: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
  },
});

const steps = ['Shipping address', 'Review your order'];

class Checkout extends React.Component {
  state = {
    activeStep: 0,
  };

  getStepContent(step) {
    console.log("getStepContent", step);
    let { submitAddress, submitReview, currUser } = this.state;
    switch (step) {
      case 0:
        return <AddressForm submit={submitAddress} parent={this} currUser={currUser} />;
      case 1:
        return <Review submit={submitReview} parent={this} />;
      default:
        throw new Error('Unknown step');
    }
  }

  handleNext = () => {
    switch (this.state.activeStep) {
      case 0:
        this.setState(state => ({
          submitAddress: true,
          submitReview: false
        }));
        break;
      case 1:
        this.setState(state => ({
          submitAddress: false,
          submitReview: true
        }));
        break;
      default:
        this.setState(state => ({
          submitAddress: false,
          submitReview: false
        }));
        break;
    }
  };

  handleFormSubmit = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  }

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
      submitAddress: false,
      submitReview: false
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  async componentDidMount() {
    let currCustomerId = getCurrCustomerId();
    if (!currCustomerId) {
      this.props.history.push("login");
    }
    this.fetchCustomerDetails(currCustomerId);
  }

  async fetchCustomerDetails(userId) {
    let response = await fetchCustomer(userId);
    if (response.body) {
      this.setState({
        currUser: response.body
      });
    }
    if (response.err) {
      // Display some error modal
    }
  }

  handleAddressSelect = (address) => {
    console.log("handleAddressSelect", address.id);
    this.setState({selectedAddress: address});
  }

  render() {
    const { classes } = this.props;
    const { activeStep, currUser, selectedAddress } = this.state;
    let currOrderNumber = getOrderNumber();
    let noAddress = (currUser && currUser.addresses && currUser.addresses.length === 0) ? true : false;
    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
              Checkout
            </Typography>
            <Stepper activeStep={activeStep} className={classes.stepper}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <React.Fragment>
              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography variant="h5" gutterBottom>
                    Thank you for your order.
                  </Typography>
                  <Typography variant="subtitle1">
                    Your order number is #<span>{currOrderNumber}</span>. We have emailed your order confirmation, and will
                    send you an update when your order has shipped.
                  </Typography>
                  <Button onClick={() => this.props.history.push("/")} variant="contained" size="small" color="primary">
                    Continue Shopping
                  </Button>
                </React.Fragment>
              ) : (
                  <React.Fragment>
                    {this.getStepContent(activeStep)}
                    <div className={classes.buttons}>
                      {activeStep !== 0 && (
                        <Button onClick={this.handleBack} className={classes.button}>
                          Back
                      </Button>
                      )}
                      {activeStep === 0 && (
                        <Button onClick={() => this.props.history.push('cart')} className={classes.button}>
                          Back
                      </Button>
                      )}
                      {noAddress ? "" : selectedAddress ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.handleNext}
                          className={classes.button}
                        >
                          {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                        </Button>
                      ): (
                        <Button
                          variant="contained"
                          color="primary"
                          disabled
                          className={classes.button}
                        >
                          {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                        </Button>
                      )}
                    </div>
                  </React.Fragment>
                )}
            </React.Fragment>
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

Checkout.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Checkout);