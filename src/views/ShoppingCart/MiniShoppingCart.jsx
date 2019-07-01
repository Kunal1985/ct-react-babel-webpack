import React from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
// Importing @material-ui/core components
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
// Importing custom components
import Card from 'components/Card/Card.jsx';
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
// Importing plugin components
import NumberFormat from 'react-number-format';
// Importing redux-custom-actions
import { fetchCartById, fetchCartFromSession } from '../../actions/cartActions';

const styles = theme => ({
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
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
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
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  button: {
    margin: theme.spacing.unit,
    float: "right"
  },
  cardActionBtn: {
    display: "block"
  },
  paddingItemGrid: {
    padding: theme.spacing.unit * 2
  },
  paddingHorizontal: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  },
  miniCartCard: {
    width: 'auto',
    maxHeight: 400,
    overflow: "scroll",
  },
  embeddedCartCard: {
    width: 'auto',
    maxHeight: 600,
    overflow: "scroll",
  },
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.4em'
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey'
    }
  },
  strikeThrough: {
    textDecoration: "line-through",
    color: "lightgray"
  }
});

class MiniShoppingCart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.fetchCartFromSession();
    let { cartFromReducer, errorFromReducer } = this.props;
    if (errorFromReducer) {
      // Display some error
      return;
    }
    if (!cartFromReducer.id) {
      this.props.fetchCartById();
    }
  }

  render() {
    const { classes, miniCart, cartFromReducer } = this.props;
    let thisVar = this;
    let grossTotal = 0;
    let subTotal = 0;
    let taxAmount = 0;
    let currCartId = "";
    let currCart = cartFromReducer;
    if (currCart.id) {
      currCartId = currCart.id
      grossTotal = currCart.taxedPrice ? currCart.taxedPrice.totalGross.centAmount / 100 : currCart.totalPrice.centAmount / 100;
      subTotal = currCart.taxedPrice ? currCart.taxedPrice.totalNet.centAmount / 100 : grossTotal;
      taxAmount = grossTotal - subTotal;
    }
    let emptyCart = !currCart.id || (currCart && currCart.lineItems && currCart.lineItems.length === 0);
    return (
      <React.Fragment>
        <CssBaseline />
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Order Summary</h4>
            <p className={classes.cardCategoryWhite}>Order# {currCartId}</p>
          </CardHeader>
          <CardBody key={currCartId}>
            {emptyCart ? (
              <Grid container spacing={24} key="emptyCart">
                <Grid item>
                  <Typography gutterBottom variant="h6">There are no items in the cart!</Typography>
                </Grid>
              </Grid>
            ) : (currCart && currCart.lineItems) ? (
              <Paper className={classes.root}>
                <div className={miniCart ? classes.miniCartCard : classes.embeddedCartCard}>
                  {currCart.lineItems.map(function (row) {
                    let displayImage = row.variant.images && row.variant.images.length > 0 ? row.variant.images[0].url : "/assets/img/no-image.jpg";
                    let skuPrice = row.price;
                    let isDiscounted = skuPrice && skuPrice.discounted ? true : false;
                    let discountedPrice = isDiscounted ? skuPrice.discounted.value.centAmount / 100 : skuPrice.value.centAmount / 100;
                    let listPrice = skuPrice && skuPrice.value.centAmount / 100;
                    return (
                      <div key={row.id} >
                        <Grid container spacing={24} className={classes.paddingItemGrid}>
                          <Grid container justify="center" alignItems="center" direction="row" className={classes.paddingItemGrid}>
                            <Grid item>
                              <ButtonBase className={classes.image}>
                                <img className={classes.img} alt="complex" src={displayImage} />
                              </ButtonBase>
                            </Grid>
                            <Grid item xs container>
                              <Grid item xs>
                                <Typography gutterBottom variant="subtitle1">
                                  {row.name.en}
                                </Typography>
                                <Typography color="textSecondary">ID: {row.id}</Typography>
                                <Typography color="textSecondary" variant="subtitle2">Attributes</Typography>
                                {row.variant.attributes && row.variant.attributes.map(function (attribute) {
                                  return <Typography color="textSecondary" key={attribute.name}>{attribute.name}: {attribute.value}</Typography>
                                })}
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid container justify="center" alignItems="center" direction="row" className={classes.paddingHorizontal}>
                            <Grid item xs={4} sm={4} md={4} container justify="center" alignItems="center">
                              <Typography variant="subtitle1">
                                QTY
                                </Typography>
                            </Grid>
                            <Grid item xs={4} sm={4} md={4} container justify="center" alignItems="center">
                              <Typography variant="subtitle1">
                                UNIT
                                </Typography>
                            </Grid>
                            <Grid item xs={4} sm={4} md={4} container justify="flex-end" alignItems="center">
                              <Typography variant="subtitle1">
                                TOTAL
                                </Typography>
                            </Grid>
                          </Grid>
                          <Grid container justify="center" alignItems="center" direction="row" className={classes.paddingHorizontal}>
                            <Grid item container xs={4} sm={4} md={4} justify="center" alignItems="center">
                              <Typography variant="subtitle1">
                                {row.quantity}
                              </Typography>
                            </Grid>
                            <Grid item container xs={4} sm={4} md={4} justify="center" alignItems="center">
                              {isDiscounted &&
                                <Typography variant="subtitle1">
                                  <NumberFormat value={listPrice} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} className={classes.strikeThrough} />&nbsp;
                                </Typography>}
                              <Typography variant="subtitle1">
                                <NumberFormat value={discountedPrice} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
                              </Typography>
                            </Grid>
                            <Grid item container xs={4} sm={4} md={4} justify="flex-end" alignItems="center">
                              <Typography variant="subtitle1">
                                <NumberFormat value={row.totalPrice.centAmount / 100} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Divider />
                      </div>
                    )
                  })}
                </div>

                <Grid container spacing={24} className={classes.paddingItemGrid}>
                  <Grid container justify="center" alignItems="center" direction="row" className={classes.paddingHorizontal}>
                    <Grid item container xs={8} sm={8} md={8} justify="flex-end" alignItems="center">
                      <Typography variant="subtitle1">
                        subtotal
                        </Typography>
                    </Grid>
                    <Grid item container xs={4} sm={4} md={4} justify="flex-end" alignItems="center">
                      <Typography variant="subtitle1">
                        <NumberFormat value={subTotal} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container justify="center" alignItems="center" direction="row" className={classes.paddingHorizontal}>
                    <Grid item container xs={8} sm={8} md={8} justify="flex-end" alignItems="center">
                      <Typography variant="subtitle1">
                        tax
                        </Typography>
                    </Grid>
                    <Grid item container xs={4} sm={4} md={4} justify="flex-end" alignItems="center">
                      <Typography variant="subtitle1">
                        <NumberFormat value={taxAmount} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider />
                <Grid container spacing={24} className={classes.paddingItemGrid}>
                  <Grid container justify="center" alignItems="center" direction="row" className={classes.paddingHorizontal}>
                    <Grid item container xs={8} sm={8} md={8} justify="flex-end" alignItems="center">
                      <Typography variant="h6">
                        total
                        </Typography>
                    </Grid>
                    <Grid item container xs={4} sm={4} md={4} justify="flex-end" alignItems="center">
                      <Typography variant="h6">
                        <NumberFormat value={grossTotal} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            ) : (
                  <Typography gutterBottom variant="h5">Loading, please wait!</Typography>
                )}
          </CardBody>
        </Card>
      </React.Fragment >
    );
  }
}

const mapStatesToProps = state => ({
  cartFromReducer: state.cart.currCart,
  errorFromReducer: state.cart.error,
})

export default withStyles(styles)(connect(mapStatesToProps, { fetchCartById, fetchCartFromSession })(MiniShoppingCart));