import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core/styles components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/core components
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Link from '@material-ui/core/Link';
// Other components
import NumberFormat from 'react-number-format';
// Util components
import { fetchCustomerOrders } from '../../utils/CommonUtils';
import ShoppingCartView from '../modals/ShoppingCartView.jsx';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit,
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing.unit,
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  toolbar: {
    root: {
      paddingLeft: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
    },
    title: {
      flex: '0 0 auto',
    }
  }
});

const headRows = [
  { id: 'id', numeric: false, disablePadding: false, label: 'Order#' },
  { id: 'orderState', numeric: true, disablePadding: false, label: 'Order State' },
  { id: 'subTotal', numeric: true, disablePadding: false, label: 'Sub-Total' },
  { id: 'tax', numeric: true, disablePadding: false, label: 'Tax' },
  { id: 'grossTotal', numeric: true, disablePadding: false, label: 'Gross-Total' },
  { id: 'lastModifiedAt', numeric: true, disablePadding: false, label: 'Last Modified Date' },
];

const nonSortableRowIds = ["subTotal", "tax"];

class MyOrdersTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'id',
      selected: [],
      page: 0,
      rowsPerPage: 10,
      myOrders: [],
      modalOpen: false
    };
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleRequestParams = this.handleRequestParams.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  async fetchOrders(refetchParams) {
    let response = await fetchCustomerOrders(this.props.currUser, refetchParams);
    if (response.body) {
      this.setState({
        myOrders: response.body
      });
    }
    if (response.err) {
      // Display some error modal
    }
  }

  async componentDidMount() {
    return this.fetchOrders({limit:10, offset:0, sort:"id asc"});
  }

  componentDidUpdate(){
    // console.log("MyOrdersTab: componentDidUpdate");
  }

  handleRequestSort(event, property) {
    if(nonSortableRowIds.indexOf(property) !== -1){
      console.log("No Sort operation");
      return;
    }
    let { order, orderBy, page, rowsPerPage } = this.state;
    const isDesc = (orderBy === property && order === 'desc') ? 'asc' : 'desc';
    let newState = {
      order: isDesc,
      orderBy: property
    }
    this.setState(newState);
    this.handleRequestParams(newState);
  }

  handleChangePage(event, newPage) {
    let newState = {
      page: newPage
    }
    this.setState(newState);
    this.handleRequestParams(newState);
  }

  handleChangeRowsPerPage(event) {
    let newState = {
      rowsPerPage: event.target.value
    }
    this.setState(newState);
    this.handleRequestParams(newState);
  }

  handleRequestParams(newState){
    let currState = this.state;
    let order = newState.order ? newState.order : currState.order;
    let orderBy = newState.orderBy ? newState.orderBy : currState.orderBy;
    let page = newState.page ? newState.page : currState.page;
    let rowsPerPage = newState.rowsPerPage ? newState.rowsPerPage : currState.rowsPerPage;
    let limit = rowsPerPage;
    let offset = limit*page;
    let sort = "";
    switch(orderBy){
      case "grossTotal": 
        sort = ["taxedPrice.totalGross.centAmount", order].join(" ");
        break;
      case "subTotal": 
        console.log("Ignore");
        break;  
      case "tax": 
        console.log("Ignore");
        break;  
      default: 
        sort = [orderBy, order].join(" ");
        break;  
    }
    let refetchParams = {limit, offset, sort};
    this.fetchOrders(refetchParams);
  }

  handleOpenModal(currOrder){
    this.setState({modalOpen: true, orderInModal: currOrder})
  }

  handleCloseModal(){
    this.setState({modalOpen: false})
  }

  render() {
    const thisVar = this;
    const { classes } = this.props;
    const emptyRows = 0;
    let { order, orderBy, page, rowsPerPage, myOrders, modalOpen, orderInModal } = this.state;
    let rows = myOrders && myOrders.results ? myOrders.results : [];
    let rowsLength = myOrders && myOrders.total ? myOrders.total : 0;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Toolbar className={classes.toolbar.root}>
            <div className={classes.toolbar.title}>
              <Typography variant="h6" id="tableTitle">
                My Orders
              </Typography>
            </div>
          </Toolbar>
          <div className={classes.tableWrapper}>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size='medium'
            >
              <TableHead>
                <TableRow>
                  {headRows.map(row => (
                    <TableCell
                      key={row.id}
                      align={row.numeric ? 'right' : 'left'}
                      padding={row.disablePadding ? 'none' : 'default'}
                      sortDirection={orderBy === row.id ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === row.id}
                        direction={order}
                        onClick={() => thisVar.handleRequestSort(event, row.id)}
                      >
                        <Typography variant="subtitle1">{row.label}</Typography>
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => {
                  let grossTotal = row.taxedPrice ? row.taxedPrice.totalGross.centAmount / 100 : row.totalPrice.centAmount / 100;
                  let subTotal = row.taxedPrice ? row.taxedPrice.totalNet.centAmount / 100 : grossTotal;
                  let taxAmount = grossTotal - subTotal;
                  return (
                    <TableRow hover key={row.id}>
                      <TableCell component="th" scope="row" >
                        <Link component="button" variant="subtitle1" onClick={() => thisVar.handleOpenModal(row)}>{row.id}</Link>
                      </TableCell>
                      <TableCell align="right">{row.orderState}</TableCell>
                      <TableCell align="right">
                        <NumberFormat value={subTotal} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
                      </TableCell>
                      <TableCell align="right">
                        <NumberFormat value={taxAmount} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
                      </TableCell>
                      <TableCell align="right">
                        <NumberFormat value={grossTotal} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
                      </TableCell>
                      <TableCell align="right">{row.lastModifiedAt}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rowsLength}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={modalOpen}
          onClose={() => this.handleCloseModal()}
        >
          <ShoppingCartView currOrder={orderInModal} />
        </Modal>
      </div>
    );
  }
}

export default withStyles(styles)(MyOrdersTab);