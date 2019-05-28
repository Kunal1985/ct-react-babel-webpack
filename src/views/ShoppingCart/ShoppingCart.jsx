import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from 'components/Card/Card.jsx';
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';

import NumberFormat from 'react-number-format';
import { getCurrCustomerId, getCurrCartId, getAuthToken, fetchCart, createCart, setCurrCartId, setCurrCartVersion } from '../../utils/CommonUtils';

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
  }
});

class ShoppingCart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
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
    const { classes } = this.props;
    let grossTotal = 0;
    let subTotal = 0;
    let taxAmount = 0;
    let currCartId = getCurrCartId();
    let currCart = this.state && this.state.currCart;
    if (currCart) {
      grossTotal = currCart.taxedPrice ? currCart.taxedPrice.totalGross.centAmount / 100 : currCart.totalPrice.centAmount / 100;
      subTotal = currCart.taxedPrice ? currCart.taxedPrice.totalNet.centAmount / 100 : grossTotal;
      taxAmount = grossTotal - subTotal;
    }
    let emptyCart = currCart && currCart.lineItems && currCart.lineItems.length === 0;
    return (
      <React.Fragment>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Shopping Cart</h4>
              <p className={classes.cardCategoryWhite}>Order# {this.state && currCart && currCart.id}</p>
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
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell><Typography variant="subtitle1">Item</Typography></TableCell>
                        <TableCell align="right"><Typography variant="subtitle1">Qty.</Typography></TableCell>
                        <TableCell align="right"><Typography variant="subtitle1">Price</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currCart.lineItems.map(row => (
                        <TableRow key={row.id}>
                          <TableCell>
                            <Grid container spacing={24} key={row.id}>
                              <Grid item>
                                <ButtonBase className={classes.image}>
                                  <img className={classes.img} alt="complex" src="/assets/img/no-image.jpg" />
                                </ButtonBase>
                              </Grid>
                              <Grid item xs container direction="column" spacing={16}>
                                <Grid item xs>
                                  <Typography gutterBottom variant="subtitle1">
                                    {row.name.en}
                                  </Typography>
                                  <Typography color="textSecondary">ID: {row.id}</Typography>
                                </Grid>
                                <Grid item>
                                  <Typography style={{ cursor: 'pointer' }}>Remove</Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle1">
                              {row.quantity}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle1">
                              <NumberFormat value={row.totalPrice.centAmount / 100} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}

                      <TableRow>
                        <TableCell rowSpan={3} />
                        <TableCell ><Typography variant="subtitle1">Subtotal</Typography></TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1">
                            <NumberFormat value={subTotal} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Typography variant="subtitle1">Tax</Typography></TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1">
                            <NumberFormat value={taxAmount} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell ><Typography variant="subtitle1">Total</Typography></TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1">
                            <NumberFormat value={grossTotal} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              ) : (
                "May not enter this section!"
              )}
            </CardBody>
            <CardActions>
              <Button variant="contained" size="small" color="primary" className={classes.button} onClick={() => this.props.history.push('checkout')}>
                Checkout
              </Button>
            </CardActions>
          </Card>
        </Paper>
      </React.Fragment >
    );
  }
}

export default withStyles(styles)(ShoppingCart);