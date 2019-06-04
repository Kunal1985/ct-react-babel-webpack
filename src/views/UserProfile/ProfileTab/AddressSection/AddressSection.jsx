import React from "react";
import classNames from 'classnames';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddressSectionEdit from "./AddressSectionEdit.jsx";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  console.log("getModalStyle")
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  addressField: {
    width: 400
  },
  fabMargin: {
    margin: theme.spacing.unit,
  },
  displayBlock: {
    display: "block"
  },
  floatBtnRight: {
    float: "right"
  },
  floatBtnLeft: {
    float: "left"
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows.unit * 5,
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
  card: {
    margin: theme.spacing.unit * 3,
  }
});

class AddressSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {modalOpen: false};
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen(){
    this.setState({modalOpen: true});
  }

  handleClose(){
    this.setState({modalOpen: false});
  }

  render() {
    const { classes, address, currUser, parent } = this.props;
    let fullName = [address.firstName, address.lastName].join(" ");
    let street = [address.streetNumber, address.streetName].join(" ");
    let cityRegion = [address.city, address.region].join(" ");
    let postalCountry = [address.country, address.postalCode].join(" ");
    let modalOpen = this.state && this.state.modalOpen ? this.state.modalOpen : false;
    return (
      <Card className={classes.card}>
        <CardActions className={classes.displayBlock}>
          <Button size="medium" color="primary" className={classes.floatBtnLeft}>
            {address.id}
          </Button>
          <Button size="small" color="primary" variant="contained" className={classes.floatBtnRight}>
            Delete 
          </Button>
          <Button size="small" color="primary" variant="contained" className={classes.floatBtnRight} onClick={this.handleOpen}>
            Edit 
          </Button>
        </CardActions>
        <CardActionArea>
          <CardContent>
            
            <Typography variant="body2" color="textSecondary" component="p">
              {fullName}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {street}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {cityRegion}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {postalCountry}
            </Typography>
          </CardContent>
        </CardActionArea>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={modalOpen}
          onClose={() => this.handleClose()}
        >
          <AddressSectionEdit currUser={currUser} address={address} parent={this} />
        </Modal>
      </Card>
    );
  }
}

export default withStyles(styles)(AddressSection);
