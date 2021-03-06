import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
// @material-ui core components
import { withStyles } from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Button from '@material-ui/core/Button';
// utils components
import { fetchCategories } from '../../utils/CommonUtils';

const tileData = [
  {
    img: "/assets/img/banner1.jpg",
    title: 'SUMMER LOVIN',
    subtitle: 'SUMMER MUST HAVE OUTFITS',
    categoryId: "1a143bf6-968a-4632-9f97-075f2cd624c2",
    className: "gridListTile50"
  },
  {
    img: "/assets/img/banner2.jpg",
    title: 'FASHION STYLES',
    subtitle: 'UNIQUE STYLE FOR EVERY SEASON',
    categoryId: "ec534c23-dc16-41b3-aed1-8555e60b5a7a",
    className: "gridListTile50"
  },
  {
    img: "/assets/img/banner3.jpg",
    title: 'MUST HAVES',
    subtitle: 'HOT PIECES FOR THE SUMMER THIS YEAR',
    categoryId: "45b04868-c8b0-47d6-a686-7883d7475ae5",
    className: "gridListTile100"
  },
];

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  hiddenTab: {
    display: "none"
  },
  typography: {
    padding: theme.spacing.unit * 2,
  },
  popper: {
    width: "80%"
  },
  gridMain: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: "100%",
    height: "auto",
  },
  gridListTile50: {
    width: "50% !important",
    height: "auto !important",
  },
  gridListTile100: {
    width: "100% !important",
    height: "auto !important",
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  bannerImg: {
    width: "100%",
    height: "auto",
  }
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 0, anchorEl: null };
    this.handleChange = this.handleChange.bind(this);
    this.mouseOverAction = this.mouseOverAction.bind(this);
    this.mouseOutAction = this.mouseOutAction.bind(this);
    this.mouseOverPopperAction = this.mouseOverPopperAction.bind(this);
    this.mouseOutPopperAction = this.mouseOutPopperAction.bind(this);
  }

  async componentDidMount() {
    let categories = [];
    let categorIds = [];
    let response = await this.fetchCats();
    if (response.body && response.body.results) {
      response.body.results.map(function (currCategory) {
        let categoryId = currCategory.id;
        let parentId = currCategory.parent && currCategory.parent.id;
        let parentCatIndex = categorIds.indexOf(parentId);
        if (parentCatIndex !== -1) {
          let subCats = categories[parentCatIndex].subCats ? categories[parentCatIndex].subCats : [];
          subCats.push({ id: currCategory.id, displayName: currCategory.name.en });
          categories[parentCatIndex].subCats = subCats;
          return;
        }
        if (categorIds.indexOf(categoryId) === -1) {
          categories.push({ id: currCategory.id, displayName: currCategory.name.en });
          categorIds.push(categoryId)
        }
      });
      this.setState({ categories: categories });
    }
  }

  async fetchCats() {
    let response = await fetchCategories();
    if (response.err) {
      if (response.err.error.error === "invalid_token") {
        return this.fetchCats();
      } else {
        // Display some error pop-up.
      }
    }
    return response;
  }

  handleChange(event, newValue) {
    let categoryId = this.state.categories[newValue - 1].id;
    this.props.history.push({
      pathname: `catalog/${categoryId}`
    })
  }

  mouseOverAction(event, newValue) {
    event.target.click();
  }

  mouseOutAction(event, newValue) {
    this.setState({ value: 0, anchorEl: null, open: false });
  }

  mouseOverPopperAction(event, newValue) {
    this.setState({ open: true });
  }

  mouseOutPopperAction(event, newValue) {
    this.setState({ open: false });
  }

  render() {
    const { classes } = this.props;
    let { value, anchorEl } = this.state;
    let open = this.state.open ? this.state.open : false;
    let categories = this.state.categories ? this.state.categories : [];
    let subCats = categories[value - 1] && categories[value - 1].subCats ? categories[value - 1].subCats : [];
    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <AppBar position="static" id="appBar">
            <Tabs
              value={value}
              onChange={this.handleChange}
            >
              <Tab
                key="dummyHidden"
                id="hiddenTab"
                className={classes.hiddenTab}
              />
              {categories && categories.length > 0 && categories.map((category, index) => (
                <Tab
                  id={index === 0 ? "startTab" : ""}
                  key={category.id}
                  label={category.displayName}
                // onMouseEnter={this.mouseOverAction}
                // onMouseLeave={this.mouseOutAction}
                />
              ))}
            </Tabs>
          </AppBar>
          <Popper id="popperTest" open={open} anchorEl={anchorEl} transition
            onMouseEnter={this.mouseOverPopperAction}
            onMouseLeave={this.mouseOutPopperAction}
            className={classes.popper}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                  <Grid container>
                    {subCats & subCats.map(function (subCategory) {
                      let displayName = subCategory.displayName
                      return (
                        <Grid item xs={4}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {displayName}
                          </Typography>
                        </Grid>
                      )
                    })}
                  </Grid>
                </Paper>
              </Fade>
            )}
          </Popper>
        </div>
        <main>
          <GridList cellHeight={180} className={classes.gridList}>
            {tileData.map(tile => (
              <GridListTile key={tile.img} className={classes[tile.className]}>
                <img src={tile.img} alt={tile.title} className={classes.bannerImg}/>
                <GridListTileBar
                  title={tile.title}
                  subtitle={<span>{tile.subtitle}</span>}
                  actionIcon={
                    <Button variant="contained" size="small" color="primary" className={classes.button}
                      onClick={() => this.props.history.push({
                        pathname: `catalog/${tile.categoryId}`
                      })}>
                      View Collection
                    </Button>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </main>
      </React.Fragment>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);