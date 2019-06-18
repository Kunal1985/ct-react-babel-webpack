import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
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

import { fetchProductById, addItemToCart, getCurrCartId, createCart, getCurrListId, createList, addItemToList, getCurrCustomerId, fetchCustomerShoppingLists, setCurrListId, setCurrListVersion, getCurrListVersion } from '../../utils/CommonUtils';

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
    width: "40%"
  },
  img: {
    maxWidth: 400
  }
});

class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isDialogOpen: false, shoppingLists:[] };
    this.handleChange = this.handleChange.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.addToList = this.addToList.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCreateList = this.handleCreateList.bind(this);
    this.handleSelectList = this.handleSelectList.bind(this);
    this.fetchShoppingLists = this.fetchShoppingLists.bind(this);
  }

  async componentDidMount() {
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
    await this.fetchShoppingLists();
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
    console.log(selectedSku);
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
    let currCartId = getCurrCartId();
    if (!currCartId) {
      let response = await createCart();
    }
    currCartId = getCurrCartId();
    if (currCartId) {
      let response = await addItemToCart(this.state.currSelectedSku);
      if (response.body) {
        this.props.history.push("/cart");
      }
    }
  }

  handleDialogOpen(){
    this.setState({ isDialogOpen: true });
  }

  async addToList() {
    let response = await addItemToList(this.state.currSelectedSku);
    if(response.body){
      this.setState({isDialogOpen: false})
    }
  }

  async handleCreateList() {
    let listName = this.state.listName;
    let response = await createList(listName);
    if(response.body){
      this.fetchShoppingLists();
    }
    if(response.err){
      //Display some error popup.
    }
  }

  handleNameChange(event) {
    this.setState({ listName: event.target.value });
  }

  handleDialogClose() {
    this.setState({ isDialogOpen: false });
  }

  handleSelectList(event){
    let selectedValue = event.target.value;
    let selectedValueArr = selectedValue.split("---")
    let listId = selectedValueArr[0];
    let listVersion = selectedValueArr[1];
    console.log(listId, listVersion);
    setCurrListId(listId);
    setCurrListVersion(listVersion);
    this.setState({selectedList: selectedValue});
  }

  async fetchShoppingLists(){
    console.log("fetchShoppingLists");
    let customerId = getCurrCustomerId();
    if(!customerId){
      return;
    }
    let response = await fetchCustomerShoppingLists(customerId);
    if(response.body){
      console.log("shoppingLists", response.body.results);
      this.setState({shoppingLists: response.body.results});
    }
  }

  render() {
    const { classes } = this.props;
    let customerId = getCurrCustomerId();
    let thisVar = this;
    let currState = this.state;
    let { listName, isDialogOpen, selectedList, shoppingLists } = currState;
    let currListInStorage = getCurrListId();
    if(!selectedList && currListInStorage){
      selectedList = [currListInStorage, getCurrListVersion()].join("---");
    }
    let age = currState.age;
    let facetMapArr = currState.facetMapArr ? currState.facetMapArr : []
    let currProduct = currState.currProduct;
    let currSelectedSku = currState.currSelectedSku;
    let displayImage = currSelectedSku && currSelectedSku.images && currSelectedSku.images.length > 0 ? currSelectedSku.images[0].url : "assets/img/no-image.jpg";
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          {currProduct ? (
            <Grid container spacing={24}>
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
                </Grid>
              </Grid>
            </Grid>
          ) : (
              "Loading, please wait!"
            )}
          <Dialog open={isDialogOpen} onClose={this.handleDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create Shopping List</DialogTitle>
            <DialogContent>
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
              <Button onClick={this.handleCreateList} color="primary" variant="contained" >
                Create List
              </Button>  
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
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleDialogClose} color="secondary" variant="contained">
                Cancel
              </Button>
              { selectedList ? (
                <Button onClick={this.addToList} color="primary" variant="contained" >
                  Add to List
                </Button>  
              ) : (
                <Button color="primary" variant="contained" disabled>
                  Add to List
                </Button>  
              )}
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

export default withStyles(styles)(ProductDetails);