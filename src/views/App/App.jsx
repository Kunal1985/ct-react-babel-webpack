import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Provider } from 'react-redux';
import store from '../../store';
// Importing @material-ui/core components
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Popper from '@material-ui/core/Popper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// Importing application-view components
import Footer from 'views/Footer/Footer.jsx';
import MiniShoppingCart from '../ShoppingCart/MiniShoppingCart.jsx';
import MiniCartTrigger from './MiniCartTrigger.jsx';
import { invokeAuthAPI } from 'utils/CommonUtils.js'
import { getCurrCustomerId, removeCurrCustomerId } from '../../utils/CommonUtils';

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

  componentDidMount() {
    invokeAuthAPI();
  }

  redirectPage(redirectRoute) {
    window.open("#/" + redirectRoute, "_self");
  }

  handleLogout() {
    removeCurrCustomerId();
    this.setState({
      currCustomerId: null
    })
    this.redirectPage('')
  }

  mouseOverPopperAction(event, newValue) {
    this.setState({ open: true, anchorEl: document.getElementById('miniCart') });
  }

  mouseOutPopperAction(event, newValue) {
    this.setState({ open: false, anchorEl: null });
  }

  render() {
    const { classes } = this.props;
    const { open, anchorEl } = this.state;
    let currCustomerId = getCurrCustomerId();
    return (
      <Provider store={store}>
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
          <MiniCartTrigger parent={this} />
          <Popper id="popperTest"
            open={open}
            anchorEl={anchorEl}
            onMouseEnter={this.mouseOverPopperAction}
            onMouseLeave={this.mouseOutPopperAction}
            className={classes.popper}
            transition >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <MiniShoppingCart miniCart={true} />
              </Fade>
            )}
          </Popper>
          <Footer />
        </React.Fragment>
      </Provider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);