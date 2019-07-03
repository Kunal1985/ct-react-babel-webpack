import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import NumberFormat from 'react-number-format';
import { getCurrCartId, fetchCart, submitOrder } from '../../utils/CommonUtils';
import { connect } from 'react-redux';
import { fetchCartById, fetchCartFromSession, clearOldCartFromSession } from '../../actions/cartActions';
import { submitOrderAction } from '../../actions/orderActions';

const products = [
  { name: 'Product 1', desc: 'A nice thing', price: '$9.99' },
  { name: 'Product 2', desc: 'Another thing', price: '$3.45' },
  { name: 'Product 3', desc: 'Something else', price: '$6.51' },
  { name: 'Product 4', desc: 'Best thing of all', price: '$14.11' },
  { name: 'Shipping', desc: '', price: 'Free' },
];
const addresses = ['1 Material-UI Drive', 'Reactville', 'Anytown', '99999', 'USA'];
const payments = [
  { name: 'Card type', detail: 'Visa' },
  { name: 'Card holder', detail: 'Mr John Smith' },
  { name: 'Card number', detail: 'xxxx-xxxx-xxxx-1234' },
  { name: 'Expiry date', detail: '04/2024' },
];

const styles = theme => ({
  listItem: {
    padding: `${theme.spacing.unit}px 0`,
  },
  total: {
    fontWeight: '700',
  },
  title: {
    marginTop: theme.spacing.unit * 2,
  },
});

class Review extends React.Component {
  componentWillMount() {
    this.props.fetchCartFromSession();
    let { cartFromReducer, cartErrorFromReducer } = this.props;
    if (cartErrorFromReducer) {
      // Display some error
      return;
    }
    if (!cartFromReducer.id) {
      this.props.fetchCartById();
    }
  }
  
  render() {
    const { classes, cartFromReducer } = this.props;
    let grossTotal = 0;
    let subTotal = 0;
    let taxAmount = 0;
    let currCartId = getCurrCartId();
    let shippingAddress = {};
    let currCart = cartFromReducer;
    if (currCart.id) {
      grossTotal = currCart.taxedPrice ? currCart.taxedPrice.totalGross.centAmount / 100 : currCart.totalPrice.centAmount / 100;
      subTotal = currCart.taxedPrice ? currCart.taxedPrice.totalNet.centAmount / 100 : grossTotal;
      taxAmount = grossTotal - subTotal;
      shippingAddress = currCart.shippingAddress ? currCart.shippingAddress : {};
      shippingAddress.fullAddress = [shippingAddress.streetNumber, shippingAddress.streetName, shippingAddress.city, [shippingAddress.country, shippingAddress.postalCode].join("-")].join(', ');
    }
    let lineItems = (currCart && currCart.lineItems) ? currCart.lineItems : [];
    return (
      <React.Fragment>
        <Typography variant="h6" gutterBottom>
          Order summary
        </Typography>
        <List disablePadding>
          {lineItems.map(currLineItem => (
            <ListItem className={classes.listItem} key={currLineItem.id}>
              <ListItemText primary={currLineItem.name.en} secondary={currLineItem.quantity} />
              <Typography variant="body2">
                <NumberFormat value={currLineItem.totalPrice.centAmount / 100} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
              </Typography>
            </ListItem>
          ))}
          <ListItem className={classes.listItem}>
            <ListItemText primary="Sub-Total" />
            <Typography variant="subtitle1" className={classes.total}>
              <NumberFormat value={subTotal} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
            </Typography>
          </ListItem>

          <ListItem className={classes.listItem}>
            <ListItemText primary="Tax" />
            <Typography variant="subtitle1" className={classes.total}>
              <NumberFormat value={taxAmount} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
            </Typography>
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText primary="Total" />
            <Typography variant="subtitle1" className={classes.total}>
              <NumberFormat value={grossTotal} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
            </Typography>
          </ListItem>
        </List>
        <Grid container spacing={16}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom className={classes.title}>
              Shipping
            </Typography>
            <Typography gutterBottom>{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
            <Typography gutterBottom>{shippingAddress.fullAddress}</Typography>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

Review.propTypes = {
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

export default withStyles(styles)(connect(mapStatesToProps, { fetchCartById, fetchCartFromSession, clearOldCartFromSession, submitOrderAction })(Review));