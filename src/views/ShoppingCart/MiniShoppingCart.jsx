import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from 'components/Card/Card.jsx';
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Divider from '@material-ui/core/Divider';

import NumberFormat from 'react-number-format';
import { getCurrCustomerId, getCurrCartId, getAuthToken, fetchCart, createCart, setCurrCartId, setCurrCartVersion, removeItemFromCart } from '../../utils/CommonUtils';

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
  }
});

class MiniShoppingCart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.fetchCurrentCart = this.fetchCurrentCart.bind(this);
  }

  componentDidMount() {
    // this.fetchCurrentCart();
  }

  async fetchCurrentCart() {
    let { currCart } = this.props;
    if (currCart) {
      this.setState({ currCart });
    }
    let currCartId = getCurrCartId();
    if (!currCartId) {
      let createCartResp = await createCart();
      if (createCartResp.body) {
        setCurrCartId(createCartResp.body.id);
        setCurrCartVersion(createCartResp.body.version);
        this.setState({ currCart: createCartResp.body });
      }
      if (createCartResp.err) {
        // Display some error modal
      }
    } else {
      let cartResponse = await fetchCart(getCurrCartId());
      if (cartResponse.body) {
        this.setState({ currCart: cartResponse.body });
      }
      if (cartResponse.err) {
        // Display some error modal
      }
    }
  }

  render() {
    const { classes, currCart, miniCart } = this.props;
    let thisVar = this;
    let grossTotal = 0;
    let subTotal = 0;
    let taxAmount = 0;
    if (currCart) {
      grossTotal = currCart.taxedPrice ? currCart.taxedPrice.totalGross.centAmount / 100 : currCart.totalPrice.centAmount / 100;
      subTotal = currCart.taxedPrice ? currCart.taxedPrice.totalNet.centAmount / 100 : grossTotal;
      taxAmount = grossTotal - subTotal;
    }
    let emptyCart = currCart && currCart.lineItems && currCart.lineItems.length === 0;
    return (
      <React.Fragment>
        <CssBaseline />
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Order Summary</h4>
              <p className={classes.cardCategoryWhite}>Order# {this.state && currCart && currCart.id}</p>
            </CardHeader>
            <CardBody key={currCart.id}>
              {emptyCart ? (
                <Grid container spacing={24} key="emptyCart">
                  <Grid item>
                    <Typography gutterBottom variant="h6">There are no items in the cart!</Typography>
                  </Grid>
                </Grid>
              ) : (currCart && currCart.lineItems) ? (
                <Paper className={classes.root}>
                  <div className={miniCart ? classes.miniCartCard: classes.embeddedCartCard}>
                    {currCart.lineItems.map(function (row) {
                      let displayImage = row.variant.images && row.variant.images.length > 0 ? row.variant.images[0].url : "/assets/img/no-image.jpg"
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
                                  {row.variant.attributes && row.variant.attributes.map(function(attribute){
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
                                <Typography variant="subtitle1">
                                  <NumberFormat value={row.price.value.centAmount / 100} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
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
                    "May not enter this section!"
                  )}
            </CardBody>
          </Card>
      </React.Fragment >
    );
  }
}

export default withStyles(styles)(MiniShoppingCart);