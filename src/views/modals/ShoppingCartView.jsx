import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from 'components/Card/Card.jsx';
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
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

const styles = theme => ({
  paper: {
    margin: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    overflow: "scroll",
    height: 600
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
});

class ShoppingCartView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, currOrder } = this.props;
    let thisVar = this;
    let grossTotal = 0;
    let subTotal = 0;
    let taxAmount = 0;
    let currOrderId = currOrder.id;
    if (currOrder) {
      grossTotal = currOrder.taxedPrice ? currOrder.taxedPrice.totalGross.centAmount / 100 : currOrder.totalPrice.centAmount / 100;
      subTotal = currOrder.taxedPrice ? currOrder.taxedPrice.totalNet.centAmount / 100 : grossTotal;
      taxAmount = grossTotal - subTotal;
    }
    let emptyCart = currOrder && currOrder.lineItems && currOrder.lineItems.length === 0;
    return (
      <React.Fragment>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Card className={classes.card}>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Your Order</h4>
              <p className={classes.cardCategoryWhite}>Order# {currOrderId}</p>
            </CardHeader>
            <CardBody key={currOrderId}>
              {emptyCart ? (
                <Grid container spacing={24} key="emptyCart">
                  <Grid item>
                    <Typography gutterBottom variant="h6">There are no items in the cart!</Typography>
                  </Grid>
                </Grid>
              ) : (currOrder && currOrder.lineItems) ? (
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
                      {currOrder.lineItems.map(function(row){
                        let displayImage = row.variant.images && row.variant.images.length>0 ? row.variant.images[0].url : "/assets/img/no-image.jpg"
                        return (
                          <TableRow key={row.id}>
                            <TableCell>
                              <Grid container spacing={24} key={row.id}>
                                <Grid item>
                                  <ButtonBase className={classes.image}>
                                    <img className={classes.img} alt="complex" src={displayImage} />
                                  </ButtonBase>
                                </Grid>
                                <Grid item xs container direction="column" spacing={16}>
                                  <Grid item xs>
                                    <Typography gutterBottom variant="subtitle1">
                                      {row.name.en}
                                    </Typography>
                                    <Typography color="textSecondary">ID: {row.id}</Typography>
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
                        )
                      })}

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
          </Card>
        </Paper>
      </React.Fragment >
    );
  }
}

export default withStyles(styles)(ShoppingCartView);