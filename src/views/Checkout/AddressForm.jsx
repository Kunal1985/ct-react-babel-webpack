import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from '@material-ui/core/Grid';
import GridItem from "components/Grid/GridItem.jsx";
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';
import { addShippingToCart } from '../../utils/CommonUtils';
import AddressSection from "../UserProfile/ProfileTab/AddressSection/AddressSection.jsx";
import AddressSectionEdit from "../UserProfile/ProfileTab/AddressSection/AddressSectionEdit.jsx";
import { connect } from 'react-redux';
import { addShippingToCartAction } from '../../actions/cartActions';

const styles = theme => ({
  fabMargin: {
    margin: theme.spacing.unit * 2
  },
});

class AddressForm extends React.Component {
  constructor(props) {
    super(props);
    this.name = "AddressForm";
    this.state = { modalOpen: false };
    this.handleChange = this.handleChange.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAddressSelect = this.handleAddressSelect.bind(this);
  }

  async componentDidUpdate() {
    const { props, state } = this;
    let { selectedAddress } = state;
    if (!selectedAddress) {
      selectedAddress = props.selectedAddress
    }
    if (props.submit) {
      this.props.addShippingToCartAction(selectedAddress);
      let { cartFromReducer, cartErrorFromReducer } = this.props;
      if (cartFromReducer.id) {
        props.parent.handleFormSubmit();
      }
      if (cartErrorFromReducer) {
        // Display some error
      }
    }
  }

  handleOpen() {
    this.setState({ modalOpen: true });
  }

  handleClose() {
    this.setState({ modalOpen: false });
  }

  handleChange(event) {
    let address = this.state && this.state.address ? this.state.address : {};
    address[event.target.name] = event.target.value;
    this.setState({ address });
  }

  handleAddressSelect(address) {
    let { parent } = this.props;
    this.setState({ selectedValue: address.id, selectedAddress: address });
    parent.handleAddressSelect(address)
  }

  render() {
    let thisVar = this;
    let { classes, currUser, selectedAddress } = this.props;
    let { modalOpen, selectedValue } = this.state;
    if (!selectedValue && selectedAddress) {
      selectedValue = selectedAddress.id
    }
    let noAddress = (currUser && currUser.addresses && currUser.addresses.length === 0) ? true : false;
    return (
      <React.Fragment>
        <Typography variant="h6" gutterBottom>
          Shipping address
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
        <Grid container spacing={24}>
          {currUser && currUser.addresses && currUser.addresses.map(function (address) {
            return (
              <GridItem xs={12} sm={12} md={12} key={address.id}>
                <AddressSection address={address} currUser={currUser} parent={thisVar} selectedValue={selectedValue} />
              </GridItem>
            )
          })}
          {noAddress ? (
            <Typography variant="subtitle1" gutterBottom>
              No Addresses yet! Please add to continue!
            </Typography>
          ) : ""}
        </Grid>
      </React.Fragment>
    );
  }
}

const mapStatesToProps = state => ({
  userFromReducer: state.user.currUser,
  userErrorFromReducer: state.user.error,
  cartFromReducer: state.cart.currCart,
  cartErrorFromReducer: state.cart.error
})


export default withStyles(styles)(connect(mapStatesToProps, { addShippingToCartAction })(AddressForm));