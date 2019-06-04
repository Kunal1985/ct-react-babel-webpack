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
import { fetchCustomerShoppingLists } from '../../utils/CommonUtils';

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
  { id: 'id', numeric: false, disablePadding: false, label: 'ID#' },
  { id: 'name', numeric: true, disablePadding: false, label: 'Name' },
  { id: 'itemsCount', numeric: true, disablePadding: false, label: 'Items (count)' },
  { id: 'createdAt', numeric: true, disablePadding: false, label: 'Created Date' },
  { id: 'lastModifiedAt', numeric: true, disablePadding: false, label: 'Last Modified Date' },
];

const nonSortableRowIds = ["itemsCount"];

class MyShoppingListsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'id',
      selected: [],
      page: 0,
      rowsPerPage: 10,
      myShoppingLists: []
    };
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
  }

  async fetchShoppingLists(refetchParams){
    let response = await fetchCustomerShoppingLists(this.props.currUser, refetchParams);
    if(response.body){
      this.setState({
        myShoppingLists: response.body
      });
    }
    if(response.err){
      // Display some error modal
    }
  }
  
  async componentDidMount(){
    return this.fetchShoppingLists({limit:10, offset:0, sort:"id asc"});
  }

  handleRequestSort(event, property) {
    if(nonSortableRowIds.indexOf(property) !== -1){
      console.log("No Sort operation");
      return;
    }
    let { order, orderBy } = this.state;
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
      case "name": 
        sort = ["name.en", order].join(" ");
        break;
      default: 
        sort = [orderBy, order].join(" ");
        break;  
    }
    let refetchParams = {limit, offset, sort};
    this.fetchShoppingLists(refetchParams);
  }

  render() {
    const thisVar = this;
    const { classes } = this.props;
    const emptyRows = 0;
    let { order, orderBy, page, rowsPerPage, myShoppingLists } = this.state;
    let rows = myShoppingLists && myShoppingLists.results ? myShoppingLists.results: [];
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Toolbar className={classes.toolbar.root}>
            <div className={classes.toolbar.title}>
              <Typography variant="h6" id="tableTitle">
                My Shopping Lists
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
                  return (
                    <TableRow hover key={row.id}>
                      <TableCell component="th" scope="row">{row.id}</TableCell>
                      <TableCell align="right">{row.name.en}</TableCell>
                      <TableCell align="right">{row.lineItems.length}</TableCell>
                      <TableCell align="right">{row.createdAt}</TableCell>
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
            count={rows.length}
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
      </div>
    );
  }
}

export default withStyles(styles)(MyShoppingListsTab);