import React from "react";
import classNames from 'classnames';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Modal from '@material-ui/core/Modal';
import EditIcon from '@material-ui/icons/Edit';
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import CardBody from "components/Card/CardBody.jsx";

import avatar from "assets/img/profile-pic.jpg";
import AddressSection from "./AddressSection/AddressSection.jsx";
import AddressSectionEdit from "./AddressSection/AddressSectionEdit.jsx";
import ProfileDetailsEdit from "./ProfileDetailsEdit.jsx";

const styles = theme => ({
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
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  email: {
    width: 300
  },
  addressField: {
    width: 400
  },
  marginTopStyle: {
    marginTop: theme.spacing.unit * 10
  },
  marginTopStyle2: {
    marginTop: theme.spacing.unit * 5
  },
  fabMargin: {
    margin: theme.spacing.unit * 2
  },
  editIcon: {
    marginLeft: theme.spacing.unit * 2
  }
});

class ProfileTabView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {modalOpen: false, pdModalOpen: false};
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handlePDModalOpen = this.handlePDModalOpen.bind(this);
    this.handlePDModalClose = this.handlePDModalClose.bind(this);
  }

  handleOpen(){
    this.setState({modalOpen: true});
  }

  handleClose(){
    this.setState({modalOpen: false});
  }

  handlePDModalOpen(){
    this.setState({pdModalOpen: true});
  }

  handlePDModalClose(){
    this.setState({pdModalOpen: false});
  }

  render() {
    const { classes } = this.props;
    const { modalOpen, pdModalOpen } = this.state;
    let thisVar = this;
    let currUser = this.props.currUser;
    let defaultAddress = currUser && currUser.addresses && currUser.addresses[0] ? currUser.addresses[0] : "No Address registered!";
    return (
      <Card className={classes.marginTopStyle}>
        <CardAvatar profile>
          <a href="#pablo" onClick={e => e.preventDefault()}>
            <img src={avatar} alt="..." />
          </a>
        </CardAvatar>
        <CardContent>
          <GridContainer>
            <GridItem xs={6} sm={6} md={6}>
              <Typography component="h1" variant="h5">
                Personal Details
                <EditIcon className={classes.editIcon}  onClick={this.handlePDModalOpen} />
                <Modal
                  aria-labelledby="personal-details-modal-title"
                  aria-describedby="personal-details-modal-description"
                  open={pdModalOpen}
                  onClose={() => this.handlePDModalClose()}
                >
                  <ProfileDetailsEdit currUser={currUser} parent={this} />
                </Modal>
              </Typography>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <TextField
                id="standard-name"
                label="Email ddress"
                className={classNames(classes.textField, classes.email)}
                value={currUser.email ? currUser.email : " "}
                margin="normal"
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <TextField
                id="standard-name"
                label="First Name"
                className={classes.textField}
                value={currUser.firstName ? currUser.firstName : " "}
                margin="normal"
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <TextField
                id="standard-name"
                label="Last Name"
                className={classes.textField}
                value={currUser.lastName ? currUser.lastName : " "}
                margin="normal"
              />
            </GridItem>
          </GridContainer>
          <Typography component="h1" variant="h5" className={classes.marginTopStyle2}>
            Addresses
            <Fab color="primary" aria-label="Add" size="small" className={classes.fabMargin}>
              <AddIcon onClick={this.handleOpen} />
              <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={modalOpen}
                onClose={() => this.handleClose()}
              >
                <AddressSectionEdit currUser={currUser} parent={this} />
              </Modal>
            </Fab>
          </Typography>
          <GridContainer>
            {currUser && currUser.addresses && currUser.addresses.map(function(address){
              return(
                <GridItem xs={12} sm={12} md={6} key={address.id}>
                  <AddressSection address={address} currUser={currUser} parent={thisVar}/>
                </GridItem>
              )
            })}
          </GridContainer>
        </CardContent>
      </Card>      
    );
  }
}

export default withStyles(styles)(ProfileTabView);
