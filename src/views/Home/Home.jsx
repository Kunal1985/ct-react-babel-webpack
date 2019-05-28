import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import rp from 'request-promise';
import { getAuthToken, createCart, getCurrCartId, setCurrCartId, setCurrCartVersion, getCurrCartVersion, addItemToCart, fetchProducts } from '../../utils/CommonUtils';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  icon: {
    marginRight: theme.spacing.unit * 2,
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
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
  }
});

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.addToCart = this.addToCart.bind(this);
  }

  componentDidMount(){
    this.fetchProductList();
  }
  
  async fetchProductList(){    
    let response = await fetchProducts();
    if(response.body){
      var products = response.body.results;
      var skuList = [];
      for(var i=0; i<products.length; i++){
          var currProduct = products[i];
          var currentData = currProduct.masterData.current;
          currentData.masterVariant.displayName = currentData.name.en;
          skuList.push(currentData.masterVariant);
          var currVariants = currentData.variants;
          currVariants.map(function(currVariant){
              currVariant.displayName = currentData.name.en; 
          });
          skuList = skuList.concat(currVariants);
          skuList.map(function(currSku){
              currSku.productId = currProduct.id;
              currSku.retailPrice = currSku.prices[0].value.centAmount/100;
              currSku.discountedPrice = currSku.prices[0].discounted ? currSku.prices[0].discounted.value.centAmount/100 : 0;
              currSku.image = currSku.images && currSku.images[0] ? currSku.images[0].url : "assets/img/no-image.jpg";
          })
      }
      this.setState({
        productList: skuList
      })
    }
    if(response.err){
      console.log(response.err);
      if(response.err.error.error === "invalid_token"){
        this.fetchProductList();
      } else{
        // Display some error pop-up.
      }
    }
  }

  async addToCart(currSku){
    console.log("addToCart", currSku);
    let currCartId = getCurrCartId();
    let currCartVersion = getCurrCartVersion();
    if(!(currCartId && currCartVersion)){
      let response = await createCart();
      if(response.body){
        currCartId = response.body.id;
        currCartVersion = response.body.version;
        setCurrCartId(currCartId);
        setCurrCartVersion(currCartVersion);
      }      
      if(response.err){
        console.log(response.err);
      }
    }
    if(currCartId && currCartVersion){
      let response = await addItemToCart(currSku);
      if(response.body){
        setCurrCartVersion(response.body.version);
      } 
      if(response.err){
        console.log(response.err);
      }
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <main>
          {/* Hero unit */}
          <div className={classes.heroUnit}>
            <div className={classes.heroContent}>
              <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                Product Catalog
                </Typography>
              <Typography variant="h6" align="center" color="textSecondary" paragraph>
                Find the best outfits here.
              </Typography>
            </div>
          </div>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            {/* End hero unit */}
            <Grid container spacing={40}>
              {this.state && this.state.productList && this.state.productList.map(currProduct => (
                <Grid item key={currProduct.sku} sm={6} md={4} lg={3}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={currProduct.image}
                      title="Image title"
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {currProduct.displayName}
                      </Typography>
                      <Typography>
                        Retail Price: {currProduct.retailPrice}
                      </Typography>
                      <Typography>
                        Discounted Price: {currProduct.discountedPrice}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button variant="contained" size="small" color="primary" className={classes.button} onClick={() => this.addToCart(currProduct)}>
                        Add to Cart
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);