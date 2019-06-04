import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Footer from 'views/Footer/Footer.jsx';

import { invokeAuthAPI } from 'utils/CommonUtils.js'

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
      width: "80%",
      marginLeft: 'auto',
      marginRight: 'auto',
    }
  },
  footer: {
    marginTop: theme.spacing.unit * 8,
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit * 6}px 0`,
  },

});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.redirectPage = this.redirectPage.bind(this);
  }

  redirectPage(redirectRoute) {
    window.open("#/" + redirectRoute, "_self");
  }

  componentDidMount() {
    invokeAuthAPI();
  }

  render() {
    const { classes } = this.props;
    console.log(this.props.children);
    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="static" color="default" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle} onClick={() => this.redirectPage('')}>
              IGNITIV INC.
            </Typography>
            <Button onClick={() => this.redirectPage('user')}>Profile</Button>
            <Button>Features</Button>
            <Button>Enterprise</Button>
            <Button>Support</Button>
            <Button color="primary" variant="outlined" onClick={() => this.redirectPage('cart')}>Cart</Button>
            <Button color="primary" variant="outlined" onClick={() => this.redirectPage('login')}>
              Login
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.layout}>
          {this.props.children}
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);