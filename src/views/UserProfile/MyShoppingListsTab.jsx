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
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// @material-ui/icons components
import DeleteIcon from '@material-ui/icons/Delete';
// utils components
import { fetchCustomerShoppingLists, removeList } from '../../utils/CommonUtils';
// views components
import ShoppingListView from '../modals/ShoppingListView.jsx';

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
      myShoppingLists: [],
      modalOpen: false,
      openDialog: false
    };
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleRemoveList = this.handleRemoveList.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
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
      rowsPerPage: event.target.value,
      page: 0
    }
    this.setState(newState);
    this.handleRequestParams(newState);
  }

  handleOpenModal(currOrder){
    this.setState({modalOpen: true, listInModal: currOrder})
  }

  handleCloseModal(){
    this.setState({modalOpen: false})
  }


  handleRequestParams(newState){
    let currState = this.state;
    let order = newState.order ? newState.order : currState.order;
    let orderBy = newState.orderBy ? newState.orderBy : currState.orderBy;
    let page = (newState.page || newState.page === 0) ? newState.page : currState.page;
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

  async handleRemoveList(){
    let currState = this.state;
    if(!currState || !currState.currListToDelete){
      return;
    }
    let {listId, listVersion} = currState.currListToDelete;
    let response = await removeList(listId, listVersion);
    if(response.body){
      this.setState({
        openDialog: false
      })
      this.handleRequestParams({});
    }
    if(response.err){
      // Display some error popup.
    }
  }

  handleDialogOpen(listId, listVersion){
    this.setState({
      openDialog: true,
      currListToDelete: {listId, listVersion}
    })
  }

  handleDialogClose() {
    this.setState({
      openDialog: false
    })
  }

  render() {
    const thisVar = this;
    const { classes } = this.props;
    const emptyRows = 0;
    let { order, orderBy, page, rowsPerPage, myShoppingLists, modalOpen, listInModal, openDialog } = this.state;
    console.log(myShoppingLists)
    let rows = myShoppingLists && myShoppingLists.results ? myShoppingLists.results: [];
    let rowsLength = rows && rows.length ? rows.length : 0;
    let pageSizeArr = (rowsLength <= 5) ? [5] : (rowsLength <= 10) ? [5, 10] : [5, 10, 25];
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
                      <TableCell component="th" scope="row" >
                        <Link component="button" variant="subtitle1" onClick={() => thisVar.handleOpenModal(row)}>{row.id}</Link>
                      </TableCell>
                      <TableCell align="right">{row.name.en}</TableCell>
                      <TableCell align="right">{row.lineItems.length}</TableCell>
                      <TableCell align="right">{row.createdAt}</TableCell>
                      <TableCell align="right">{row.lastModifiedAt}</TableCell>
                      <TableCell align="right">
                        <IconButton aria-label="Delete" className={classes.margin} onClick={() => thisVar.handleDialogOpen(row.id, row.version)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
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
            rowsPerPageOptions={pageSizeArr}
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

        <Modal
          aria-labelledby="shopping-lists-modal-title"
          aria-describedby="shopping-lists-modal-description"
          open={modalOpen}
          onClose={() => this.handleCloseModal()}
        >
          <ShoppingListView currList={listInModal} parent={this} />
        </Modal>

        <Dialog
          open={openDialog}
          onClose={this.handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Are you sure, you want to delete this Shopping-List?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              There might be items present in the Shopping-List you are trying to delete.
              Performing this action will delete the Shopping-List from the database, there will be no backup for recovery!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} variant="contained" color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleRemoveList} variant="contained" color="secondary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(MyShoppingListsTab);