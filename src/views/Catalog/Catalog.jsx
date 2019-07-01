import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
// utils components
import { fetchProductProjections, fetchCategories } from "../../utils/CommonUtils";

import NumberFormat from 'react-number-format';
const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  grid: {
    padding: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '100%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing.unit,
  },
  media: {
    height: 300
  }
});

class Catalog extends React.Component {
  constructor(props) {
    const { location } = props;
    super(props);
    this.state = {
      open: true,
      selectedCategory: location.selectedCategory
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleColorFacetSelection = this.handleColorFacetSelection.bind(this);
  }

  async componentDidMount(){
    let pp = await this.fetchPP();
    let categories = await this.fetchCats();
    this.setState({
      pp: pp.body,
      categories: categories.body.results,
      colorFacets: [],
      sizeFacets: []
    })    
  }

  async fetchPP(selectedCategory, selectedColorFacets, selectedSizeFacets){
    let categoryId = selectedCategory ? selectedCategory : this.state.selectedCategory;
    let query = "";
    if(categoryId){
      let queryTxt = categoryId ? `categories.id:subtree("${categoryId}")` : null
      let categoryFilterQuery = ["filter", encodeURIComponent(queryTxt)].join("=");
      let categoryFilterFacetQuery = ["filter.facets", encodeURIComponent(queryTxt)].join("=");
      let categoryQuery = [categoryFilterQuery, categoryFilterFacetQuery].join("&")
      query = [query, categoryQuery].join("&");
    }

    let colorFacets = selectedColorFacets ? selectedColorFacets : this.state.colorFacets;
    if(colorFacets && colorFacets.length>0){
      let colorFilterFacetQuery = ["filter.facets=variants.attributes.color:", colorFacets.join('","'), ""].join('"');
      let colorFacetQuery = ["filter=variants.attributes.color:", colorFacets.join('","'), ""].join('"');
      let colorQuery = [colorFilterFacetQuery, colorFacetQuery].join("&");
      query = [query, colorQuery].join("&");
    }

    let sizeFacets = selectedSizeFacets ? selectedSizeFacets : this.state.sizeFacets;
    if(sizeFacets && sizeFacets.length>0){
      let sizeFilterFacetQuery = ["filter.facets=variants.attributes.size:", sizeFacets.join('","'), ""].join('"');
      let sizeFacetQuery = ["filter=variants.attributes.size:", sizeFacets.join('","'), ""].join('"');
      let sizeQuery = [sizeFilterFacetQuery, sizeFacetQuery].join("&");
      query = [query, sizeQuery].join("&");
    }

    let response = await fetchProductProjections(query);
    if(response.err){
      if(response.err.error.error === "invalid_token"){
        return this.fetchPP();
      } else{
        // Display some error pop-up.
      }
    }
    return response;
  }

  async fetchCats(){    
    let response = await fetchCategories();
    if(response.err){
      if(response.err.error.error === "invalid_token"){
      } else{
        // Display some error pop-up.
      }
    }
    return response;
  }

  async handleCategorySelection(termSelected){
    this.setState({
      selectedCategory: termSelected
    });
    let pp = await this.fetchPP(termSelected);
    this.setState({ pp: pp.body });
  }

  async handleColorFacetSelection(termSelected){
    let colorFacets = this.state.colorFacets ? this.state.colorFacets : [];
    let index = colorFacets.indexOf(termSelected);
    if(index === -1){
      colorFacets.push(termSelected);
    } else{
      colorFacets.splice(index, 1)
    }
    this.setState({colorFacets: colorFacets})
    let pp = await this.fetchPP(null, colorFacets);
    this.setState({ pp: pp.body });
  }

  async handleSizeFacetSelection(termSelected){
    let sizeFacets = this.state.sizeFacets ? this.state.sizeFacets : [];
    let index = sizeFacets.indexOf(termSelected);
    if(index === -1){
      sizeFacets.push(termSelected);
    } else{
      sizeFacets.splice(index, 1)
    }
    this.setState({sizeFacets: sizeFacets});
    let pp = await this.fetchPP(null, null, sizeFacets);
    this.setState({
      pp: pp.body
    });
  }

  handleClick() {
    let open = this.state.open;
    this.setState({
      open: !open
    });
  }

  render() {
    let thisVar = this;
    const { classes } = this.props;
    let thisState = this.state;
    let selectedCategory = thisState.selectedCategory;
    let pp = thisState.pp;
    let productList = pp && pp.results;
    let facetsArr = pp && pp.facets;
    let categories = thisState.categories;
    categories && categories.map(function(category){
      if(category.id === selectedCategory){
        category.selected = true;
      } else{
        category.selected = false;
      }
      let categoryFacetsArr = facetsArr && facetsArr["categories.id"] && facetsArr["categories.id"].terms;
      for(var i=0; i<categoryFacetsArr.length; i++){
        let currTerm = categoryFacetsArr[i]
        if(currTerm.term === category.id){
          category.count = currTerm.count;
          break; 
        }
      }
      return category
    })
    let colorFacets = facetsArr && facetsArr["variants.attributes.color"];
    let sizeFacets = facetsArr && facetsArr["variants.attributes.size"];
    let selectedColorFacets = this.state.colorFacets ? this.state.colorFacets : [];
    let selectedSizeFacets = this.state.sizeFacets ? this.state.sizeFacets : [];
    colorFacets && colorFacets.terms.map(function(currColor){
      if(selectedColorFacets.indexOf(currColor.term) !== -1){
        currColor.selected = true
      } else{
        currColor.selected = false
      }
      return currColor;
    });
    sizeFacets && sizeFacets.terms.map(function(currSize){
      if(selectedSizeFacets.indexOf(currSize.term) !== -1){
        currSize.selected = true
      } else{
        currSize.selected = false
      }
      return currSize;
    })
    let open = thisState.open;
    return (
      <Grid container className={classes.grid}>
        <Grid item xs={12} className={classes.paper}>
          <Card>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="assets/img/banner5.jpg"
                title="Common Catalog Banner"
              />
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={3}>
          {categories && categories.length>0 && (
            <List
              component="nav"
              subheader={<ListSubheader component="div">CATEGORIES</ListSubheader>}
              className={classes.root}
            >
              {categories.map( category => (
                <ListItem button className={classes.nested} key={category.id} onClick={() => this.handleCategorySelection(category.id)}>
                  <Typography variant="subtitle2" color={category.selected ? "primary" : "textPrimary"} component="h6">
                    {category.name.en} ({category.count})
                  </Typography>
                </ListItem>
              ))}
            </List>
          )}

          {colorFacets && colorFacets.terms && colorFacets.terms.length>0 && (
            <List
              component="nav"
              subheader={<ListSubheader component="div">COLOR</ListSubheader>}
              className={classes.root}
            >
              {colorFacets.terms.map( term => (
                <ListItem button className={classes.nested} key={term.term} onClick={() => this.handleColorFacetSelection(term.term)} >
                  <Typography variant="subtitle2" color={term.selected ? "primary" : "textPrimary"}>
                    {term.term} ({term.count})
                  </Typography>
                </ListItem>
              ))}
            </List>
          )}

          {sizeFacets && sizeFacets.terms && sizeFacets.terms.length>0 && (
            <List
              component="nav"
              subheader={<ListSubheader component="div">SIZE</ListSubheader>}
              className={classes.root}
            >
              {sizeFacets.terms.map( term => (
                <ListItem button className={classes.nested} key={term.term} onClick={() => this.handleSizeFacetSelection(term.term)} >
                  <Typography variant="subtitle2" color={term.selected ? "primary" : "textPrimary"}>
                    {term.term} ({term.count})
                  </Typography>
                </ListItem>
              ))}
            </List>
          )}          
        </Grid>
        <Grid item xs={9}>
          <Grid container>
            {productList && productList.map(function(currProduct){
              let displayImage = currProduct.masterVariant && currProduct.masterVariant.images && currProduct.masterVariant.images.length>0 ? currProduct.masterVariant.images[0].url : "assets/img/no-image.jpg";
              let lowerPrice = 0;
              let higherPrice = 0;
              currProduct.masterVariant.prices.map(function(price){
                lowerPrice = lowerPrice===0 && price.value.centAmount;
                higherPrice = higherPrice===0 && price.value.centAmount;
                lowerPrice = lowerPrice < price.value.centAmount ? lowerPrice : price.value.centAmount;
                higherPrice = higherPrice > price.value.centAmount ? higherPrice : price.value.centAmount;
              })
              currProduct.variants.map(currVariant => currVariant.prices.map(function(price){
                lowerPrice = lowerPrice < price.value.centAmount ? lowerPrice : price.value.centAmount;
                higherPrice = higherPrice > price.value.centAmount ? higherPrice : price.value.centAmount;
              }))
              lowerPrice = lowerPrice / 100;
              higherPrice = higherPrice / 100;
              return (
                <Grid item key={currProduct.id} sm={12} md={6} lg={3} className={classes.grid}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={displayImage}
                      title="Image title"
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {currProduct.name.en}
                      </Typography>
                      <Typography>
                        Retail Price: 
                      </Typography>
                        {lowerPrice === higherPrice ? (
                          <NumberFormat value={lowerPrice} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
                        ) : (
                          <div>
                            <NumberFormat value={lowerPrice} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} /> to <NumberFormat value={higherPrice} decimalScale={2} fixedDecimalScale={true} displayType={'text'} prefix={'$'} />
                          </div>
                        )}
                    </CardContent>
                    <CardActions>
                      <Button variant="contained" size="small" color="primary" className={classes.button} onClick={() => thisVar.props.history.push({pathname: '/product/' + currProduct.id, productList})}>
                        Product Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Catalog);
