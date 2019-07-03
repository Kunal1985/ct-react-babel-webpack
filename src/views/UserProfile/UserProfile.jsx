import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import ShopRounded from '@material-ui/icons/ShoppingCart';
import ShoppingBasket from '@material-ui/icons/ShoppingBasket';
// core components
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";

import { getCurrCustomerId, fetchCustomer } from "../../utils/CommonUtils";
import ProfileTab from "./ProfileTab/ProfileTab.jsx";
import MyOrdersTab from "./MyOrdersTab.jsx";
import MyShoppingListsTab from "./MyShoppingListsTab.jsx";
import { fetchUserById, fetchUserFromSession } from '../../actions/userActions'

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px ${theme.spacing.unit * 3}px`,
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    width: '100%',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  toolbarTitle: {
    marginRight: theme.spacing.unit * 8,
  }
});

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 0 };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    let currUserId = getCurrCustomerId();
    if (!currUserId) {
      this.props.history.push("/login");
      return;
    }
    this.props.fetchUserFromSession();
    let { userFromReducer, errorFromReducer } = this.props;
    if (errorFromReducer) {
      // Display some error
      return;
    }
    if (!userFromReducer.id) {
      this.props.fetchUserById(currUserId);
    }
  }

  handleChange(event, newValue) {
    this.setState({
      value: newValue
    });
  }

  render() {
    const { classes, userFromReducer } = this.props;
    let { value } = this.state;
    let currUser = userFromReducer;
    let userFullName = currUser ? [currUser.firstName, currUser.lastName].join(" ") : "";
    let currUserId = currUser ? currUser.id : "";
    return (
      <div className={classes.root}>
        <React.Fragment>
          <CssBaseline />
          <Card >
            <AppBar position="static">
              <Toolbar>
                <div className={classes.toolbarTitle}>
                  <h4 className={classes.cardTitleWhite}>{userFullName}</h4>
                  <p className={classes.cardCategoryWhite}>Profile# {currUserId}</p>
                </div>
                <Tabs value={value} onChange={this.handleChange}
                  indicatorColor="secondary"
                >
                  <Tab label="Profile" icon={<PersonIcon />} />
                  <Tab label="Orders" icon={<ShopRounded />} />
                  <Tab label="Wish List" icon={<ShoppingBasket />} />
                </Tabs>
              </Toolbar>
            </AppBar>
            <CardBody>
              {value === 0 && <ProfileTab parent={this} currUser={currUser} />}
              {value === 1 && <MyOrdersTab parent={this} currUser={currUserId} />}
              {value === 2 && <MyShoppingListsTab parent={this} currUser={currUserId} />}
            </CardBody>
          </Card>
        </React.Fragment>
      </div>
    );
  }
}

const mapStatesToProps = state => ({
  userFromReducer: state.user.currUser,
  errorFromReducer: state.user.error
})

export default withStyles(styles)(connect(mapStatesToProps, { fetchUserById, fetchUserFromSession })(UserProfile));
