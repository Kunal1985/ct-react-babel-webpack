import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
// Imported Components
import AddressForm from './AddressForm.jsx';
import PaymentForm from './PaymentForm.jsx';
import MiniShoppingCart from '../ShoppingCart/MiniShoppingCart.jsx';
import Review from './Review.jsx';
import { connect } from 'react-redux';
import { fetchUserFromSession, fetchUserById } from '../../actions/userActions'
import { fetchCartFromSession, fetchCartById, clearOldCartFromSession } from '../../actions/cartActions'
import { submitOrderAction } from '../../actions/orderActions'
import { getCurrCartId } from '../../utils/CommonUtils.js';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
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
    float: "left !important"
  },
});

const steps = ['Shipping address', 'Payment', 'Review your order'];

class Checkout extends React.Component {
  state = {
    activeStep: 0,
  };

  componentWillMount() {
    this.props.fetchUserFromSession();
    let { userFromReducer, userErrorFromReducer } = this.props;
    if (userErrorFromReducer) {
      // Display some error
      return;
    }
    if (!userFromReducer.id) {
      this.props.fetchUserById();
    }
    this.props.fetchCartFromSession();
    let { cartFromReducer, cartErrorFromReducer } = this.props;
    if (cartErrorFromReducer) {
      // Display some error
      return;
    }
    if (!cartFromReducer.id) {
      this.props.fetchCartById();
    } else {
      cartFromReducer.shippingAddress && this.setState({ selectedAddress: cartFromReducer.shippingAddress });
    }
  }

  componentWillReceiveProps(nextProps) {
    let { orderFromReducer, cartFromReducer, cartErrorFromReducer } = nextProps;
    if (orderFromReducer.orderNumber) {
      if(cartFromReducer.id){
        this.props.clearOldCartFromSession();
      } else{
        if(this.state.activeStep === steps.length-1){
          this.handleFormSubmit();
        }
      }
    }
    if (cartFromReducer.id) {
      cartFromReducer.shippingAddress && this.setState({ selectedAddress: cartFromReducer.shippingAddress });
    } else{
      if(!orderFromReducer.orderNumber){
        nextProps.history.push("")
      }
    }
  }

  getStepContent(step) {
    let { submitAddress, submitPayment, submitReview, selectedAddress } = this.state;
    let currUser = this.props.userFromReducer;
    switch (step) {
      case 0:
        return <AddressForm submit={submitAddress} parent={this} currUser={currUser} selectedAddress={selectedAddress} />;
      case 1:
        return <PaymentForm submit={submitPayment} parent={this} />;
      case 2:
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
          submitPayment: false,
          submitReview: false
        }));
        break;
      case 1:
        this.setState(state => ({
          submitAddress: false,
          submitPayment: true,
          submitReview: false
        }));
        this.handleFormSubmit();
        break;
      case 2:
        this.handleSubmitOrder();
        break;
      default:
        this.setState(state => ({
          submitAddress: false,
          submitPayment: false,
          submitReview: false
        }));
        break;
    }
  };

  handleSubmitOrder() {
    this.props.submitOrderAction()
  }

  handleFormSubmit = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  }

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
      submitAddress: false,
      submitPayment: false,
      submitReview: false
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleAddressSelect = (address) => {
    this.setState({ selectedAddress: address });
  }

  render() {
    const { classes, userFromReducer, userErrorFromReducer, cartFromReducer, cartErrorFromReducer, orderFromReducer } = this.props;
    const { activeStep, selectedAddress } = this.state;
    let currCart = cartFromReducer ? cartFromReducer : orderFromReducer;
    let currUser = userFromReducer;
    let currOrderNumber = orderFromReducer.orderNumber;
    let noAddress = (currUser && currUser.addresses && currUser.addresses.length === 0) ? true : false;
    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={8} key="leftSide">
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
                          ) : (
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
              </GridItem>
              <GridItem xs={12} sm={12} md={4} key="rightSide">
                {currCart && <MiniShoppingCart currCart={currCart} />}
              </GridItem>
            </GridContainer>
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

Checkout.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStatesToProps = state => ({
  userFromReducer: state.user.currUser,
  userErrorFromReducer: state.user.error,
  cartFromReducer: state.cart.currCart,
  cartErrorFromReducer: state.cart.error,
  orderFromReducer: state.lastOrder.lastOrderPlaced,
  orderErrorFromReducer: state.lastOrder.error,
})

export default withStyles(styles)(connect(mapStatesToProps, { fetchUserFromSession, fetchUserById, fetchCartFromSession, fetchCartById, submitOrderAction, clearOldCartFromSession })(Checkout));