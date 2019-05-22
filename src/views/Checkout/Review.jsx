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
  async componentDidUpdate(){
    console.log("Review componentDidUpdate", this.props);
    if(this.props.submit){
      let response = await submitOrder();
      if(response.body){
        this.props.parent.handleFormSubmit();
      }
      if(response.err){
        // Display some error
      }
      // this.props.parent.handleFormSubmit();
    }
  }
  async componentDidMount(){
    console.log("Review componentDidMount", this.props);
    let currCartId = getCurrCartId();
    if(currCartId){
      let cartResponse = await fetchCart(getCurrCartId());
      if (cartResponse.body) {
        this.setState({ currCart: cartResponse.body });
      }
      if (cartResponse.err) {
        // Display some error modal
      }
    }
  }
  render(){
    const { classes } = this.props;
    let grossTotal = 0;
    let subTotal = 0;
    let taxAmount = 0;
    let currCartId = getCurrCartId();
    let shippingAddress = {};
    if (this.state && this.state.currCart) {
      grossTotal = this.state.currCart.taxedPrice ? this.state.currCart.taxedPrice.totalGross.centAmount / 100 : this.state.currCart.totalPrice.centAmount / 100;
      subTotal = this.state.currCart.taxedPrice ? this.state.currCart.taxedPrice.totalNet.centAmount / 100 : grossTotal;
      taxAmount = grossTotal - subTotal;
      shippingAddress = this.state.currCart.shippingAddress ? this.state.currCart.shippingAddress:{};
      shippingAddress.fullAddress = [shippingAddress.streetNumber, shippingAddress.streetName, shippingAddress.city, [shippingAddress.country, shippingAddress.postalCode].join("-")].join(', ');
    }
    let lineItems = (this.state && this.state.currCart && this.state.currCart.lineItems) ? this.state.currCart.lineItems : [];
    return (
      <React.Fragment>
        <Typography variant="h6" gutterBottom>
          Order summary
        </Typography>
        <List disablePadding>
          {lineItems.map(currLineItem => (
            <ListItem className={classes.listItem} key={currLineItem.id}>
              <ListItemText primary={currLineItem.name.en} secondary={currLineItem.quantity}/>
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

export default withStyles(styles)(Review);