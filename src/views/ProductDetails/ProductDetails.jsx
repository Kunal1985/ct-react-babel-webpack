import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import StarIcon from '@material-ui/icons/Star';
// Import Utils
import { fetchProductById, getCurrListId, createList, addItemToList, getCurrCustomerId, fetchCustomerShoppingLists, setCurrListId, setCurrListVersion, getCurrListVersion } from '../../utils/CommonUtils';
import ReviewsRatings from '../common/ReviewsRatings.jsx';
import RelatedProducts from './RelatedProducts.jsx';
import NumberFormat from 'react-number-format';
import { addToCartAction } from '../../actions/cartActions';
import { fetchUserShoppingListsAction, createListAction, addToListAction } from '../../actions/listActions';
import {fetchRecentlyViewedFromSessionAction, fetchRecentlyViewedByIdsAction, updateRecentlyViewedAction} from '../../actions/recentlyViewedActions';

import { connect } from 'react-redux';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  button: {
    margin: theme.spacing.unit,
  },
  formControl: {
    marginTop: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    width: "100%"
  },
  img: {
    maxWidth: 400
  },
  productGrid: {
    width: "70%"
  },
  strikeThrough: {
    textDecoration: "line-through",
    color: "lightgray"
  },
  paddingTop: {
    paddingTop: theme.spacing.unit * 2
  },
  cancelBtn: {
    float: "left"
  }
});

class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isDialogOpen: false, shoppingLists: [], quantity: 1 };
    this.handleChange = this.handleChange.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.addToList = this.addToList.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCreateList = this.handleCreateList.bind(this);
    this.handleSelectList = this.handleSelectList.bind(this);
    this.handleQtyChange = this.handleQtyChange.bind(this);
    this.fetchProduct = this.fetchProduct.bind(this);
  }

  componentWillMount() {
    this.props.fetchUserShoppingListsAction();
    this.props.fetchRecentlyViewedFromSessionAction();
  }

  componentWillReceiveProps(nextProps) {
    let { match: { params }, recentlyViewedIds, recentlyViewedItems, currListFromReducer, updateUserListFromReducer } = nextProps;
    let productId = params.productId;
    if(recentlyViewedIds.indexOf(productId) === -1 || recentlyViewedIds.indexOf(productId) !== recentlyViewedIds.length-1){
      nextProps.updateRecentlyViewedAction(productId, recentlyViewedItems);
      return;
    }
    if(recentlyViewedItems.length !== recentlyViewedIds.length){
     this.props.fetchRecentlyViewedByIdsAction(); 
     return;
    }
    if (currListFromReducer.errorFromReducer) {
      // Display some error
      return;
    }
    if (updateUserListFromReducer) {
      nextProps.fetchUserShoppingListsAction();
    } else {
      let { isDialogOpen } = this.state;
      if (currListFromReducer.id && isDialogOpen) {
        this.setState({ isDialogOpen: false, selectedList: [currListFromReducer.id, currListFromReducer.version].join('---') })
      }
    }
  }

  async componentDidMount() {
    await this.fetchProduct();
  }

  async fetchProduct() {
    const { match: { params } } = this.props;
    let productId = params.productId;
    if (productId) {
      let response = await fetchProductById(productId);
      if (response && response.body) {
        let currProduct = response.body.masterData.current;
        currProduct.id = response.body.id;
        let facetMapArr = this.getFacetMap(currProduct);
        this.setState({
          currProduct: currProduct,
          currSelectedSku: currProduct.masterVariant,
          facetMapArr: facetMapArr[0],
          combinationFacetMapArr: facetMapArr[1],
        });
      }
      if (response.err) {
        // Display some error popup
      }
    }
  }

  handleChange = name => event => {
    let facetMapArr = this.state.facetMapArr;
    let combinationFacet = this.state.combinationFacetMapArr;
    let colorSelected = '';
    let sizeSelected = '';
    facetMapArr.map(function (facet) {
      if (facet.name === name) {
        facet.selected = event.target.value;
      }
      switch (facet.name) {
        case "color": colorSelected = facet.selected; break;
        case "size": sizeSelected = facet.selected; break;
        default: break;
      }
    });
    let selectedSku = combinationFacet.find(function (item) {
      if (item.color === colorSelected && item.size === sizeSelected) {
        return item
      }
    });
    let skuSelection = null;
    if (selectedSku) {
      let masterData = this.state.currProduct;
      let masterVariant = masterData.masterVariant;
      if (masterVariant.id === selectedSku.id) {
        skuSelection = masterVariant;
      }
      if (!skuSelection) {
        let variantObj = masterData.variants.find(function (item) {
          if (item.id === selectedSku.id) {
            return item;
          }
        });
        if (variantObj) {
          skuSelection = variantObj;
        }
      }
    }
    this.setState({ facetMapArr, currSelectedSku: skuSelection });
  };

  getFacetMap(product) {
    let facetMapArr = [];
    let combinationFacetMapArr = [];
    let masterData = product;
    let masterVariant = masterData.masterVariant;
    let variants = masterData.variants;
    let combinationFacetMap = { id: masterVariant.id };
    masterVariant.attributes.map(function (attribute) {
      let facetMap = {};
      facetMap.name = attribute.name;
      facetMap.values = [attribute.value];
      facetMap.selected = attribute.value
      combinationFacetMap[attribute.name] = attribute.value;
      facetMapArr.push(facetMap);
    });
    combinationFacetMapArr.push(combinationFacetMap)

    variants.map(function (currVariant) {
      let combinationFacetMap = { id: currVariant.id };
      currVariant.attributes.map(function (attribute) {
        combinationFacetMap[attribute.name] = attribute.value;
        let filteredObj = facetMapArr.find(function (item) {
          if ((item.name === attribute.name) && (item.values.indexOf(attribute.value) === -1)) {
            return item;
          }
        });
        if (filteredObj) {
          filteredObj.values.push(attribute.value)
        }
      });
      combinationFacetMapArr.push(combinationFacetMap)
    })
    return [facetMapArr, combinationFacetMapArr];
  }

  async addToCart() {
    let { currSelectedSku, quantity } = this.state;
    this.props.addToCartAction(currSelectedSku, quantity)
  }

  handleDialogOpen() {
    this.setState({ isDialogOpen: true });
  }

  async handleCreateList() {
    let { listName } = this.state;
    if (listName && listName !== "") {
      this.props.createListAction(listName, this.state.currSelectedSku);
    }
  }

  async addToList() {
    this.props.addToListAction(this.state.currSelectedSku);
  }

  handleNameChange(event) {
    this.setState({ listName: event.target.value });
  }

  handleDialogClose() {
    this.setState({ isDialogOpen: false });
  }

  handleSelectList(event) {
    let selectedValue = event.target.value;
    let selectedValueArr = selectedValue.split("---")
    let listId = selectedValueArr[0];
    let listVersion = selectedValueArr[1];
    setCurrListId(listId);
    setCurrListVersion(listVersion);
    this.setState({ selectedList: selectedValue });
  }

  handleQtyChange(event) {
    this.setState({ quantity: event.target.value });
  }

  render() {
    const { classes, location, match: { params }, userListsFromReducer, recentlyViewedItems } = this.props;
    let shoppingLists = userListsFromReducer && userListsFromReducer.results ? userListsFromReducer.results : [];
    let productList = recentlyViewedItems;
    let productId = params.productId;
    let customerId = getCurrCustomerId();
    let thisVar = this;
    let currState = this.state;
    let { isDialogOpen, selectedList, quantity } = currState;
    let currListInStorage = getCurrListId();
    if (!selectedList && currListInStorage) {
      selectedList = [currListInStorage, getCurrListVersion()].join("---");
    }
    let age = currState.age;
    let facetMapArr = currState.facetMapArr ? currState.facetMapArr : []
    let currProduct = currState.currProduct;
    if (currProduct && productId !== currProduct.id) {
      this.fetchProduct();
    }
    let currSelectedSku = currState.currSelectedSku;
    let skuPrice = currSelectedSku && currSelectedSku.prices[0];
    let isDiscounted = skuPrice && skuPrice.discounted ? true : false;
    let discountedPrice = isDiscounted ? skuPrice.discounted.value.centAmount / 100 : skuPrice && skuPrice.value.centAmount / 100;
    let listPrice = skuPrice && skuPrice.value.centAmount / 100;
    let displayImage = currSelectedSku && currSelectedSku.images && currSelectedSku.images.length > 0 ? currSelectedSku.images[0].url : "assets/img/no-image.jpg";
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          {currProduct ? (
            <Grid container spacing={24} className={classes.productGrid}>
              <Grid item>
                <ButtonBase className={classes.image}>
                  <img className={classes.img} alt="complex" src={displayImage} />
                </ButtonBase>
              </Grid>
              <Grid item xs={12} sm>
                <Grid item xs container direction="column" spacing={8}>
                  <Grid item xs>
                    <Typography gutterBottom variant="subtitle1">
                      {currProduct.name.en}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ID: {currProduct.id}
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <StarIcon color="primary" />
                    <StarIcon color="primary" />
                    <StarIcon color="primary" />
                    <StarIcon color="disabled" />
                    <StarIcon color="disabled" />
                    <Typography variant="h5" color="primary">
                      {isDiscounted && <NumberFormat value={listPrice} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} className={classes.strikeThrough} />}
                      &nbsp;<NumberFormat value={discountedPrice} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Description
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero.
                    </Typography>
                  </Grid>
                  <Divider />
                  <Grid item xs>
                    <Typography variant="body2" variant="subtitle2">
                      Select variant options...
                    </Typography>
                    {facetMapArr && facetMapArr.map(function (facetMap) {
                      let optionValues = facetMap.values;
                      return (
                        <FormControl className={classes.formControl} key={facetMap.name}>
                          <InputLabel htmlFor="age-native-simple">{facetMap.name}</InputLabel>
                          <Select
                            native
                            value={facetMap.selected}
                            onChange={thisVar.handleChange(facetMap.name)}
                            inputProps={{
                              name: facetMap.name,
                              id: 'age-native-simple',
                            }}
                          >
                            {optionValues.map(function (value) {
                              return (
                                <option value={value} key={value}>{value}</option>
                              )
                            })}
                          </Select>
                        </FormControl>
                      )
                    })}
                  </Grid>
                  <Grid item xs>
                    <TextField
                      id="standard-number"
                      label="Quantity"
                      value={quantity}
                      onChange={this.handleQtyChange}
                      type="number"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item padding={16}>
                    {currSelectedSku ? (
                      <div>
                        <Button variant="contained" size="small" color="primary" className={classes.button} onClick={this.addToCart}>
                          Add to Cart
                        </Button>
                        {customerId && (
                          <Button variant="contained" size="small" color="secondary" className={classes.button} onClick={this.handleDialogOpen}>
                            Add to List
                          </Button>
                        )}
                      </div>
                    ) : (
                        <Button variant="contained" size="small" disabled color="secondary" className={classes.button}>
                          Out of Stock
                      </Button>
                      )}
                  </Grid>
                  <Divider />
                </Grid>
              </Grid>
            </Grid>
          ) : (
              "Loading, please wait!"
            )}
          <RelatedProducts productList={productList} productToNotShow={currProduct} parent={this} />
          <ReviewsRatings />
          <Dialog open={isDialogOpen} onClose={this.handleDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create Shopping List</DialogTitle>
            <DialogContent>
              <Grid container spacing={24} direction="column">
                <Grid item className={classes.paddingTop}>
                  <Grid item container className={classes.paddingTop}>
                    <DialogContentText>
                      Please enter the name to create a new Shopping-List!
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Shipping List Name"
                      type="text"
                      fullWidth
                      onChange={this.handleNameChange}
                    />
                  </Grid>
                  <Grid item container className={classes.paddingTop} justify="center">
                    <Button onClick={this.handleCreateList} color="primary" variant="contained" >
                      Create & Add to List
                    </Button>
                  </Grid>
                </Grid>
                <Grid item container className={classes.paddingTop} justify="center" direction="row">
                  <Typography variant="h5" gutterBottom>
                    OR
                  </Typography>
                </Grid>
                <Grid item className={classes.paddingTop}>
                  <Grid item container className={classes.paddingTop}>
                    <DialogContentText>
                      Select one of the below Shopping-Lists to proceed!
                    </DialogContentText>
                    <FormControl className={classes.formControl} key="listsControl">
                      <InputLabel htmlFor="age-native-simple">Shopping-Lists</InputLabel>
                      <Select
                        native
                        value={selectedList}
                        onChange={() => this.handleSelectList(event)}
                        inputProps={{
                          name: 'shopping-lists',
                          id: 'age-native-simple',
                        }}
                      >
                        {shoppingLists.map(function (list) {
                          return (
                            <option value={[list.id, list.version].join("---")} key={list.id}>{list.name.en}</option>
                          )
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item container className={classes.paddingTop} justify="center">
                    {selectedList ? (
                      <Button onClick={this.addToList} color="primary" variant="contained" >
                        Add to List
                    </Button>
                    ) : (
                        <Button color="primary" variant="contained" disabled>
                          Add to List
                      </Button>
                      )}
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleDialogClose} color="secondary" variant="contained" className={classes.cancelBtn}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </main>
    );
  }
}

ProductDetails.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStatesToProps = state => ({
  currListFromReducer: state.list.currList,
  errorFromReducer: state.list.error,
  userListsFromReducer: state.list.currUserLists,
  userListsErrorFromReducer: state.list.currUserListsError,
  updateUserListFromReducer: state.list.updateUserList,
  recentlyViewedIds: state.recentlyViewed.recentlyViewedIds,
  recentlyViewedItems: state.recentlyViewed.recentlyViewedItems
})

export default withStyles(styles)(withRouter(connect(mapStatesToProps, { 
  addToCartAction, 
  createListAction, 
  fetchUserShoppingListsAction, 
  addToListAction,
  fetchRecentlyViewedFromSessionAction,
  fetchRecentlyViewedByIdsAction, 
  updateRecentlyViewedAction })(ProductDetails)));