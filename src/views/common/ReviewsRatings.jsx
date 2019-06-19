import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import StarIcon from '@material-ui/icons/Star';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: 'inline',
  },
  paddingHorizontal: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  },
  paddingTop: {
    paddingTop: theme.spacing.unit * 5
  }
});

const rrList = [{

},{

},{

}]

class ReviewsRatings extends React.Component {
  render(){
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Divider />
        <Grid container spacing={16} justify="center" className={classes.paddingTop}>
          <Typography variant="h4" color="textPrimary">
            REVIEWS
          </Typography>
        </Grid>
        <List>
          {rrList.map(function(){
            return (<main>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Grid container spacing={16}>
                        <Grid item className={classes.paddingHoritontal}>
                          <StarIcon color="primary" fontSize="small"/>
                          <StarIcon color="primary" fontSize="small"/>
                          <StarIcon color="primary" fontSize="small"/>
                          <StarIcon color="disabled" fontSize="small"/>
                          <StarIcon color="disabled" fontSize="small"/>
                        </Grid>
                        <Grid item direction="row" className={classes.paddingHoritonal}>
                          <Typography variant="subtitle1" color="textSecondary">
                            John Davis
                          </Typography>
                        </Grid>
                        <Grid item direction="row" className={classes.paddingHoritonal}>
                          <Typography variant="subtitle2" color="textSecondary">
                            2 Days Ago
                          </Typography>
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  }
                  secondary={
                    <React.Fragment>
                      <Grid container spacing={16}>
                        <Grid item className={classes.paddingHoritontal}>
                          <Typography variant="h6" color="textSecondary">
                            Lorem borem forem dorem morem
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. 
                          </Typography>
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider />
            </main>)
          })}
        </List>
      </div>
    )
  }
}

ReviewsRatings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReviewsRatings);