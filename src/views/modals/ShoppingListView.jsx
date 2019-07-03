import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// @material-ui/icons components
import DeleteIcon from '@material-ui/icons/Delete';
// core components
import Card from 'components/Card/Card.jsx';
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
// utils components
import { removeItemFromList, fetchList } from '../../utils/CommonUtils';

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

class ShoppingListView extends React.Component {
  constructor(props) {
    super(props);
    let { currList } = this.props;
    this.state = { currList };
    this.removeItem = this.removeItem.bind(this);
  }

  async removeItem(itemId) {
    let { parent } = this.props;
    let { currList } = this.state;
    let response = await removeItemFromList(currList.id, currList.version, itemId);
    if (response.body) {
      await parent.handleRequestParams({});
      this.setState({ currList: response.body});
    }
    if (response.err) {
      // Display some error popup
    }
  }

  render() {
    const { classes } = this.props;
    let thisVar = this;
    let { currList } = this.state;
    let currListId = currList.id;
    let emptyCart = currList && currList.lineItems && currList.lineItems.length === 0;
    return (
      <React.Fragment>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Card className={classes.card}>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Your Order</h4>
              <p className={classes.cardCategoryWhite}>Order# {currListId}</p>
            </CardHeader>
            <CardBody key={currListId}>
              {emptyCart ? (
                <Grid container spacing={24} key="emptyCart">
                  <Grid item>
                    <Typography gutterBottom variant="h6">There are no items in the list!</Typography>
                  </Grid>
                </Grid>
              ) : (currList && currList.lineItems) ? (
                <Paper className={classes.root}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell><Typography variant="subtitle1">Item</Typography></TableCell>
                        <TableCell align="right"><Typography variant="subtitle1">Qty.</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currList.lineItems.map(function (row) {
                        let displayImage = "/assets/img/no-image.jpg"
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
                                <IconButton aria-label="Delete" className={classes.margin} onClick={() => thisVar.removeItem(row.id)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )
                      })}
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

export default withStyles(styles)(ShoppingListView);