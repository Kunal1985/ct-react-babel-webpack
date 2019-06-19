import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Footer from 'views/Footer/Footer.jsx';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MiniShoppingCart from '../ShoppingCart/MiniShoppingCart.jsx';
import NumberFormat from 'react-number-format';
import { invokeAuthAPI } from 'utils/CommonUtils.js'
import { getCurrCustomerId, removeCurrCustomerId, getCurrCartId, fetchCart } from '../../utils/CommonUtils';

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  appBar: {
    position: 'relative',
  },
  toolbarTitle: {
    flex: 1,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: "98%",
      marginLeft: 'auto',
      marginRight: 'auto',
    }
  },
  footer: {
    marginTop: theme.spacing.unit * 8,
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit * 6}px 0`,
  },
  popper: {
    width: "30%",
    zIndex: 9999
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, anchorEl: null, currCustomerId: getCurrCustomerId() };
    this.redirectPage = this.redirectPage.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.mouseOverPopperAction = this.mouseOverPopperAction.bind(this);
    this.mouseOutPopperAction = this.mouseOutPopperAction.bind(this);
  }

  redirectPage(redirectRoute) {
    window.open("#/" + redirectRoute, "_self");
  }

  componentDidMount() {
    invokeAuthAPI();
  }

  handleLogout() {
    removeCurrCustomerId();
    this.setState({
      currCustomerId: null
    })
    this.redirectPage('')
  }

  async mouseOverPopperAction(event, newValue) {
    console.log("mouseOverPopperAction, Fetching Cart again!");
    let currCartId = getCurrCartId();
    if (currCartId) {
      let cartResponse = await fetchCart(getCurrCartId());
      if (cartResponse.body) {
        this.setState({ currCart: cartResponse.body, open: true, anchorEl: document.getElementById('miniCart') });
        return;
      }
    }
  }

  mouseOutPopperAction(event, newValue) {
    console.log("mouseOutPopperAction")
    this.setState({ open: false, anchorEl: null });
  }

  render() {
    const { classes, history } = this.props;
    const { open, anchorEl, currCart } = this.state;
    let currCustomerId = getCurrCustomerId();
    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="static" color="default" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle} onClick={() => this.redirectPage('')}>
              IGNITIV INC.
            </Typography>
            <Button onClick={() => this.redirectPage('user')}>Profile</Button>
            <Button
              id='miniCart'
              onClick={() => this.redirectPage('cart')}
              onMouseEnter={this.mouseOverPopperAction}
              onMouseLeave={this.mouseOutPopperAction}>
              Cart
            </Button>
            {currCustomerId ? (
              <Button color="secondary" variant="contained" onClick={this.handleLogout}>
                Logout
              </Button>
            ) : (
                <Button color="primary" variant="contained" onClick={() => this.redirectPage('login')}>
                  Login
              </Button>
              )}
          </Toolbar>
        </AppBar>
        <div className={classes.layout}>
          {this.props.children}
        </div>
        <Popper id="popperTest" 
          open={open} 
          anchorEl={anchorEl} 
          onMouseEnter={this.mouseOverPopperAction}
          onMouseLeave={this.mouseOutPopperAction}
          className={classes.popper} 
          transition >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              {currCart && (
                <MiniShoppingCart currCart={currCart} miniCart={true}/>
              )}
            </Fade>
          )}
        </Popper>
        <Footer />
      </React.Fragment>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);